import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
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

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Prove the variance-of-a-sum
              identity. For random variables{" "}
              <M>{tex`X_{1}, \ldots, X_{n}`}</M> and constants{" "}
              <M>{tex`a_{1}, \ldots, a_{n}`}</M>, show
              <Block>{tex`\operatorname{Var}\!\left[\sum_{i=1}^{n} a_{i} X_{i}\right] = \sum_{i=1}^{n} a_{i}^{2}\, \operatorname{Var}[X_{i}] + 2 \sum_{i < j} a_{i} a_{j}\, \operatorname{Cov}(X_{i}, X_{j}),`}</Block>
              where{" "}
              <M>{tex`\operatorname{Cov}(X, Y) = \mathbb{E}[XY] - \mathbb{E}[X]\mathbb{E}[Y]`}</M>.
              When the <M>{tex`X_{i}`}</M> are uncorrelated this
              collapses to the &ldquo;sum the squared
              coefficients&rdquo; rule. For i.i.d.&nbsp;<M>{tex`X_{i}`}</M>{" "}
              with variance{" "}
              <M>{tex`\sigma^{2}`}</M>, deduce the standard error of
              the sample mean:
              <Block>{tex`\operatorname{Var}\!\left[\frac{1}{n}\sum_{i=1}^{n} X_{i}\right] = \frac{\sigma^{2}}{n}.`}</Block>
            </p>
            <p>
              <strong>(b)</strong> Show <strong>Chebyshev&apos;s
              inequality</strong>: for any{" "}
              <M>{tex`k > 0`}</M>,
              <Block>{tex`P\bigl(|X - \mathbb{E}[X]| \geq k\, \sigma[X]\bigr) \leq \frac{1}{k^{2}}.`}</Block>
              Combine with (a) to derive the{" "}
              <strong>weak law of large numbers</strong>: for
              i.i.d.&nbsp;<M>{tex`X_{i}`}</M> with finite variance,{" "}
              <M>{tex`\bar{X}_{n} \to \mathbb{E}[X]`}</M> in
              probability. State the rate.
            </p>
            <p>
              <strong>(c)</strong> A mech-interp metric is the{" "}
              &ldquo;average causal effect&rdquo; of an intervention,
              estimated as a sample mean over <M>n</M> prompts
              of{" "}
              <M>{tex`Y_{i} = (\text{logit diff with}) - (\text{logit diff without})`}</M>.
              You see <M>{tex`\hat{\mu} = 0.31`}</M> on{" "}
              <M>{tex`n = 50`}</M> prompts, with empirical sample
              standard deviation <M>{tex`\hat{\sigma} = 1.20`}</M>.
              Compute a <M>{tex`95\%`}</M> confidence interval for
              the true mean, using the asymptotic normality of the
              sample mean. Is &ldquo;the head matters on
              average&rdquo; well-supported by this evidence? How
              many prompts would you need to halve the width of the
              CI?
            </p>
          </>
        }
        hint={
          <>
            For (a): use{" "}
            <M>{tex`\operatorname{Var}[Y] = \mathbb{E}[Y^{2}] - \mathbb{E}[Y]^{2}`}</M>{" "}
            with{" "}
            <M>{tex`Y = \sum a_{i} X_{i}`}</M> and expand. For (b):
            apply Markov&apos;s inequality{" "}
            <M>{tex`P(Z \ge t) \le \mathbb{E}[Z]/t`}</M> to{" "}
            <M>{tex`Z = (X - \mathbb{E}[X])^{2}`}</M>. For (c): the
            CI half-width is{" "}
            <M>{tex`1.96\, \hat\sigma/\sqrt{n}`}</M>; halving it
            requires <M>4n</M> samples.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Let{" "}
              <M>{tex`Y = \sum_{i} a_{i} X_{i}`}</M>. Linearity gives{" "}
              <M>{tex`\mathbb{E}[Y] = \sum_{i} a_{i} \mathbb{E}[X_{i}]`}</M>.
              Then
              <Block>{tex`\operatorname{Var}[Y] = \mathbb{E}\!\left[\Bigl(\sum_{i} a_{i}(X_{i} - \mathbb{E}[X_{i}])\Bigr)^{2}\right] = \sum_{i, j} a_{i} a_{j}\, \mathbb{E}\bigl[(X_{i} - \mathbb{E}[X_{i}])(X_{j} - \mathbb{E}[X_{j}])\bigr],`}</Block>
              and the inner expectation is{" "}
              <M>{tex`\operatorname{Var}[X_{i}]`}</M> when{" "}
              <M>{tex`i = j`}</M>, otherwise{" "}
              <M>{tex`\operatorname{Cov}(X_{i}, X_{j})`}</M>.
              Splitting into diagonal and off-diagonal, and combining
              symmetric{" "}
              <M>{tex`(i, j)`}</M> and{" "}
              <M>{tex`(j, i)`}</M> terms, gives the formula. For
              i.i.d.&nbsp;<M>{tex`X_{i}`}</M> with variance{" "}
              <M>{tex`\sigma^{2}`}</M> and{" "}
              <M>{tex`a_{i} = 1/n`}</M>, the cross-terms vanish
              (independence) and{" "}
              <M>{tex`\operatorname{Var}[\bar X_{n}] = n \cdot (1/n)^{2} \sigma^{2} = \sigma^{2}/n`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Apply Markov to{" "}
              <M>{tex`Z = (X - \mathbb{E}[X])^{2} \ge 0`}</M> at
              threshold{" "}
              <M>{tex`t = k^{2} \sigma^{2}`}</M>:{" "}
              <M>{tex`P(Z \ge k^{2} \sigma^{2}) \le \mathbb{E}[Z]/(k^{2} \sigma^{2}) = 1/k^{2}`}</M>.
              Squaring inside the absolute value gives Chebyshev.
              Apply to{" "}
              <M>{tex`\bar X_{n}`}</M>:{" "}
              <M>{tex`P(|\bar X_{n} - \mu| \ge \varepsilon) \le \operatorname{Var}[\bar X_{n}]/\varepsilon^{2} = \sigma^{2}/(n \varepsilon^{2}) \to 0`}</M>{" "}
              as <M>{tex`n \to \infty`}</M>. The rate is{" "}
              <M>{tex`O(1/(n \varepsilon^{2}))`}</M> for the
              Chebyshev bound; with stronger assumptions
              (subexponential tails, etc.) the rate sharpens to{" "}
              <M>{tex`e^{-c n \varepsilon^{2}}`}</M> via Hoeffding /
              Chernoff.
            </p>
            <p>
              <strong>(c)</strong> Sample standard error{" "}
              <M>{tex`\hat\sigma/\sqrt{n} = 1.20/\sqrt{50} \approx 0.170`}</M>.
              The 95% CI is{" "}
              <M>{tex`0.31 \pm 1.96 \cdot 0.170 = 0.31 \pm 0.333`}</M>,
              i.e.&nbsp;<M>{tex`(-0.02, 0.64)`}</M>. The interval
              <em>contains zero</em>, so on this evidence we cannot
              reject the hypothesis &ldquo;the head&apos;s average
              effect is zero.&rdquo; The point estimate of 0.31
              looks suggestive but the noise is too large for the
              sample size.
            </p>
            <p>
              To halve the CI half-width from 0.333 to 0.166, we
              need to halve the standard error{" "}
              <M>{tex`\hat\sigma/\sqrt{n}`}</M> — i.e.&nbsp;quadruple{" "}
              <M>n</M> from 50 to 200, assuming{" "}
              <M>{tex`\hat\sigma`}</M> stays the same. This{" "}
              <M>{tex`1/\sqrt{n}`}</M> rate is the entire reason
              interpretability evals need either large prompt sets
              or per-prompt paired analyses. (Paired comparisons,
              when applicable, can dramatically shrink the relevant
              variance because the &ldquo;baseline noise per
              prompt&rdquo; cancels — a strong reason to compare{" "}
              <em>same prompt with vs.&nbsp;without ablation</em>{" "}
              rather than two independent prompt samples.)
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
