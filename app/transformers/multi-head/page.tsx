import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { MultiHeadDemo } from "@/components/viz/MultiHeadDemo";

export const metadata = {
  title: "Multi-head attention",
};

export default function MultiHeadPage() {
  return (
    <ChapterShell
      moduleSlug="transformers"
      chapterSlug="multi-head"
      eyebrow="Chapter 02"
      title="Multi-head attention"
      lede="Run several small attention operations in parallel, each in its own subspace, then concatenate and project. The architectural change is tiny; the consequence is that different heads end up doing different jobs — and the &lsquo;different jobs&rsquo; are exactly what mech interp tries to read out."
    >
      <h2>From one head to many</h2>
      <p>
        A single attention head with full hidden width <M>d</M> would
        force every kind of bookkeeping the model wants to do —
        previous-token, copy, subject-tracker, name-mover — into a
        single weighted-average operation. Instead, transformers split
        the residual stream into <M>h</M> parallel slices and run a
        <em> separate</em> attention head on each. Each head has its
        own learned <M>{tex`W_Q^{(i)}, W_K^{(i)}, W_V^{(i)}`}</M> of
        width <M>{tex`d_k = d / h`}</M>.
      </p>
      <Block>{tex`\mathrm{head}_i = \mathrm{Attn}(Q^{(i)}, K^{(i)}, V^{(i)}) \in \mathbb{R}^{n \times d_k}.`}</Block>
      <p>
        Concatenate them column-wise and apply one shared output
        projection <M>{tex`W_O \in \mathbb{R}^{d \times d}`}</M>:
      </p>
      <Block>{tex`\mathrm{MHA}(X) = \mathrm{concat}(\mathrm{head}_1, \ldots, \mathrm{head}_h)\, W_O.`}</Block>
      <p>
        Same total compute as one big head; same total parameters (to
        within constants). The difference is purely architectural: the
        information flowing through head <M>i</M> can&apos;t mix with
        head <M>j</M> until <M>{tex`W_O`}</M> recombines them.
      </p>

      <h2>Why heads specialize</h2>
      <p>
        Nothing in the equation tells head 1 to learn one thing and
        head 2 another. Specialization is{" "}
        <em>emergent</em>: gradient descent finds that a model with
        diverse heads has lower loss than one with redundant heads,
        because the residual stream wants to encode many distinct
        kinds of relationships at once. In practice, on small models
        you can stare at attention patterns and label heads by hand:
      </p>
      <ul>
        <li>
          <strong>Previous-token heads.</strong> Almost-diagonal
          pattern, one slot down. Common in early layers; forms one
          half of the induction circuit.
        </li>
        <li>
          <strong>Copy / current-token heads.</strong> Pure diagonal,
          or near-diagonal — the head is mostly a no-op except to
          re-emphasize features already at this position.
        </li>
        <li>
          <strong>Punctuation / sink heads.</strong> Nearly all queries
          attend to the very first token (or to BOS / commas /
          newlines). Not laziness — these positions act as a
          &ldquo;rest position&rdquo; that absorbs probability mass
          when there&apos;s nothing else to attend to.
        </li>
        <li>
          <strong>Name-movers, S-inhibition, induction, and more</strong>{" "}
          — discussed in detail in the circuits module.
        </li>
      </ul>

      <Figure caption="Three hand-designed heads on the same eight-token sentence: previous-token (red), subject-tracker (blue), and first-token sink (green). Click any cell or row of the heatmap to read off the weights for that query.">
        <MultiHeadDemo />
      </Figure>

      <h2>The hidden symmetry</h2>
      <p>
        Multi-head attention has an exact <em>permutation symmetry</em>{" "}
        you should know about: relabeling the heads —{" "}
        <M>{tex`(\mathrm{head}_1, \ldots, \mathrm{head}_h) \to (\mathrm{head}_{\pi(1)}, \ldots, \mathrm{head}_{\pi(h)})`}</M>{" "}
        — and permuting the corresponding columns of{" "}
        <M>{tex`W_O`}</M> the same way leaves the output unchanged.
        That means &ldquo;head 3&rdquo; in one model and{" "}
        &ldquo;head 7&rdquo; in another have no canonical relation;
        across runs heads end up in different slots. The conventional
        index <M>{tex`(\ell, h)`}</M> is just a label, not a
        type-level identity.
      </p>

      <h2>What <M>{tex`W_O`}</M> is doing</h2>
      <p>
        After concat, the multi-head output is one long vector of
        width <M>d</M>. <M>{tex`W_O`}</M> recombines it into the
        residual-stream basis: every column of{" "}
        <M>{tex`W_O`}</M> corresponds to one head&apos;s output and
        decides <em>which directions in the residual stream</em> that
        head writes into. We&apos;ll spend the next chapter making
        this fact precise (the &ldquo;OV circuit&rdquo;), but the
        useful framing is already here:
      </p>
      <Block>{tex`\mathrm{MHA}(X) = \sum_{i=1}^{h} \mathrm{head}_i(X)\, W_O^{(i)},`}</Block>
      <p>
        where <M>{tex`W_O^{(i)} \in \mathbb{R}^{d_k \times d}`}</M> is
        the slice of <M>{tex`W_O`}</M> corresponding to head <M>i</M>.
        Each head writes <em>independently</em> into the residual
        stream; the output is just a sum of head contributions.
      </p>

      <Callout variant="intuition">
        Heads are parallel programs sharing one scratchpad. Multi-head
        attention buys you concurrency: a fixed budget of attention
        compute, partitioned into many small specialized operations
        instead of one giant one. The empirical fact that this works
        better is one of the deepest, simplest, most under-explained
        tricks in deep learning.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The interpretability practice is built on this
          decomposition.
        </p>
        <ul>
          <li>
            <strong>Head ablation.</strong> Zero out one head&apos;s
            output (<M>{tex`\mathrm{head}_i \to 0`}</M>) and re-run
            the model. The change in loss / logits tells you what
            that head was for. This is the simplest causal experiment
            in mech interp.
          </li>
          <li>
            <strong>Head naming.</strong> The literature names heads
            by behavior (induction head, name-mover, S-inhibition).
            That naming is only meaningful because of the per-head
            decomposition above.
          </li>
          <li>
            <strong>Cross-model comparison is hard.</strong> Because
            of the permutation symmetry, &ldquo;head 5.7 in GPT-2
            small&rdquo; can&apos;t be matched 1:1 to a head in
            another run. Comparisons happen at the level of{" "}
            <em>function</em> (does this model also have an induction
            head?) not <em>identity</em>.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            GPT-2 small has <M>{tex`d = 768`}</M> and{" "}
            <M>{tex`h = 12`}</M> heads. What are{" "}
            <M>{tex`d_k`}</M> and the per-head OV subspace dimension,
            and how many residual-stream directions can{" "}
            <em>all heads of one layer combined</em> potentially
            write into?
          </>
        }
        choices={[
          {
            id: "a",
            label: "d_k = 64; one layer can write into at most 64 directions.",
            explain:
              "d_k = 768 / 12 = 64 is right. But each head writes into its own d-dim subspace via its W_O slice — together they can span up to 12 × 64 = 768 directions.",
          },
          {
            id: "b",
            label: "d_k = 64; one layer can write into at most 768 directions.",
            correct: true,
            explain:
              "d_k = 768 / 12 = 64. Each head's W_O slice maps R^{64} → R^{768}, contributing rank ≤ 64. Twelve heads together can in principle span the entire 768-dim residual stream — though in practice they overlap heavily.",
          },
          {
            id: "c",
            label: "d_k = 768; the head dimension and residual-stream dimension are the same.",
            explain:
              "That would be a single full-width head, not a 12-head layer. The whole point of multi-head is splitting d into h slices.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Multi-head attention is{" "}
              <M>{tex`\mathrm{MHA}(X) = \sum_i \mathrm{head}_i(X) W_O^{(i)}`}</M>.
            </p>
            <p>
              <strong>(a)</strong> A &ldquo;collapsed multi-head&rdquo;
              architecture replaces the <M>h</M> separate heads with
              a single full-width head (<M>{tex`d_k = d`}</M>) and
              keeps the same parameter count overall. Show that this
              architecture is{" "}
              <em>strictly less expressive</em> than multi-head, and
              identify the property of the function class
              you&apos;re losing. (Hint: think about the rank of the
              attention pattern times the value matrix.)
            </p>
            <p>
              <strong>(b)</strong> Suppose two heads in the same layer
              have learned <em>identical</em> Q, K, V weights up to
              an orthogonal change of basis. Show that the model can
              merge them with no change in the function it computes,
              by absorbing the basis change into <M>{tex`W_O`}</M>.
              Why does this rarely happen at convergence in practice?
            </p>
            <p>
              <strong>(c)</strong> Imagine an interpretability tool
              that wants to test &ldquo;is head 5.7 redundant?&rdquo;
              Two natural protocols: (i) ablate it (zero its output)
              and measure loss change; (ii) replace its output with
              the mean of its outputs over a held-out set (mean
              ablation). Argue when (ii) is preferable to (i), and
              what failure mode (i) has when the head&apos;s
              average output is large but constant across inputs.
            </p>
          </>
        }
        hint={
          <>
            For (a): a single head produces an output of the form{" "}
            <M>{tex`A V`}</M> with{" "}
            <M>{tex`A`}</M> a <em>single</em> attention pattern; multi-head produces a sum of such terms with different patterns.
            For (c): zero ablation injects an off-distribution
            constant (zero) where the model expects a typical-looking
            vector; mean ablation respects the typical scale.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> A single head computes{" "}
              <M>{tex`A V`}</M> where{" "}
              <M>{tex`A \in \mathbb{R}^{n\times n}`}</M> is one
              attention pattern. Multi-head computes{" "}
              <M>{tex`\sum_i A_i V_i W_O^{(i)}`}</M> — a{" "}
              <em>sum of</em> such products with distinct patterns.
              Per-row, the multi-head output sits in the{" "}
              <em>span</em> of multiple value-direction sets, not
              just one. The function class &ldquo;sum of attention-weighted convex combinations from <M>h</M>{" "}
              different patterns&rdquo; is strictly larger than
              &ldquo;one attention-weighted convex combination&rdquo;:
              you cannot in general write the former as the latter
              without inflating the value subspace, which you can&apos;t
              do at fixed budget.
            </p>
            <p>
              <strong>(b)</strong> Suppose head 1 has{" "}
              <M>{tex`(W_Q^{(1)}, W_K^{(1)}, W_V^{(1)})`}</M> and
              head 2 has{" "}
              <M>{tex`(W_Q^{(1)} R, W_K^{(1)} R, W_V^{(1)} R)`}</M>{" "}
              for some orthogonal{" "}
              <M>{tex`R \in \mathbb{R}^{d_k \times d_k}`}</M>. The
              attention pattern is unchanged ({" "}
              <M>{tex`R R^{\top} = I`}</M>); the value vectors
              become <M>{tex`V_2 = V_1 R`}</M>. Then{" "}
              <M>{tex`V_2 W_O^{(2)} = V_1 R W_O^{(2)}`}</M> equals{" "}
              <M>{tex`V_1 W_O^{(1)}`}</M> if we set{" "}
              <M>{tex`W_O^{(2)} = R^{\top} W_O^{(1)}`}</M> — so we
              can absorb <M>R</M> into the output projection and
              merge the two heads into one. In practice gradient
              descent + nonlinear MLPs in subsequent layers break
              ties between heads; redundant heads get small gradient
              pressure to <em>diverge</em> rather than converge.
              Trained models do contain partial redundancies, but
              not exact ones.
            </p>
            <p>
              <strong>(c)</strong> Mean ablation is preferable
              when the head&apos;s output has a non-trivial baseline
              that downstream layers <em>expect</em>. Zero ablation
              creates an off-distribution residual stream — the
              downstream MLP and attention have never seen a layer
              5 residual with that head zeroed, and they may
              over-compensate or panic. Mean ablation injects
              something in-distribution and isolates the variance,
              not the entire signal. The classic failure of zero
              ablation: the head writes a large constant{" "}
              <M>{tex`+\mathbf{c}`}</M> into the residual stream
              that the next LayerNorm subtracts out anyway. Zero
              ablation removes <M>{tex`\mathbf{c}`}</M> too, which
              pushes LayerNorm into a different regime and looks
              like a big effect — but the head was actually doing
              nothing input-dependent.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
