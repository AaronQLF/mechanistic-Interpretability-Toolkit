import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { MLPBlock } from "@/components/viz/MLPBlock";

export const metadata = {
  title: "The MLP — the workhorse block",
};

export default function MLPPage() {
  return (
    <ChapterShell
      moduleSlug="neural-networks"
      chapterSlug="mlp"
      eyebrow="Chapter 05"
      title="The MLP — the workhorse block"
      lede="Two linear layers and a nonlinearity between them. That&apos;s the multilayer perceptron. It&apos;s the second half of every transformer block, the entirety of every &ldquo;feed-forward network&rdquo; in deep-learning literature, and a universal function approximator on its own."
    >
      <h2>The block</h2>
      <p>
        A <strong>multilayer perceptron</strong> (MLP) is a function{" "}
        <M>{tex`\mathbb{R}^{d} \to \mathbb{R}^{m}`}</M> of the form
      </p>
      <Block>{tex`f(\mathbf{x}) = W_2\, \sigma(W_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2.`}</Block>
      <p>
        Three pieces; we&apos;ve met all of them.{" "}
        <M>{tex`W_1 \in \mathbb{R}^{h \times d}`}</M> is the
        &ldquo;up-projection&rdquo;: it lifts the input into a wider{" "}
        <strong>hidden dimension</strong> <M>h</M>.{" "}
        <M>{tex`\sigma`}</M> is the elementwise nonlinearity from
        chapter 3.{" "}
        <M>{tex`W_2 \in \mathbb{R}^{m \times h}`}</M> is the
        &ldquo;down-projection&rdquo;: it projects back to the output
        width <M>m</M>. In a transformer block, <M>m = d</M> and{" "}
        <M>h</M> is conventionally <M>4d</M>.
      </p>

      <Figure caption="A 4 → 6 → 4 MLP with ReLU. Drag the input bars; watch the pre-activation z, the ReLU'd hidden h (notice the zeros), and the output y update in lockstep.">
        <MLPBlock />
      </Figure>

      <h2>Why this particular shape</h2>
      <p>
        The choice of &ldquo;narrow → wide → narrow&rdquo; is not
        arbitrary. The wider middle layer is where the network does
        its <em>computation</em>; the down-projection collects what
        was computed back into the residual stream:
      </p>
      <ul>
        <li>
          <strong>Up-projection <M>{tex`W_1`}</M>.</strong> Each row{" "}
          <M>{tex`W_1[i, :]`}</M> is a learned <em>feature
          detector</em>: a direction in input space that the
          <M>i</M>-th hidden neuron compares the input against.
          With <M>{tex`h = 4d`}</M> there is room for the network
          to learn many overlapping detectors at once.
        </li>
        <li>
          <strong>Nonlinearity.</strong> Without it, the block
          collapses to a single linear map (chapter 2 challenge).
          With it, each hidden neuron either &ldquo;fires&rdquo; or
          stays silent (or, for GELU, mostly silent), turning the
          MLP into a piecewise-linear / piecewise-smooth function.
        </li>
        <li>
          <strong>Down-projection <M>{tex`W_2`}</M>.</strong> Each
          column <M>{tex`W_2[:, i]`}</M> is the &ldquo;writing
          direction&rdquo; of the <M>i</M>-th hidden neuron: when it
          fires with magnitude <M>{tex`h_i`}</M>, that column gets
          added (scaled by <M>{tex`h_i`}</M>) to the output. The
          block&apos;s output is{" "}
          <M>{tex`\sum_i h_i\, W_2[:, i] + \mathbf{b}_2`}</M>.
        </li>
      </ul>

      <h2>The key/value framing</h2>
      <p>
        A useful re-reading of the same equation. Treat the rows of{" "}
        <M>{tex`W_1`}</M> as <strong>keys</strong>{" "}
        <M>{tex`\mathbf{k}_i`}</M> and the columns of{" "}
        <M>{tex`W_2`}</M> as <strong>values</strong>{" "}
        <M>{tex`\mathbf{v}_i`}</M>. Then for any input{" "}
        <M>{tex`\mathbf{x}`}</M>:
      </p>
      <Block>{tex`\mathrm{MLP}(\mathbf{x}) = \sum_{i=1}^{h} \sigma(\mathbf{k}_i \cdot \mathbf{x} + b_i)\, \mathbf{v}_i + \mathbf{b}_2.`}</Block>
      <p>
        Hidden neuron <M>i</M> &ldquo;fires&rdquo; when{" "}
        <M>{tex`\mathbf{x}`}</M> matches its key direction; when it
        does, it adds its value vector to the output. The MLP is
        literally a <em>soft, learned, content-addressable
        lookup table</em>: keys query, values write. This framing
        (Geva et al., &ldquo;Transformer Feed-Forward Layers Are
        Key-Value Memories&rdquo;) is one of the most useful
        interpretability lenses we have on MLP blocks.
      </p>

      <h2>Universal approximation, briefly</h2>
      <p>
        The classical theorems (Cybenko 1989, Hornik 1991) say that
        a single-hidden-layer MLP with enough neurons and{" "}
        <em>any</em> non-polynomial nonlinearity can approximate
        any continuous function on a compact set arbitrarily well.
        Two notes about what this does and doesn&apos;t mean:
      </p>
      <ul>
        <li>
          <strong>Existence, not construction.</strong> The theorem
          says such weights exist. It says nothing about whether
          gradient descent will find them, or how many neurons are
          required (often: catastrophically many).
        </li>
        <li>
          <strong>Width vs. depth.</strong> A single shallow MLP can
          approximate anything in principle; deep networks can
          approximate the same things with{" "}
          <em>exponentially fewer</em> parameters because each layer
          composes new piecewise linear pieces (chapter 3 challenge).
          That&apos;s why nobody actually trains a billion-neuron
          one-layer MLP.
        </li>
      </ul>

      <Callout variant="intuition">
        Up-project to make room for many feature detectors; squash
        with a nonlinearity so each detector can decide independently
        whether to speak; down-project to collect their answers back
        into the residual stream. That&apos;s an MLP. Half of every
        transformer block is exactly this; the other half is
        attention.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The MLP block is where almost all of a transformer&apos;s
          parameters live (~⅔ in GPT-3-style models). It&apos;s also
          where many of the most concrete interpretability findings
          live:
        </p>
        <ul>
          <li>
            <strong>Knowledge neurons</strong> (Dai et al.) are
            individual MLP rows whose down-projection direction
            encodes a specific factual association &mdash; ablate
            the neuron and the model forgets the fact.
          </li>
          <li>
            <strong>ROME / MEMIT</strong> directly edit{" "}
            <M>{tex`W_2`}</M> rows in MLP blocks to surgically modify
            facts. The key/value framing above is what makes the edit
            target obvious.
          </li>
          <li>
            <strong>Sparse autoencoders</strong> (Anthropic, OpenAI)
            decompose the MLP&apos;s post-activation hidden vector
            into a much wider sparse code, exposing
            human-interpretable features that the dense{" "}
            <M>h</M>-dim vector hides through superposition.
          </li>
          <li>
            <strong>Polysemanticity</strong> &mdash; one neuron
            firing for several unrelated concepts &mdash; is the
            MLP-level version of superposition. A single hidden
            channel often has multiple keys that activate it.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            For a transformer-style MLP with input width{" "}
            <M>{tex`d = 768`}</M>, hidden width{" "}
            <M>{tex`h = 4d = 3072`}</M>, and output width{" "}
            <M>{tex`m = d`}</M>, roughly how many parameters does the
            block have (counting weights + biases)?
          </>
        }
        choices={[
          {
            id: "a",
            label: "≈ 2.4 million.",
            explain:
              "That counts only one of the two matrices. There are two of them, plus biases.",
          },
          {
            id: "b",
            label: "≈ 4.7 million.",
            correct: true,
            explain:
              "W₁ is 3072 × 768 ≈ 2.36M, W₂ is 768 × 3072 ≈ 2.36M, plus biases of size 3072 + 768 ≈ 3.8K. Total ≈ 4.7M.",
          },
          {
            id: "c",
            label: "≈ 9.4 million.",
            explain:
              "Double-counted somewhere — perhaps you doubled both matrices.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Consider an MLP block{" "}
              <M>{tex`f(\mathbf{x}) = W_2 \sigma(W_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2`}</M>{" "}
              with <M>{tex`\sigma = \mathrm{ReLU}`}</M>, input/output
              dimension <M>d</M>, hidden dimension <M>h</M>.
            </p>
            <p>
              <strong>(a)</strong> Adopt the key/value framing:{" "}
              <M>{tex`\mathbf{k}_i = W_1[i, :]^{\top}`}</M>,{" "}
              <M>{tex`\mathbf{v}_i = W_2[:, i]`}</M>. Suppose the
              network has been trained so that, for a particular
              concept <M>c</M>, exactly one hidden neuron <M>{tex`i^\star`}</M>{" "}
              activates: its key <M>{tex`\mathbf{k}_{i^\star}`}</M>{" "}
              fires only on inputs related to <M>c</M>, and{" "}
              <M>{tex`\mathbf{v}_{i^\star}`}</M> writes the
              &ldquo;answer&rdquo; for <M>c</M> into the residual
              stream. Describe two distinct interventions on the MLP
              weights that would make the network &ldquo;forget&rdquo;{" "}
              <M>c</M> on every input. Which is more surgical?
            </p>
            <p>
              <strong>(b)</strong> Show that if you set{" "}
              <M>{tex`W_2[:, i^\star] = \mathbf{0}`}</M> (zero out the
              value column), the block&apos;s output for <em>any</em>{" "}
              input is unchanged on the level of MLP composition with
              the next attention block &mdash; <em>provided</em> the
              residual stream is the only path forward. Does this
              imply that the model truly forgets <M>c</M>? What
              additional pathways might preserve the memory? (Hint:
              residual connections, attention from earlier tokens.)
            </p>
            <p>
              <strong>(c)</strong> Real models exhibit{" "}
              <em>polysemanticity</em>: one neuron fires for several
              unrelated concepts. Suppose neuron{" "}
              <M>{tex`i^\star`}</M> fires for both &ldquo;Paris is
              the capital of France&rdquo; and &ldquo;the chemical
              symbol of gold is Au.&rdquo; Argue why a single rank-1
              edit{" "}
              <M>{tex`W_2[:, i^\star] \to W_2[:, i^\star] + \alpha \mathbf{w}`}</M>{" "}
              <em>cannot</em> in general fix the &ldquo;capital of
              France&rdquo; fact without disturbing the gold one.
              What is the minimum-rank edit that <em>can</em>, and
              what does this tell you about MEMIT-style edit budgets?
            </p>
          </>
        }
        hint={
          <>
            For (a): you can either prevent the key from firing
            (modify <M>{tex`W_1[i^\star, :]`}</M>) or prevent the
            value from being written (modify{" "}
            <M>{tex`W_2[:, i^\star]`}</M>). For (c): a single
            polysemantic neuron mixes multiple concepts in its key,
            so any change to its value affects all of them in
            lockstep.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Two clean options:
            </p>
            <ul>
              <li>
                <em>Kill the key.</em> Set{" "}
                <M>{tex`W_1[i^\star, :] = \mathbf{0}`}</M> and{" "}
                <M>{tex`(\mathbf{b}_1)_{i^\star} = -\infty`}</M>{" "}
                (in practice a large negative number). The neuron
                never fires, so its value is never written.
              </li>
              <li>
                <em>Kill the value.</em> Set{" "}
                <M>{tex`W_2[:, i^\star] = \mathbf{0}`}</M>. The
                neuron may still fire, but it contributes nothing to
                the output.
              </li>
            </ul>
            <p>
              The second is more surgical: it only touches{" "}
              <M>d</M> entries of one column instead of an entire
              row of <M>{tex`W_1`}</M>. In MEMIT-style edits, this
              is the &ldquo;output side&rdquo; intervention.
            </p>
            <p>
              <strong>(b)</strong> Zeroing{" "}
              <M>{tex`W_2[:, i^\star]`}</M> removes neuron{" "}
              <M>{tex`i^\star`}</M>&apos;s contribution to the
              residual stream from <em>this</em> MLP block. But the
              residual stream is a sum across all blocks: another
              MLP, an attention head reading from a different token,
              or the embedding itself can carry the same information.
              Concretely, ablating one knowledge neuron in GPT-2
              typically reduces but rarely eliminates the model&apos;s
              ability to recall a fact &mdash; the model has{" "}
              <em>distributed</em> the memory across many neurons and
              layers. This is why &ldquo;model editing&rdquo;
              evaluations always test both the target fact and a
              suite of unrelated facts: success requires forgetting{" "}
              <em>and</em> not breaking everything else.
            </p>
            <p>
              <strong>(c)</strong> Suppose neuron{" "}
              <M>{tex`i^\star`}</M> fires (with similar magnitude){" "}
              both on &ldquo;capital of France&rdquo; queries and on
              &ldquo;chemical symbol of gold&rdquo; queries. Any
              additive edit{" "}
              <M>{tex`W_2[:, i^\star] \to W_2[:, i^\star] + \alpha \mathbf{w}`}</M>{" "}
              changes the value vector that gets written when{" "}
              <em>either</em> query fires. So &ldquo;teach the model
              that Paris &rarr; Madrid&rdquo; will simultaneously
              shift the answer for &ldquo;gold &rarr; Au&rdquo; in
              an arbitrary direction. To edit one without disturbing
              the other, you need a <em>rank-2</em> change: introduce
              a new neuron whose key fires only on the Paris query,
              and whose value writes the new answer; leave the
              polysemantic neuron alone. This is precisely the
              insight behind ROME (rank-1 edits assume monosemantic
              key/value structure) and MEMIT (multi-rank batched
              edits): the edit budget you need scales with how
              polysemantic the relevant neurons are. Sparse
              autoencoders attempt to <em>monosemantize</em> the
              representation precisely so that rank-1 edits become
              clean again.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
