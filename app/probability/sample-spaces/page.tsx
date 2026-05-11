import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SampleSpaceGrid } from "@/components/viz/SampleSpaceGrid";

export const metadata = {
  title: "Sample spaces & events",
};

export default function SampleSpacesPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="sample-spaces"
      eyebrow="Chapter 01"
      title="Sample spaces & events"
      lede="Before we can talk about probability, we have to be clear about what we're putting probabilities on. The setup is small but worth taking seriously — the rest of the module rides on it."
    >
      <h2>Three nouns: outcome, sample space, event</h2>
      <p>
        Pick something random — a coin flip, a dice roll, a model&apos;s
        next token. There&apos;s a set of things that <em>could</em> happen.
        Each one is an <strong>outcome</strong>. The full set of outcomes
        is the <strong>sample space</strong>, usually written{" "}
        <M>{tex`\Omega`}</M>. An <strong>event</strong> is just a subset of
        the sample space — &ldquo;the roll is even,&rdquo; &ldquo;the
        token starts with a space.&rdquo;
      </p>
      <Block>{tex`\Omega = \{\, \omega_1, \omega_2, \ldots \,\}, \qquad A \subseteq \Omega.`}</Block>
      <p>
        That&apos;s the whole vocabulary. An outcome is a single thing,
        a sample space is the set of every single thing, and an event
        groups some of those things together because we care about them
        for a question.
      </p>

      <h2>The three axioms of probability</h2>
      <p>
        A <strong>probability</strong> is a function <M>P</M> that
        assigns a number to every event, subject to three rules:
      </p>
      <ol>
        <li>
          <strong>Non-negativity.</strong> <M>{tex`P(A) \geq 0`}</M> for
          every event <M>A</M>.
        </li>
        <li>
          <strong>Total mass.</strong> <M>{tex`P(\Omega) = 1`}</M>.
          Something happens.
        </li>
        <li>
          <strong>Additivity.</strong> If two events <M>A</M> and{" "}
          <M>B</M> can&apos;t both happen (they&apos;re{" "}
          <em>disjoint</em>), then{" "}
          <M>{tex`P(A \cup B) = P(A) + P(B)`}</M>.
        </li>
      </ol>
      <p>
        Everything else — conditional probability, Bayes&apos; rule,
        expectation — is bookkeeping on top of those three rules.
      </p>

      <h2>The uniform case</h2>
      <p>
        When every outcome is equally likely and the sample space is
        finite, probability collapses to counting:
      </p>
      <Block>{tex`P(A) = \frac{|A|}{|\Omega|}.`}</Block>
      <p>
        Below: roll two fair dice. There are <M>{tex`6 \times 6 = 36`}</M>{" "}
        outcomes. Pick an event by toggling a preset or by clicking
        individual cells, and read off <M>{tex`|A|/|\Omega|`}</M>.
      </p>

      <Figure caption="Two-dice sample space. Each cell is one outcome (d₁, d₂); selected cells form the event A. P(A) is just how many cells are highlighted, divided by 36.">
        <SampleSpaceGrid />
      </Figure>

      <Callout variant="intuition">
        When outcomes are equally likely, probability is counting. When
        they aren&apos;t — and in mech interp they almost never are —
        you replace &ldquo;count&rdquo; with &ldquo;sum the
        probabilities.&rdquo; The structure is identical.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A language model&apos;s <strong>vocabulary</strong> is its
          sample space at every token position. For GPT-2 it has{" "}
          <M>{tex`|\Omega| = 50{,}257`}</M> outcomes. The model assigns
          a probability to every one of them, and{" "}
          <em>an event is any subset of tokens you care about</em> —
          &ldquo;the next token is a digit,&rdquo; &ldquo;the next token
          continues a code block,&rdquo; &ldquo;the next token is{" "}
          <code>the</code>.&rdquo;
        </p>
        <p>
          When you ablate a head and measure how often the model still
          puts probability on the &ldquo;correct token set,&rdquo;
          you&apos;re computing <M>{tex`P(A)`}</M> under two different
          distributions and comparing.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            You roll two fair dice. What is the probability that the sum
            is divisible by 6?
          </>
        }
        choices={[
          {
            id: "a",
            label: "1/6",
            correct: true,
            explain:
              "The sums that work are 6 (5 outcomes) and 12 (1 outcome). 6/36 = 1/6.",
          },
          {
            id: "b",
            label: "1/12",
            explain:
              "That would be just the (6,6) outcome. Don't forget the sums equal to 6.",
          },
          {
            id: "c",
            label: "1/3",
            explain:
              "Too generous — you'd need 12 outcomes out of 36, but only 6 sums are divisible by 6.",
          },
        ]}
      />
    </ChapterShell>
  );
}
