import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SuperpositionToy } from "@/components/viz/SuperpositionToy";

export const metadata = {
  title: "Capstone: neural networks in mech interp",
};

export default function NNBridgePage() {
  return (
    <ChapterShell
      moduleSlug="neural-networks"
      chapterSlug="mech-interp-bridge"
      eyebrow="Capstone"
      title="Neural networks in mech interp"
      lede="Six chapters of neurons, layers, and residual streams. This one collects them into the picture mech interp actually uses: feature directions, polysemanticity, MLPs as key-value memory, and the residual stream as a shared bus the entire model talks over."
    >
      <h2>The picture so far</h2>
      <p>
        A modern transformer is, at the level of this module:
      </p>
      <Block>{tex`\mathbf{x}_{\ell} = \mathbf{x}_{\ell-1} + \mathrm{Attn}_{\ell}(\mathrm{LN}(\mathbf{x}_{\ell-1})) + \mathrm{MLP}_{\ell}(\mathrm{LN}(\mathbf{x}_{\ell-1})), \quad \ell = 1, \ldots, L,`}</Block>
      <p>
        with <M>{tex`\mathbf{x}_{0} = \mathrm{embed}(t)`}</M> and the
        final logits given by{" "}
        <M>{tex`\mathbf{z} = W_U \mathbf{x}_L`}</M>. Everything in
        mech interp is a way of asking a question about that
        equation.
      </p>

      <h2>The linear-representation hypothesis</h2>
      <p>
        The single most load-bearing assumption in modern
        interpretability is the <strong>linear-representation
        hypothesis</strong>: <em>concepts the model uses are
        encoded as directions in the residual stream.</em> Concretely,
        if &ldquo;the next token is a digit&rdquo; is a feature{" "}
        <M>F</M>, there is some direction{" "}
        <M>{tex`\mathbf{f}_F \in \mathbb{R}^{d}`}</M> such that the
        model&apos;s &ldquo;belief in <M>F</M>&rdquo; is the
        projection{" "}
        <M>{tex`\mathbf{f}_F \cdot \mathbf{x}_{\ell}`}</M>.
      </p>
      <p>
        Two consequences shape almost every interpretability method:
      </p>
      <ul>
        <li>
          <strong>Reading.</strong> To check whether the model knows{" "}
          <M>F</M> at layer <M>{tex`\ell`}</M>, project the residual
          stream onto <M>{tex`\mathbf{f}_F`}</M>. This is a{" "}
          <em>linear probe</em>.
        </li>
        <li>
          <strong>Writing / steering.</strong> To <em>insert</em>{" "}
          <M>F</M>, add{" "}
          <M>{tex`\alpha\, \mathbf{f}_F`}</M> to the residual stream.
          To remove it, subtract. This is the entire idea behind
          activation steering, refusal direction ablation, and the
          recent &ldquo;representation engineering&rdquo; literature.
        </li>
      </ul>

      <h2>Superposition</h2>
      <p>
        A model has many more features it wants to track than it has
        residual stream dimensions. GPT-2 small has{" "}
        <M>{tex`d = 768`}</M>; the number of distinct concepts a
        decent language model represents is in the thousands or
        millions. The model fits them in by{" "}
        <strong>superposition</strong>: storing many features along
        slightly-overlapping directions, accepting some interference
        in exchange for capacity.
      </p>

      <Figure caption="A 2D residual stream pretending to track up to N orthogonal-ish features. Each colored arrow is a feature direction; click any one to set the residual stream to it, and read the dot products with every other feature on the right. As N grows the readouts get noisier — that's the price of superposition.">
        <SuperpositionToy />
      </Figure>

      <p>
        Superposition is not a bug; it&apos;s a deliberate use of{" "}
        <em>almost-orthogonal</em> directions in high-dimensional
        space. In <M>{tex`\mathbb{R}^{d}`}</M> you can pack
        exponentially many vectors at angle <M>{tex`\geq \pi/2 - \epsilon`}</M>{" "}
        from each other (Johnson&ndash;Lindenstrauss), so a
        <M>d</M>-dim residual stream can carry many more than{" "}
        <M>d</M> usable features &mdash; provided each one fires
        rarely.
      </p>

      <h2>Polysemanticity</h2>
      <p>
        From the MLP chapter: a single hidden neuron often fires on
        several unrelated concepts. That&apos;s{" "}
        <strong>polysemanticity</strong>, and it&apos;s the
        neuron-level shadow of superposition. The same fact can be
        stated more carefully:
      </p>
      <ol>
        <li>
          The residual stream stores many features along
          almost-orthogonal directions (superposition).
        </li>
        <li>
          A neuron&apos;s key{" "}
          <M>{tex`\mathbf{k}_i = W_1[i, :]`}</M> in an MLP block
          fires when the residual stream lights up <em>any</em>{" "}
          direction with positive dot product against{" "}
          <M>{tex`\mathbf{k}_i`}</M>.
        </li>
        <li>
          So if multiple features happen to project positively onto{" "}
          <M>{tex`\mathbf{k}_i`}</M>, the neuron fires on all of
          them &mdash; without the model ever &ldquo;intending&rdquo;
          to mix those concepts.
        </li>
      </ol>
      <p>
        The mech-interp project of <em>monosemanticity</em> &mdash;{" "}
        most prominently the sparse-autoencoder agenda &mdash; is the
        attempt to find a wider basis in which features and neurons
        line up one-to-one.
      </p>

      <h2>MLPs as key-value memory, again</h2>
      <p>
        Once you accept the linear-representation hypothesis, the
        key-value framing from chapter 5 becomes a literal
        statement about <em>retrieval</em>:
      </p>
      <Block>{tex`\mathrm{MLP}(\mathbf{x}) = \sum_{i=1}^{h} \underbrace{\sigma(\mathbf{k}_i \cdot \mathbf{x} + b_i)}_{\text{match score}} \cdot\, \underbrace{\mathbf{v}_i}_{\text{written direction}}.`}</Block>
      <p>
        Each MLP neuron is a memory cell: when its key matches the
        residual stream, its value is added to the next stream. Edit
        the value vector and you edit the memory. This is the
        single piece of theory behind ROME, MEMIT, and most of the
        &ldquo;model editing&rdquo; literature.
      </p>

      <h2>The residual stream as a bus</h2>
      <p>
        A useful change of perspective: stop thinking of the
        transformer as a tower of layers, and start thinking of it
        as a <em>shared communication bus</em> (the residual stream)
        that many independent &ldquo;programs&rdquo; (heads, MLP
        neurons) read from and write to:
      </p>
      <ul>
        <li>
          Every block reads the bus, applies LayerNorm, computes
          something, and adds its result back.
        </li>
        <li>
          A &ldquo;circuit&rdquo; is a path: feature{" "}
          <M>F</M> is{" "}
          <em>written</em> by an early head&apos;s OV column, then{" "}
          <em>read</em> by a later head&apos;s QK row that has high
          dot product with <M>{tex`\mathbf{f}_F`}</M>, which
          triggers a copy operation, which writes a new feature, and
          so on.
        </li>
        <li>
          Two components &ldquo;don&apos;t interact&rdquo; precisely
          when the writing direction of the earlier and the reading
          direction of the later are orthogonal.
        </li>
      </ul>

      <h2>What you can do with this picture</h2>
      <ol>
        <li>
          <strong>Logit lens.</strong> Apply{" "}
          <M>{tex`W_U`}</M> at intermediate layers to read which
          tokens are climbing in the residual stream.
        </li>
        <li>
          <strong>Activation patching / attribution patching.</strong>{" "}
          Swap or scale a piece of the residual stream from one
          forward pass into another, measure the change in logits,
          attribute the difference to a specific component.
        </li>
        <li>
          <strong>Sparse autoencoders.</strong> Decompose the
          residual stream (or an MLP&apos;s hidden activations)
          into a much wider sparse code, exposing monosemantic
          features that the dense{" "}
          <M>d</M>-dim representation hides.
        </li>
        <li>
          <strong>Steering vectors.</strong> Find a direction{" "}
          <M>{tex`\mathbf{f}_F`}</M> (often by averaging activations
          on contrastive prompts), then add or subtract it at
          inference time to nudge the model&apos;s behavior.
        </li>
        <li>
          <strong>Circuit finding.</strong> Combine the above to
          identify a small subgraph of heads / MLP neurons whose
          ablation removes a specific behavior &mdash; for example,
          the indirect-object-identification circuit (Wang et al.)
          or the induction circuit (Olsson et al.).
        </li>
      </ol>

      <Callout variant="intuition">
        A neural network is a stack of programs that all share one
        scratchpad &mdash; the residual stream. Mech interp is the
        project of figuring out which programs run, what they read
        and write, and which directions on the scratchpad mean what.
        Every result, paper, and tool you&apos;ll see is a way of
        sharpening that picture for one particular model on one
        particular behavior.
      </Callout>

      <Callout variant="note">
        Up next: the <strong>Transformers</strong> module, where we
        flesh out attention, the QK and OV circuits, position
        encodings, and put together the architecture that ate NLP.
        After that, the <strong>Mech-interp Circuits</strong>{" "}
        module digs into induction heads, sparse autoencoders, and
        the modern interpretability toolbox in detail.
      </Callout>

      <Challenge
        prompt={
          <>
            <p>
              You are handed a small transformer and a single
              behaviour to explain: on the prompt &ldquo;The capital
              of France is&rdquo; the model outputs &ldquo;
              Paris&rdquo; with very high probability. Design a{" "}
              <em>minimal experimental protocol</em> using only the
              tools developed in this module to localize where in the
              network the &ldquo;Paris&rdquo; answer is computed.
            </p>
            <p>
              <strong>(a)</strong> Describe a sequence of measurements
              based on the <em>logit lens</em> alone that tells you,
              for each layer <M>{tex`\ell`}</M>, how much of the
              final &ldquo;Paris&rdquo; logit is already present in{" "}
              <M>{tex`\mathbf{x}_{\ell}`}</M>. What pattern would
              indicate &ldquo;the answer is computed at layer{" "}
              <M>{tex`\ell^\star`}</M>&rdquo;?
            </p>
            <p>
              <strong>(b)</strong> Suppose the logit-lens curve has a
              sharp step between layers <M>{tex`\ell^\star - 1`}</M>{" "}
              and <M>{tex`\ell^\star`}</M>. Use the residual-stream
              decomposition from chapter 6 to break the contribution
              at layer <M>{tex`\ell^\star`}</M> into an attention
              piece and an MLP piece. Then propose an{" "}
              <em>activation patching</em> experiment that decides
              whether the step is caused by attention, by the MLP,
              or by both jointly.
            </p>
            <p>
              <strong>(c)</strong> Suppose the answer is the MLP at
              layer <M>{tex`\ell^\star`}</M>. Using the
              key-value framing of chapter 5, design a procedure to
              find the specific neuron(s) most responsible. State
              explicitly what could go wrong if those neurons turn
              out to be polysemantic, and how you would adapt the
              procedure (think SAEs from this chapter).
            </p>
          </>
        }
        hint={
          <>
            For (a): the logit lens applies{" "}
            <M>{tex`W_U`}</M> at every intermediate layer; track the
            scalar{" "}
            <M>{tex`(W_U)_{\text{Paris}, :}\, \mathbf{x}_{\ell}`}</M>.
            For (b): residual additivity means the layer&apos;s
            contribution is exactly{" "}
            <M>{tex`\mathrm{Attn}_{\ell}(\cdot) + \mathrm{MLP}_{\ell}(\cdot)`}</M>.
            For (c): the MLP&apos;s contribution is a sum over
            neurons; rank them by their individual contribution.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Run the prompt through the model;
              cache the residual stream{" "}
              <M>{tex`\mathbf{x}_{\ell}`}</M> at every layer. For
              each <M>{tex`\ell`}</M> compute
              <Block>{tex`s_{\ell} = (W_U)_{\text{Paris}, :} \cdot \mathbf{x}_{\ell} - (W_U)_{\text{London}, :} \cdot \mathbf{x}_{\ell},`}</Block>
              the &ldquo;Paris vs.&nbsp;London&rdquo; logit
              difference, computed using the unembedding at every
              intermediate layer. Plot{" "}
              <M>{tex`s_{\ell}`}</M> vs.{" "}
              <M>{tex`\ell`}</M>. A sharp jump from near zero to
              near the final value somewhere around{" "}
              <M>{tex`\ell^\star`}</M> indicates the answer is
              committed at that layer; a slow, monotonic climb
              indicates the answer is built up gradually across
              layers.
            </p>
            <p>
              <strong>(b)</strong> By residual additivity,{" "}
              <M>{tex`\mathbf{x}_{\ell^\star} - \mathbf{x}_{\ell^\star - 1} = \mathrm{Attn}_{\ell^\star}(\cdot) + \mathrm{MLP}_{\ell^\star}(\cdot)`}</M>.
              Project both sides onto the &ldquo;Paris&rdquo;
              direction{" "}
              <M>{tex`(W_U)_{\text{Paris}, :}`}</M> and read off
              which sub-component contributes more. Then patch:
            </p>
            <ol>
              <li>
                <em>Run a baseline.</em> &ldquo;The capital of France
                is&rdquo; — cache all activations.
              </li>
              <li>
                <em>Run a counterfactual.</em> &ldquo;The capital of
                Spain is&rdquo; — same length, different answer.
              </li>
              <li>
                <em>Patch the attention output</em> at layer{" "}
                <M>{tex`\ell^\star`}</M> from the counterfactual into
                the baseline run; re-run the rest of the network from
                that point. If the &ldquo;Paris&rdquo; logit difference
                drops to near the &ldquo;Madrid&rdquo; value, the
                attention output at <M>{tex`\ell^\star`}</M> carries
                the country &rarr; capital information.
              </li>
              <li>
                <em>Repeat with the MLP output.</em> Same procedure,
                MLP component instead of attention.
              </li>
              <li>
                Compare the two patches. Whichever drop is larger is
                the dominant cause; if both matter, they&apos;re
                jointly necessary.
              </li>
            </ol>
            <p>
              <strong>(c)</strong> If the MLP carries the answer,
              decompose its output into a sum over hidden neurons:
              <Block>{tex`\mathrm{MLP}(\mathbf{x}) = \sum_{i=1}^{h} h_i\, \mathbf{v}_i, \qquad h_i = \sigma(\mathbf{k}_i \cdot \mathbf{x} + b_i).`}</Block>
              Score each neuron <M>i</M> by{" "}
              <M>{tex`h_i \cdot ((W_U)_{\text{Paris}, :} \cdot \mathbf{v}_i)`}</M>{" "}
              — its individual contribution to the Paris direction
              on this prompt. Rank by score; the top few are
              candidate &ldquo;capital-of-France neurons.&rdquo;
              Validate by ablating each (zero out{" "}
              <M>{tex`\mathbf{v}_i`}</M>) and re-measuring the Paris
              logit.
            </p>
            <p>
              What can go wrong: if these neurons are{" "}
              <em>polysemantic</em> &mdash; firing for many unrelated
              concepts, not just Paris &mdash; then ablating one
              breaks unrelated facts too, and the &ldquo;capital of
              France&rdquo; computation is not localized to a clean
              cell. The fix from this chapter: train a sparse
              autoencoder on the MLP&apos;s post-activation hidden
              vector at this layer; in the (much wider, much
              sparser) SAE basis you should see <em>one</em>{" "}
              dictionary feature that fires almost only on
              capital-of-France-style queries. That feature is the
              clean monosemantic version of whatever the dense
              neurons were doing in superposition. Edit the SAE
              feature instead of the raw neuron and the surgery is
              clean.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
