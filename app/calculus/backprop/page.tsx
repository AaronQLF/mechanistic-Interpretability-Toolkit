import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { BackpropToy } from "@/components/viz/BackpropToy";

export const metadata = {
  title: "Backpropagation",
};

export default function BackpropPage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="backprop"
      eyebrow="Chapter 08"
      title="Backpropagation"
      lede="Backpropagation is what you get when you apply the chain rule to a computation graph, in reverse, with caching. That sentence is the whole algorithm. The rest is bookkeeping — but the bookkeeping is what made deep learning possible."
    >
      <h2>The setup: a tiny network</h2>
      <p>
        Consider this composition:
      </p>
      <Block>{tex`y = a \cdot x, \quad z = y + b, \quad s = \sigma(z), \quad L = (s - t)^2.`}</Block>
      <p>
        This is a neuron with input <M>x</M>, weight <M>a</M>, bias{" "}
        <M>b</M>, sigmoid activation, and squared error against a
        target <M>t</M>. Training means adjusting <M>a</M> and{" "}
        <M>b</M> to make <M>L</M> small. To do that with gradient
        descent we need{" "}
        <M>{tex`\partial L / \partial a`}</M> and{" "}
        <M>{tex`\partial L / \partial b`}</M>.
      </p>

      <h2>The forward pass</h2>
      <p>
        Plug numbers in and compute every intermediate value, in order:{" "}
        <M>y</M>, then <M>z</M>, then <M>s</M>, then <M>L</M>. These
        values are the blue numbers on each edge in the widget below.
        Cache them — you&apos;ll need them for the backward pass.
      </p>

      <h2>The backward pass</h2>
      <p>
        Start at the output. <M>{tex`\partial L / \partial L = 1`}</M>{" "}
        trivially. Then for each operation, walk one step backward
        and apply the chain rule using the cached forward value:
      </p>
      <Block>{tex`\frac{\partial L}{\partial s} = 2(s - t).`}</Block>
      <Block>{tex`\frac{\partial L}{\partial z} = \frac{\partial L}{\partial s} \cdot \sigma'(z) = \frac{\partial L}{\partial s} \cdot s(1 - s).`}</Block>
      <Block>{tex`\frac{\partial L}{\partial y} = \frac{\partial L}{\partial z} \cdot 1, \qquad \frac{\partial L}{\partial b} = \frac{\partial L}{\partial z} \cdot 1.`}</Block>
      <Block>{tex`\frac{\partial L}{\partial x} = \frac{\partial L}{\partial y} \cdot a, \qquad \frac{\partial L}{\partial a} = \frac{\partial L}{\partial y} \cdot x.`}</Block>
      <p>
        Two patterns are doing all the work. First, each edge
        contributes a <em>local Jacobian</em> — the derivative of
        the output of that operation with respect to its input,
        evaluated at the cached forward value. Second, the gradient
        flowing into an operation is multiplied by that local
        Jacobian as it flows out, and split between every input that
        operation had. That&apos;s it. That&apos;s backprop.
      </p>

      <Figure caption="Forward values (blue) flow left to right along each edge; gradients of L (purple) flow right to left along the same edge. Every gradient is the upstream gradient times the local derivative of the operation it crosses.">
        <BackpropToy />
      </Figure>

      <h2>Why it&apos;s called &apos;reverse-mode&apos;</h2>
      <p>
        We could have computed{" "}
        <M>{tex`\partial L / \partial a`}</M> by sweeping derivatives{" "}
        <em>forward</em> — pushing <M>{tex`\partial \cdot / \partial a`}</M>{" "}
        through each operation in order. That works for a single
        parameter, but it costs one full pass <em>per parameter</em>.
        For a model with <M>{tex`10^{11}`}</M> parameters, that&apos;s
        catastrophic.
      </p>
      <p>
        Sweeping in reverse — starting from the single output and
        pushing derivatives <em>back</em> through each operation —
        computes the gradient with respect to <em>every</em> parameter
        in a single pass. The total cost is{" "}
        <M>{tex`O(\text{forward cost})`}</M>, not{" "}
        <M>{tex`O(\text{params} \times \text{forward cost})`}</M>. This
        is the asymmetry between &ldquo;many inputs, one output&rdquo;
        (where reverse-mode wins) and &ldquo;one input, many outputs&rdquo;
        (where forward-mode wins). Loss functions are in the first
        camp, by definition.
      </p>

      <h2>Scaling up</h2>
      <p>
        A real network is the same graph, larger and with vector edges.
        Every operation in the forward pass has a corresponding
        backward op — implemented and tested once, then reused
        forever. The local Jacobian for a linear layer{" "}
        <M>{tex`y = W x + b`}</M> is just <M>W</M>; for an
        elementwise nonlinearity, a diagonal matrix; for softmax with
        cross-entropy, the famously clean{" "}
        <M>{tex`p - \mathbf{1}_{\text{target}}`}</M>. PyTorch,
        TensorFlow, JAX — all of modern autograd is a clean
        implementation of the algorithm you just walked through.
      </p>

      <Callout variant="intuition">
        Forward pass: compute every value in the graph and cache it.
        Backward pass: start from the output, multiply by local
        derivatives as you walk backward, sum gradients where edges
        merge. Every parameter&apos;s gradient drops out of the same
        sweep. That&apos;s the algorithm. Everything else is
        bookkeeping and parallelism.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Mech interp interacts with backprop in three places:
        </p>
        <ul>
          <li>
            <strong>Saliency maps and integrated gradients</strong>{" "}
            require <M>{tex`\partial \text{output} / \partial \text{input}`}</M> — one full
            backward pass per query.
          </li>
          <li>
            <strong>Attribution patching</strong>, which is the fast
            approximate version of activation patching, is{" "}
            <em>literally backprop</em> applied to an intermediate
            activation. It computes the first-order effect of every
            internal value on a chosen loss.
          </li>
          <li>
            <strong>Gradient routing / TransformerLens hooks</strong>{" "}
            insert custom backward functions at chosen layers, so you
            can study where in the graph a particular gradient comes
            from.
          </li>
        </ul>
        <p>
          In all three cases, you&apos;re using the same algorithm
          that trained the model, with a different question in mind.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            In the widget, you nudge <M>x</M> upward by{" "}
            <M>{tex`\delta`}</M>. To first order, how does <M>L</M>{" "}
            change?
          </>
        }
        choices={[
          {
            id: "a",
            label: "By δ.",
            explain:
              "That ignores the chain of derivatives — the answer scales by ∂L/∂x, which is generally not 1.",
          },
          {
            id: "b",
            label: "By (∂L/∂x) · δ.",
            correct: true,
            explain:
              "By definition of the partial derivative. The widget computes ∂L/∂x = (∂L/∂y) · a for you.",
          },
          {
            id: "c",
            label: "By (∂L/∂a) · δ.",
            explain:
              "That's the linear effect of nudging the parameter a, not the input x.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              A <strong>residual stream</strong> of depth <M>L</M> is
              the iteration
            </p>
            <Block>{tex`\mathbf{h}_{l+1} = \mathbf{h}_{l} + f_{l}(\mathbf{h}_{l}), \qquad l = 0, 1, \ldots, L - 1,`}</Block>
            <p>
              where each <M>{tex`f_{l} : \mathbb{R}^{d} \to \mathbb{R}^{d}`}</M>{" "}
              has Jacobian{" "}
              <M>{tex`J_{l} = \partial f_{l}(\mathbf{h}_{l})/\partial \mathbf{h}_{l}`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Show that{" "}
              <M>{tex`\partial \mathbf{h}_{L}/\partial \mathbf{h}_{0}`}</M>{" "}
              is the right-to-left product
            </p>
            <Block>{tex`\frac{\partial \mathbf{h}_{L}}{\partial \mathbf{h}_{0}} = \prod_{l = L - 1}^{0} \bigl(I + J_{l}\bigr).`}</Block>
            <p>
              <strong>(b)</strong> Compare to a plain (non-residual) net{" "}
              <M>{tex`\mathbf{h}_{l+1} = f_{l}(\mathbf{h}_{l})`}</M>,
              whose corresponding product is{" "}
              <M>{tex`\prod J_{l}`}</M>. Suppose every{" "}
              <M>{tex`\|J_{l}\| \leq \rho`}</M>. Bound the gradient norm
              for both architectures, and explain why training stays
              healthy in the residual case even when{" "}
              <M>{tex`\rho \ll 1`}</M>.
            </p>
            <p>
              <strong>(c)</strong> Mech-interp-flavoured corollary:
              expand the product in (a) and identify the term that, in
              the small-<M>J</M> limit, recovers the &ldquo;direct
              path&rdquo;{" "}
              <M>{tex`\mathbf{h}_{L} \approx \mathbf{h}_{0}`}</M>. What
              do the higher-order terms correspond to in transformer
              language?
            </p>
          </>
        }
        hint={
          <>
            For (a), apply the chain rule one layer at a time:{" "}
            <M>{tex`\partial \mathbf{h}_{l+1}/\partial \mathbf{h}_{l} = I + J_{l}`}</M>.
            For (b), the bound is{" "}
            <M>{tex`\|\prod J_l\| \leq \rho^{L}`}</M> versus{" "}
            <M>{tex`\|\prod (I + J_{l})\| \leq (1 + \rho)^{L}`}</M> —
            but you should think about <em>lower</em> bounds too. For
            (c), expand the product into{" "}
            <M>{tex`I + \sum J_l + \sum_{l > l'} J_{l} J_{l'} + \ldots`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`\mathbf{h}_{l+1} = \mathbf{h}_{l} + f_{l}(\mathbf{h}_{l})`}</M>{" "}
              gives{" "}
              <M>{tex`\partial \mathbf{h}_{l+1}/\partial \mathbf{h}_{l} = I + J_{l}`}</M>.
              By the matrix chain rule,
            </p>
            <Block>{tex`\frac{\partial \mathbf{h}_{L}}{\partial \mathbf{h}_{0}} = \frac{\partial \mathbf{h}_{L}}{\partial \mathbf{h}_{L-1}} \cdots \frac{\partial \mathbf{h}_{1}}{\partial \mathbf{h}_{0}} = (I + J_{L-1}) \cdots (I + J_{0}).`}</Block>
            <p>
              <strong>(b)</strong> For a plain net,{" "}
              <M>{tex`\|\partial \mathbf{h}_{L}/\partial \mathbf{h}_{0}\| \leq \rho^{L}`}</M>.
              If <M>{tex`\rho < 1`}</M>, this collapses geometrically as{" "}
              <M>L</M> grows — the vanishing gradient. For the residual
              net,
            </p>
            <Block>{tex`\bigl\|\textstyle\prod (I + J_{l})\bigr\| \leq (1 + \rho)^{L},`}</Block>
            <p>
              but more importantly the product contains an explicit{" "}
              <M>I</M> from each factor, so a simple lower bound (when
              the <M>{tex`J_{l}`}</M> aren&apos;t adversarially aligned)
              is something like{" "}
              <M>{tex`(1 - \rho)^{L}`}</M>. The point is that the
              gradient cannot collapse to <em>zero</em> just because
              activations are small: the identity skip guarantees a
              gradient floor of order 1. This is exactly why ResNets
              and transformers can be trained at depth 100+, while
              vanilla MLPs of that depth cannot.
            </p>
            <p>
              <strong>(c)</strong> Expand:
            </p>
            <Block>{tex`\prod_{l=0}^{L-1}(I + J_{l}) = I + \sum_{l} J_{l} + \sum_{l > l'} J_{l} J_{l'} + \cdots + J_{L-1} J_{L-2} \cdots J_{0}.`}</Block>
            <p>
              The leading <M>I</M> is the &ldquo;direct path&rdquo; — a
              copy of <M>{tex`\mathbf{h}_{0}`}</M> that survives all
              layers untouched. The single-<M>J</M> sum is the set of{" "}
              <em>length-1 paths</em>: the contribution where exactly
              one layer fires non-trivially. Higher-order terms are{" "}
              <em>compositions</em> of layers — the deeper circuits.
            </p>
            <p>
              This is the algebraic backbone of Elhage et al.&apos;s
              &ldquo;mathematical framework for transformer circuits&rdquo;:
              the residual stream is read by every layer, and gradients
              flow back through every <em>subset</em> of layers. The
              first-order terms are linear circuits; the second-order
              ones are layer-pair circuits like induction heads. The
              Jacobian product is what makes this decomposition exact.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
