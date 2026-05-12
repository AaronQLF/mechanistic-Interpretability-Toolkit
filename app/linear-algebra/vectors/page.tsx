import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { Vector2DPlayground } from "@/components/viz/Vector2DPlayground";

export const metadata = {
  title: "Vectors",
};

export default function VectorsPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="vectors"
      eyebrow="Chapter 01"
      title="Vectors"
      lede="A vector is the kind of thing a neural network thinks in. Before we can read what one is doing, we have to learn to see vectors clearly — as arrows, as lists of numbers, and as points in space."
    >
      <h2>Three views, one object</h2>
      <p>
        Mathematicians, physicists, and machine-learning engineers all use the
        word <em>vector</em>, but they each have a favorite picture in their
        head. The trick is that they&apos;re all looking at the same object
        from different angles, and you&apos;ll need all three views to do mech
        interp comfortably.
      </p>
      <ul>
        <li>
          <strong>Arrow.</strong> A vector is an arrow with a length and a
          direction. Where you place its tail doesn&apos;t matter; only its
          shape matters. This is the picture that makes geometry tractable.
        </li>
        <li>
          <strong>List.</strong> A vector is an ordered list of numbers, like{" "}
          <M>{tex`(3, 2)`}</M>. This is what your code actually stores. A
          768-dimensional residual stream is just a list of 768 numbers.
        </li>
        <li>
          <strong>Point.</strong> A vector is a location in space — the
          arrowhead of an arrow whose tail sits at the origin. This is the
          picture that lets us talk about &ldquo;feature directions&rdquo; and
          &ldquo;clusters of activations.&rdquo;
        </li>
      </ul>

      <Block>{tex`\mathbf{v} = \begin{bmatrix} 3 \\ 2 \end{bmatrix} \quad \Longleftrightarrow \quad \text{arrow from } (0,0) \text{ to } (3, 2)`}</Block>

      <h2>Drag the arrowhead</h2>
      <p>
        Grab the dot at the head of the arrow and move it around. Notice three
        things at once:
      </p>
      <ul>
        <li>
          The two coordinates <M>x</M> and <M>y</M> change with your finger.
        </li>
        <li>
          The dashed segments — the arrow&apos;s shadows on each axis — show
          how those coordinates are read off.
        </li>
        <li>
          The length <M>{tex`\lVert \mathbf{v} \rVert`}</M> changes too,
          following the Pythagorean theorem.
        </li>
      </ul>

      <Figure caption="Drag the head of v. The list (x, y), the arrow, and the point all move together because they're the same object.">
        <Vector2DPlayground />
      </Figure>

      <h2>Notation</h2>
      <p>
        We&apos;ll write vectors in bold like <M>{tex`\mathbf{v}`}</M>, and
        sometimes as a column of numbers. The dimension <M>n</M> of a vector
        is just how many numbers are in the list:
      </p>
      <Block>{tex`\mathbf{v} \in \mathbb{R}^{n} \quad \text{means } \mathbf{v} = \begin{bmatrix} v_1 \\ v_2 \\ \vdots \\ v_n \end{bmatrix}.`}</Block>

      <Callout variant="intuition">
        In 2D and 3D you can <em>see</em> a vector. In 768D you can&apos;t —
        but the algebra is identical. We&apos;ll build all our intuitions in
        2D, then trust that the same operations carry up. That&apos;s the
        whole game.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A transformer&apos;s <strong>residual stream</strong> at one token
          position is a vector. In GPT-2 small it lives in{" "}
          <M>{tex`\mathbb{R}^{768}`}</M>; in larger models it&apos;s in
          thousands of dimensions. Every layer reads from this vector and
          writes back to it.
        </p>
        <p>
          A <strong>feature direction</strong> — a hypothesized concept like
          &ldquo;is this token a verb?&rdquo; — is also a vector in that
          space. We measure how strongly a feature is present by how far the
          residual stream points along the feature&apos;s direction.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            You move a vector&apos;s tail from the origin to{" "}
            <M>{tex`(2, 1)`}</M> without changing its length or direction. What
            happened to the vector?
          </>
        }
        choices={[
          {
            id: "a",
            label: "Its components changed.",
            explain:
              "Components are read tail-to-head. If both tail and head shifted by the same amount, the components are identical.",
          },
          {
            id: "b",
            label: "Nothing changed; it's the same vector.",
            correct: true,
            explain:
              "A vector cares only about magnitude and direction. Translating its tail leaves it unchanged.",
          },
          {
            id: "c",
            label: "Its length changed.",
            explain:
              "Translation preserves length. Only stretching or shrinking changes ‖v‖.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>The parallelogram identity, and the median of a
              triangle.</strong>
            </p>
            <p>
              <strong>(a)</strong> Let{" "}
              <M>{tex`\mathbf{v}, \mathbf{w} \in \mathbb{R}^{n}`}</M>.
              Working only from the coordinate definition{" "}
              <M>{tex`\|\mathbf{v}\|^{2} = \sum_{i} v_{i}^{2}`}</M>,
              prove
            </p>
            <Block>{tex`\|\mathbf{v} + \mathbf{w}\|^{2} + \|\mathbf{v} - \mathbf{w}\|^{2} = 2\|\mathbf{v}\|^{2} + 2\|\mathbf{w}\|^{2}.`}</Block>
            <p>
              <strong>(b)</strong> Use (a) to prove{" "}
              <strong>Apollonius&apos; median formula</strong>: in a
              triangle with vertices <M>A</M>, <M>B</M>, <M>C</M>, let{" "}
              <M>M</M> be the midpoint of side <M>BC</M> and let{" "}
              <M>{tex`m = \|AM\|`}</M>. Show that
            </p>
            <Block>{tex`m^{2} = \frac{2\|AB\|^{2} + 2\|AC\|^{2} - \|BC\|^{2}}{4}.`}</Block>
            <p>
              <strong>(c)</strong> Conclude that knowing all three side
              lengths of a triangle pins down every median&apos;s length —
              <em>without</em> trigonometry.
            </p>
          </>
        }
        hint={
          <>
            For (b), put the triangle&apos;s vertices at vectors{" "}
            <M>{tex`\mathbf{a}, \mathbf{b}, \mathbf{c}`}</M> from a
            convenient origin and write{" "}
            <M>{tex`M = (\mathbf{b} + \mathbf{c})/2`}</M>. The median is{" "}
            <M>{tex`\mathbf{m} = M - \mathbf{a}`}</M>. Apply the
            identity from (a) cleverly to <M>{tex`\mathbf{b} - \mathbf{a}`}</M>{" "}
            and <M>{tex`\mathbf{c} - \mathbf{a}`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Expand componentwise:
            </p>
            <Block>{tex`\|\mathbf{v} \pm \mathbf{w}\|^{2} = \sum_{i}(v_{i} \pm w_{i})^{2} = \sum_{i} v_{i}^{2} \pm 2\sum_{i} v_{i} w_{i} + \sum_{i} w_{i}^{2}.`}</Block>
            <p>
              Adding the <M>+</M> and <M>-</M> versions, the cross
              terms cancel and you&apos;re left with{" "}
              <M>{tex`2\|\mathbf{v}\|^{2} + 2\|\mathbf{w}\|^{2}`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Place <M>A</M> at the origin and let{" "}
              <M>{tex`\mathbf{b} = B - A`}</M>,{" "}
              <M>{tex`\mathbf{c} = C - A`}</M>. The midpoint of <M>BC</M>{" "}
              is <M>{tex`M = (\mathbf{b} + \mathbf{c})/2`}</M> and{" "}
              <M>{tex`BC = \mathbf{c} - \mathbf{b}`}</M>. Apply (a) with{" "}
              <M>{tex`\mathbf{v} = \mathbf{b}`}</M>,{" "}
              <M>{tex`\mathbf{w} = \mathbf{c}`}</M>:
            </p>
            <Block>{tex`\|\mathbf{b} + \mathbf{c}\|^{2} + \|\mathbf{c} - \mathbf{b}\|^{2} = 2\|\mathbf{b}\|^{2} + 2\|\mathbf{c}\|^{2}.`}</Block>
            <p>
              The first term is{" "}
              <M>{tex`\|\mathbf{b} + \mathbf{c}\|^{2} = \|2 M\|^{2} = 4 m^{2}`}</M>;
              the second is <M>{tex`\|BC\|^{2}`}</M>; and the right side
              is <M>{tex`2\|AB\|^{2} + 2\|AC\|^{2}`}</M>. Solve for{" "}
              <M>{tex`m^{2}`}</M>.
            </p>
            <p>
              <strong>(c)</strong> Direct: every term on the right of
              the formula is determined by side lengths alone, so{" "}
              <M>m</M> is too. Trigonometry never enters; the algebra of
              vectors does the whole job. This is the same engine that
              lets a transformer compute meaningful similarity from raw
              coordinates without ever &ldquo;knowing&rdquo; the angles
              involved.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
