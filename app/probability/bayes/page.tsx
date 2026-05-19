import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { BayesUpdater } from "@/components/viz/BayesUpdater";

export const metadata = {
  title: "Bayes' rule",
};

export default function BayesPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="bayes"
      eyebrow="Chapter 04"
      title="Bayes' rule"
      lede="If you already knew the chain rule, you already (almost) knew Bayes' rule. It is the same identity, rearranged into the most useful shape in all of applied probability: how to flip a conditional."
    >
      <h2>The derivation, in one line</h2>
      <p>
        Last chapter we had two ways to write a joint:
      </p>
      <Block>{tex`p(h, x) = p(x \mid h)\, p(h) = p(h \mid x)\, p(x).`}</Block>
      <p>
        Solve for <M>{tex`p(h \mid x)`}</M>:
      </p>
      <Block>{tex`p(h \mid x) = \frac{p(x \mid h)\, p(h)}{p(x)}.`}</Block>
      <p>
        That&apos;s <strong>Bayes&apos; rule</strong>. The names of the
        pieces are the entire reason it&apos;s famous:
      </p>
      <ul>
        <li>
          <strong>Prior</strong> <M>{tex`p(h)`}</M>: how much you
          believed the hypothesis <em>before</em> seeing the evidence.
        </li>
        <li>
          <strong>Likelihood</strong> <M>{tex`p(x \mid h)`}</M>: how
          well the hypothesis explains the data.
        </li>
        <li>
          <strong>Posterior</strong> <M>{tex`p(h \mid x)`}</M>: how
          much you believe the hypothesis <em>after</em> seeing the
          data.
        </li>
        <li>
          <strong>Evidence</strong> <M>{tex`p(x)`}</M>: the total
          probability of the data — just the normalizing constant that
          makes the posterior a real distribution.
        </li>
      </ul>

      <h2>Posterior ∝ prior × likelihood</h2>
      <p>
        In practice you rarely compute <M>{tex`p(x)`}</M> directly; you
        compute the numerator for every hypothesis and renormalize:
      </p>
      <Block>{tex`p(h \mid x) \propto p(x \mid h)\, p(h),\qquad p(x) = \sum_{h} p(x \mid h)\, p(h).`}</Block>
      <p>
        That is the whole pattern. Multiply the bars in the prior by the
        matching bars in the likelihood, then renormalize.
      </p>

      <h2>The classic example: a rare-disease test</h2>
      <p>
        Suppose 1% of people have a disease, and a test is 99%
        sensitive and 95% specific. Someone tests positive. What&apos;s
        the probability they actually have it?
      </p>
      <p>
        Many people guess &ldquo;about 99%.&rdquo; The right answer is
        about 17%. Move the sliders and feel why — when the prior is
        tiny, the false-positive contribution from the huge healthy
        population swamps the true-positive contribution from the tiny
        sick one.
      </p>

      <Figure caption="Top: the prior P(H). Middle: the likelihood of the observation under each hypothesis (these do not sum to 1; they're column slices). Bottom: the posterior — prior × likelihood, renormalized.">
        <BayesUpdater />
      </Figure>

      <Callout variant="intuition">
        The posterior is the prior &ldquo;reweighted by how well each
        hypothesis predicts the data.&rdquo; If two hypotheses predict
        the data equally well, they get the same multiplicative kick
        and the posterior just looks like the prior.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          When you do a causal intervention on a model — patch an
          activation, ablate a head, swap an attention pattern — you&apos;re
          asking a Bayesian question of the model:
        </p>
        <Block>{tex`p(\text{correct token} \mid \text{intervention}) \ \text{vs.}\ p(\text{correct token} \mid \text{baseline}).`}</Block>
        <p>
          The Bayesian framing also shows up in <em>activation patching</em>{" "}
          metrics like the &ldquo;logit difference&rdquo; or the
          &ldquo;noise-to-clean recovery ratio&rdquo; — they&apos;re
          all comparisons of posteriors over the vocabulary under
          different conditions.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            Disease prevalence is 1%. A test is 99% sensitive and 95%
            specific. You test positive. Roughly what is{" "}
            <M>{tex`P(\text{disease} \mid +)`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "≈ 99%",
            explain:
              "The test's sensitivity isn't the same as P(disease | +). With a low prior, the false-positive mass dominates.",
          },
          {
            id: "b",
            label: "≈ 17%",
            correct: true,
            explain:
              "(0.99 × 0.01) / (0.99 × 0.01 + 0.05 × 0.99) ≈ 0.167. The widget agrees.",
          },
          {
            id: "c",
            label: "≈ 1%",
            explain:
              "That's the prior — Bayes updates it upward when the evidence is informative.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a) Sequential Bayes.</strong> Suppose
              evidence comes in pieces{" "}
              <M>{tex`x_{1}, x_{2}, \ldots, x_{n}`}</M> that are{" "}
              <em>conditionally independent given the
              hypothesis</em>{" "}
              <M>H</M>:{" "}
              <M>{tex`p(x_{1}, \ldots, x_{n} \mid H) = \prod_{i} p(x_{i} \mid H)`}</M>.
              Show that updating one piece at a time and updating
              all at once yield the same posterior:
              <Block>{tex`p(H \mid x_{1}, \ldots, x_{n}) \propto p(H) \prod_{i=1}^{n} p(x_{i} \mid H).`}</Block>
              Derive an equivalent form using <em>log-odds</em>{" "}
              <M>{tex`\ell(H) = \log\frac{p(H)}{1-p(H)}`}</M> for a
              binary hypothesis: each piece of evidence{" "}
              <em>adds</em> a term to the log-odds. (This is the
              elementary Bayesian argument behind logistic
              regression.)
            </p>
            <p>
              <strong>(b) Two tests.</strong> A disease has prior
              prevalence{" "}
              <M>{tex`\pi = 0.01`}</M>. Test A has sensitivity{" "}
              <M>{tex`\alpha = 0.99`}</M> and specificity{" "}
              <M>{tex`\beta = 0.95`}</M>. Test B (different
              technology, conditionally independent given true
              status) has the same sensitivity and specificity. A
              patient tests positive on both. What is the posterior
              probability of disease? Compare to the single-test
              posterior of <M>{tex`\approx 0.17`}</M>; explain why
              the second positive moves you so much further.
            </p>
            <p>
              <strong>(c) Activation patching as Bayes.</strong>{" "}
              Frame an activation-patching experiment in Bayesian
              language. Let <M>H</M> be the hypothesis &ldquo;head{" "}
              <M>h</M> at layer <M>{tex`\ell`}</M> is causally
              responsible for the model&apos;s correct answer on
              prompt <M>P</M>.&rdquo; Let <M>x</M> be the
              experimental observation that the logit difference
              drops by amount <M>{tex`\Delta`}</M> when you ablate
              that head. Write a likelihood ratio{" "}
              <M>{tex`p(x \mid H)/p(x \mid \neg H)`}</M> in qualitative
              form, and explain what would constitute a strong vs.&nbsp;weak
              piece of evidence for <M>H</M>. Where in this picture
              does the multiple-comparisons / publication-bias
              problem live?
            </p>
          </>
        }
        hint={
          <>
            For (a): apply Bayes&apos; rule once to the joint
            evidence, then once per piece, and compare. For
            log-odds: take logs and use{" "}
            <M>{tex`p(x|H)/p(x|\neg H)`}</M> as the per-evidence
            additive term. For (b): apply two independent likelihood
            ratios to the prior odds.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> By Bayes,{" "}
              <M>{tex`p(H \mid \mathbf{x}) \propto p(\mathbf{x} \mid H) p(H)`}</M>.
              Conditional independence factors{" "}
              <M>{tex`p(\mathbf{x} \mid H)`}</M> as{" "}
              <M>{tex`\prod_{i} p(x_{i} \mid H)`}</M>, giving the
              stated form. Update one piece at a time: starting from{" "}
              <M>{tex`p(H)`}</M>, the first piece gives{" "}
              <M>{tex`p(H \mid x_{1}) \propto p(x_{1} \mid H) p(H)`}</M>,
              the second gives{" "}
              <M>{tex`p(H \mid x_{1}, x_{2}) \propto p(x_{2} \mid H, x_{1}) p(H \mid x_{1}) = p(x_{2} \mid H) p(x_{1} \mid H) p(H)`}</M>{" "}
              (using conditional independence{" "}
              <M>{tex`p(x_{2} \mid H, x_{1}) = p(x_{2} \mid H)`}</M>),
              and so on. Same answer.
            </p>
            <p>
              For binary <M>H</M>: divide by{" "}
              <M>{tex`p(\neg H \mid \mathbf{x})`}</M>:
              <Block>{tex`\frac{p(H \mid \mathbf{x})}{p(\neg H \mid \mathbf{x})} = \frac{p(H)}{p(\neg H)} \cdot \prod_{i} \frac{p(x_{i} \mid H)}{p(x_{i} \mid \neg H)}.`}</Block>
              Take logs:
              <Block>{tex`\ell(H \mid \mathbf{x}) = \ell(H) + \sum_{i} \log \frac{p(x_{i} \mid H)}{p(x_{i} \mid \neg H)}.`}</Block>
              Each piece of evidence shifts the log-odds by an
              additive likelihood-ratio term. This is the bedrock of
              log-linear classifiers.
            </p>
            <p>
              <strong>(b)</strong> Each positive test contributes a
              likelihood ratio of{" "}
              <M>{tex`\alpha/(1-\beta) = 0.99/0.05 = 19.8`}</M>.
              Prior odds are{" "}
              <M>{tex`0.01/0.99 \approx 0.0101`}</M>. After two
              independent positive tests,
              <Block>{tex`\text{posterior odds} = 0.0101 \times 19.8^{2} \approx 3.96.`}</Block>
              Posterior probability:{" "}
              <M>{tex`3.96/(1+3.96) \approx 0.80`}</M>, much larger
              than the single-test 0.17. Two independent positives
              multiply likelihood ratios; the second positive
              effectively moves a posterior of 0.17 (odds 0.20) up
              by another factor of 19.8, yielding odds 3.96. The
              second positive is the same evidence quantitatively as
              the first but lands on a much larger prior, so it
              dominates.
            </p>
            <p>
              <strong>(c)</strong> Likelihood ratio:{" "}
              <M>{tex`p(\Delta \mid H)/p(\Delta \mid \neg H)`}</M>.
              Under <M>H</M> we expect a large{" "}
              <M>{tex`\Delta`}</M> (the head was crucial; ablation
              should hurt). Under <M>{tex`\neg H`}</M> we expect{" "}
              <M>{tex`\Delta \approx 0`}</M> (the head was
              irrelevant; ablation should do nothing). A strong
              piece of evidence is a{" "}
              <em>large</em>{" "}
              <M>{tex`\Delta`}</M> that has small probability under{" "}
              <M>{tex`\neg H`}</M>. A weak piece is{" "}
              <M>{tex`\Delta`}</M> in a range that is plausible
              under <em>both</em> hypotheses (e.g.&nbsp;noise-level
              variation across re-runs is comparable to{" "}
              <M>{tex`\Delta`}</M>).
            </p>
            <p>
              Multiple comparisons / publication bias: in a typical
              circuit-finding study the experimenter ablates many
              heads and reports the ones with large{" "}
              <M>{tex`\Delta`}</M>. The prior over &ldquo;this head
              specifically&rdquo; is uniform across the{" "}
              <M>{tex`L \times H`}</M> heads — which is the same as
              applying a Bonferroni correction to whatever{" "}
              <M>{tex`\Delta`}</M> threshold counts as &ldquo;large
              enough.&rdquo; Without the correction (or without
              honestly reporting how many heads were tried), an
              experimenter who tries 100 heads and reports the
              biggest <M>{tex`\Delta`}</M> is performing the
              statistical equivalent of running 100 hypothesis tests
              and only reporting the one that crossed the
              significance threshold by chance. The likelihood-ratio
              picture makes the failure mode precise: <em>conditioning
              on which head you decided to look at</em>, the
              null-hypothesis distribution of{" "}
              <M>{tex`\Delta`}</M> is the maximum over all heads, not
              the per-head distribution.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
