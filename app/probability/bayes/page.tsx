import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
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
    </ChapterShell>
  );
}
