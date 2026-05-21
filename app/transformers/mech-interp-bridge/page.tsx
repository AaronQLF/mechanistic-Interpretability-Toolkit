import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";

export const metadata = {
  title: "Capstone: transformers in mech interp",
};

export default function TransformersBridgePage() {
  return (
    <ChapterShell
      moduleSlug="transformers"
      chapterSlug="mech-interp-bridge"
      eyebrow="Capstone"
      title="Transformers in mech interp"
      lede="Six chapters of attention, residuals, and blocks. This one collects them into the picture every interpretability paper assumes you already have: the residual stream as a privileged basis, attention heads as named subroutines, and a mathematical framework precise enough to do real circuit-finding work in the next module."
    >
      <h2>The picture, reassembled</h2>
      <p>
        A modern decoder-only transformer is, end-to-end, the map
      </p>
      <Block>{tex`\mathbf{x}_{0} = \mathrm{embed}(t) + p, \quad \mathbf{x}_{\ell} = \mathbf{x}_{\ell-1} + \mathrm{MHA}_{\ell}(\mathrm{LN}(\mathbf{x}_{\ell-1})) + \mathrm{MLP}_{\ell}(\mathrm{LN}(\mathbf{x}_{\ell-1})), \quad \mathbf{z} = W_U\, \mathrm{LN}_f(\mathbf{x}_L).`}</Block>
      <p>
        Three things to keep in mind that we now have all the
        vocabulary for:
      </p>
      <ul>
        <li>
          The <strong>residual stream</strong> is the running sum.
          Every block reads (after LayerNorm) and writes (added
          back). Nothing is lost; everything is bandwidth-shared.
        </li>
        <li>
          Each <strong>attention head</strong> decomposes into a
          QK circuit (<em>where to read</em>) and an OV circuit
          (<em>what to write</em>). Both are{" "}
          <M>{tex`d \times d`}</M> matrices. They are the only
          interpretable invariants of a head.
        </li>
        <li>
          Each <strong>MLP block</strong> is a content-addressable
          memory: a sum of (key, value) pairs whose key has to fire
          on the residual stream for the value to be written. The
          neural-networks module already laid this out.
        </li>
      </ul>

      <h2>The residual stream as a privileged basis</h2>
      <p>
        The single load-bearing assumption: there is a fixed
        <M>{tex`d`}</M>-dimensional space — the residual stream —
        and concepts the model uses are stored as{" "}
        <em>directions</em> in it. Two consequences for everything
        downstream:
      </p>
      <ul>
        <li>
          <strong>Reading.</strong> To check whether the model
          knows feature <M>F</M>, project the residual stream onto
          the feature direction <M>{tex`\mathbf{f}_F`}</M>. If you
          want a token-level readout: project onto a column of{" "}
          <M>{tex`W_U`}</M>. This is the <em>logit lens</em> applied
          one layer at a time.
        </li>
        <li>
          <strong>Writing.</strong> Every component contributes
          additively. To insert a feature, add a vector along{" "}
          <M>{tex`\mathbf{f}_F`}</M>; to suppress one, subtract.
          Every &ldquo;steering vector&rdquo; paper exploits
          exactly this affordance.
        </li>
      </ul>

      <h2>Attention heads as named subroutines</h2>
      <p>
        With the QK / OV factorization in hand, you can name an
        attention head by its function. The literature has settled
        on a handful of recurring archetypes:
      </p>
      <ul>
        <li>
          <strong>Previous-token heads.</strong> QK is concentrated
          on the diagonal shifted by −1; OV writes the source
          token&apos;s embedding into the destination.
        </li>
        <li>
          <strong>Induction heads.</strong> QK matches &ldquo;current
          token&rdquo; against &ldquo;tokens that were
          previous-tokened earlier in the sequence&rdquo;; OV
          copies the current token&apos;s successor. Two heads
          across two layers; the canonical example of cross-head
          composition.
        </li>
        <li>
          <strong>Name-mover heads.</strong> QK attends from the
          end of a sentence to a name mentioned earlier; OV writes
          that name&apos;s direction into the residual stream so
          the unembedding picks it. Central to the IOI circuit.
        </li>
        <li>
          <strong>S-inhibition heads.</strong> The dual: their
          job is to <em>suppress</em> the wrong name (the subject)
          rather than promote the right one.
        </li>
        <li>
          <strong>Successor heads.</strong> QK attends to the
          previous occurrence of the current token; OV writes
          the embedding of the <em>next</em> token. Useful for
          counting, ordinals, and lists.
        </li>
        <li>
          <strong>Punctuation / sink heads.</strong> Most queries
          attend to BOS or commas; the OV is small. These look
          like &ldquo;rest position&rdquo; behavior — somewhere
          to dump probability mass when the head has nothing
          informative to do.
        </li>
      </ul>
      <p>
        These names are useful but provisional. Real heads are
        polysemantic: a single head can do
        previous-token-on-some-inputs and copy-on-others. The
        circuits module uses a finer-grained vocabulary and gives
        formal definitions backed by causal experiments.
      </p>

      <h2>Decomposing a forward pass</h2>
      <p>
        The most concrete consequence of everything in this
        module: the final residual stream{" "}
        <M>{tex`\mathbf{x}_L`}</M> at any position can be written
        as
      </p>
      <Block>{tex`\mathbf{x}_L = \mathbf{x}_0 + \sum_{\ell=1}^{L} \sum_{i=1}^{h} \mathrm{head}_{\ell, i}(\mathbf{x}_{\ell-1}) + \sum_{\ell=1}^{L} \mathrm{MLP}_\ell(\mathbf{x}_{\ell-1}+\sum_i \mathrm{head}_{\ell, i}).`}</Block>
      <p>
        That is{" "}
        <M>{tex`1 + Lh + L`}</M> additive contributions to one
        vector. For GPT-2 small that&apos;s 1 + 144 + 12 = 157
        contributions — each small enough to study one at a time,
        each large enough to potentially carry a circuit. Mech
        interp is, in large part, the project of:
      </p>
      <ol>
        <li>
          Identifying which contributions matter for a chosen
          behavior (<em>localization</em>);
        </li>
        <li>
          Naming what each one is doing (<em>interpretation</em>);
        </li>
        <li>
          Verifying with causal experiments that those names
          actually predict the model&apos;s behavior on new inputs
          (<em>validation</em>).
        </li>
      </ol>
      <p>
        The next module is exactly that loop, applied to two
        canonical circuits.
      </p>

      <h2>The toolkit you now have</h2>
      <p>
        From everything in this module:
      </p>
      <ul>
        <li>
          <strong>Logit lens.</strong> Apply{" "}
          <M>{tex`W_U`}</M> to{" "}
          <M>{tex`\mathbf{x}_\ell`}</M> at every layer, see which
          tokens are climbing in the residual stream as you go
          deeper.
        </li>
        <li>
          <strong>Direct logit attribution.</strong> For a target
          token <M>t</M>, compute{" "}
          <M>{tex`(W_U[:, t]) \cdot \mathrm{head}_{\ell, i}(\cdot)`}</M>{" "}
          for each head — a per-head accounting of who promoted{" "}
          <M>t</M>.
        </li>
        <li>
          <strong>Attention pattern visualization.</strong> Look
          at the <M>{tex`n \times n`}</M> matrix{" "}
          <M>{tex`A^{(\ell, i)}`}</M> directly.
        </li>
        <li>
          <strong>QK / OV inspection.</strong>{" "}
          Eigendecompose, SVD, or compute composition products
          across layers.
        </li>
        <li>
          <strong>Component ablation.</strong> Replace one
          contribution with zero or with its mean and remeasure
          loss.
        </li>
      </ul>
      <p>
        Each tool is a way of answering one of the three questions
        above. The next module wires them together.
      </p>

      <Callout variant="intuition">
        A transformer is a content-addressable bus. The bus is the
        residual stream; every component has the same direct
        access to its history (via the identity skip), and writes
        its own contribution back. Attention moves things between
        positions; MLPs process them within positions. The
        architecture is small. The phenomena it gives rise to
        are not.
      </Callout>

      <Callout variant="note">
        Up next: the <strong>Mech-interp Circuits</strong> module.
        We&apos;ll build the &ldquo;what is a circuit?&rdquo;
        vocabulary, walk through the two most-studied circuits in
        GPT-2 small (induction heads and IOI), build the causal
        toolkit (activation patching, attribution), and end on
        sparse autoencoders and circuit diagrams. Bring the
        residual-stream picture from this chapter; everything else
        sits inside it.
      </Callout>

      <Challenge
        prompt={
          <>
            <p>
              You are given a small transformer (12 layers, 12 heads
              each) and a single behavior to explain: on any prompt
              of the form &ldquo;Joe gave the ball to Sally and
              Sally gave it to&rdquo; the model outputs &ldquo;
              Joe&rdquo; with high probability (the IOI behavior).
              Sketch a complete experimental protocol — using only
              tools introduced in this module — to localize the
              circuit and prove your localization is correct.
            </p>
            <p>
              <strong>(a)</strong> Stage 1, localization: describe
              how you would use direct logit attribution and the
              logit lens to identify the <em>handful</em> of heads
              and MLP blocks contributing the bulk of the &ldquo;Joe&rdquo;
              logit. What pattern would tell you &ldquo;the answer
              is in heads at layer 9 and 10&rdquo; vs. &ldquo;the
              answer is built up gradually&rdquo;?
            </p>
            <p>
              <strong>(b)</strong> Stage 2, interpretation: for the
              top three heads, propose what each is doing using
              QK and OV inspection alone (no patching yet). For
              instance, you might predict &ldquo;head 9.6 is a
              name-mover from the IO position to the final
              token&rdquo; — what would the QK and OV of such a
              head look like?
            </p>
            <p>
              <strong>(c)</strong> Stage 3, validation: design two
              causal experiments that would distinguish your
              proposed interpretation from a plausible alternative.
              What would falsification look like in each? (We&apos;ll
              build the formal version of these experiments in the
              circuits module — but the design should already be
              clear.)
            </p>
          </>
        }
        hint={
          <>
            For (a): direct logit attribution gives you{" "}
            <M>{tex`(W_U[:, \text{Joe}]) \cdot \mathrm{head}_{\ell, i}`}</M>{" "}
            per head. The logit lens shows you{" "}
            <M>{tex`(W_U[:, \text{Joe}]) \cdot \mathbf{x}_\ell`}</M>{" "}
            per layer. For (c): the alternative is &ldquo;head 9.6
            is just a copying head and would write any name in the
            prefix.&rdquo; Design a counterfactual where IO and S
            are different names.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Cache the residual stream and
              every component output in a single forward pass. For
              every position, every layer, every head, every MLP,
              compute the inner product with{" "}
              <M>{tex`W_U[:, \text{Joe}]`}</M> — this is each
              component&apos;s &ldquo;direct contribution&rdquo; to
              the Joe logit. Sort by magnitude. Plot the cumulative
              contribution by layer (the logit lens) and by
              component (direct logit attribution). A
              <em>sharp jump</em> at a small set of late-layer
              heads + a flat earlier curve indicates a localized
              circuit; a smooth ramp indicates distributed
              processing. For IOI in GPT-2 small, the empirical
              answer is that ~3 heads at layers 9–10 (name-movers)
              dominate, with smaller contributions from a half
              dozen earlier &ldquo;preparing&rdquo; heads.
            </p>
            <p>
              <strong>(b)</strong> A name-mover at the final
              position would have a QK that, when given a residual
              stream containing &ldquo;a name was mentioned at
              position <M>j</M>,&rdquo; gives high score to{" "}
              <M>j</M>. Concretely: top eigenvectors of{" "}
              <M>{tex`W_{QK}`}</M> aligned with the
              &ldquo;subject&rdquo; vs.&nbsp;&ldquo;object&rdquo;
              positional / role features. Its{" "}
              <M>{tex`W_{OV}`}</M> would have a top eigenvector
              that copies the source token&apos;s embedding
              direction into the output — composing with the
              unembedding so that{" "}
              <M>{tex`(W_E[t,:]) W_{OV} W_U[:, t']`}</M> is large
              only for <M>{tex`t = t'`}</M>. That&apos;s a direct
              prediction you can check with a few matrix products,
              before any patching.
            </p>
            <p>
              <strong>(c)</strong> Two causal experiments:
            </p>
            <ol>
              <li>
                <em>Counterfactual on the IO.</em> Run the prompt
                with &ldquo;Joe&rdquo; replaced by &ldquo;Mark.&rdquo;
                Patch the candidate name-mover head&apos;s output
                from the original run into the &ldquo;Mark&rdquo;
                run. If the head is really a name-mover, the patch
                should drag the prediction from &ldquo;Mark&rdquo;
                back toward &ldquo;Joe.&rdquo; If it&apos;s instead
                a generic copy head that copies whatever name is in
                the prefix, the patch should have little effect.
              </li>
              <li>
                <em>Counterfactual on the S.</em> Swap the subject
                from &ldquo;Sally&rdquo; to &ldquo;Beth&rdquo;
                (changing only the wrong-answer name, leaving Joe
                in place). Patch the candidate S-inhibition head;
                a head that suppresses S should now suppress
                &ldquo;Beth&rdquo; instead of &ldquo;Sally,&rdquo;
                while name-mover heads should be roughly invariant.
              </li>
            </ol>
            <p>
              Each experiment&apos;s falsification: if the head
              behaves the same regardless of which name you put
              where, your label is wrong. The circuits module will
              dress this up as activation patching and path
              patching, but the design is already this concrete.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
