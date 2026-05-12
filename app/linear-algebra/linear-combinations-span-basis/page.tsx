import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SpanExplorer } from "@/components/viz/SpanExplorer";

export const metadata = {
  title: "Linear combinations, span & basis",
};

export default function SpanPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="linear-combinations-span-basis"
      eyebrow="Chapter 03"
      title="Linear combinations, span & basis"
      lede="Once you can add and scale, the natural question is: which vectors can you reach? The answer gives us the words span, basis, and dimension — and the language we'll use to describe feature directions inside a model."
    >
      <h2>Linear combinations</h2>
      <p>
        A <strong>linear combination</strong> of vectors{" "}
        <M>{tex`\mathbf{v}_1, \mathbf{v}_2, \ldots`}</M> is anything you can
        build by scaling each one and adding them up:
      </p>
      <Block>{tex`a_1 \mathbf{v}_1 + a_2 \mathbf{v}_2 + \cdots + a_k \mathbf{v}_k.`}</Block>
      <p>
        That&apos;s it. Pick scalars, multiply, sum. The set of <em>all</em>{" "}
        such combinations — every vector you can possibly produce this way —
        is called the <strong>span</strong> of those vectors.
      </p>

      <h2>Span: the territory you can reach</h2>
      <p>
        Drag the two arrows below. As long as they don&apos;t lie on the same
        line, the scalars <M>a</M> and <M>b</M> let you reach every point in
        the plane — their span is all of <M>{tex`\mathbb{R}^2`}</M>. Drag one
        arrow on top of the other and watch the shaded region collapse to a
        line: when vectors are <em>collinear</em>, you&apos;ve lost a
        dimension.
      </p>

      <Figure caption="Two vectors span the plane unless they happen to lie along the same line. The shaded region is the set of all linear combinations a·v + b·w with |a|, |b| ≤ 2.">
        <SpanExplorer />
      </Figure>

      <h2>Linear independence</h2>
      <p>
        A set of vectors is <strong>linearly independent</strong> if none of
        them can be written as a combination of the others. In{" "}
        <M>{tex`\mathbb{R}^2`}</M>, two vectors are independent precisely when
        they&apos;re not collinear. The formal version:
      </p>
      <Block>{tex`a_1 \mathbf{v}_1 + a_2 \mathbf{v}_2 + \cdots + a_k \mathbf{v}_k = \mathbf{0} \quad \Longrightarrow \quad a_1 = a_2 = \cdots = a_k = 0.`}</Block>
      <p>
        In words: the only way to combine them down to zero is the trivial
        way.
      </p>

      <h2>Basis and dimension</h2>
      <p>
        A <strong>basis</strong> for a space is a set of vectors that is{" "}
        <em>(a)</em> linearly independent and <em>(b)</em> spans the space.
        The number of vectors in any basis is the space&apos;s{" "}
        <strong>dimension</strong>.
      </p>
      <p>
        The most familiar basis in <M>{tex`\mathbb{R}^2`}</M> is the{" "}
        <em>standard basis</em>:
      </p>
      <Block>{tex`\mathbf{e}_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \quad \mathbf{e}_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}.`}</Block>
      <p>
        Every vector <M>{tex`(x, y) = x\mathbf{e}_1 + y\mathbf{e}_2`}</M>. But
        plenty of other pairs work as bases too — and choosing a different
        basis is exactly what lets you see a model from a new angle.
      </p>

      <Callout variant="intuition">
        Span = the menu of points you can order. Independence = no item on
        the menu is a recipe for another. Basis = the smallest menu that
        still serves the whole restaurant.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A transformer&apos;s residual stream lives in{" "}
          <M>{tex`\mathbb{R}^d`}</M>, but the model is trying to represent far
          more than <M>d</M> features. It does this by giving each feature its
          own <strong>direction</strong> — its own vector in residual space.
        </p>
        <p>
          The <em>linear representation hypothesis</em> says these directions
          are essentially independent enough that you can read off feature
          activity by projecting onto them. <strong>Superposition</strong>{" "}
          (which we&apos;ll see in the capstone) is what happens when the
          model jams more features in than dimensions allow — they end up
          almost-but-not-quite linearly independent.
        </p>
      </Callout>

      <Quiz
        question="Three vectors in ℝ²: can they ever be linearly independent?"
        choices={[
          {
            id: "a",
            label: "Yes, if they all point in different directions.",
            explain:
              "Pointing different directions isn't enough. Any three vectors in ℝ² must have a linear relation between them.",
          },
          {
            id: "b",
            label: "No — at most you can have 2 independent vectors in ℝ².",
            correct: true,
            explain:
              "Dimension is the maximum number of linearly independent vectors. ℝ² has dimension 2.",
          },
          {
            id: "c",
            label: "Only if one is the zero vector.",
            explain:
              "The zero vector is never independent of anything, but the answer is more general — three vectors in ℝ² can never be independent.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>The fundamental dimension theorem.</strong>
            </p>
            <p>
              <strong>(a)</strong> Prove that any{" "}
              <M>{tex`n + 1`}</M> vectors{" "}
              <M>{tex`\mathbf{v}_{1}, \ldots, \mathbf{v}_{n+1} \in \mathbb{R}^{n}`}</M>{" "}
              must be linearly dependent. (The quiz above asserted this
              for <M>{tex`n = 2`}</M>; now prove it for every <M>n</M>.)
            </p>
            <p>
              <strong>(b)</strong> Conclude: the number of vectors in
              any basis of <M>{tex`\mathbb{R}^{n}`}</M> is exactly{" "}
              <M>n</M> — i.e. dimension is{" "}
              <em>well-defined</em> and doesn&apos;t depend on which
              basis you happen to choose.
            </p>
            <p>
              <strong>(c)</strong> A transformer&apos;s residual stream
              has dimension{" "}
              <M>{tex`d \approx 10^{3}`}</M> to{" "}
              <M>{tex`10^{4}`}</M>. Use (b) to give an immediate upper
              bound on the number of features that can be encoded as{" "}
              <em>strictly</em> linearly independent directions. (The
              capstone will explain how transformers exceed this bound
              by allowing &ldquo;almost&rdquo; independent — i.e.,
              superposition.)
            </p>
          </>
        }
        hint={
          <>
            For (a), do strong induction on <M>n</M>. Use the columns of
            the <M>{tex`n \times (n+1)`}</M> matrix{" "}
            <M>{tex`V = [\mathbf{v}_{1} \mid \ldots \mid \mathbf{v}_{n+1}]`}</M>
            . If some <M>{tex`\mathbf{v}_{i}`}</M> has a zero in its
            first coordinate, drop it. Otherwise scale and subtract to
            zero out the first coordinates of all but one and reduce to
            an <M>{tex`(n-1)`}</M>-dim problem with <M>n</M> vectors.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Induct on <M>n</M>. Base case{" "}
              <M>{tex`n = 1`}</M>: any two vectors in{" "}
              <M>{tex`\mathbb{R}^{1}`}</M> are scalars, and any two
              real numbers <M>{tex`a, b`}</M> satisfy{" "}
              <M>{tex`b\, a - a\, b = 0`}</M> — a non-trivial linear
              relation.
            </p>
            <p>
              Inductive step. Suppose the theorem holds for{" "}
              <M>{tex`n - 1`}</M>. Given{" "}
              <M>{tex`\mathbf{v}_{1}, \ldots, \mathbf{v}_{n+1} \in \mathbb{R}^{n}`}</M>,
              look at their first coordinates{" "}
              <M>{tex`v_{1, 1}, \ldots, v_{1, n+1}`}</M>.
            </p>
            <p>
              <em>Case 1.</em> They&apos;re all zero. Then every{" "}
              <M>{tex`\mathbf{v}_{i}`}</M> lies in the{" "}
              <M>{tex`(n-1)`}</M>-dim subspace{" "}
              <M>{tex`\{\mathbf{x} : x_{1} = 0\} \cong \mathbb{R}^{n-1}`}</M>,
              and we have <M>{tex`n + 1 > n`}</M> vectors there, hence{" "}
              <M>{tex`n + 1 > (n - 1) + 1`}</M>, so by the IH applied
              with the more vectors, they&apos;re dependent. (More
              cleanly: <M>{tex`n + 1`}</M> vectors in a space of
              dimension <M>{tex`n - 1`}</M> is more than{" "}
              <M>{tex`(n - 1) + 1 = n`}</M> vectors, so the IH gives
              dependence.)
            </p>
            <p>
              <em>Case 2.</em> Some <M>{tex`v_{1, j} \neq 0`}</M>. WLOG{" "}
              <M>{tex`j = 1`}</M>. For each{" "}
              <M>{tex`i = 2, \ldots, n + 1`}</M> form
            </p>
            <Block>{tex`\mathbf{v}_{i}' = \mathbf{v}_{i} - \frac{v_{1, i}}{v_{1, 1}}\, \mathbf{v}_{1}.`}</Block>
            <p>
              These <M>n</M> new vectors all have first coordinate 0,
              so they live in <M>{tex`\mathbb{R}^{n-1}`}</M>. By the
              inductive hypothesis they are dependent: there exist
              scalars{" "}
              <M>{tex`c_{2}, \ldots, c_{n+1}`}</M>, not all zero, with{" "}
              <M>{tex`\sum_{i \geq 2} c_{i}\, \mathbf{v}_{i}' = \mathbf{0}`}</M>.
              Substituting back gives a non-trivial relation among{" "}
              <M>{tex`\mathbf{v}_{1}, \ldots, \mathbf{v}_{n+1}`}</M>{" "}
              (the coefficient on <M>{tex`\mathbf{v}_{1}`}</M> is
              determined, the rest are the <M>{tex`c_{i}`}</M>, not all
              zero). Done.
            </p>
            <p>
              <strong>(b)</strong> Suppose{" "}
              <M>{tex`\{\mathbf{b}_{1}, \ldots, \mathbf{b}_{m}\}`}</M>{" "}
              and{" "}
              <M>{tex`\{\mathbf{c}_{1}, \ldots, \mathbf{c}_{k}\}`}</M>{" "}
              are both bases of{" "}
              <M>{tex`\mathbb{R}^{n}`}</M>. Both sets are linearly
              independent. By (a) (and the symmetric argument inside{" "}
              <M>{tex`\mathbb{R}^{n}`}</M>) we get{" "}
              <M>{tex`m \leq n`}</M> and <M>{tex`k \leq n`}</M>; and
              both sets span, so by another application of (a){" "}
              <M>{tex`m \geq n`}</M> and <M>{tex`k \geq n`}</M>. Hence{" "}
              <M>{tex`m = k = n`}</M>.
            </p>
            <p>
              <strong>(c)</strong> At most <M>d</M> features can be
              encoded as strictly linearly independent directions in a{" "}
              <M>d</M>-dimensional residual stream. The number of
              concepts a model represents is empirically much larger
              than <M>d</M> — that&apos;s what forces almost-orthogonal
              encodings, which the capstone makes precise.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
