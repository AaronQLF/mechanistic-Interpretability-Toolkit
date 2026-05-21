import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";

export const metadata = {
  title: "What is a circuit?",
};

export default function WhatIsACircuitPage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="what-is-a-circuit"
      eyebrow="Chapter 01"
      title="What is a circuit?"
      lede="A circuit is a small, named subgraph of a trained model that&mdash;through specific reads from and writes to the residual stream&mdash;implements a specific behavior. The word is borrowed from electrical engineering on purpose. It&apos;s the load-bearing object of mech interp, and we have to be precise about what it does and doesn&apos;t mean."
    >
      <h2>Components, edges, and paths</h2>
      <p>
        Start from the residual-stream picture you already have.
        The model&apos;s computation can be written as a directed
        graph:
      </p>
      <ul>
        <li>
          <strong>Nodes</strong> are <em>components</em>: the
          embedding, each attention head{" "}
          <M>{tex`(\ell, i)`}</M>, each MLP block, the unembedding.
          For GPT-2 small that&apos;s{" "}
          <M>{tex`1 + 12 \cdot 12 + 12 + 1 = 158`}</M>{" "}
          nodes.
        </li>
        <li>
          <strong>Edges</strong> are paths in the residual stream.
          Component <M>A</M> writes a vector at layer{" "}
          <M>{tex`\ell_A`}</M>; component <M>B</M> at layer{" "}
          <M>{tex`\ell_B > \ell_A`}</M> reads from the residual
          stream after <M>A</M> has written. There is an edge from{" "}
          <M>A</M> to <M>B</M> whenever the value{" "}
          <M>A</M> writes affects what <M>B</M> reads.
        </li>
        <li>
          <strong>Paths</strong> are sequences of edges from
          embedding to unembedding. Every prediction is the sum of
          contributions from <em>all</em> paths.
        </li>
      </ul>
      <p>
        A <strong>circuit</strong> is a small subset of components
        and edges in this graph whose joint behavior accounts for
        most of a specific model behavior. &ldquo;Most&rdquo; is
        defined causally — by ablation, patching, or attribution
        — and we&apos;ll spend the next four chapters making this
        rigorous.
      </p>

      <h2>The minimal example: a pass-through circuit</h2>
      <p>
        Consider the simplest possible circuit: the embedding writes
        token <M>t</M>&apos;s direction, every block leaves it
        alone, the unembedding reads it. Symbolically:
      </p>
      <Block>{tex`\mathrm{logit}(t) \approx W_U[:, t]^{\top}\, W_E[t, :].`}</Block>
      <p>
        This is, roughly, what unigram statistics look like through
        the lens of the architecture. For a model that&apos;s never
        learned anything more, this is the entire prediction
        circuit. For a real trained model, the pass-through circuit
        explains a small (but non-zero!) fraction of the loss; the
        interesting circuits add corrections on top.
      </p>

      <h2>What counts as &ldquo;an explanation&rdquo;?</h2>
      <p>
        A circuit explanation has three parts:
      </p>
      <ol>
        <li>
          <strong>A behavior.</strong> A precise input distribution
          and an output property to explain. &ldquo;On IOI prompts
          of the form {`'A and B went to the C; A gave the D to'`},
          predict <M>B</M>&rdquo; is a behavior. &ldquo;Be smart&rdquo;
          is not.
        </li>
        <li>
          <strong>A subgraph.</strong> A small set of components
          and edges that you claim implement the behavior. For
          IOI it&apos;s 26 heads across 5 layers, partitioned into
          four roles.
        </li>
        <li>
          <strong>A causal verification.</strong> Evidence that
          patching, ablating, or rewiring the named subgraph
          affects the behavior in the way you claim, and that the
          rest of the model does not. This is the part that
          distinguishes &ldquo;I drew a diagram&rdquo; from &ldquo;I
          have a circuit.&rdquo;
        </li>
      </ol>
      <p>
        The third bullet is what most of this module is about.
        Without it, &ldquo;circuit&rdquo; is just &ldquo;suggestive
        story.&rdquo;
      </p>

      <h2>Compositional structure: paths, not nodes</h2>
      <p>
        A trap in early mech interp work is to focus on individual
        components: &ldquo;head 5.7 does X.&rdquo; Real circuits are
        often compositional — head <M>{tex`A`}</M> does something
        useful only because head <M>{tex`B`}</M> at a later layer
        reads what <M>A</M> wrote. The interesting object is the
        edge, not the node. Two examples we&apos;ll cover in detail:
      </p>
      <ul>
        <li>
          <strong>Induction</strong> = (previous-token head at layer{" "}
          <M>{tex`\ell_1`}</M>) + (induction head at layer{" "}
          <M>{tex`\ell_2 > \ell_1`}</M>). Either head alone does
          nothing useful for the in-context-learning task; together
          they implement the &ldquo;copy what came after the last
          time you saw this&rdquo; algorithm.
        </li>
        <li>
          <strong>IOI</strong> = (S-inhibition heads) + (name-mover
          heads). The S-inhibitors suppress the wrong name; the
          name-movers promote the right one. Each plays a
          well-defined role only in the presence of the other.
        </li>
      </ul>
      <p>
        The general lesson: <em>circuits compose</em>. The
        residual-stream additivity of a transformer means
        contributions stack linearly, and the right way to read
        a circuit diagram is as a small dataflow program rather
        than a list of independent components.
      </p>

      <h2>Faithfulness, completeness, minimality</h2>
      <p>
        Three properties a good circuit explanation should aim for
        (the vocabulary varies; this is one common version):
      </p>
      <ul>
        <li>
          <strong>Faithfulness.</strong> If you keep only the
          named circuit and ablate everything else, the behavior
          is preserved. A faithful circuit is sufficient to
          reproduce the behavior on its own.
        </li>
        <li>
          <strong>Completeness.</strong> If you ablate the named
          circuit and keep everything else, the behavior is{" "}
          <em>destroyed</em>. A complete circuit is necessary —
          there&apos;s no parallel pathway doing the same job.
        </li>
        <li>
          <strong>Minimality.</strong> No proper subgraph of the
          named circuit is itself faithful. You haven&apos;t
          included irrelevant components.
        </li>
      </ul>
      <p>
        Real circuit papers rarely achieve all three. IOI is
        partly faithful, mostly complete, and almost minimal. That
        gap — and the methods we use to characterize it — is the
        substance of the next four chapters.
      </p>

      <h2>What a circuit isn&apos;t</h2>
      <p>
        Three failure modes worth naming explicitly, because each
        has burned working researchers:
      </p>
      <ul>
        <li>
          <strong>A confused naming.</strong> &ldquo;Head 5.7
          activates on punctuation&rdquo; based on visual
          inspection of attention patterns is not a circuit. It&apos;s
          a hypothesis, awaiting causal validation.
        </li>
        <li>
          <strong>An over-fitted story.</strong> If your circuit
          explains a behavior on the held-out test set used to
          discover it but fails on related-but-different inputs,
          you&apos;ve memorized a coincidence. Generalization
          across sub-distributions is part of the validation
          burden.
        </li>
        <li>
          <strong>A non-mechanistic correlation.</strong>{" "}
          &ldquo;The probe says feature <M>F</M> is in the
          residual stream at layer 7&rdquo; is a correlational
          claim. A circuit claim says <em>which components</em>{" "}
          wrote <M>F</M> there and <em>which components</em> read
          it later. Probes are a useful first pass; they&apos;re
          not a circuit by themselves.
        </li>
      </ul>

      <Callout variant="intuition">
        A circuit is a small program inside a big neural network.
        The components are subroutines; the residual stream is
        their shared data structure; the edges are who calls whom.
        Mech interp, at this stage of the field, is the practice
        of finding and naming small programs in models that
        weren&apos;t designed to have them.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Three concrete things that make circuits in transformers
          tractable to find, where they&apos;re hopeless in (say)
          ResNets:
        </p>
        <ul>
          <li>
            <strong>The residual stream is additive.</strong> Every
            component contributes a separable vector; you can
            attribute logit changes to specific contributions
            mechanically.
          </li>
          <li>
            <strong>The component count is small.</strong>{" "}
            Hundreds, not millions. You can plot all attention
            patterns in a model on a single page.
          </li>
          <li>
            <strong>Components have natural categories.</strong>{" "}
            QK and OV give you the structure of an attention head;
            keys/values give you the structure of an MLP. You aren&apos;t
            staring at an unstructured tensor.
          </li>
        </ul>
        <p>
          None of these are true for a CNN. The fact that mech
          interp is more advanced for transformers than for any
          other architecture is, in part, an architectural
          accident — and one to be grateful for.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            Which of these counts as a <em>circuit-level</em>{" "}
            explanation of a behavior, by the standards of this
            chapter?
          </>
        }
        choices={[
          {
            id: "a",
            label: "'A linear probe trained on layer 8 residuals predicts gender at 95% accuracy.'",
            explain:
              "That's a correlational claim about representation, not a circuit. Which components wrote that information? Which components later read it? A probe by itself doesn't say.",
          },
          {
            id: "b",
            label: "'Heads (9, 6) and (10, 0) attend from the final position to the IO and write its embedding into the residual stream; ablating both drops IOI accuracy from 99% to 30%.'",
            correct: true,
            explain:
              "Behavior (IOI), subgraph (the two named heads with their reading and writing roles), causal verification (ablation experiment with quantified effect). All three boxes ticked.",
          },
          {
            id: "c",
            label: "'Attention pattern in head 5.7 looks like a previous-token shift on most inputs.'",
            explain:
              "Suggestive but incomplete. What does the head's OV write? Does its output matter for any downstream component? Without the OV side and a causal experiment, this is one half of one hypothesis.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Define a &ldquo;path&rdquo; in a
              transformer formally: an ordered sequence of
              components <M>{tex`(C_1, C_2, \ldots, C_k)`}</M> with
              <M>{tex`C_1 = \mathrm{embed}, C_k = \mathrm{unembed}`}</M>{" "}
              and each consecutive pair related by a residual-stream
              read/write. Show that the model&apos;s output at the
              final position can be written as a sum over all
              such paths (this is the &ldquo;path expansion&rdquo;
              from Elhage et al.). For a 2-layer transformer with
              1 head per layer (no MLPs), enumerate all paths of
              length 2, 3, and 4.
            </p>
            <p>
              <strong>(b)</strong> Define faithfulness, completeness,
              and minimality precisely as set-membership properties
              over the component graph. Show that &ldquo;faithfulness +
              completeness&rdquo; does not imply minimality, and
              give a concrete (toy) example.
            </p>
            <p>
              <strong>(c)</strong> Suppose a researcher claims
              circuit <M>{tex`\mathcal{C}`}</M> is faithful (the
              circuit alone reproduces behavior <M>{tex`\mathcal{B}`}</M>)
              and complete (ablating it kills <M>{tex`\mathcal{B}`}</M>),
              but you discover that on a held-out input
              distribution{" "}
              <M>{tex`\mathcal{D}'`}</M> (a different syntactic
              form of the same task) the circuit is unfaithful —
              the model still gets the right answer, but the named
              circuit alone gets it wrong. What has the researcher
              actually identified, and what would a more careful
              statement of the result look like?
            </p>
          </>
        }
        hint={
          <>
            For (a): in a 2-layer model the paths run embed →
            head₁ → head₂ → unembed (length 4), embed → head₁ →
            unembed (length 3), and embed → unembed (length 2).
            For (b): minimality means no strict subset is faithful;
            you need a faithful circuit that contains a strictly
            smaller faithful sub-circuit. For (c): the key word is
            &ldquo;mechanism&rdquo; vs. &ldquo;model.&rdquo;
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Each component &ldquo;reads&rdquo;
              the residual stream by passing it through a linear
              map (its Q, K projections, or its MLP&apos;s first
              weight matrix), and &ldquo;writes&rdquo; via a
              linear map (its <M>{tex`W_O`}</M> or{" "}
              <M>{tex`W_2`}</M>). Composing reads and writes along
              a path gives a linear contribution; the model&apos;s
              output is the sum of these contributions, plus
              non-linear corrections from softmax and MLP
              activations. For a 2-layer toy: paths of length 2:
              {" "}<M>{tex`\mathrm{embed} \to \mathrm{unembed}`}</M>{" "}
              (one path). Length 3:{" "}
              <M>{tex`\mathrm{embed} \to H_1 \to \mathrm{unembed}`}</M>{" "}
              and{" "}
              <M>{tex`\mathrm{embed} \to H_2 \to \mathrm{unembed}`}</M>{" "}
              (two). Length 4:{" "}
              <M>{tex`\mathrm{embed} \to H_1 \to H_2 \to \mathrm{unembed}`}</M>{" "}
              (one). Total: four paths in a model whose graph has
              four nodes — an exhaustive accounting.
            </p>
            <p>
              <strong>(b)</strong> Let <M>G</M> be the component
              graph and <M>{tex`\mathcal{C} \subseteq G`}</M>{" "}
              a candidate circuit. <em>Faithful</em>: ablating
              everything outside <M>{tex`\mathcal{C}`}</M>{" "}
              preserves behavior. <em>Complete</em>: ablating{" "}
              <M>{tex`\mathcal{C}`}</M> destroys behavior.{" "}
              <em>Minimal</em>: no strict{" "}
              <M>{tex`\mathcal{C}' \subsetneq \mathcal{C}`}</M>{" "}
              is faithful. Counter-example to &ldquo;F + C ⇒
              M&rdquo;: take{" "}
              <M>{tex`\mathcal{C} = \mathcal{C}_{\min} \cup \{\text{irrelevant component } X\}`}</M>.
              <M>{tex`\mathcal{C}`}</M> is faithful (still contains
              the working subgraph) and complete (still necessary,
              since <M>{tex`\mathcal{C}_{\min}`}</M> is). But
              <M>{tex`\mathcal{C}_{\min}`}</M> is itself faithful,
              so <M>{tex`\mathcal{C}`}</M> isn&apos;t minimal.
            </p>
            <p>
              <strong>(c)</strong> The researcher has identified an{" "}
              <em>implementation</em>, not a <em>capability</em>.
              Their circuit is the mechanism the model uses on
              <M>{tex`\mathcal{D}`}</M>; the model has at least one
              additional mechanism, in different components, that
              kicks in on <M>{tex`\mathcal{D}'`}</M>. The honest
              statement: &ldquo;circuit{" "}
              <M>{tex`\mathcal{C}`}</M> implements{" "}
              <M>{tex`\mathcal{B}`}</M> on inputs from{" "}
              <M>{tex`\mathcal{D}`}</M>; on{" "}
              <M>{tex`\mathcal{D}'`}</M> the model uses a
              different, currently-unidentified mechanism.&rdquo;{" "}
              The IOI paper itself is careful about this: their
              circuit is faithful on the specific syntactic
              template they study, and they&apos;re explicit that
              other templates use overlapping but not identical
              components. Many follow-on papers have pushed on
              exactly this gap.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
