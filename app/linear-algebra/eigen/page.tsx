import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
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
        vector <M>{tex`\mathbf{v}`}</M> that <M>M</M> only stretches:
      </p>
      <Block>{tex`M \mathbf{v} = \lambda \mathbf{v}.`}</Block>
      <p>
        The scalar <M>λ</M> is the corresponding <strong>eigenvalue</strong>.
        It says <em>by how much</em> the eigenvector gets stretched. Negative
        eigenvalues flip; <M>{tex`|\lambda| > 1`}</M> stretches; <M>{tex`|\lambda| < 1`}</M>{" "}
        shrinks; <M>{tex`\lambda = 0`}</M> means the eigenvector lives in the
        null space.
      </p>

      <h2>Finding them</h2>
      <p>
        Rearranging:
      </p>
      <Block>{tex`(M - \lambda I)\mathbf{v} = \mathbf{0}.`}</Block>
      <p>
        For a nonzero <M>{tex`\mathbf{v}`}</M> to satisfy this,{" "}
        <M>{tex`M - \lambda I`}</M> must be singular — its determinant must be
        zero. That gives the <strong>characteristic equation</strong>:
      </p>
      <Block>{tex`\det(M - \lambda I) = 0.`}</Block>
      <p>
        For a 2×2 matrix this becomes a quadratic in <M>λ</M>, with roots:
      </p>
      <Block>{tex`\lambda = \frac{\text{tr}(M) \pm \sqrt{\text{tr}(M)^2 - 4 \det(M)}}{2}.`}</Block>

      <h2>See it move</h2>
      <p>
        In the widget below, the dashed pink lines are the eigen-directions.
        Drag the blue vector <M>{tex`\mathbf{v}`}</M> off the line and{" "}
        <M>{tex`M\mathbf{v}`}</M> swings to a new direction. Drag it{" "}
        <em>onto</em> the dashed line and <M>{tex`M\mathbf{v}`}</M> stays
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
            For <M>{tex`M = \begin{pmatrix} 3 & 0 \\ 0 & -1 \end{pmatrix}`}</M>, what
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

      <Challenge
        prompt={
          <>
            <p>
              <strong>The spectral theorem (and a defective
              counter-example).</strong>
            </p>
            <p>
              <strong>(a) Spectral theorem.</strong> Let <M>A</M> be a
              real <M>{tex`n \times n`}</M> <em>symmetric</em> matrix
              (<M>{tex`A^{\top} = A`}</M>). Show that:
            </p>
            <ol>
              <li>Every eigenvalue of <M>A</M> is real.</li>
              <li>
                Eigenvectors corresponding to <em>distinct</em>{" "}
                eigenvalues are orthogonal.
              </li>
            </ol>
            <p>
              (You need only handle real, symmetric{" "}
              <M>{tex`2 \times 2`}</M> for the algebra to be clean —
              the same argument generalises.)
            </p>
            <p>
              <strong>(b) A defective matrix.</strong> Consider
            </p>
            <Block>{tex`J = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}.`}</Block>
            <p>
              Find all real eigenvalues and all eigenvectors. Show that{" "}
              <M>J</M> has only{" "}
              <em>one</em> linearly independent eigenvector even though
              its characteristic polynomial has 2 as a double root.
              Conclude that <M>J</M> is{" "}
              <strong>not</strong> diagonalisable.
            </p>
            <p>
              <strong>(c)</strong> Combine: explain in one or two
              sentences why activation-covariance matrices
              (<M>{tex`X^{\top} X`}</M> for an activation matrix{" "}
              <M>X</M>), which are symmetric, can <em>always</em> be
              diagonalised — and why this is the algebraic
              justification for &ldquo;principal component
              analysis&rdquo; on residual streams.
            </p>
          </>
        }
        hint={
          <>
            For (a)-(2), let{" "}
            <M>{tex`A \mathbf{v} = \lambda \mathbf{v}`}</M> and{" "}
            <M>{tex`A \mathbf{w} = \mu \mathbf{w}`}</M> with{" "}
            <M>{tex`\lambda \neq \mu`}</M>. Compute{" "}
            <M>{tex`\mathbf{w}^{\top} A \mathbf{v}`}</M> two ways. For
            (b), set up{" "}
            <M>{tex`(J - \lambda I)\mathbf{v} = \mathbf{0}`}</M> and
            actually solve it.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a) Reality of eigenvalues.</strong> Suppose{" "}
              <M>{tex`A \mathbf{v} = \lambda \mathbf{v}`}</M> over{" "}
              <M>{tex`\mathbb{C}`}</M> with{" "}
              <M>{tex`\mathbf{v} \neq \mathbf{0}`}</M>. Take the
              conjugate-transpose:{" "}
              <M>{tex`\mathbf{v}^{*} A^{\top} = \bar\lambda \mathbf{v}^{*}`}</M>.
              Since <M>{tex`A^{\top} = A`}</M> with real entries,
            </p>
            <Block>{tex`\mathbf{v}^{*} A \mathbf{v} = \lambda\, \mathbf{v}^{*} \mathbf{v} \quad \text{and} \quad \mathbf{v}^{*} A \mathbf{v} = \overline{\lambda}\, \mathbf{v}^{*} \mathbf{v}.`}</Block>
            <p>
              <M>{tex`\mathbf{v}^{*} \mathbf{v} > 0`}</M>, so{" "}
              <M>{tex`\lambda = \overline{\lambda}`}</M>, i.e.{" "}
              <M>{tex`\lambda \in \mathbb{R}`}</M>.
            </p>
            <p>
              <strong>Orthogonality for distinct eigenvalues.</strong>{" "}
              Let{" "}
              <M>{tex`A \mathbf{v} = \lambda \mathbf{v}`}</M>,{" "}
              <M>{tex`A \mathbf{w} = \mu \mathbf{w}`}</M> with{" "}
              <M>{tex`\lambda \neq \mu`}</M>. Compute{" "}
              <M>{tex`\mathbf{w}^{\top} A \mathbf{v}`}</M> two ways:
            </p>
            <Block>{tex`\mathbf{w}^{\top} A \mathbf{v} = \mathbf{w}^{\top}(\lambda \mathbf{v}) = \lambda\, \mathbf{w}^{\top} \mathbf{v}.`}</Block>
            <Block>{tex`\mathbf{w}^{\top} A \mathbf{v} = (A^{\top} \mathbf{w})^{\top} \mathbf{v} = (A \mathbf{w})^{\top} \mathbf{v} = \mu\, \mathbf{w}^{\top} \mathbf{v}.`}</Block>
            <p>
              Subtracting:{" "}
              <M>{tex`(\lambda - \mu)\, \mathbf{w}^{\top} \mathbf{v} = 0`}</M>.
              Since{" "}
              <M>{tex`\lambda \neq \mu`}</M>,{" "}
              <M>{tex`\mathbf{w}^{\top} \mathbf{v} = 0`}</M> —
              orthogonal.
            </p>
            <p>
              <strong>(b)</strong> The characteristic polynomial of{" "}
              <M>J</M> is{" "}
              <M>{tex`\det(J - \lambda I) = (2 - \lambda)^{2}`}</M>, so{" "}
              <M>{tex`\lambda = 2`}</M> with algebraic multiplicity 2.
              Find eigenvectors:
            </p>
            <Block>{tex`(J - 2 I)\mathbf{v} = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} v_{1} \\ v_{2} \end{bmatrix} = \begin{bmatrix} v_{2} \\ 0 \end{bmatrix} = \mathbf{0} \;\Longrightarrow\; v_{2} = 0.`}</Block>
            <p>
              The eigenspace is 1-dimensional, spanned by{" "}
              <M>{tex`(1, 0)`}</M>. So <M>J</M> has algebraic
              multiplicity 2 but geometric multiplicity 1 — it&apos;s{" "}
              <em>defective</em>. There is no basis of{" "}
              <M>{tex`\mathbb{R}^{2}`}</M> made of <M>J</M>&apos;s
              eigenvectors, hence no diagonal{" "}
              <M>{tex`P^{-1} J P`}</M>.
            </p>
            <p>
              <strong>(c)</strong>{" "}
              <M>{tex`X^{\top} X`}</M> is symmetric and positive
              semi-definite. By (a), its eigenvalues are real (and{" "}
              <M>{tex`\geq 0`}</M>) and the eigenvectors corresponding
              to distinct eigenvalues are orthogonal. With a small
              extra argument (eigenvectors within a single eigenspace
              can be chosen orthogonal by Gram–Schmidt), we get an
              orthonormal eigenbasis of all of{" "}
              <M>{tex`\mathbb{R}^{n}`}</M>. PCA on activations{" "}
              <em>is</em> diagonalising <M>{tex`X^{\top} X`}</M>: the
              eigenvectors are the principal directions, the
              eigenvalues are the variances along them. Activations are
              never &ldquo;defective&rdquo; in this sense — the
              symmetry guarantees the decomposition exists.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
