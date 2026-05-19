import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SoftmaxExplorer } from "@/components/viz/SoftmaxExplorer";

export const metadata = {
  title: "From scores to probabilities: softmax",
};

export default function SoftmaxPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="softmax"
      eyebrow="Chapter 06"
      title="From scores to probabilities: softmax"
      lede="A neural network spits out a vector of real numbers. A distribution is a vector of probabilities. The function that maps one to the other is softmax, and it has a few quirks worth knowing."
    >
      <h2>The definition</h2>
      <p>
        Given a vector of real-valued scores{" "}
        <M>{tex`\mathbf{z} = (z_1, \ldots, z_K)`}</M> — usually called{" "}
        <strong>logits</strong> — softmax produces a probability
        distribution:
      </p>
      <Block>{tex`\mathrm{softmax}(\mathbf{z})_i = \frac{\exp(z_i)}{\sum_{j=1}^{K} \exp(z_j)}.`}</Block>
      <p>
        The exponentials make every entry positive; the sum in the
        denominator normalizes the result. The output is non-negative
        and sums to 1 — a real distribution.
      </p>

      <h2>Two structural properties</h2>
      <ul>
        <li>
          <strong>Shift-invariance.</strong> Adding a constant to every
          logit doesn&apos;t change the output:{" "}
          <M>{tex`\mathrm{softmax}(\mathbf{z}) = \mathrm{softmax}(\mathbf{z} + c\mathbf{1})`}</M>.
          That&apos;s why &ldquo;raw logits&rdquo; in interpretability
          work are usually re-centred — only differences matter.
        </li>
        <li>
          <strong>Order-preserving.</strong> The argmax of softmax is
          just the argmax of the logits. Whichever token has the
          highest score has the highest probability; everything below
          softmax is a monotone reshuffling.
        </li>
      </ul>

      <h2>Temperature</h2>
      <p>
        A common variant divides logits by a positive constant{" "}
        <M>T</M>, the <strong>temperature</strong>:
      </p>
      <Block>{tex`\mathrm{softmax}_T(\mathbf{z})_i = \frac{\exp(z_i / T)}{\sum_{j} \exp(z_j / T)}.`}</Block>
      <p>
        Two limits make this concrete:
      </p>
      <ul>
        <li>
          As <M>{tex`T \to 0^+`}</M>, softmax collapses onto the argmax —
          one bar becomes essentially 100%.
        </li>
        <li>
          As <M>{tex`T \to \infty`}</M>, softmax flattens to the uniform
          distribution — every bar is <M>1/K</M>.
        </li>
      </ul>
      <p>
        Drag the logits and sweep <M>T</M> below to feel both limits.
      </p>

      <Figure caption="Top: a vector of logits (drag the bar tops). Bottom: the resulting softmax distribution. The temperature slider on the right controls how peaky the output is.">
        <SoftmaxExplorer />
      </Figure>

      <h2>Why exponentials?</h2>
      <p>
        Softmax is not the only function that turns reals into a
        distribution — but it&apos;s the unique one with three desirable
        properties: it&apos;s a smooth approximation of argmax, its
        log-probability is{" "}
        <M>{tex`\log p_i = z_i - \log \sum_j e^{z_j}`}</M> (a clean
        log-sum-exp form), and its gradient is{" "}
        <M>{tex`p - \mathbf{1}_{\text{target}}`}</M> for cross-entropy
        loss. The next two chapters are about that loss.
      </p>

      <Callout variant="pitfall">
        <p>
          <strong>Numerical safety.</strong> Computing softmax naively
          will overflow if any logit is large. Every real implementation
          subtracts the maximum logit first:
        </p>
        <Block>{tex`\mathrm{softmax}(\mathbf{z})_i = \frac{\exp(z_i - \max_j z_j)}{\sum_k \exp(z_k - \max_j z_j)}.`}</Block>
        <p>
          The output is identical by shift-invariance, but no exponent
          is ever positive. (The widget above does this internally.)
        </p>
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The final layer of a transformer applies the unembedding{" "}
          <M>{tex`\mathbf{z} = W_U \mathbf{x}`}</M>, then softmax. The
          interesting analyses live one step earlier in <M>{tex`\mathbf{z}`}</M>:
        </p>
        <ul>
          <li>
            <strong>Logit lens.</strong> Apply <M>{tex`W_U`}</M> at
            intermediate layers and look at which tokens are climbing.
          </li>
          <li>
            <strong>Logit difference.</strong> Compare{" "}
            <M>{tex`z_{\text{correct}} - z_{\text{wrong}}`}</M> across
            interventions. Shift-invariance means absolute logit values
            are meaningless — only differences matter.
          </li>
          <li>
            <strong>Temperature scaling.</strong> Calibration work
            re-fits <M>T</M> at the output so the model&apos;s confidence
            matches its accuracy.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            You add 100 to every logit and recompute softmax. What
            happens to the output distribution?
          </>
        }
        choices={[
          {
            id: "a",
            label: "It becomes more peaked.",
            explain:
              "Adding a constant to all logits is shift-invariant — softmax doesn't move.",
          },
          {
            id: "b",
            label: "It flattens toward uniform.",
            explain:
              "Flattening happens when you divide logits by a large T, not when you add a constant.",
          },
          {
            id: "c",
            label: "Nothing changes.",
            correct: true,
            explain:
              "softmax(z + c·1) = softmax(z). Only logit differences matter.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Let{" "}
              <M>{tex`\mathbf{p} = \mathrm{softmax}(\mathbf{z})`}</M>{" "}
              with{" "}
              <M>{tex`\mathbf{z} \in \mathbb{R}^{K}`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Compute the Jacobian{" "}
              <M>{tex`\partial p_{i}/\partial z_{j}`}</M> and show it
              equals
              <Block>{tex`\frac{\partial p_{i}}{\partial z_{j}} = p_{i}(\delta_{ij} - p_{j}),`}</Block>
              where{" "}
              <M>{tex`\delta_{ij}`}</M> is the Kronecker delta. Hence
              the Jacobian as a matrix is{" "}
              <M>{tex`J = \mathrm{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^{\top}`}</M>{" "}
              — a rank-deficient (singular) matrix. Identify its
              null direction; relate it to softmax&apos;s
              shift-invariance.
            </p>
            <p>
              <strong>(b)</strong> Cross-entropy loss with a one-hot
              target{" "}
              <M>{tex`y \in \{1, \ldots, K\}`}</M> is{" "}
              <M>{tex`L = -\log p_{y}`}</M>. Show that
              <Block>{tex`\frac{\partial L}{\partial z_{j}} = p_{j} - \delta_{jy} = (\mathbf{p} - \mathbf{e}_{y})_{j},`}</Block>
              the famous &ldquo;model probability minus one-hot
              target&rdquo; gradient. Notice the Jacobian computed in
              (a) collapsed into something elementary; explain why
              this <em>specific</em> combination of softmax + cross-entropy
              has a much cleaner gradient than either piece would
              alone.
            </p>
            <p>
              <strong>(c) The temperature has a hidden cost.</strong>{" "}
              Sometimes one trains with logits divided by a fixed{" "}
              <M>{tex`T > 0`}</M>:{" "}
              <M>{tex`\mathbf{p}^{(T)} = \mathrm{softmax}(\mathbf{z}/T)`}</M>.
              Recompute the cross-entropy gradient with respect to{" "}
              <M>{tex`\mathbf{z}`}</M> in this case. What does the
              <M>{tex`1/T`}</M> factor mean for training dynamics, and
              why is using temperature scaling at <em>training time</em>{" "}
              equivalent to rescaling the learning rate by{" "}
              <M>{tex`1/T`}</M>?
            </p>
          </>
        }
        hint={
          <>
            For (a): write{" "}
            <M>{tex`p_{i} = e^{z_{i}}/Z`}</M> with{" "}
            <M>{tex`Z = \sum_{k} e^{z_{k}}`}</M>. Differentiate with
            quotient rule and recognize{" "}
            <M>{tex`\partial Z/\partial z_{j} = e^{z_{j}}`}</M>. For
            (b): apply the chain rule via the Jacobian of (a) and
            simplify; almost everything cancels. For (c): the chain
            rule introduces an extra <M>{tex`1/T`}</M> factor.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`p_{i} = e^{z_{i}}/Z`}</M> with{" "}
              <M>{tex`Z = \sum_{k} e^{z_{k}}`}</M>.
              <Block>{tex`\frac{\partial p_{i}}{\partial z_{j}} = \frac{\delta_{ij} e^{z_{i}} Z - e^{z_{i}} e^{z_{j}}}{Z^{2}} = \delta_{ij} p_{i} - p_{i} p_{j} = p_{i}(\delta_{ij} - p_{j}).`}</Block>
              The matrix form{" "}
              <M>{tex`J = \mathrm{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^{\top}`}</M>{" "}
              has{" "}
              <M>{tex`J \mathbf{1} = \mathbf{p} - \mathbf{p}(\mathbf{p}^{\top}\mathbf{1}) = \mathbf{p} - \mathbf{p} = \mathbf{0}`}</M>.
              So{" "}
              <M>{tex`\mathbf{1}`}</M> is in the null space; this is
              the infinitesimal version of shift-invariance. Adding
              the same constant to every logit moves you along the
              null direction and changes nothing.
            </p>
            <p>
              <strong>(b)</strong>{" "}
              <M>{tex`L = -\log p_{y} = -z_{y} + \log Z`}</M>. Direct:{" "}
              <M>{tex`\partial L/\partial z_{j} = -\delta_{jy} + (1/Z) e^{z_{j}} = p_{j} - \delta_{jy}`}</M>.
              In vector form,{" "}
              <M>{tex`\nabla_{\mathbf{z}} L = \mathbf{p} - \mathbf{e}_{y}`}</M>.
              The Jacobian formula from (a) plus chain rule gives{" "}
              <M>{tex`\nabla_{\mathbf{z}} L = J^{\top} (-\mathbf{e}_{y}/p_{y})`}</M>;
              expanding,{" "}
              <M>{tex`(J^{\top} \mathbf{v})_{j} = p_{j} v_{j} - p_{j} \mathbf{p}^{\top} \mathbf{v}`}</M>{" "}
              with{" "}
              <M>{tex`\mathbf{v} = -\mathbf{e}_{y}/p_{y}`}</M> gives{" "}
              <M>{tex`p_{j}(-\delta_{jy}/p_{y}) - p_{j}(-1) = -\delta_{jy} + p_{j}`}</M>,
              same answer.
            </p>
            <p>
              The cancellation is structural: cross-entropy is the
              negative log of the softmax output, and{" "}
              <M>{tex`\log \mathrm{softmax}(\mathbf{z}) = \mathbf{z} - \log Z`}</M>{" "}
              is &ldquo;almost linear&rdquo; in{" "}
              <M>{tex`\mathbf{z}`}</M> — only the log-sum-exp piece
              produces a softmax in the gradient, and the one-hot
              target picks out a single coordinate of the linear
              part. This is why every framework implements
              &ldquo;cross-entropy with logits&rdquo; as a single
              numerically-stable op and not as the literal
              composition of softmax and log.
            </p>
            <p>
              <strong>(c)</strong> Replace{" "}
              <M>{tex`\mathbf{z}`}</M> with{" "}
              <M>{tex`\mathbf{z}/T`}</M>; chain rule introduces a{" "}
              <M>{tex`1/T`}</M> factor:
              <Block>{tex`\frac{\partial L^{(T)}}{\partial \mathbf{z}} = \frac{1}{T}\bigl(\mathbf{p}^{(T)} - \mathbf{e}_{y}\bigr).`}</Block>
              For training: a gradient step{" "}
              <M>{tex`\mathbf{z} \leftarrow \mathbf{z} - \eta\, \nabla_{\mathbf{z}} L^{(T)}`}</M>{" "}
              is the same as a step at temperature 1 with learning
              rate <M>{tex`\eta/T`}</M> — except that the
              probabilities{" "}
              <M>{tex`\mathbf{p}^{(T)}`}</M> are the temperature-T
              softmax of{" "}
              <M>{tex`\mathbf{z}`}</M>, not the temperature-1
              softmax. Two practical consequences. (1) Training
              losses reported at different <M>T</M> are not directly
              comparable; the gradient magnitude is{" "}
              <M>{tex`O(1/T)`}</M>. (2) Distillation losses (Hinton)
              that use a high <M>T</M> on the teacher must
              compensate by multiplying by{" "}
              <M>{tex`T^{2}`}</M> to keep the gradient scale matched
              to the standard cross-entropy term.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
