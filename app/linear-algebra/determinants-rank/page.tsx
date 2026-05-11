import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { DeterminantArea } from "@/components/viz/DeterminantArea";

export const metadata = {
  title: "Determinants & rank",
};

export default function DetRankPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="determinants-rank"
      eyebrow="Chapter 06"
      title="Determinants & rank"
      lede="Determinants tell you how much a transformation stretches space. Rank tells you how much information it keeps. Together they decide whether a transformation can be undone."
    >
      <h2>Determinant: the area scale factor</h2>
      <p>
        Take the unit square — the one with corners at{" "}
        <M>{`(0,0), (1,0), (1,1), (0,1)`}</M>. Apply a 2×2 matrix <M>M</M>.
        The image is a parallelogram. The <strong>determinant</strong> of{" "}
        <M>M</M> is its <em>signed</em> area:
      </p>
      <Block>{`\\det \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} = ad - bc.`}</Block>
      <ul>
        <li>
          <M>{`|\\det M|`}</M> is how much <M>M</M> stretches area.
        </li>
        <li>
          The <em>sign</em> of <M>{`\\det M`}</M> tells you whether{" "}
          <M>M</M> flipped orientation (a reflection makes it negative).
        </li>
        <li>
          <M>{`\\det M = 0`}</M> means the parallelogram has collapsed to a
          segment — <M>M</M> has crushed the plane onto a line, losing a
          dimension.
        </li>
      </ul>

      <Figure caption="The grey square is the original; the colored parallelogram is its image under M. Make M's columns parallel to watch the area drop to zero.">
        <DeterminantArea />
      </Figure>

      <h2>Rank: the dimension of the image</h2>
      <p>
        The <strong>rank</strong> of a matrix is the dimension of the space
        it lands in — i.e. the dimension of the span of its columns. For a
        2×2 matrix:
      </p>
      <ul>
        <li>
          <strong>Rank 2</strong> (<M>{`\\det M \\ne 0`}</M>): <M>M</M> maps
          the plane onto the plane; nothing collapses.
        </li>
        <li>
          <strong>Rank 1</strong> (<M>{`\\det M = 0`}</M>, but <M>M</M> isn&apos;t
          all zeros): the image is a line.
        </li>
        <li>
          <strong>Rank 0</strong> (<M>M = 0</M>): the image is the origin.
        </li>
      </ul>
      <p>
        Rank is essentially &ldquo;how many independent directions survive
        the transformation.&rdquo; A rank-1 transformation crushes everything
        onto one direction.
      </p>

      <Callout variant="intuition">
        Determinant is volume; rank is dimension. A nonzero determinant means
        full rank means the map is invertible. A zero determinant means
        you&apos;ve lost a dimension and there&apos;s no way back.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Many of the most-studied attention matrices are explicitly{" "}
          <strong>low-rank</strong>: <M>{`W_O W_V`}</M> is at most rank{" "}
          <M>{`d_{\\text{head}}`}</M>, which is much smaller than the
          residual dimension. That means each head reads a low-dimensional
          subspace of the residual stream and writes back to a low-dimensional
          subspace of it.
        </p>
        <p>
          Reasoning about which subspaces — i.e. which directions — that
          turns out to be is a core mech-interp activity, and the language
          for it is the language of rank.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            For <M>{`M = \\begin{pmatrix} 2 & 4 \\\\ 1 & 2 \\end{pmatrix}`}</M>, what is{" "}
            <M>{`\\det M`}</M> and what does that tell you?
          </>
        }
        choices={[
          {
            id: "a",
            label: "det = 0; the matrix is singular and its rank is 1.",
            correct: true,
            explain:
              "2·2 − 4·1 = 0. The columns (2,1) and (4,2) are parallel, so the image is a line — rank 1.",
          },
          {
            id: "b",
            label: "det = 8; full rank.",
            explain: "8 would be 2·2 + 4·1. The formula is ad − bc, not ad + bc.",
          },
          {
            id: "c",
            label: "det = 4; full rank, mild stretch.",
            explain: "Recompute: 2·2 − 4·1 = 4 − 4 = 0.",
          },
        ]}
      />
    </ChapterShell>
  );
}
