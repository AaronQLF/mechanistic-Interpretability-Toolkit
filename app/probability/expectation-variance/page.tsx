import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { ExpectationSimulator } from "@/components/viz/ExpectationSimulator";

export const metadata = {
  title: "Expectation, variance & the law of large numbers",
};

export default function ExpectationVariancePage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="expectation-variance"
      eyebrow="Chapter 05"
      title="Expectation, variance & the law of large numbers"
      lede="A distribution is too much information to keep in your head. The two summary numbers people actually quote are the mean — what to expect — and the variance — how wrong that expectation usually is."
    >
      <h2>Expectation</h2>
      <p>
        The <strong>expectation</strong> of a discrete random variable
        is the probability-weighted average of its values:
      </p>
      <Block>{tex`\mathbb{E}[X] = \sum_{x} x\, p(x).`}</Block>
      <p>
        It&apos;s linear: <M>{tex`\mathbb{E}[aX + bY] = a\,\mathbb{E}[X] + b\,\mathbb{E}[Y]`}</M>,
        which is unreasonably useful given how easy it is to prove. Note
        that <M>{tex`\mathbb{E}[X]`}</M> need not be a possible value of{" "}
        <M>X</M> — a fair die has mean 3.5, which is not a face.
      </p>

      <h2>Variance and standard deviation</h2>
      <p>
        The <strong>variance</strong> is how far <M>X</M> tends to land
        from its mean, on average, squared:
      </p>
      <Block>{tex`\operatorname{Var}[X] = \mathbb{E}\bigl[(X - \mathbb{E}[X])^2\bigr] = \mathbb{E}[X^2] - \mathbb{E}[X]^2.`}</Block>
      <p>
        Its square root is the <strong>standard deviation</strong>{" "}
        <M>{tex`\sigma[X]`}</M>. Variance is in units-squared; standard
        deviation is in the same units as <M>X</M>. When someone says
        &ldquo;the loss is 2.4 ± 0.1,&rdquo; that 0.1 is usually a
        standard deviation.
      </p>

      <h2>The law of large numbers</h2>
      <p>
        Sample <M>X</M> many times independently and take the running
        average. As <M>n</M> grows, that average homes in on{" "}
        <M>{tex`\mathbb{E}[X]`}</M>:
      </p>
      <Block>{tex`\bar{X}_n = \frac{1}{n}\sum_{i=1}^{n} X_i \;\xrightarrow{n \to \infty}\; \mathbb{E}[X].`}</Block>
      <p>
        Press <em>Sample</em> below to watch it happen. The shaded band
        around the dashed target line is a{" "}
        <M>{tex`\pm 1.96\sigma/\sqrt{n}`}</M> confidence band — the
        sample mean shrinks into it like a funnel as <M>n</M> grows.
        That <M>{tex`1/\sqrt{n}`}</M> rate is the entire reason ML
        benchmarks need lots of samples.
      </p>

      <Figure caption="Top: a distribution over six values, with its expectation and variance. Bottom: a running sample mean over time, with the ±1.96σ/√n confidence band closing in on E[X].">
        <ExpectationSimulator />
      </Figure>

      <Callout variant="intuition">
        Expectation is the bet you should make about <M>X</M>. Variance
        is how often you&apos;ll regret it. The law of large numbers is
        the promise that, if you make the bet enough times, your
        per-bet luck washes out.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Every aggregate metric in interpretability work is an
          expectation: the loss on a benchmark, the average effect of an
          ablation, the mean activation in a residual stream channel.
          Reporting it with no notion of its variance (or a confidence
          interval, ultimately a statement about the <M>{tex`1/\sqrt{n}`}</M>{" "}
          rate above) is a familiar way for papers to mislead.
        </p>
        <p>
          The <em>per-token loss</em> a language model reports is{" "}
          <M>{tex`\mathbb{E}_{x \sim \text{data}}[-\log p_\theta(x)]`}</M> —
          an expectation, estimated by averaging samples.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            For a fair six-sided die, what is <M>{tex`\mathbb{E}[X]`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "3",
            explain:
              "Close, but the values 1 through 6 average to 3.5 — and the die is fair, so each contributes equally.",
          },
          {
            id: "b",
            label: "3.5",
            correct: true,
            explain:
              "(1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3.5. Expectations need not be achievable values.",
          },
          {
            id: "c",
            label: "1/6",
            explain:
              "That's the probability of any single face, not the mean of the outcomes.",
          },
        ]}
      />
    </ChapterShell>
  );
}
