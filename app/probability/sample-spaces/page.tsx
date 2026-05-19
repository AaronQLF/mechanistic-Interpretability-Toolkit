import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
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

      <Challenge
        prompt={
          <>
            <p>
              Let <M>{tex`\Omega`}</M> be a finite sample space and{" "}
              <M>{tex`A_1, \ldots, A_n \subseteq \Omega`}</M> be
              events (not necessarily disjoint).
            </p>
            <p>
              <strong>(a)</strong> Prove the{" "}
              <strong>inclusion-exclusion</strong> formula
              <Block>{tex`P\!\left(\bigcup_{i=1}^{n} A_{i}\right) = \sum_{k=1}^{n} (-1)^{k+1} \!\!\sum_{1 \le i_{1} < \cdots < i_{k} \le n}\! P(A_{i_{1}} \cap \cdots \cap A_{i_{k}})`}</Block>
              from the three probability axioms (start with{" "}
              <M>{tex`n = 2`}</M> and induct).
            </p>
            <p>
              <strong>(b)</strong> Apply it to the &ldquo;hat-check
              problem&rdquo;: <M>n</M> guests check their hats; the
              hats are returned in a uniformly random order. Let{" "}
              <M>{tex`A_{i}`}</M> be the event that guest <M>i</M>{" "}
              gets her own hat. Compute{" "}
              <M>{tex`P(\bigcup A_{i})`}</M> and show that the
              probability that <em>nobody</em> gets the right hat
              tends to <M>{tex`1/e`}</M> as{" "}
              <M>{tex`n \to \infty`}</M>.
            </p>
            <p>
              <strong>(c)</strong> A language-model analogue. A model
              has vocabulary <M>V</M> with{" "}
              <M>{tex`|V| = N`}</M>. On a particular prompt the
              model places probability{" "}
              <M>{tex`p_{i}`}</M> on token <M>i</M>. You sample{" "}
              <M>n</M> times independently. Express the probability
              of seeing token <M>{tex`i^\star`}</M> at least once as
              a complement, and use it to show that for large{" "}
              <M>n</M> with small <M>{tex`p_{i^\star}`}</M> this
              equals{" "}
              <M>{tex`1 - e^{-n p_{i^\star}}`}</M> to leading order.
              When does &ldquo;low-probability tokens are basically
              never sampled&rdquo; break down?
            </p>
          </>
        }
        hint={
          <>
            For (a)&nbsp;<M>{tex`n=2`}</M>: write{" "}
            <M>{tex`A \cup B = A \sqcup (B \setminus A)`}</M> and
            apply additivity twice. For (b): by symmetry every{" "}
            <M>{tex`P(A_{i_1} \cap \cdots \cap A_{i_k})`}</M> equals{" "}
            <M>{tex`(n-k)!/n!`}</M>. For (c): the probability of
            token <M>{tex`i^\star`}</M>{" "}
            <em>never</em> appearing in <M>n</M> samples is{" "}
            <M>{tex`(1 - p_{i^\star})^{n}`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> For <M>{tex`n = 2`}</M>: let{" "}
              <M>{tex`B' = B \setminus A`}</M>. Then{" "}
              <M>A</M> and <M>{tex`B'`}</M> are disjoint, so{" "}
              <M>{tex`P(A \cup B) = P(A) + P(B')`}</M>. Also{" "}
              <M>{tex`B = (A \cap B) \sqcup B'`}</M>, so{" "}
              <M>{tex`P(B) = P(A \cap B) + P(B')`}</M>; substituting
              gives{" "}
              <M>{tex`P(A \cup B) = P(A) + P(B) - P(A \cap B)`}</M>.
              The general case follows by induction on <M>n</M>:
              apply <M>{tex`n=2`}</M> to{" "}
              <M>{tex`A_n`}</M> and{" "}
              <M>{tex`\bigcup_{i<n} A_i`}</M>, then expand the
              intersection{" "}
              <M>{tex`A_n \cap \bigcup_{i<n} A_i = \bigcup_{i<n} (A_n \cap A_i)`}</M>{" "}
              using the inductive hypothesis. The signs collapse
              into the alternating-sign formula stated.
            </p>
            <p>
              <strong>(b)</strong> By symmetry, for any{" "}
              <M>k</M>-subset of guests, the probability that all{" "}
              <M>k</M> get their own hats is{" "}
              <M>{tex`(n-k)!/n!`}</M> (fix those <M>k</M>; the
              remaining <M>{tex`n-k`}</M> hats permute freely). There
              are <M>{tex`\binom{n}{k}`}</M> such subsets, so
              <Block>{tex`P\!\left(\bigcup A_{i}\right) = \sum_{k=1}^{n} (-1)^{k+1} \binom{n}{k} \frac{(n-k)!}{n!} = \sum_{k=1}^{n} \frac{(-1)^{k+1}}{k!}.`}</Block>
              The probability of <em>no</em> guest getting their own
              hat is the complement,{" "}
              <M>{tex`\sum_{k=0}^{n} (-1)^{k}/k!`}</M>, the partial
              sum of the Taylor series of{" "}
              <M>{tex`e^{-1}`}</M>. As{" "}
              <M>{tex`n \to \infty`}</M> this tends to{" "}
              <M>{tex`1/e \approx 0.368`}</M>.
            </p>
            <p>
              <strong>(c)</strong> The probability that token{" "}
              <M>{tex`i^\star`}</M> is{" "}
              <em>never</em> drawn in <M>n</M> independent samples is{" "}
              <M>{tex`(1 - p_{i^\star})^{n}`}</M>; the complement (at
              least once) is{" "}
              <M>{tex`1 - (1 - p_{i^\star})^{n}`}</M>. Use{" "}
              <M>{tex`\log(1 - p) \approx -p`}</M> for small{" "}
              <M>p</M>: <M>{tex`(1 - p_{i^\star})^{n} \approx e^{-n p_{i^\star}}`}</M>.
              So the probability of seeing token{" "}
              <M>{tex`i^\star`}</M> at least once is{" "}
              <M>{tex`\approx 1 - e^{-n p_{i^\star}}`}</M>.
            </p>
            <p>
              The approximation breaks down precisely when{" "}
              <M>{tex`n p_{i^\star} \gtrsim 1`}</M> — i.e.&nbsp;the
              expected number of times you would see the token is
              order 1 or larger. For a 50K-vocab model with a
              one-in-a-million probability on token{" "}
              <M>{tex`i^\star`}</M>, you need on the order of{" "}
              <M>{tex`10^{6}`}</M> samples before that token starts
              to actually appear. This is why long-tail evaluation is
              expensive, and why &ldquo;the model never produces
              this token&rdquo; claims need to be verified at scale,
              not on a few thousand samples.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
