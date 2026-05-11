import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { EigenFinder } from "@/components/viz/EigenFinder";

export const metadata = {
  title: "Eigenvalues & eigenvectors",
};

export default function EigenPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="eigen"
      eyebrow="Chapter 10"
      title="Eigenvalues & eigenvectors"
      lede="Some directions are special: a transformation might bend most of space, but along these directions it just stretches. Find them and you've found the skeleton of the transformation."
    >
      <h2>The defining equation</h2>
      <p>
        An <strong>eigenvector</strong> of a matrix <M>M</M> is a nonzero
        vector <M>{`\\mathbf{v}`}</M> that <M>M</M> only stretches:
      </p>
      <Block>{`M \\mathbf{v} = \\lambda \\mathbf{v}.`}</Block>
      <p>
        The scalar <M>λ</M> is the corresponding <strong>eigenvalue</strong>.
        It says <em>by how much</em> the eigenvector gets stretched. Negative
        eigenvalues flip; <M>{`|\\lambda| > 1`}</M> stretches; <M>{`|\\lambda| < 1`}</M>{" "}
        shrinks; <M>{`\\lambda = 0`}</M> means the eigenvector lives in the
        null space.
      </p>

      <h2>Finding them</h2>
      <p>
        Rearranging:
      </p>
      <Block>{`(M - \\lambda I)\\mathbf{v} = \\mathbf{0}.`}</Block>
      <p>
        For a nonzero <M>{`\\mathbf{v}`}</M> to satisfy this,{" "}
        <M>{`M - \\lambda I`}</M> must be singular — its determinant must be
        zero. That gives the <strong>characteristic equation</strong>:
      </p>
      <Block>{`\\det(M - \\lambda I) = 0.`}</Block>
      <p>
        For a 2×2 matrix this becomes a quadratic in <M>λ</M>, with roots:
      </p>
      <Block>{`\\lambda = \\frac{\\text{tr}(M) \\pm \\sqrt{\\text{tr}(M)^2 - 4 \\det(M)}}{2}.`}</Block>

      <h2>See it move</h2>
      <p>
        In the widget below, the dashed pink lines are the eigen-directions.
        Drag the blue vector <M>{`\\mathbf{v}`}</M> off the line and{" "}
        <M>{`M\\mathbf{v}`}</M> swings to a new direction. Drag it{" "}
        <em>onto</em> the dashed line and <M>{`M\\mathbf{v}`}</M> stays
        parallel — only its length changes.
      </p>

      <Figure caption="Pink lines = eigen-directions. The colored ghost grid is the image of the plane under M. Some matrices have no real eigenvalues — that's a pure rotation.">
        <EigenFinder />
      </Figure>

      <Callout variant="intuition">
        Eigenvectors are a transformation&apos;s &ldquo;preferred&rdquo;
        directions. If you describe a vector in the eigenbasis, the matrix
        becomes a simple per-axis stretch — diagonal. That&apos;s why
        diagonalization is so loved.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Eigenanalysis comes up in interpretability whenever you want to
          understand what an iterated linear map <em>does</em>: power
          iteration on the OV circuit, the dominant directions of attention
          patterns, the principal axes of an activation covariance matrix.
        </p>
        <p>
          A close cousin — the <strong>singular value decomposition</strong>{" "}
          (next chapter) — is the workhorse for non-square matrices, which
          covers basically everything in a transformer.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            For <M>{`M = \\begin{pmatrix} 3 & 0 \\\\ 0 & -1 \\end{pmatrix}`}</M>, what
            are the eigenvalues and eigenvectors?
          </>
        }
        choices={[
          {
            id: "a",
            label: "λ = 3 with eigenvector e₁; λ = −1 with eigenvector e₂.",
            correct: true,
            explain:
              "Diagonal matrices reveal their eigenstuff for free: the diagonal entries are the eigenvalues, and the standard basis vectors are eigenvectors.",
          },
          {
            id: "b",
            label: "λ = 1 with eigenvector (1, 1).",
            explain:
              "Plug it in: M(1,1) = (3, −1), which is not a multiple of (1,1).",
          },
          {
            id: "c",
            label: "There are no real eigenvalues.",
            explain:
              "Real eigenvalues fail when the matrix rotates without an axis. Diagonal matrices always have real eigenvalues.",
          },
        ]}
      />
    </ChapterShell>
  );
}
