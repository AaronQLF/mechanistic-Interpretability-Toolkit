import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
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
          <M>{`(3, 2)`}</M>. This is what your code actually stores. A
          768-dimensional residual stream is just a list of 768 numbers.
        </li>
        <li>
          <strong>Point.</strong> A vector is a location in space — the
          arrowhead of an arrow whose tail sits at the origin. This is the
          picture that lets us talk about &ldquo;feature directions&rdquo; and
          &ldquo;clusters of activations.&rdquo;
        </li>
      </ul>

      <Block>{`\\mathbf{v} = \\begin{bmatrix} 3 \\\\ 2 \\end{bmatrix} \\quad \\Longleftrightarrow \\quad \\text{arrow from } (0,0) \\text{ to } (3, 2)`}</Block>

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
          The length <M>{`\\lVert \\mathbf{v} \\rVert`}</M> changes too,
          following the Pythagorean theorem.
        </li>
      </ul>

      <Figure caption="Drag the head of v. The list (x, y), the arrow, and the point all move together because they're the same object.">
        <Vector2DPlayground />
      </Figure>

      <h2>Notation</h2>
      <p>
        We&apos;ll write vectors in bold like <M>{`\\mathbf{v}`}</M>, and
        sometimes as a column of numbers. The dimension <M>n</M> of a vector
        is just how many numbers are in the list:
      </p>
      <Block>{`\\mathbf{v} \\in \\mathbb{R}^{n} \\quad \\text{means } \\mathbf{v} = \\begin{bmatrix} v_1 \\\\ v_2 \\\\ \\vdots \\\\ v_n \\end{bmatrix}.`}</Block>

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
          <M>{`\\mathbb{R}^{768}`}</M>; in larger models it&apos;s in
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
            <M>{`(2, 1)`}</M> without changing its length or direction. What
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
    </ChapterShell>
  );
}
