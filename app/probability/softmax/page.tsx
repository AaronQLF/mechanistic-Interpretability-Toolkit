import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
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
    </ChapterShell>
  );
}
