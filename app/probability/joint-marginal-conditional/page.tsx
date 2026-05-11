import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { JointHeatmap } from "@/components/viz/JointHeatmap";

export const metadata = {
  title: "Joint, marginal & conditional",
};

export default function JointMarginalConditionalPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="joint-marginal-conditional"
      eyebrow="Chapter 03"
      title="Joint, marginal & conditional"
      lede="Most interesting questions involve more than one random thing at a time. The whole grammar for asking those questions fits in three definitions and a single picture: a 2D table."
    >
      <h2>The joint distribution</h2>
      <p>
        Two random variables <M>X</M> and <M>Y</M> together have a{" "}
        <strong>joint distribution</strong>:
      </p>
      <Block>{tex`p(x, y) = P(X = x,\ Y = y).`}</Block>
      <p>
        For discrete <M>X</M> and <M>Y</M>, that&apos;s a 2D table with
        one cell per pair of values. Add every cell up and you get 1.
      </p>

      <h2>Marginals: sum the rows or columns</h2>
      <p>
        If you only care about <M>X</M>, you ignore <M>Y</M> by{" "}
        <em>summing it out</em>. The result is the{" "}
        <strong>marginal</strong> distribution of <M>X</M>:
      </p>
      <Block>{tex`p_X(x) = \sum_{y} p(x, y).`}</Block>
      <p>
        Geometrically: collapse the table along the <M>Y</M> axis and
        read the row sums on the right. The marginals for <M>X</M> and{" "}
        <M>Y</M> are the two side bar charts in the figure.
      </p>

      <h2>Conditionals: slice and renormalize</h2>
      <p>
        If you learn that <M>{tex`X = x`}</M>, the universe shrinks to
        that one row and you renormalize to make it a distribution
        again:
      </p>
      <Block>{tex`p(y \mid x) = \frac{p(x, y)}{p_X(x)}.`}</Block>
      <p>
        That&apos;s <strong>conditional probability</strong>. The
        denominator is just whatever the row sums to. Hover a row or
        column below — the right panel shows the resulting conditional
        distribution.
      </p>

      <Figure caption="Joint distribution P(X, Y) as a heatmap; row and column marginals on the sides. Hover a row to slice into P(Y | X = x); hover a column for P(X | Y = y).">
        <JointHeatmap />
      </Figure>

      <h2>Independence</h2>
      <p>
        <M>X</M> and <M>Y</M> are <strong>independent</strong> when
        learning <M>{tex`X = x`}</M> tells you nothing about <M>Y</M>.
        Formally:
      </p>
      <Block>{tex`p(x, y) = p_X(x)\, p_Y(y) \quad \text{for every } x, y.`}</Block>
      <p>
        In the heatmap, that means every row has the same shape (the
        marginal of <M>Y</M>) and every column has the same shape (the
        marginal of <M>X</M>). Try the &ldquo;independent&rdquo; preset.
        Then try &ldquo;correlated&rdquo; and watch how slicing
        different rows gives genuinely different conditional shapes.
      </p>

      <h2>The chain rule</h2>
      <p>
        Rearranging the conditional definition gives a small but
        extremely useful identity:
      </p>
      <Block>{tex`p(x, y) = p(y \mid x)\, p_X(x) = p(x \mid y)\, p_Y(y).`}</Block>
      <p>
        It&apos;s called the <strong>chain rule of probability</strong>.
        It scales to any number of variables and is the engine inside
        almost every probabilistic model you&apos;ll meet — including,
        as we&apos;ll see, language models.
      </p>

      <Callout variant="intuition">
        Joint is the whole table. Marginals are what you see when you
        look from the side. Conditionals are a single row or column,
        cleaned up so it adds to 1 again.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A language model factors the probability of a sequence using
          the chain rule:
        </p>
        <Block>{tex`p(x_1, x_2, \ldots, x_T) = \prod_{t=1}^{T} p(x_t \mid x_{<t}).`}</Block>
        <p>
          Each forward pass computes one of those conditional
          distributions over the vocabulary. The model is literally a
          giant <M>{tex`p(x_t \mid x_{<t})`}</M> machine — every other
          piece of mech-interp vocabulary (logit lens, attribution,
          ablation) is a way of staring at that conditional.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            If <M>X</M> and <M>Y</M> are independent and{" "}
            <M>{tex`P(X = 1) = 0.4`}</M>, <M>{tex`P(Y = 1) = 0.5`}</M>,
            what is <M>{tex`P(X = 1,\ Y = 1)`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "0.9",
            explain:
              "That's the probability of (X=1 or Y=1), not both — and only under disjointness, which fails here.",
          },
          {
            id: "b",
            label: "0.2",
            correct: true,
            explain:
              "Independence means the joint factors: 0.4 × 0.5 = 0.2.",
          },
          {
            id: "c",
            label: "0.45",
            explain:
              "That's the average, which has nothing to do with probability of a conjunction.",
          },
        ]}
      />
    </ChapterShell>
  );
}
