import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
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
    </ChapterShell>
  );
}
