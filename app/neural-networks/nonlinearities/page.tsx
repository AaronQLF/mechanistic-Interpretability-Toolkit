import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { ActivationCompare } from "@/components/viz/ActivationCompare";

export const metadata = {
  title: "Nonlinearities",
};

export default function NonlinearitiesPage() {
  return (
    <ChapterShell
      moduleSlug="neural-networks"
      chapterSlug="nonlinearities"
      eyebrow="Chapter 03"
      title="Nonlinearities"
      lede="A stack of linear layers with no nonlinearity is a single linear layer. The whole reason depth buys you anything is the elementwise squashing function tucked between the matmuls. There are about four worth knowing."
    >
      <h2>Why we need them at all</h2>
      <p>
        From the previous chapter: composing two linear layers gives{" "}
        <M>{tex`f_2 \circ f_1 = (W_2 W_1)\mathbf{x} + (W_2 \mathbf{b}_1 + \mathbf{b}_2)`}</M>{" "}
        — a single affine map. That collapses any number of stacked
        linear layers into one. The fix is to insert an{" "}
        <em>elementwise nonlinearity</em>{" "}
        <M>{tex`\sigma : \mathbb{R} \to \mathbb{R}`}</M> between
        them:
      </p>
      <Block>{tex`f_2(\sigma(f_1(\mathbf{x}))).`}</Block>
      <p>
        Now <M>{tex`\sigma`}</M> sits between the matmuls and breaks
        the linearity argument: <M>{tex`W_2`}</M> can no longer be
        pulled inside <M>{tex`\sigma`}</M>. The composed map is
        genuinely a richer function. The classical universal
        approximation theorems say that{" "}
        <em>almost any</em>{" "}
        <M>{tex`\sigma`}</M> works — the choice of
        nonlinearity matters for training and not for what&apos;s
        ultimately representable.
      </p>

      <h2>The four you&apos;ll meet</h2>
      <p>
        All four below are applied <em>elementwise</em>: a vector
        comes in, a vector of the same shape comes out. Toggle them
        in the figure to compare.
      </p>

      <h3>Sigmoid</h3>
      <Block>{tex`\sigma(z) = \frac{1}{1 + e^{-z}}.`}</Block>
      <p>
        Output range <M>{tex`(0, 1)`}</M>; smooth; saturates flat at
        both ends. The historical default of the 1990s. Mostly
        retired from hidden layers because of the{" "}
        <em>vanishing gradient</em>: in the saturated regions{" "}
        <M>{tex`\sigma'(z) = \sigma(z)(1 - \sigma(z))`}</M> is{" "}
        nearly zero, so the chain rule multiplies tiny numbers and
        the upstream gradient dies. Still ubiquitous as the{" "}
        <em>output</em> of binary classifiers.
      </p>

      <h3>Tanh</h3>
      <Block>{tex`\tanh(z) = \frac{e^{z} - e^{-z}}{e^{z} + e^{-z}} = 2\sigma(2z) - 1.`}</Block>
      <p>
        Same shape as sigmoid but rescaled and shifted to range{" "}
        <M>{tex`(-1, 1)`}</M> with a derivative that peaks at{" "}
        <M>1</M> at <M>{tex`z = 0`}</M>. Better than sigmoid for
        hidden layers because the output is centred at zero, so
        gradients aren&apos;t systematically biased in one sign.
      </p>

      <h3>ReLU</h3>
      <Block>{tex`\mathrm{ReLU}(z) = \max(0,\, z).`}</Block>
      <p>
        Identity on the positive half, zero on the negative half.
        Three reasons it took over deep learning around 2012:
        the gradient is exactly <M>1</M> on the active half (no
        vanishing), it&apos;s cheap to compute, and the
        sparsity of its outputs (about half the neurons are zero on
        any given input) regularises networks.
      </p>
      <p>
        Pitfalls worth naming: ReLU has zero gradient on the silent
        half, so a neuron that ever drifts there stays there
        (the &ldquo;dead ReLU&rdquo; problem). It is also{" "}
        <em>not differentiable</em> at <M>{tex`z = 0`}</M>; in
        practice frameworks pick one of the subgradients.
      </p>

      <h3>GELU</h3>
      <Block>{tex`\mathrm{GELU}(z) = z\, \Phi(z),`}</Block>
      <p>
        where <M>{tex`\Phi`}</M> is the Gaussian CDF. A smooth,
        slightly-non-monotonic approximation to ReLU that is the
        default in most modern transformers (BERT, GPT-2, GPT-3,
        LLaMA). It allows a small amount of negative output near{" "}
        <M>{tex`z = 0`}</M>, which empirically improves training and
        avoids the &ldquo;dead&rdquo; failure mode of ReLU.
      </p>

      <Figure caption="Same axes, four activations. ReLU is hard-clipped; GELU smooths the corner and dips slightly negative; sigmoid and tanh saturate at both ends.">
        <ActivationCompare />
      </Figure>

      <h2>What &ldquo;buys you what&rdquo;</h2>
      <ul>
        <li>
          <strong>Saturation.</strong> Sigmoid and tanh saturate; ReLU
          and GELU do not (positive side). Saturating activations
          throttle gradients; non-saturating ones do not. This is the
          single biggest reason ReLU/GELU dominate modern hidden
          layers.
        </li>
        <li>
          <strong>Sparsity.</strong> ReLU produces literal zeros on
          its silent half. GELU produces near-zeros but not exact
          ones. This matters for some interpretability methods that
          assume sparse activations.
        </li>
        <li>
          <strong>Smoothness.</strong> GELU is{" "}
          <M>{tex`C^{\infty}`}</M>; ReLU is only{" "}
          <M>{tex`C^{0}`}</M>. Smoothness helps optimization with
          methods that rely on second-order information.
        </li>
        <li>
          <strong>Output range.</strong> Sigmoid and tanh have bounded
          output; ReLU and GELU don&apos;t. That&apos;s why the
          first two get used at network <em>outputs</em> for
          probability or signed scores, while the last two get used
          in <em>hidden</em> layers.
        </li>
      </ul>

      <Callout variant="intuition">
        Pick a nonlinearity by what it lets through and what it
        squashes. Sigmoid: probability. Tanh: signed score in{" "}
        <M>{tex`(-1, 1)`}</M>. ReLU: an unbounded positive number,
        zero otherwise. GELU: ReLU with the corner sanded off and
        a tiny dip into the negatives. Anything else you&apos;ll
        find — Swish, Mish, ELU, SELU — is a small variation on
        these themes.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The choice of nonlinearity determines what counts as a{" "}
          <em>feature</em> inside an MLP block:
        </p>
        <ul>
          <li>
            For ReLU networks, a feature is naturally an{" "}
            <strong>active half-space</strong>: the inputs on which a
            given hidden neuron has nonzero output. Sparse autoencoders
            for ReLU residual streams exploit this directly.
          </li>
          <li>
            For GELU networks (most transformers), the feature is
            blurred — a neuron is &ldquo;mostly silent&rdquo; on the
            negative half but not exactly. SAE training on GELU
            networks needs slightly different sparsity priors.
          </li>
          <li>
            <strong>SwiGLU / GeGLU</strong> blocks (used in LLaMA,
            PaLM) replace one nonlinearity with a gating product{" "}
            <M>{tex`\sigma(W_1 \mathbf{x}) \odot (W_2 \mathbf{x})`}</M>.
            That changes the effective rank and the OV-like
            decomposition you can do on the block — see the LLaMA
            interpretability literature.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            Why do we put a nonlinearity <em>between</em> two linear
            layers, not before the first or after the last?
          </>
        }
        choices={[
          {
            id: "a",
            label:
              "Convention; you could put it anywhere and the network would behave the same.",
            explain:
              "False. Placement matters because the composition with the surrounding linear maps changes the function class.",
          },
          {
            id: "b",
            label:
              "Because two consecutive linear maps collapse into one; an interior nonlinearity is the thing that prevents the collapse.",
            correct: true,
            explain:
              "Exactly. Without σ between f₁ and f₂, the composition is just W₂W₁ x + W₂b₁ + b₂ — a single linear layer. σ is what makes depth meaningful.",
          },
          {
            id: "c",
            label:
              "Because σ has no parameters; placing it elsewhere would change the parameter count.",
            explain:
              "Activations are parameter-free everywhere. The reason for placement is the linearity argument, not parameter accounting.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Define{" "}
              <M>{tex`f(\mathbf{x}) = W_2\, \mathrm{ReLU}(W_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2`}</M>{" "}
              with <M>{tex`W_1 \in \mathbb{R}^{h \times d}`}</M> and{" "}
              <M>{tex`W_2 \in \mathbb{R}^{m \times h}`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Show that the input space{" "}
              <M>{tex`\mathbb{R}^{d}`}</M> is partitioned into at
              most <M>{tex`2^h`}</M> regions (an{" "}
              <em>activation pattern</em> — which hidden neurons
              fire and which don&apos;t), and that <M>f</M> is{" "}
              <em>affine</em> on each region. (Hence ReLU networks
              are <em>piecewise linear</em>.)
            </p>
            <p>
              <strong>(b)</strong> The bound{" "}
              <M>{tex`2^h`}</M> is loose — many activation patterns
              are infeasible. Show that the actual number of regions
              is at most the number of cells in the arrangement of{" "}
              <M>h</M> hyperplanes in{" "}
              <M>{tex`\mathbb{R}^{d}`}</M>, which is{" "}
              <M>{tex`\sum_{k=0}^{d}\binom{h}{k} = O(h^d)`}</M>{" "}
              for <M>{tex`h \ge d`}</M>. Why is this much smaller
              than <M>{tex`2^h`}</M> when <M>{tex`d \ll h`}</M>?
            </p>
            <p>
              <strong>(c)</strong> Now replace ReLU with GELU. Is the
              resulting <M>f</M> piecewise linear? If not, what is
              the correct analogous statement about how the input
              space is &ldquo;organized&rdquo;? What does this
              difference tell you about what features look like in a
              ReLU network vs.&nbsp;a GELU network — and which is
              easier to interpret?
            </p>
          </>
        }
        hint={
          <>
            For (a): each hidden neuron defines a half-space &ldquo;I
            fire&rdquo; vs.&nbsp;&ldquo;I don&apos;t.&rdquo; The
            intersection of all those choices is a polytope; on it{" "}
            <M>{tex`\mathrm{ReLU}(W_1 \mathbf{x} + \mathbf{b}_1)`}</M>{" "}
            is an affine map of <M>{tex`\mathbf{x}`}</M>. For (b):
            this is the well-known Zaslavsky bound on hyperplane
            arrangements. For (c): GELU is{" "}
            <M>{tex`C^{\infty}`}</M>, so the pieces blend smoothly.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Let{" "}
              <M>{tex`\mathbf{a}_i = W_{1,i,:}`}</M> and{" "}
              <M>{tex`b_i = (\mathbf{b}_1)_i`}</M>. Each neuron{" "}
              <M>i</M> defines a half-space{" "}
              <M>{tex`H_i^+ = \{\mathbf{x} : \mathbf{a}_i\cdot\mathbf{x} + b_i > 0\}`}</M>.
              An <em>activation pattern</em> is a sign vector{" "}
              <M>{tex`s \in \{0,1\}^h`}</M>; the corresponding region
              is the intersection of half-spaces{" "}
              <M>{tex`H_i^+`}</M> for <M>{tex`s_i = 1`}</M> and{" "}
              <M>{tex`H_i^-`}</M> otherwise. On each such region the
              ReLU mask is constant, so{" "}
              <M>{tex`\mathrm{ReLU}(W_1 \mathbf{x} + \mathbf{b}_1) = D_s (W_1 \mathbf{x} + \mathbf{b}_1)`}</M>{" "}
              for the diagonal mask matrix{" "}
              <M>{tex`D_s = \mathrm{diag}(s)`}</M>, hence{" "}
              <M>{tex`f(\mathbf{x}) = W_2 D_s W_1 \mathbf{x} + (W_2 D_s \mathbf{b}_1 + \mathbf{b}_2)`}</M>{" "}
              is affine. There are at most{" "}
              <M>{tex`2^h`}</M> sign vectors and so at most{" "}
              <M>{tex`2^h`}</M> regions.
            </p>
            <p>
              <strong>(b)</strong> Most sign vectors don&apos;t
              correspond to a non-empty region, because the{" "}
              <M>h</M> hyperplanes only chop{" "}
              <M>{tex`\mathbb{R}^{d}`}</M> into{" "}
              <M>{tex`\sum_{k=0}^{d}\binom{h}{k}`}</M> cells
              (Zaslavsky&apos;s theorem), which for fixed <M>d</M>{" "}
              and large <M>h</M> grows polynomially. Intuitively, in
              low-dimensional input space you cannot even <em>realize</em>{" "}
              all <M>{tex`2^h`}</M> on/off combinations of the hidden
              neurons — they&apos;re geometrically constrained. So
              the &ldquo;effective expressivity&rdquo; of a ReLU layer
              with <M>{tex`h \gg d`}</M> hidden units is much smaller
              than the naïve count suggests. This is one of the
              well-known reasons depth is more parameter-efficient
              than width: deep networks compose piecewise-linear
              functions, multiplying the region counts.
            </p>
            <p>
              <strong>(c)</strong> Replace ReLU with GELU and{" "}
              <M>f</M> is no longer piecewise linear — it is a
              smooth function with no exact regions. The closest
              analog is the &ldquo;soft activation pattern&rdquo;:
              each hidden neuron is partly on and partly off, with
              fractional contributions. For interpretability this
              has two consequences. First, ReLU networks admit a
              clean &ldquo;polytope decomposition&rdquo; — every
              input lies in <em>one</em> linear region, and the
              network on that region is just a single matrix you
              can read off. Sparse autoencoder dictionaries on ReLU
              activations exploit this directly. Second, GELU
              networks are easier to{" "}
              <em>train</em> (smooth gradients, no dead neurons)
              but harder to{" "}
              <em>cleanly decompose</em>: features blur into each
              other near zero. Real transformers use GELU because
              training matters more than interpretability, and
              modern SAE work has had to develop GELU-aware
              dictionaries (e.g. JumpReLU, top-k SAEs) to recover
              the clean piecewise picture.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
