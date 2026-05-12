import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SuperpositionToy } from "@/components/viz/SuperpositionToy";

export const metadata = {
  title: "Capstone: the mech-interp bridge",
};

export default function MechInterpBridgePage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="mech-interp-bridge"
      eyebrow="Capstone"
      title="The mech-interp bridge"
      lede="Everything in the previous eleven chapters is now a tool for talking about transformers. This chapter is the translation guide: residual streams, the logit lens, attention as low-rank circuits, and superposition."
    >
      <h2>The residual stream is a vector space</h2>
      <p>
        At every token position in a transformer there&apos;s a vector,
        called the <strong>residual stream</strong>:
      </p>
      <Block>{tex`\mathbf{x}_{\ell} \in \mathbb{R}^{d_{\text{model}}}.`}</Block>
      <p>
        Each layer reads from <M>{tex`\mathbf{x}_{\ell}`}</M>, computes
        something, and adds the result back:
      </p>
      <Block>{tex`\mathbf{x}_{\ell+1} = \mathbf{x}_{\ell} + \text{Attn}(\mathbf{x}_{\ell}) + \text{MLP}(\mathbf{x}_{\ell}).`}</Block>
      <p>
        Two chapters of this module justified that{" "}
        <em>vector addition is composition</em>: the contribution of any
        single layer is a vector that lives in the same space as the stream
        itself. You can attribute output behavior to specific contributions
        by reading off the right directions.
      </p>

      <h2>The logit lens is a linear map</h2>
      <p>
        The unembedding matrix <M>{tex`W_U \in \mathbb{R}^{|V| \times d}`}</M>{" "}
        turns a residual stream into logits:
      </p>
      <Block>{tex`\text{logits} = W_U\, \mathbf{x}.`}</Block>
      <p>
        Each row <M>{tex`(W_U)_k`}</M> is the <strong>direction</strong> in
        residual space that promotes token <M>k</M>. The logit for token{" "}
        <M>k</M> is the dot product:
      </p>
      <Block>{tex`\text{logit}_k = (W_U)_k \cdot \mathbf{x}.`}</Block>
      <p>
        The <em>logit lens</em> trick is to apply <M>{tex`W_U`}</M> at every
        layer, not just the last one, to see what tokens the residual stream
        is &ldquo;leaning toward&rdquo; partway through the network. It
        works because of nothing more than{" "}
        <em>matrix-vector multiplication is dot products with rows</em>.
      </p>

      <h2>Attention as low-rank circuits</h2>
      <p>
        Each attention head has four parameter matrices —{" "}
        <M>{tex`W_Q`}</M>, <M>{tex`W_K`}</M>, <M>{tex`W_V`}</M>, <M>{tex`W_O`}</M> —
        with an inner dimension <M>{tex`d_{\text{head}} \ll d_{\text{model}}`}</M>.
        Two products turn out to be more interpretable than the parts:
      </p>
      <Block>{tex`\underbrace{W_O W_V}_{\text{OV circuit}}, \qquad \underbrace{W_Q^{\top} W_K}_{\text{QK circuit}}.`}</Block>
      <p>
        Both are <strong>at most rank{" "}<M>{tex`d_{\text{head}}`}</M></strong>{" "}
        — they&apos;re skinny products of skinny matrices. The SVD chapter
        gave us the language for this: the OV circuit reads from a low-rank
        subspace of residual space and writes back to a low-rank subspace
        of it. Decomposing it tells you which directions a head moves
        information between.
      </p>

      <h2>Superposition, intuitively</h2>
      <p>
        A transformer has{" "}
        <M>{tex`d_{\text{model}}`}</M> dimensions but is asked to represent
        thousands of distinct features (concepts, syntactic roles, world
        states). The number of features can vastly exceed the dimension.
      </p>
      <p>
        It pulls this off via <strong>superposition</strong>: each feature
        gets its own direction in residual space, and the directions are
        almost-but-not-quite orthogonal. To &ldquo;decode&rdquo; whether a
        feature is active, take the dot product of the residual stream with
        that feature&apos;s direction.
      </p>
      <p>
        The price is interference: when one feature fires, every other
        feature&apos;s decoder picks up a small spurious signal. Below is a
        toy: <em>n</em> feature directions in just 2D. Press a feature to
        fire it; watch what the other features &ldquo;hear.&rdquo;
      </p>

      <Figure caption="With n features in 2D, you cannot make them mutually orthogonal once n > 2. The feature decoders pick up cross-talk. In high dimensions, models can get away with a lot more — but the same trade-off applies.">
        <SuperpositionToy />
      </Figure>

      <h2>What you can now read</h2>
      <p>
        You can now read papers like <em>A Mathematical Framework for
        Transformer Circuits</em>, <em>In-context Learning and Induction
        Heads</em>, and <em>Toy Models of Superposition</em> with the
        background you actually need. You won&apos;t recognize every term
        immediately, but the linear algebra they lean on is no longer
        opaque.
      </p>

      <Callout variant="note">
        Next modules — probability, calculus, neural networks, transformers,
        and circuits — pick up where this leaves off. They&apos;re scaffolded
        and on the way. Until then: revisit the widgets, build your own,
        and start staring at small models.
      </Callout>

      <Challenge
        prompt={
          <>
            <p>
              <strong>The math of superposition: a hard lower bound on
              feature interference.</strong>
            </p>
            <p>
              Suppose a transformer encodes <M>n</M> features as unit
              vectors{" "}
              <M>{tex`\mathbf{f}_{1}, \ldots, \mathbf{f}_{n} \in \mathbb{R}^{d}`}</M>{" "}
              with <M>{tex`n > d`}</M>. Define the{" "}
              <strong>Gram matrix</strong>{" "}
              <M>{tex`G \in \mathbb{R}^{n \times n}`}</M> by{" "}
              <M>{tex`G_{ij} = \mathbf{f}_{i}^{\top} \mathbf{f}_{j}`}</M>.
              Note <M>{tex`G_{ii} = 1`}</M>, and{" "}
              <M>{tex`G_{ij}`}</M> for{" "}
              <M>{tex`i \neq j`}</M> is the &ldquo;cross-talk&rdquo;
              between feature <M>i</M> and feature <M>j</M>.
            </p>
            <p>
              <strong>(a)</strong> Show that{" "}
              <M>{tex`G = F^{\top} F`}</M> where{" "}
              <M>{tex`F = [\mathbf{f}_{1} | \cdots | \mathbf{f}_{n}] \in \mathbb{R}^{d \times n}`}</M>.
              Conclude that{" "}
              <M>{tex`\mathrm{rank}(G) \leq d`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Show that
            </p>
            <Block>{tex`\|G\|_{F}^{2} = \sum_{i,j} G_{ij}^{2} = n + \sum_{i \neq j} G_{ij}^{2}.`}</Block>
            <p>
              <strong>(c)</strong> Now use rank: a matrix of rank{" "}
              <M>{tex`\leq d`}</M> with trace <M>{tex`\mathrm{tr}(G) = n`}</M>{" "}
              satisfies{" "}
              <M>{tex`\|G\|_{F}^{2} \geq n^{2} / d`}</M>.{" "}
              <em>Hint:</em> let{" "}
              <M>{tex`\lambda_{1}, \ldots, \lambda_{d}`}</M> be the
              non-zero eigenvalues; use Cauchy–Schwarz on{" "}
              <M>{tex`(\lambda_{1}, \ldots, \lambda_{d})`}</M> against{" "}
              <M>{tex`(1, \ldots, 1)`}</M>.
            </p>
            <p>
              <strong>(d)</strong> Combine (b) and (c) to deduce
            </p>
            <Block>{tex`\frac{1}{n(n-1)}\, \sum_{i \neq j} G_{ij}^{2} \;\geq\; \frac{n - d}{d(n - 1)}.`}</Block>
            <p>
              That is the <strong>Welch bound</strong>: the
              average squared cross-talk grows{" "}
              <em>linearly</em> in <M>{tex`n/d`}</M> once you push past{" "}
              <M>{tex`n = d`}</M>.
            </p>
            <p>
              <strong>(e) Mech-interp interpretation.</strong> Take a
              residual stream with{" "}
              <M>{tex`d = 768`}</M> (GPT-2 small) and{" "}
              <M>{tex`n \approx 30{,}000`}</M> features (one per
              English word). Compute the lower bound. What does this
              tell you about whether linear probes can isolate features
              cleanly, and why sparse autoencoders deliberately impose
              sparsity (most features off at any given input)?
            </p>
          </>
        }
        hint={
          <>
            For (c), the trace of <M>G</M> is the sum of its
            eigenvalues, and the Frobenius norm squared is the sum of
            squared eigenvalues (since <M>G</M> is symmetric PSD by
            (a)). Cauchy–Schwarz on these two sequences gives the
            bound.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`(F^{\top} F)_{ij} = \sum_{k} F_{ki} F_{kj} = \mathbf{f}_{i}^{\top} \mathbf{f}_{j} = G_{ij}`}</M>.
              So{" "}
              <M>{tex`G = F^{\top} F`}</M>. Rank of{" "}
              <M>{tex`F^{\top} F`}</M> equals rank of <M>F</M>, which is
              at most <M>{tex`\min(d, n) = d`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Direct: the sum splits into diagonal
              terms (each{" "}
              <M>{tex`G_{ii}^{2} = 1`}</M>, total <M>n</M>) and
              off-diagonal terms.
            </p>
            <p>
              <strong>(c)</strong> Since <M>G</M> is symmetric PSD with
              rank <M>{tex`\leq d`}</M>, write its eigendecomposition{" "}
              <M>{tex`G = Q \Lambda Q^{\top}`}</M> with at most <M>d</M>{" "}
              non-zero eigenvalues{" "}
              <M>{tex`\lambda_{1}, \ldots, \lambda_{d} \geq 0`}</M>.
              Then{" "}
              <M>{tex`\mathrm{tr}(G) = \sum_{i} \lambda_{i} = n`}</M>{" "}
              and{" "}
              <M>{tex`\|G\|_{F}^{2} = \mathrm{tr}(G^{2}) = \sum_{i} \lambda_{i}^{2}`}</M>.
              By Cauchy–Schwarz applied to{" "}
              <M>{tex`(\lambda_{1}, \ldots, \lambda_{d})`}</M> and{" "}
              <M>{tex`(1, \ldots, 1)`}</M>:
            </p>
            <Block>{tex`\Bigl(\textstyle\sum_{i=1}^{d} \lambda_{i}\Bigr)^{2} \leq d \cdot \sum_{i=1}^{d} \lambda_{i}^{2} \;\Longrightarrow\; n^{2} \leq d \cdot \|G\|_{F}^{2}.`}</Block>
            <p>
              So{" "}
              <M>{tex`\|G\|_{F}^{2} \geq n^{2}/d`}</M>.
            </p>
            <p>
              <strong>(d)</strong> Combine: from (b),{" "}
              <M>{tex`\sum_{i \neq j} G_{ij}^{2} = \|G\|_{F}^{2} - n \geq n^{2}/d - n = n(n - d)/d`}</M>.
              Divide by{" "}
              <M>{tex`n(n-1)`}</M>:
            </p>
            <Block>{tex`\frac{1}{n(n-1)} \sum_{i \neq j} G_{ij}^{2} \geq \frac{n - d}{d(n - 1)}.`}</Block>
            <p>
              For large{" "}
              <M>n</M>, this is{" "}
              <M>{tex`\approx 1/d`}</M>; the typical cross-talk
              magnitude is at least{" "}
              <M>{tex`1/\sqrt{d}`}</M>.
            </p>
            <p>
              <strong>(e)</strong> With{" "}
              <M>{tex`d = 768`}</M> and{" "}
              <M>{tex`n = 30{,}000`}</M>:
            </p>
            <Block>{tex`\frac{1}{n(n-1)} \sum_{i \neq j} G_{ij}^{2} \geq \frac{30000 - 768}{768 \cdot 29999} \approx 1.27 \times 10^{-3}.`}</Block>
            <p>
              The typical cross-talk is at least{" "}
              <M>{tex`\sqrt{1.27 \times 10^{-3}} \approx 0.036`}</M> in
              cosine — small, but not zero, and the average hides a
              long-tailed distribution. So <em>any</em> linear probe
              for a single feature will pick up a fundamental floor of
              interference from many other features. This is the
              algebraic origin of <strong>polysemanticity</strong>:
              one neuron, or one direction, is forced to fire for many
              concepts because the model has no choice.
            </p>
            <p>
              <strong>Sparse autoencoders</strong> attack this from the
              other side. They learn an over-complete dictionary{" "}
              <M>{tex`D \in \mathbb{R}^{d \times n}`}</M> where{" "}
              <M>{tex`n \gg d`}</M>, but enforce that for any given
              input only a few coordinates fire. The Welch bound still
              holds — features are not orthogonal — but{" "}
              <em>sparsity</em> means cross-talk between non-co-active
              features doesn&apos;t hurt you. That trade-off — a Welch
              bound on the dictionary, sparsity on the activations —
              is the entire algebraic story of why SAEs work, and the
              point at which linear algebra hands the next module
              (probability) a well-posed problem to think about.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
