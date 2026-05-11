import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { DistributionEditor } from "@/components/viz/DistributionEditor";

export const metadata = {
  title: "Random variables & distributions",
};

export default function DistributionsPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="distributions"
      eyebrow="Chapter 02"
      title="Random variables & distributions"
      lede="A random variable is a number that hasn't been pinned down yet. Its distribution is the catalogue of which numbers are how likely. In code, that catalogue is just a list."
    >
      <h2>From outcomes to numbers</h2>
      <p>
        Sample spaces are great for definitions and bad for arithmetic. A{" "}
        <strong>random variable</strong> <M>X</M> turns each outcome
        into a number, so we can do math on the result:
      </p>
      <Block>{tex`X : \Omega \to \mathbb{R}.`}</Block>
      <p>
        Roll two dice; let <M>X</M> be their sum. The function <M>X</M>{" "}
        sends <M>{tex`(3,4) \mapsto 7`}</M>, <M>{tex`(6,6) \mapsto 12`}</M>,
        and so on. Once you have a random variable, you almost stop
        caring about <M>{tex`\Omega`}</M> and start caring about its
        values.
      </p>

      <h2>The distribution</h2>
      <p>
        The <strong>distribution</strong> of a discrete random variable
        is a list of values together with the probability of each:
      </p>
      <Block>{tex`p(x) = P(X = x), \qquad \sum_{x} p(x) = 1.`}</Block>
      <p>
        That second condition is just &ldquo;total mass equals one&rdquo;
        from last chapter. The function <M>{tex`p`}</M> is called the{" "}
        <strong>probability mass function</strong> (PMF). Drag the bars
        below — you&apos;ll see the heights renormalize so the total
        always comes back to 100%.
      </p>

      <Figure caption="A categorical distribution over six values. Drag any bar's top edge to reshape; the rest re-normalize so total mass stays at 1.">
        <DistributionEditor />
      </Figure>

      <h2>Some distributions you&apos;ll meet again</h2>
      <ul>
        <li>
          <strong>Bernoulli(<M>{tex`\rho`}</M>).</strong> A single yes/no.{" "}
          <M>{tex`P(X = 1) = \rho`}</M>, <M>{tex`P(X = 0) = 1 - \rho`}</M>.
        </li>
        <li>
          <strong>Categorical / multinoulli.</strong> Like the bars above
          — one of <M>K</M> classes, with a probability for each.
          A transformer&apos;s next-token output is a categorical
          distribution over its vocabulary.
        </li>
        <li>
          <strong>Uniform on <M>{tex`\{1, \ldots, n\}`}</M>.</strong>{" "}
          Every value equally likely. Maximally non-committal.
        </li>
      </ul>

      <p>
        Continuous random variables exist too — densities instead of
        masses, integrals instead of sums — but every chapter from here
        on works in the discrete case. The intuition transfers, and the
        models we actually want to read are discrete at the output.
      </p>

      <Callout variant="intuition">
        Think of a distribution as a bar chart that sums to 1. Tall bars
        are likely, short bars are not, the bars never go negative,
        and the total never exceeds the page. That cartoon is enough to
        survive nine-tenths of mech-interp writing.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          After the unembedding, a transformer outputs a vector of{" "}
          <M>{tex`|V|`}</M> logits. Softmax turns those into a
          categorical distribution over tokens — exactly the shape of
          the bars above, just with 50,000 entries instead of six. We
          will spend the rest of this module learning to read that
          distribution.
        </p>
      </Callout>

      <Quiz
        question="Which of these is not a valid probability mass function on three outcomes?"
        choices={[
          {
            id: "a",
            label: "(0.2, 0.5, 0.3)",
            explain:
              "All non-negative and they sum to 1 — perfectly valid.",
          },
          {
            id: "b",
            label: "(0.4, 0.4, 0.4)",
            correct: true,
            explain:
              "Sums to 1.2. A PMF must have total mass exactly 1.",
          },
          {
            id: "c",
            label: "(0, 0, 1)",
            explain:
              "A degenerate but legal distribution: outcome 3 happens with probability 1.",
          },
        ]}
      />
    </ChapterShell>
  );
}
