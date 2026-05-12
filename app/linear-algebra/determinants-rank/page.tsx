import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
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
        <M>{tex`(0,0), (1,0), (1,1), (0,1)`}</M>. Apply a 2×2 matrix <M>M</M>.
        The image is a parallelogram. The <strong>determinant</strong> of{" "}
        <M>M</M> is its <em>signed</em> area:
      </p>
      <Block>{tex`\det \begin{bmatrix} a & b \\ c & d \end{bmatrix} = ad - bc.`}</Block>
      <ul>
        <li>
          <M>{tex`|\det M|`}</M> is how much <M>M</M> stretches area.
        </li>
        <li>
          The <em>sign</em> of <M>{tex`\det M`}</M> tells you whether{" "}
          <M>M</M> flipped orientation (a reflection makes it negative).
        </li>
        <li>
          <M>{tex`\det M = 0`}</M> means the parallelogram has collapsed to a
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
          <strong>Rank 2</strong> (<M>{tex`\det M \ne 0`}</M>): <M>M</M> maps
          the plane onto the plane; nothing collapses.
        </li>
        <li>
          <strong>Rank 1</strong> (<M>{tex`\det M = 0`}</M>, but <M>M</M> isn&apos;t
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
          <strong>low-rank</strong>: <M>{tex`W_O W_V`}</M> is at most rank{" "}
          <M>{tex`d_{\text{head}}`}</M>, which is much smaller than the
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
            For <M>{tex`M = \begin{pmatrix} 2 & 4 \\ 1 & 2 \end{pmatrix}`}</M>, what is{" "}
            <M>{tex`\det M`}</M> and what does that tell you?
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

      <Challenge
        prompt={
          <>
            <p>
              <strong>The rank–nullity theorem.</strong>
            </p>
            <p>
              For an <M>{tex`m \times n`}</M> matrix <M>A</M>, define
            </p>
            <ul>
              <li>
                the <strong>image</strong>{" "}
                <M>{tex`\mathrm{im}(A) = \{A \mathbf{x} : \mathbf{x} \in \mathbb{R}^{n}\} \subseteq \mathbb{R}^{m}`}</M>{" "}
                (a.k.a. the column space),
              </li>
              <li>
                the <strong>kernel</strong>{" "}
                <M>{tex`\ker(A) = \{\mathbf{x} \in \mathbb{R}^{n} : A \mathbf{x} = \mathbf{0}\}`}</M>{" "}
                (a.k.a. the null space),
              </li>
              <li>
                <strong>rank</strong>{" "}
                <M>{tex`r = \dim \mathrm{im}(A)`}</M> and{" "}
                <strong>nullity</strong>{" "}
                <M>{tex`\nu = \dim \ker(A)`}</M>.
              </li>
            </ul>
            <p>
              <strong>(a)</strong> Prove
            </p>
            <Block>{tex`r + \nu = n.`}</Block>
            <p>
              <strong>(b)</strong> Conclude that for an attention-head
              factor like{" "}
              <M>{tex`W_{O} W_{V} \in \mathbb{R}^{d \times d}`}</M>{" "}
              with inner dimension <M>{tex`d_{\text{head}} \ll d`}</M>,
              the kernel has dimension at least{" "}
              <M>{tex`d - d_{\text{head}}`}</M>. What does that mean
              about how much of the residual stream the head can{" "}
              <em>see</em>?
            </p>
            <p>
              <strong>(c)</strong> Give an{" "}
              <M>{tex`m \times n`}</M> matrix with prescribed{" "}
              <M>{tex`m, n, r`}</M> (with{" "}
              <M>{tex`r \leq \min(m, n)`}</M>) by exhibiting one in
              block form, and verify (a) on it.
            </p>
          </>
        }
        hint={
          <>
            For (a), pick a basis{" "}
            <M>{tex`\mathbf{u}_{1}, \ldots, \mathbf{u}_{\nu}`}</M> of{" "}
            <M>{tex`\ker(A)`}</M>, extend it to a basis{" "}
            <M>{tex`\mathbf{u}_{1}, \ldots, \mathbf{u}_{\nu}, \mathbf{w}_{1}, \ldots, \mathbf{w}_{k}`}</M>{" "}
            of <M>{tex`\mathbb{R}^{n}`}</M>, and prove the images{" "}
            <M>{tex`A \mathbf{w}_{j}`}</M> are a basis of{" "}
            <M>{tex`\mathrm{im}(A)`}</M>. So{" "}
            <M>{tex`r = k = n - \nu`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Let{" "}
              <M>{tex`\{\mathbf{u}_{1}, \ldots, \mathbf{u}_{\nu}\}`}</M>{" "}
              be a basis of <M>{tex`\ker(A)`}</M>; extend it to a basis{" "}
              <M>{tex`\{\mathbf{u}_{1}, \ldots, \mathbf{u}_{\nu}, \mathbf{w}_{1}, \ldots, \mathbf{w}_{k}\}`}</M>{" "}
              of all of <M>{tex`\mathbb{R}^{n}`}</M>, so{" "}
              <M>{tex`\nu + k = n`}</M>. We claim{" "}
              <M>{tex`\{A \mathbf{w}_{1}, \ldots, A \mathbf{w}_{k}\}`}</M>{" "}
              is a basis of <M>{tex`\mathrm{im}(A)`}</M>.
            </p>
            <p>
              <em>Spanning.</em> Any{" "}
              <M>{tex`A \mathbf{x} \in \mathrm{im}(A)`}</M> with{" "}
              <M>{tex`\mathbf{x} = \sum a_i \mathbf{u}_i + \sum b_j \mathbf{w}_j`}</M>{" "}
              satisfies{" "}
              <M>{tex`A\mathbf{x} = \sum b_j A\mathbf{w}_j`}</M> since{" "}
              <M>{tex`A \mathbf{u}_{i} = \mathbf{0}`}</M>.
            </p>
            <p>
              <em>Independence.</em> Suppose{" "}
              <M>{tex`\sum c_j A\mathbf{w}_j = \mathbf{0}`}</M>. Then{" "}
              <M>{tex`A\bigl(\sum c_j \mathbf{w}_j\bigr) = \mathbf{0}`}</M>,
              so{" "}
              <M>{tex`\sum c_j \mathbf{w}_j \in \ker(A)`}</M>. Express
              that as a combination of the{" "}
              <M>{tex`\mathbf{u}_i`}</M> — but the{" "}
              <M>{tex`\mathbf{u}_i, \mathbf{w}_j`}</M> are independent
              by construction, so all the <M>{tex`c_j`}</M> must be
              zero.
            </p>
            <p>
              Hence{" "}
              <M>{tex`r = \dim \mathrm{im}(A) = k = n - \nu`}</M>.
            </p>
            <p>
              <strong>(b)</strong>{" "}
              <M>{tex`W_{V} : \mathbb{R}^{d} \to \mathbb{R}^{d_{\text{head}}}`}</M>{" "}
              has rank at most{" "}
              <M>{tex`d_{\text{head}}`}</M>, so{" "}
              <M>{tex`W_{O} W_{V}`}</M> does too. By (a), its kernel
              has dimension at least{" "}
              <M>{tex`d - d_{\text{head}}`}</M>. Concretely: there is a
              subspace of the residual stream of dimension at least{" "}
              <M>{tex`d - d_{\text{head}}`}</M> that the head{" "}
              <em>cannot read</em> — it&apos;s blind to that subspace.
              That blindness is the precise content of &ldquo;low-rank
              attention&rdquo;.
            </p>
            <p>
              <strong>(c)</strong> The block matrix
            </p>
            <Block>{tex`A = \begin{bmatrix} I_{r} & 0 \\ 0 & 0 \end{bmatrix} \in \mathbb{R}^{m \times n}`}</Block>
            <p>
              has rank exactly <M>r</M>. Its kernel is{" "}
              <M>{tex`\{0\}^{r} \times \mathbb{R}^{n-r}`}</M> with
              dimension{" "}
              <M>{tex`n - r`}</M>. So{" "}
              <M>{tex`r + (n - r) = n`}</M> ✓.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
