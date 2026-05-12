import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { IntegratedGradientsToy } from "@/components/viz/IntegratedGradientsToy";

export const metadata = {
  title: "Capstone: calculus in mech interp",
};

export default function CalculusCapstonePage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="mech-interp-bridge"
      eyebrow="Capstone"
      title="Calculus in mech interp"
      lede="Now that backprop is real to you, three big interpretability ideas snap into focus: saliency maps, integrated gradients, and attribution patching. All three are calculus, applied carefully to a trained model."
    >
      <h2>Saliency: ∂output / ∂input</h2>
      <p>
        The simplest gradient-based interpretability move is just to
        read off
      </p>
      <Block>{tex`\text{saliency}_i(\mathbf{x}) = \left|\frac{\partial f(\mathbf{x})}{\partial x_i}\right|.`}</Block>
      <p>
        Big derivative means the output is locally sensitive to that
        input. For an image classifier, that highlights pixels; for
        a transformer, that highlights tokens or activation channels.
      </p>
      <p>
        Saliency has two well-known problems. It&apos;s a{" "}
        <em>local</em> linearisation — only valid for a vanishingly
        small neighbourhood around <M>{tex`\mathbf{x}`}</M>. And for
        deep networks with ReLUs and softmaxes, the gradient often{" "}
        <em>saturates</em>: when the model is very confident, all
        partial derivatives are tiny, and a saliency map looks like
        nothing in particular. Both problems are why people moved to
        integrated gradients.
      </p>

      <h2>Integrated gradients</h2>
      <p>
        Pick a <strong>baseline</strong> input{" "}
        <M>{tex`\mathbf{x}^{0}`}</M> — typically zero or a blurred
        version of the real input — and the actual input{" "}
        <M>{tex`\mathbf{x}^{1} = \mathbf{x}`}</M>. The attribution to
        input coordinate <M>i</M> is the average gradient along the
        straight line from baseline to input, times the input&apos;s
        change in that coordinate:
      </p>
      <Block>{tex`\mathrm{IG}_i(\mathbf{x}) = (x^{1}_i - x^{0}_i)\, \int_{0}^{1} \frac{\partial f}{\partial x_i}\bigl(\mathbf{x}^{0} + \alpha(\mathbf{x}^{1} - \mathbf{x}^{0})\bigr)\, d\alpha.`}</Block>
      <p>
        The integral is what averages out the saturation. The factor
        in front is what scales the attribution to the input&apos;s
        magnitude. The integral is approximated in practice by{" "}
        <M>{tex`m`}</M> evenly spaced gradient evaluations along the
        path.
      </p>

      <h2>The completeness property</h2>
      <p>
        Integrated gradients has a beautiful conservation law:
      </p>
      <Block>{tex`\sum_{i} \mathrm{IG}_i(\mathbf{x}) = f(\mathbf{x}^{1}) - f(\mathbf{x}^{0}).`}</Block>
      <p>
        This is the multi-variable fundamental theorem of calculus.
        The total attribution adds up to the actual change in output
        between baseline and input. No mass is lost; no mass is
        invented. Sliding the number of samples in the widget below
        shows it converging.
      </p>

      <Figure caption="A toy scalar function as a stand-in for the model output. Drag x⁰ (grey) and x¹ (orange). The straight dashed line is the integration path. Each orange arrow is ∇F at a sample along the path. The IG sum recovers F(x¹) − F(x⁰) to within Riemann-sum error.">
        <IntegratedGradientsToy />
      </Figure>

      <h2>Attribution patching</h2>
      <p>
        <em>Activation patching</em> in interpretability replaces an
        intermediate activation <M>{tex`\mathbf{a}`}</M> with one from
        a different forward pass and remeasures the output. Doing this
        for every component is expensive.
      </p>
      <p>
        <strong>Attribution patching</strong> approximates the effect
        of a patch with a single backward pass:
      </p>
      <Block>{tex`\Delta f \approx \frac{\partial f}{\partial \mathbf{a}} \cdot \bigl(\mathbf{a}_{\text{clean}} - \mathbf{a}_{\text{patched}}\bigr).`}</Block>
      <p>
        That&apos;s a directional derivative of the loss along the
        activation difference — chapter 5&apos;s identity, applied to
        a transformer&apos;s internals. It&apos;s a linearisation, so
        it&apos;s only accurate when the patch is small, but it lets
        you score every internal component for importance with one
        backward pass instead of one forward pass per component. The
        TransformerLens library and most modern circuit-finding work
        run on this approximation.
      </p>

      <h2>Where calculus stops and other things start</h2>
      <p>
        Gradients tell you the <em>linear</em> effect of a nudge. They
        are blind to:
      </p>
      <ul>
        <li>
          <strong>Nonlinear interactions</strong>: two features that
          only matter <em>together</em>.
        </li>
        <li>
          <strong>Long-range effects</strong>: a coordinate that
          doesn&apos;t move the output at <M>{tex`\mathbf{x}`}</M> but
          does move it elsewhere.
        </li>
        <li>
          <strong>Discrete switches</strong>: an argmax that just
          flipped to a different token has a zero gradient on either
          side of the switch.
        </li>
      </ul>
      <p>
        Mech interp leans hard on gradients <em>and</em> on
        activation-level interventions because the two together cover
        what either misses on its own. The next module — Neural
        Networks — is where we stop talking about calculus on
        abstract functions and start tracing it through real
        architectures.
      </p>

      <Callout variant="intuition">
        Every gradient-based interpretability method is the chain rule
        applied to a trained model with a different question in mind.
        Train the network: backprop the loss to the parameters.
        Saliency: backprop the output to the inputs. Attribution
        patching: backprop the output to an internal activation. Same
        algorithm, three questions.
      </Callout>

      <Callout variant="note">
        Next module: <em>Neural Networks</em>. We&apos;ll put together
        the linear algebra, probability, and calculus you have, and
        build the forward pass of an MLP and a transformer from the
        ground up.
      </Callout>

      <Challenge
        prompt={
          <>
            <p>
              <strong>Prove the completeness property of integrated
              gradients.</strong> Let{" "}
              <M>{tex`f : \mathbb{R}^{n} \to \mathbb{R}`}</M> be{" "}
              <M>{tex`C^{1}`}</M>, fix a baseline{" "}
              <M>{tex`\mathbf{x}^{0}`}</M> and an input{" "}
              <M>{tex`\mathbf{x}^{1}`}</M>, and define
            </p>
            <Block>{tex`\mathrm{IG}_{i}(\mathbf{x}^{1}) = (x^{1}_{i} - x^{0}_{i})\, \int_{0}^{1} \frac{\partial f}{\partial x_{i}}\!\bigl(\mathbf{x}^{0} + \alpha(\mathbf{x}^{1} - \mathbf{x}^{0})\bigr)\, d\alpha.`}</Block>
            <p>
              Show that
            </p>
            <Block>{tex`\sum_{i=1}^{n} \mathrm{IG}_{i}(\mathbf{x}^{1}) = f(\mathbf{x}^{1}) - f(\mathbf{x}^{0}).`}</Block>
            <p>
              Then explain — using the proof you just wrote — why
              completeness fails if the path from{" "}
              <M>{tex`\mathbf{x}^{0}`}</M> to{" "}
              <M>{tex`\mathbf{x}^{1}`}</M> is replaced by an arbitrary
              non-straight curve, unless you also change the integrand.
              What conservation law replaces it?
            </p>
          </>
        }
        hint={
          <>
            Define the single-variable function{" "}
            <M>{tex`\varphi(\alpha) = f\bigl(\mathbf{x}^{0} + \alpha (\mathbf{x}^{1} - \mathbf{x}^{0})\bigr)`}</M>.
            Compute <M>{tex`\varphi'(\alpha)`}</M> by the chain rule and
            apply the 1D fundamental theorem of calculus to{" "}
            <M>{tex`\varphi`}</M> on <M>{tex`[0, 1]`}</M>.
          </>
        }
        solution={
          <>
            <p>
              Let <M>{tex`\boldsymbol{\Delta} = \mathbf{x}^{1} - \mathbf{x}^{0}`}</M>{" "}
              and define{" "}
              <M>{tex`\varphi(\alpha) = f(\mathbf{x}^{0} + \alpha \boldsymbol{\Delta})`}</M>.
              By the multivariable chain rule,
            </p>
            <Block>{tex`\varphi'(\alpha) = \nabla f\bigl(\mathbf{x}^{0} + \alpha \boldsymbol{\Delta}\bigr) \cdot \boldsymbol{\Delta} = \sum_{i} \frac{\partial f}{\partial x_{i}}\bigl(\mathbf{x}^{0} + \alpha \boldsymbol{\Delta}\bigr) \cdot \Delta_{i}.`}</Block>
            <p>
              By the fundamental theorem of calculus on <M>{tex`[0, 1]`}</M>,
            </p>
            <Block>{tex`f(\mathbf{x}^{1}) - f(\mathbf{x}^{0}) = \varphi(1) - \varphi(0) = \int_{0}^{1} \varphi'(\alpha)\, d\alpha.`}</Block>
            <p>Substituting and switching sum and integral (legal because both are finite for <M>{tex`C^{1}`}</M> <M>f</M>),</p>
            <Block>{tex`f(\mathbf{x}^{1}) - f(\mathbf{x}^{0}) = \sum_{i} \Delta_{i} \int_{0}^{1} \frac{\partial f}{\partial x_{i}}\bigl(\mathbf{x}^{0} + \alpha \boldsymbol{\Delta}\bigr)\, d\alpha = \sum_{i} \mathrm{IG}_{i}(\mathbf{x}^{1}).`}</Block>
            <p>
              <strong>Why straight paths are special.</strong> The
              identity{" "}
              <M>{tex`\varphi'(\alpha) = \nabla f \cdot \boldsymbol{\Delta}`}</M>{" "}
              relied on the path having constant velocity{" "}
              <M>{tex`\boldsymbol{\Delta}`}</M> — i.e. on it being a
              straight line. For a general path{" "}
              <M>{tex`\gamma : [0, 1] \to \mathbb{R}^{n}`}</M>, the
              chain rule gives{" "}
              <M>{tex`\varphi'(\alpha) = \nabla f(\gamma(\alpha)) \cdot \gamma'(\alpha)`}</M>,
              and what survives is the <em>line-integral</em> form of
              the fundamental theorem:
            </p>
            <Block>{tex`f(\mathbf{x}^{1}) - f(\mathbf{x}^{0}) = \int_{\gamma} \nabla f \cdot d\boldsymbol{\ell}.`}</Block>
            <p>
              The integral is path-independent because <M>{tex`\nabla f`}</M>{" "}
              is a conservative vector field — that is the conservation
              law. Standard integrated gradients picks the straight
              path and partitions the answer additively across
              coordinates. Other choices (e.g. expected gradients,
              Aumann–Shapley) integrate over a <em>distribution</em> of
              paths and give different attributions, but they still sum
              to <M>{tex`f(\mathbf{x}^{1}) - f(\mathbf{x}^{0})`}</M>.
              Completeness is the multivariable fundamental theorem of
              calculus, dressed up.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
