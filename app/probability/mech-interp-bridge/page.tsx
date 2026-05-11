import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { LogitLensToy } from "@/components/viz/LogitLensToy";

export const metadata = {
  title: "Capstone: probability in mech interp",
};

export default function ProbCapstonePage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="mech-interp-bridge"
      eyebrow="Capstone"
      title="Probability in mech interp"
      lede="The bars you've been dragging are the bars at the end of a transformer's forward pass. This chapter strings the previous nine into a single picture: what the logit lens sees, how attention is itself a distribution, and why KL is the right metric for an ablation."
    >
      <h2>The forward pass, probabilistically</h2>
      <p>
        A language model is a parametric family of distributions:
      </p>
      <Block>{tex`p_\theta(x_t \mid x_{<t}).`}</Block>
      <p>
        At a single token position, the residual stream{" "}
        <M>{tex`\mathbf{x} \in \mathbb{R}^{d}`}</M> is multiplied by the
        unembedding to produce logits, and a softmax produces the
        conditional distribution over the vocabulary:
      </p>
      <Block>{tex`\mathbf{z} = W_U\, \mathbf{x}, \qquad p_\theta(\cdot \mid x_{<t}) = \mathrm{softmax}(\mathbf{z}).`}</Block>
      <p>
        Every probability concept from the last nine chapters lives in
        that two-line forward pass. The bars below are the smallest
        possible language model — 4-dimensional residual stream, 6-token
        vocabulary — but the shape is the real one.
      </p>

      <Figure caption="A toy logit-lens setup. Top-left: a 4D residual stream. Top-right: the corresponding logits. Bottom: the softmax distribution before and after zeroing a single channel of x. The number that matters is the KL between the two distributions.">
        <LogitLensToy />
      </Figure>

      <h2>The logit lens, formally</h2>
      <p>
        The <strong>logit lens</strong> is the observation that you
        don&apos;t have to wait until the final layer to apply{" "}
        <M>{tex`W_U`}</M>. At any intermediate layer{" "}
        <M>{tex`\ell`}</M>:
      </p>
      <Block>{tex`p_\ell(\cdot \mid x_{<t}) = \mathrm{softmax}\bigl(W_U\, \mathbf{x}_\ell\bigr).`}</Block>
      <p>
        These intermediate distributions tell you which tokens the
        model is &ldquo;already considering&rdquo; — and when (which
        layer) it commits to the eventual answer. Reading them is
        exactly reading the bars in the figure above, layer by layer.
      </p>

      <h2>Attention is a distribution</h2>
      <p>
        Inside an attention head, the score matrix passes through a
        softmax:
      </p>
      <Block>{tex`A_{ij} = \mathrm{softmax}_j\!\left(\frac{\mathbf{q}_i \cdot \mathbf{k}_j}{\sqrt{d_{\text{head}}}}\right).`}</Block>
      <p>
        Each row <M>{tex`A_{i, \cdot}`}</M> is a probability distribution
        over earlier tokens — &ldquo;where does token <M>i</M> read from?&rdquo;
        That row has an entropy, a perplexity, an argmax, a top-p set.
        Every diagnostic we built for next-token distributions applies
        equally to attention rows: low entropy means the head is
        focused; high entropy means it&apos;s diffusing.
      </p>

      <h2>The training loss, again</h2>
      <p>
        Pre-training optimises average per-token{" "}
        <em>cross-entropy</em> against a one-hot target:
      </p>
      <Block>{tex`\mathcal{L}(\theta) = -\mathbb{E}_{x \sim \text{data}} \sum_{t} \log p_\theta(x_t \mid x_{<t}).`}</Block>
      <p>
        Loss in nats, perplexity{" "}
        <M>{tex`\mathrm{PPL} = e^{\mathcal{L}/T}`}</M> per token, scaling
        laws as <M>{tex`\mathcal{L}(N, D)`}</M> — all the same quantity
        in different costumes.
      </p>

      <h2>The right metric for an intervention</h2>
      <p>
        Suppose you ablate a head or patch in an activation. There are
        three popular ways to measure what changed:
      </p>
      <ol>
        <li>
          <strong>String match.</strong> Did the sampled token change?
          Cheap and noisy: 99.9% of the distribution can move without
          changing the argmax.
        </li>
        <li>
          <strong>Logit difference.</strong>{" "}
          <M>{tex`z_{\text{correct}} - z_{\text{wrong}}`}</M> before and
          after. Sensitive, shift-invariant, the workhorse of activation
          patching.
        </li>
        <li>
          <strong>KL divergence.</strong>{" "}
          <M>{tex`\mathrm{KL}\bigl(p_{\text{clean}} \,\|\, p_{\text{ablated}}\bigr)`}</M>.
          Captures every probability shift, not just the contrast
          between two tokens.
        </li>
      </ol>
      <p>
        In the toy widget above, try ablating each hidden channel.
        Some channels are doing nothing on this input (KL stays near 0).
        Others are doing a lot (KL spikes; argmax can flip). The same
        pattern, with 50,257 tokens and 768 channels instead of 6 and 4,
        is how heads and MLP neurons in real models are scored for
        importance.
      </p>

      <Callout variant="intuition">
        A transformer is a probability distribution over tokens.
        Mech-interp metrics are ways of asking, &ldquo;how much did
        this internal component shape <em>that distribution</em>?&rdquo;
        The answer is always an entropy, a cross-entropy, a KL, or a
        logit difference — there is nothing else to measure.
      </Callout>

      <Callout variant="note">
        Next module: <em>Calculus</em>. We&apos;ll learn how the loss
        in this chapter gets pushed back through the network as a
        gradient, and why softmax + cross-entropy has the cleanest
        gradient in all of deep learning.
      </Callout>
    </ChapterShell>
  );
}
