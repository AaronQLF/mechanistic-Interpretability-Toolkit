import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
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

      <Challenge
        prompt={
          <>
            <p>
              Pick a single token position. Let{" "}
              <M>{tex`\mathbf{x} \in \mathbb{R}^{d}`}</M> be the
              residual stream at that position,{" "}
              <M>{tex`W_U \in \mathbb{R}^{|V| \times d}`}</M> the
              unembedding (with rows{" "}
              <M>{tex`\mathbf{u}_{i}`}</M>),{" "}
              <M>{tex`\mathbf{p} = \mathrm{softmax}(W_U \mathbf{x})`}</M>{" "}
              the next-token distribution.
            </p>
            <p>
              <strong>(a) The logit-lens decomposition.</strong>{" "}
              From chapter 6 (residual streams), write{" "}
              <M>{tex`\mathbf{x} = \mathbf{x}_{0} + \sum_{\ell} \mathbf{c}_{\ell}`}</M>{" "}
              where each <M>{tex`\mathbf{c}_{\ell}`}</M> is one
              block&apos;s contribution. Show that the logit for any
              token <M>i</M> is the sum
              <Block>{tex`z_{i} = \mathbf{u}_{i} \cdot \mathbf{x} = \mathbf{u}_{i} \cdot \mathbf{x}_{0} + \sum_{\ell} \mathbf{u}_{i} \cdot \mathbf{c}_{\ell},`}</Block>
              and hence the &ldquo;logit difference&rdquo;{" "}
              <M>{tex`z_{\text{correct}} - z_{\text{wrong}}`}</M> is
              also additive over blocks. Why does this fail for the{" "}
              <em>probability</em>{" "}
              <M>{tex`p_{i}`}</M>?
            </p>
            <p>
              <strong>(b) KL of an ablation, channel-by-channel.</strong>{" "}
              Suppose you ablate one residual stream channel{" "}
              <M>j</M> by zeroing{" "}
              <M>{tex`x_{j}`}</M>. The post-ablation logits become{" "}
              <M>{tex`\tilde z_{i} = z_{i} - (W_U)_{ij} x_{j}`}</M>.
              Show that for small <M>{tex`x_{j}`}</M> the KL between
              clean and ablated next-token distributions has the
              second-order expansion
              <Block>{tex`\mathrm{KL}(p \,\|\, \tilde p) \approx \frac{1}{2}\,(W_U)_{:,j}^{\top}\, (\mathrm{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^{\top})\, (W_U)_{:,j}\, x_{j}^{2},`}</Block>
              and identify the central matrix as the Fisher
              information of the categorical distribution at{" "}
              <M>{tex`\mathbf{p}`}</M>. (You met this matrix in the
              softmax chapter as the Jacobian{" "}
              <M>{tex`J = \mathrm{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^{\top}`}</M>.)
            </p>
            <p>
              <strong>(c) Reading the result.</strong> Use (b) to
              explain three observations interpreters make in
              practice. (i) Channels with{" "}
              <M>{tex`x_{j} \approx 0`}</M> on the input never
              matter for ablations on that input. (ii) The{" "}
              <em>direction</em>{" "}
              <M>{tex`(W_U)_{:,j}`}</M> matters as much as its
              magnitude — channels whose unembedding column is
              orthogonal to the current{" "}
              <M>{tex`\mathbf{p}`}</M>-weighted spread don&apos;t
              affect the output even if{" "}
              <M>{tex`x_{j}`}</M> is large. (iii) Two channels can
              be individually unimportant but jointly crucial; what
              term in (b) explains this when you ablate{" "}
              <em>two</em> channels simultaneously?
            </p>
          </>
        }
        hint={
          <>
            For (a): probability involves softmax, which is
            nonlinear. For (b): KL between two categoricals close to
            each other equals (1/2) × Fisher × (logit shift)², a
            standard Taylor expansion. For (c): if{" "}
            <M>{tex`(W_U)_{:,j}`}</M> is a constant vector, the
            quadratic form vanishes; for two channels the
            cross-term involves{" "}
            <M>{tex`(W_U)_{:, j_1}^{\top} J (W_U)_{:, j_2}`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> The logit{" "}
              <M>{tex`z_{i} = \mathbf{u}_{i} \cdot \mathbf{x}`}</M>{" "}
              is linear in <M>{tex`\mathbf{x}`}</M>; substituting
              the residual decomposition gives the additive form.
              The same is true for any{" "}
              <em>linear</em> functional of the logits, in
              particular logit differences. The <em>probability</em>{" "}
              <M>{tex`p_{i} = \exp(z_{i})/\sum_{j} \exp(z_{j})`}</M>{" "}
              is nonlinear in <M>{tex`\mathbf{x}`}</M>; you cannot
              attribute &ldquo;1% of the probability&rdquo; to one
              block in a meaningful way without choosing a baseline
              and linearizing — which is exactly what attribution
              patching does.
            </p>
            <p>
              <strong>(b)</strong> Set{" "}
              <M>{tex`\mathbf{\delta} = -(W_U)_{:,j} x_{j}`}</M> so
              that{" "}
              <M>{tex`\tilde{\mathbf{z}} = \mathbf{z} + \mathbf{\delta}`}</M>.
              For two categoricals related by a small shift in
              logits,
              <Block>{tex`\mathrm{KL}(p \,\|\, \tilde p) = \frac{1}{2} \mathbf{\delta}^{\top} J \mathbf{\delta} + O(\|\mathbf{\delta}\|^{3}),`}</Block>
              with{" "}
              <M>{tex`J = \mathrm{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^{\top}`}</M>{" "}
              the Fisher matrix of the categorical at{" "}
              <M>{tex`\mathbf{p}`}</M>. (Derivation: Taylor-expand
              <M>{tex`\log Z(\mathbf{z} + \mathbf{\delta})`}</M> to
              second order; the first-order term cancels in KL, and
              the Hessian of the log-partition is exactly{" "}
              <M>J</M>.) Substituting{" "}
              <M>{tex`\mathbf{\delta}`}</M> gives the displayed
              expression.
            </p>
            <p>
              <strong>(c)</strong> (i){" "}
              <M>{tex`x_{j} = 0`}</M> means the ablation actually
              changes nothing —{" "}
              <M>{tex`\tilde{\mathbf{z}} = \mathbf{z}`}</M> — so KL
              is zero. Intuitive but easy to miss: a channel
              important for some inputs may be silent on others,
              and an ablation on the silent input gives no signal.
              (ii) The quadratic form{" "}
              <M>{tex`\mathbf{u}^{\top} J \mathbf{u}`}</M> is the
              Fisher inner product. For{" "}
              <M>{tex`\mathbf{u} = \alpha \mathbf{1}`}</M>{" "}
              (constant), <M>{tex`J \mathbf{1} = \mathbf{p} - \mathbf{p} = 0`}</M>{" "}
              (the softmax shift-invariance reflected here),
              so a unembedding column proportional to constant
              gives KL = 0 — this is the same null direction we met
              in the softmax challenge. More generally, a column{" "}
              <M>{tex`(W_U)_{:,j}`}</M> in the kernel of <M>J</M>{" "}
              moves the logits in a way the softmax cannot
              distinguish. (iii) Ablating two channels{" "}
              <M>{tex`j_{1}, j_{2}`}</M> introduces a cross-term{" "}
              <M>{tex`x_{j_{1}} x_{j_{2}} (W_U)_{:,j_{1}}^{\top} J (W_U)_{:,j_{2}}`}</M>.
              If the unembedding columns are aligned in
              Fisher-inner-product (e.g.&nbsp;they push
              probability in the same direction), the joint effect
              can be twice the sum of singletons; if they cancel,
              the joint effect can be smaller than either. This is
              why &ldquo;mean ablation&rdquo; or &ldquo;leave-one-out&rdquo;
              metrics can wildly mislead in the presence of
              redundant or interacting components — and why
              activation patching, which always uses the full
              residual stream from a counterfactual run, gives
              cleaner answers than per-channel ablation.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
