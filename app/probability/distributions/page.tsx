import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
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

      <Challenge
        prompt={
          <>
            <p>
              Consider categorical distributions on{" "}
              <M>K</M> outcomes. The set of valid PMFs is the{" "}
              <strong>probability simplex</strong>
              <Block>{tex`\Delta^{K-1} = \Bigl\{\, \mathbf{p} \in \mathbb{R}^{K} : p_{i} \geq 0,\ \sum_{i=1}^{K} p_{i} = 1 \,\Bigr\}.`}</Block>
            </p>
            <p>
              <strong>(a)</strong> Show <M>{tex`\Delta^{K-1}`}</M> is
              a convex set: any mixture{" "}
              <M>{tex`\lambda \mathbf{p} + (1 - \lambda)\mathbf{q}`}</M>{" "}
              with <M>{tex`\lambda \in [0, 1]`}</M> of two PMFs is a
              PMF. What does this mean operationally for sampling?
            </p>
            <p>
              <strong>(b)</strong> The set of PMFs is{" "}
              <M>{tex`(K-1)`}</M>-dimensional, not{" "}
              <M>K</M>-dimensional. Identify the constraint that
              kills one degree of freedom and produce an explicit
              parameterization{" "}
              <M>{tex`\mathbb{R}^{K-1} \to \Delta^{K-1}`}</M> using
              the softmax function from chapter 6 — and show that
              softmax has exactly one redundant input direction.
            </p>
            <p>
              <strong>(c)</strong> Suppose two language models{" "}
              <M>{tex`p_{\theta}`}</M> and{" "}
              <M>{tex`p_{\phi}`}</M> output PMFs over the same
              vocabulary. Show that the set{" "}
              <M>{tex`\{\lambda p_{\theta} + (1-\lambda) p_{\phi} : \lambda \in [0, 1]\}`}</M>{" "}
              is itself a valid family of next-token distributions
              (this is the entire content of <em>model averaging</em>{" "}
              and ensembling). Then argue that, in general, the{" "}
              <em>geometric</em> mixture{" "}
              <M>{tex`p_{\theta}^{\lambda} p_{\phi}^{1-\lambda} / Z`}</M>{" "}
              is also a valid PMF (this is &ldquo;product of
              experts&rdquo;), but the two mixtures are different
              distributions. Which one is more peaky in general?
            </p>
          </>
        }
        hint={
          <>
            For (a): check non-negativity and total mass directly.
            For (b): the constraint{" "}
            <M>{tex`\sum p_i = 1`}</M> is one linear equation in{" "}
            <M>K</M> unknowns; softmax of any vector{" "}
            <M>{tex`\mathbf{z} + c\,\mathbf{1}`}</M> is the same.
            For (c): compare{" "}
            <M>{tex`\lambda p + (1-\lambda) q`}</M> vs.&nbsp;
            <M>{tex`p^{\lambda} q^{1-\lambda}/Z`}</M> at any{" "}
            outcome where one is small and the other large.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> If{" "}
              <M>{tex`p_i, q_i \geq 0`}</M> and{" "}
              <M>{tex`\lambda \in [0,1]`}</M> then{" "}
              <M>{tex`\lambda p_i + (1-\lambda) q_i \geq 0`}</M>; and{" "}
              <M>{tex`\sum_i (\lambda p_i + (1-\lambda) q_i) = \lambda + (1-\lambda) = 1`}</M>.
              So the mixture is a PMF. Operationally: to sample from
              the mixture, flip a coin with probability{" "}
              <M>{tex`\lambda`}</M>; on heads sample from{" "}
              <M>p</M>, on tails from <M>q</M>. The marginal is
              exactly the mixture PMF.
            </p>
            <p>
              <strong>(b)</strong> The constraint{" "}
              <M>{tex`\sum p_i = 1`}</M> reduces dimension by 1, so{" "}
              <M>{tex`\Delta^{K-1}`}</M> is a{" "}
              <M>{tex`(K-1)`}</M>-dimensional simplex. Softmax{" "}
              <M>{tex`\sigma : \mathbb{R}^{K} \to \Delta^{K-1}`}</M>{" "}
              is surjective but not injective:{" "}
              <M>{tex`\sigma(\mathbf{z}) = \sigma(\mathbf{z} + c\mathbf{1})`}</M>{" "}
              for every <M>{tex`c \in \mathbb{R}`}</M> (the
              shift-invariance from chapter 6). The kernel of the
              map is exactly the 1D subspace{" "}
              <M>{tex`\mathbb{R} \cdot \mathbf{1}`}</M>; quotienting
              gives a bijection{" "}
              <M>{tex`\mathbb{R}^{K}/\mathbb{R}\mathbf{1} \cong \Delta^{K-1}`}</M>,
              which is <M>{tex`(K-1)`}</M>-dimensional, matching the
              simplex. So &ldquo;parameterize a categorical with{" "}
              <M>K</M> logits&rdquo; secretly has one redundant
              degree of freedom; we just don&apos;t bother removing
              it.
            </p>
            <p>
              <strong>(c)</strong> Linear mixtures of PMFs are PMFs
              (part a), so model averaging is well-defined.
              Geometric mixtures{" "}
              <M>{tex`r_i \propto p_i^{\lambda} q_i^{1-\lambda}`}</M>{" "}
              also produce non-negative weights summing to 1 after
              the normalizer <M>Z</M>, so they are PMFs too. The
              two are genuinely different. Take{" "}
              <M>{tex`\lambda = 1/2`}</M> and an outcome <M>i</M>{" "}
              where <M>{tex`p_i = 0.9`}</M>,{" "}
              <M>{tex`q_i = 0.1`}</M>: linear mixture gives{" "}
              <M>{tex`0.5`}</M>; geometric gives{" "}
              <M>{tex`\sqrt{0.09} = 0.3`}</M> before normalizing.
              The geometric mixture is{" "}
              <em>peakier</em>: an outcome that is unlikely under{" "}
              <em>any</em> single model is suppressed in the
              product, while in the linear mixture it just gets
              weighted-averaged. Intuition: linear mixture is
              &ldquo;OR over models&rdquo;; geometric is
              &ldquo;AND.&rdquo; This is exactly the difference
              between an ensemble that votes (linear) and one that
              requires consensus (geometric / product of experts).
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
