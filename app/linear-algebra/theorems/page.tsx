import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Theorem } from "@/components/content/Theorem";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { CauchySchwarzDemo } from "@/components/viz/CauchySchwarzDemo";
import { RankNullityDemo } from "@/components/viz/RankNullityDemo";
import { DetProductDemo } from "@/components/viz/DetProductDemo";
import { TraceCyclicDemo } from "@/components/viz/TraceCyclicDemo";
import { SpectralSymmetricDemo } from "@/components/viz/SpectralSymmetricDemo";
import { EckartYoungDemo } from "@/components/viz/EckartYoungDemo";

export const metadata = {
  title: "Theorems & proofs",
};

export default function TheoremsPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="theorems"
      eyebrow="Reference"
      title="Theorems & proofs"
      lede="A curated atlas of the linear algebra results everything else leans on. Each one comes with a one-line statement, an intuition, an interactive demo where it helps, and a toggleable proof you can read when you want to see the gears."
    >
      <p>
        Read these in any order. The interactive demos let you{" "}
        <em>poke at</em> a theorem until it stops looking like a sentence and
        starts looking like a fact about pictures. The proofs are written
        terse-but-complete, in the style you&apos;ll see in graduate notes.
        Toggle them on when you want a proof; keep them off when you just
        want to use the result.
      </p>

      <h2>Norms and inner products</h2>

      <Theorem
        number="1"
        title="Cauchy–Schwarz inequality"
        statement={
          <>
            <p>
              For any vectors <M>{tex`\mathbf{v}, \mathbf{w} \in \mathbb{R}^n`}</M>:
            </p>
            <Block>{tex`|\langle \mathbf{v}, \mathbf{w}\rangle| \le \|\mathbf{v}\|\,\|\mathbf{w}\|,`}</Block>
            <p>
              with equality if and only if <M>{tex`\mathbf{v}`}</M> and{" "}
              <M>{tex`\mathbf{w}`}</M> are linearly dependent.
            </p>
          </>
        }
        intuition={
          <>
            The dot product can never exceed the product of lengths, because{" "}
            <M>{tex`\cos\theta`}</M> can never exceed 1. Equality happens
            exactly when the angle between the vectors is 0 or π.
          </>
        }
        proof={
          <>
            <p>
              If <M>{tex`\mathbf{w} = \mathbf{0}`}</M> both sides are zero;
              suppose <M>{tex`\mathbf{w} \ne \mathbf{0}`}</M>. For every{" "}
              <M>{tex`t \in \mathbb{R}`}</M>:
            </p>
            <Block>{tex`0 \le \|\mathbf{v} - t\mathbf{w}\|^2 = \|\mathbf{v}\|^2 - 2t\langle \mathbf{v}, \mathbf{w}\rangle + t^2\|\mathbf{w}\|^2.`}</Block>
            <p>
              This is a non-negative quadratic in <M>t</M>, so its
              discriminant is <M>{tex`\le 0`}</M>:
            </p>
            <Block>{tex`4\langle \mathbf{v}, \mathbf{w}\rangle^2 - 4\|\mathbf{v}\|^2 \|\mathbf{w}\|^2 \le 0.`}</Block>
            <p>
              Dividing by 4 and taking square roots gives the inequality.
              Equality forces the discriminant to be zero, i.e. there is some{" "}
              <M>{tex`t^\star`}</M> with{" "}
              <M>{tex`\mathbf{v} = t^\star \mathbf{w}`}</M> — linear dependence.
            </p>
          </>
        }
      >
        <Figure caption="Drag v and w. The bar fills as |v·w| approaches ‖v‖‖w‖; equality only when the two vectors line up.">
          <CauchySchwarzDemo />
        </Figure>
      </Theorem>

      <Theorem
        number="2"
        title="Triangle inequality"
        statement={
          <>
            <p>
              For any vectors <M>{tex`\mathbf{v}, \mathbf{w} \in \mathbb{R}^n`}</M>:
            </p>
            <Block>{tex`\|\mathbf{v} + \mathbf{w}\| \le \|\mathbf{v}\| + \|\mathbf{w}\|.`}</Block>
          </>
        }
        intuition={
          <>
            The shortest path between two points is a straight line. Adding
            two arrows tip-to-tail never beats laying them out in a line.
          </>
        }
        proof={
          <>
            <p>Square both sides; it suffices to show:</p>
            <Block>{tex`\|\mathbf{v} + \mathbf{w}\|^2 \le (\|\mathbf{v}\| + \|\mathbf{w}\|)^2.`}</Block>
            <p>Expanding both sides:</p>
            <Block>{tex`\|\mathbf{v}\|^2 + 2\langle \mathbf{v}, \mathbf{w}\rangle + \|\mathbf{w}\|^2 \le \|\mathbf{v}\|^2 + 2\|\mathbf{v}\|\|\mathbf{w}\| + \|\mathbf{w}\|^2.`}</Block>
            <p>
              This reduces to{" "}
              <M>{tex`\langle \mathbf{v}, \mathbf{w}\rangle \le \|\mathbf{v}\|\|\mathbf{w}\|`}</M>,
              which is Cauchy–Schwarz (Theorem 1).
            </p>
          </>
        }
      />

      <Theorem
        number="3"
        variant="identity"
        title="Pythagorean theorem (inner-product form)"
        statement={
          <>
            <p>
              If <M>{tex`\langle \mathbf{v}, \mathbf{w}\rangle = 0`}</M>:
            </p>
            <Block>{tex`\|\mathbf{v} + \mathbf{w}\|^2 = \|\mathbf{v}\|^2 + \|\mathbf{w}\|^2.`}</Block>
          </>
        }
        intuition={
          <>
            Old Pythagoras, restated in arbitrary dimension. Orthogonal
            components add in squared length, not in length.
          </>
        }
        proof={
          <>
            <p>Expand:</p>
            <Block>{tex`\|\mathbf{v}+\mathbf{w}\|^2 = \langle \mathbf{v}+\mathbf{w}, \mathbf{v}+\mathbf{w}\rangle = \|\mathbf{v}\|^2 + 2\langle \mathbf{v}, \mathbf{w}\rangle + \|\mathbf{w}\|^2.`}</Block>
            <p>
              The middle term vanishes by orthogonality.
            </p>
          </>
        }
      />

      <h2>Dimension, rank, and the structure of linear maps</h2>

      <Theorem
        number="4"
        title="Rank–nullity theorem"
        statement={
          <>
            <p>
              For any linear map <M>{tex`T : V \to W`}</M> with finite-dimensional
              domain:
            </p>
            <Block>{tex`\dim \ker T + \dim \operatorname{im} T = \dim V.`}</Block>
            <p>
              Equivalently, for an <M>{tex`m \times n`}</M> matrix{" "}
              <M>A</M>:{" "}
              <M>{tex`\operatorname{rank}(A) + \operatorname{nullity}(A) = n`}</M>.
            </p>
          </>
        }
        intuition={
          <>
            Every input dimension is accounted for: it either survives as an
            output direction (rank) or it gets crushed to zero (nullity).
          </>
        }
        proof={
          <>
            <p>
              Let <M>{tex`\{\mathbf{u}_1, \dots, \mathbf{u}_k\}`}</M> be a
              basis for <M>{tex`\ker T`}</M>. Extend to a basis{" "}
              <M>{tex`\{\mathbf{u}_1, \dots, \mathbf{u}_k, \mathbf{x}_1, \dots, \mathbf{x}_r\}`}</M>{" "}
              of <M>V</M>, so <M>{tex`k + r = \dim V`}</M>.
            </p>
            <p>
              We claim <M>{tex`\{T(\mathbf{x}_1), \dots, T(\mathbf{x}_r)\}`}</M>{" "}
              is a basis for <M>{tex`\operatorname{im} T`}</M>.
            </p>
            <p>
              <em>Spanning.</em> Any <M>{tex`T(\mathbf{v})`}</M> can be written
              by expressing <M>{tex`\mathbf{v}`}</M> in the chosen basis. The{" "}
              <M>{tex`\mathbf{u}_i`}</M> terms vanish under <M>T</M>, leaving a
              combination of the <M>{tex`T(\mathbf{x}_j)`}</M>.
            </p>
            <p>
              <em>Independence.</em> Suppose{" "}
              <M>{tex`\sum c_j T(\mathbf{x}_j) = 0`}</M>, i.e.{" "}
              <M>{tex`T(\sum c_j \mathbf{x}_j) = 0`}</M>. Then{" "}
              <M>{tex`\sum c_j \mathbf{x}_j \in \ker T`}</M>, so it&apos;s a
              combination of the <M>{tex`\mathbf{u}_i`}</M>. Subtracting and
              using independence of the full basis forces all{" "}
              <M>{tex`c_j = 0`}</M>.
            </p>
            <p>
              Hence <M>{tex`\dim \operatorname{im} T = r`}</M>, and{" "}
              <M>{tex`\dim \ker T + \dim \operatorname{im} T = k + r = \dim V`}</M>.
            </p>
          </>
        }
      >
        <Figure caption="Slide M's entries until the columns become parallel. det → 0, rank drops to 1, a 1D kernel line appears (dashed), and rank + nullity stays equal to 2.">
          <RankNullityDemo />
        </Figure>
      </Theorem>

      <Theorem
        number="5"
        title="The Invertible Matrix Theorem"
        statement={
          <>
            <p>
              For a square <M>{tex`n \times n`}</M> matrix <M>A</M>, the
              following are equivalent:
            </p>
            <ol className="!my-2 !pl-6 text-[0.9rem]">
              <li><M>A</M> is invertible.</li>
              <li><M>{tex`\det(A) \ne 0`}</M>.</li>
              <li><M>{tex`\operatorname{rank}(A) = n`}</M>.</li>
              <li><M>{tex`\ker A = \{\mathbf{0}\}`}</M>.</li>
              <li>The columns of <M>A</M> are linearly independent.</li>
              <li>The columns of <M>A</M> span <M>{tex`\mathbb{R}^n`}</M>.</li>
              <li><M>{tex`A\mathbf{x} = \mathbf{b}`}</M> has a unique solution for every <M>{tex`\mathbf{b}`}</M>.</li>
              <li>0 is not an eigenvalue of <M>A</M>.</li>
            </ol>
          </>
        }
        intuition={
          <>
            One concept, eight wardrobes. Pick whichever phrasing makes the
            current problem easiest — they describe the same matrix.
          </>
        }
        proof={
          <>
            <p>
              The equivalences fall out of three earlier results: rank–nullity
              (Theorem 4), the determinant area formula (which makes{" "}
              <M>{tex`\det(A) = 0`}</M> equivalent to a collapsed column
              parallelepiped, i.e. rank <M>{tex`< n`}</M>), and the definition
              of eigenvalue.
            </p>
            <p>
              Concretely: (1) <M>{tex`\Rightarrow`}</M> (7) is direct (apply{" "}
              <M>{tex`A^{-1}`}</M>); (7) <M>{tex`\Rightarrow`}</M> (4) because
              a unique solution to <M>{tex`A\mathbf{x} = \mathbf{0}`}</M> is{" "}
              <M>{tex`\mathbf{x} = \mathbf{0}`}</M>; (4){" "}
              <M>{tex`\Leftrightarrow`}</M> (3) by rank–nullity; (3){" "}
              <M>{tex`\Leftrightarrow`}</M> (5){" "}
              <M>{tex`\Leftrightarrow`}</M> (6) because rank is the column-span
              dimension; (3) <M>{tex`\Leftrightarrow`}</M> (2) because{" "}
              <M>{tex`\det = 0`}</M> means a collapsed column system; (8){" "}
              <M>{tex`\Leftrightarrow`}</M> (4) since 0 being an eigenvalue
              means some nonzero <M>{tex`\mathbf{v}`}</M> has{" "}
              <M>{tex`A\mathbf{v} = 0`}</M>; and (3){" "}
              <M>{tex`\Rightarrow`}</M> (1) constructs the inverse via row
              reduction (Gauss–Jordan).
            </p>
          </>
        }
      />

      <h2>Determinants and traces</h2>

      <Theorem
        number="6"
        title="Multiplicativity of the determinant"
        statement={
          <Block>{tex`\det(AB) = \det(A)\,\det(B) \quad \text{for any square } A, B.`}</Block>
        }
        intuition={
          <>
            Determinants measure volume scaling. Composing two
            transformations multiplies their scaling factors — exactly what
            volumes do.
          </>
        }
        proof={
          <>
            <p>
              Treat <M>{tex`A \mapsto \det(AB)`}</M> as a function of the
              columns of <M>A</M> (with <M>B</M> fixed). It is multilinear and
              alternating in those columns — both properties follow because{" "}
              <M>{tex`\det`}</M> is, and matrix multiplication is linear in
              each column.
            </p>
            <p>
              The unique alternating multilinear function on the columns of an{" "}
              <M>{tex`n \times n`}</M> matrix that sends <M>I</M> to{" "}
              <M>{tex`\det(B)`}</M> is{" "}
              <M>{tex`A \mapsto \det(A)\det(B)`}</M> (up to that
              normalisation), and substituting <M>{tex`A = I`}</M> in{" "}
              <M>{tex`\det(AB)`}</M> gives <M>{tex`\det(B)`}</M>. By
              uniqueness, the two functions agree everywhere.
            </p>
            <p>
              A more hands-on argument: write <M>A</M> as a product of
              elementary matrices and check the identity for each elementary
              type. Then chain.
            </p>
          </>
        }
      >
        <Figure caption="Grey = unit square. Blue = image under B. Orange = image under AB. The orange area equals |det A · det B|, no matter what.">
          <DetProductDemo />
        </Figure>
      </Theorem>

      <Theorem
        number="7"
        variant="identity"
        title="Cyclic property of the trace"
        statement={
          <>
            <Block>{tex`\operatorname{tr}(AB) = \operatorname{tr}(BA),`}</Block>
            <p>
              and more generally{" "}
              <M>{tex`\operatorname{tr}(A_1 A_2 \cdots A_k) = \operatorname{tr}(A_2 \cdots A_k A_1)`}</M>.
            </p>
          </>
        }
        intuition={
          <>
            Trace doesn&apos;t care about order in the same way determinant
            doesn&apos;t care about basis. Consequence: trace is invariant
            under similarity, <M>{tex`\operatorname{tr}(P^{-1} A P) = \operatorname{tr}(A)`}</M>.
          </>
        }
        proof={
          <>
            <p>Compute both sides directly. With Einstein summation:</p>
            <Block>{tex`\operatorname{tr}(AB) = \sum_i (AB)_{ii} = \sum_i \sum_j A_{ij} B_{ji} = \sum_j \sum_i B_{ji} A_{ij} = \sum_j (BA)_{jj} = \operatorname{tr}(BA).`}</Block>
            <p>
              The cyclic version follows by iterating: group{" "}
              <M>{tex`(A_1)(A_2 \cdots A_k)`}</M> as two matrices and apply.
            </p>
          </>
        }
      >
        <div className="my-2">
          <TraceCyclicDemo />
        </div>
      </Theorem>

      <Theorem
        number="8"
        variant="identity"
        title="Sylvester's determinant identity"
        statement={
          <>
            <p>
              For <M>{tex`A \in \mathbb{R}^{m\times n}`}</M> and{" "}
              <M>{tex`B \in \mathbb{R}^{n\times m}`}</M>:
            </p>
            <Block>{tex`\det(I_m + AB) = \det(I_n + BA).`}</Block>
          </>
        }
        intuition={
          <>
            The non-zero eigenvalues of <M>{tex`AB`}</M> and <M>{tex`BA`}</M>{" "}
            match — even though the matrices are different sizes. It&apos;s
            the same reason a tall-skinny product and its short-fat partner
            have the same nonzero singular values.
          </>
        }
        proof={
          <>
            <p>
              Consider the block matrix identity (a direct multiplication):
            </p>
            <Block>{tex`\begin{pmatrix} I_m & -A \\ 0 & I_n \end{pmatrix}\begin{pmatrix} I_m & A \\ B & I_n \end{pmatrix} = \begin{pmatrix} I_m - AB & 0 \\ B & I_n \end{pmatrix},`}</Block>
            <Block>{tex`\begin{pmatrix} I_m & A \\ B & I_n \end{pmatrix}\begin{pmatrix} I_m & 0 \\ -B & I_n \end{pmatrix} = \begin{pmatrix} I_m & A \\ 0 & I_n - BA \end{pmatrix}.`}</Block>
            <p>
              Taking determinants (the outer factors have determinant 1) on
              both decompositions gives{" "}
              <M>{tex`\det(I_m - AB) = \det(I_n - BA)`}</M>. Replace{" "}
              <M>A</M> with <M>{tex`-A`}</M> to get the form stated.
            </p>
          </>
        }
      />

      <h2>Spectra</h2>

      <Theorem
        number="9"
        title="Cayley–Hamilton theorem"
        statement={
          <>
            <p>
              Every square matrix <M>A</M> satisfies its own characteristic
              polynomial. If{" "}
              <M>{tex`p(\lambda) = \det(\lambda I - A) = \lambda^n + c_{n-1}\lambda^{n-1} + \cdots + c_0`}</M>,
              then:
            </p>
            <Block>{tex`p(A) = A^n + c_{n-1} A^{n-1} + \cdots + c_0 I = 0.`}</Block>
          </>
        }
        intuition={
          <>
            Once you know <M>A</M>&apos;s eigenvalues, you know enough to kill
            it with a polynomial. Higher powers of <M>A</M> can always be
            re-expressed in terms of <M>{tex`I, A, \dots, A^{n-1}`}</M>.
          </>
        }
        proof={
          <>
            <p>
              <em>Diagonalizable case.</em> Suppose{" "}
              <M>{tex`A = P D P^{-1}`}</M> with{" "}
              <M>{tex`D = \operatorname{diag}(\lambda_1, \dots, \lambda_n)`}</M>.
              Then{" "}
              <M>{tex`p(A) = P\, p(D)\, P^{-1}`}</M> and{" "}
              <M>{tex`p(D) = \operatorname{diag}(p(\lambda_1), \dots, p(\lambda_n)) = 0`}</M>{" "}
              because each <M>{tex`\lambda_i`}</M> is a root of{" "}
              <M>p</M>.
            </p>
            <p>
              <em>General case (real or complex).</em> Diagonalizable matrices
              are dense in <M>{tex`\mathbb{C}^{n \times n}`}</M>: every matrix
              is a limit of matrices with distinct eigenvalues. The map{" "}
              <M>{tex`A \mapsto p_A(A)`}</M> is continuous (it is a polynomial
              in entries of <M>A</M>) and vanishes on a dense set, so it
              vanishes everywhere.
            </p>
            <p>
              An elementary proof uses the adjugate identity{" "}
              <M>{tex`(\lambda I - A)\operatorname{adj}(\lambda I - A) = p(\lambda) I`}</M>,
              treating both sides as polynomials in <M>{tex`\lambda`}</M> with
              matrix coefficients, then formally substituting{" "}
              <M>{tex`\lambda = A`}</M>. See any standard text for the
              bookkeeping.
            </p>
          </>
        }
      />

      <Theorem
        number="10"
        title="Spectral theorem (real symmetric case)"
        statement={
          <>
            <p>
              Every real symmetric matrix{" "}
              <M>{tex`A = A^\top \in \mathbb{R}^{n\times n}`}</M> can be
              written:
            </p>
            <Block>{tex`A = Q \Lambda Q^\top,`}</Block>
            <p>
              where <M>Q</M> is orthogonal and{" "}
              <M>{tex`\Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_n)`}</M>{" "}
              is real. Eigenvalues are real and eigenvectors corresponding to
              distinct eigenvalues are orthogonal.
            </p>
          </>
        }
        intuition={
          <>
            A symmetric matrix is just a list of independent stretches along
            perpendicular axes. The skeleton from the Eigen chapter is even
            simpler when the matrix is symmetric: the eigenvectors are an
            orthonormal basis.
          </>
        }
        proof={
          <>
            <p>
              <em>Eigenvalues are real.</em> Let <M>{tex`\lambda \in \mathbb{C}`}</M>{" "}
              with eigenvector <M>{tex`\mathbf{v}`}</M>, so{" "}
              <M>{tex`A\mathbf{v} = \lambda \mathbf{v}`}</M>. Taking conjugate
              transpose:
              <Block>{tex`\overline{\mathbf{v}}^\top A^\top = \overline{\lambda}\, \overline{\mathbf{v}}^\top.`}</Block>
              Using <M>{tex`A^\top = A`}</M> and multiplying by{" "}
              <M>{tex`\mathbf{v}`}</M> on the right:{" "}
              <M>{tex`\lambda \overline{\mathbf{v}}^\top \mathbf{v} = \overline{\lambda}\, \overline{\mathbf{v}}^\top \mathbf{v}`}</M>.
              Since <M>{tex`\overline{\mathbf{v}}^\top \mathbf{v} > 0`}</M>,
              this forces <M>{tex`\lambda = \overline{\lambda}`}</M>, i.e.{" "}
              <M>{tex`\lambda \in \mathbb{R}`}</M>.
            </p>
            <p>
              <em>Eigenvectors of distinct eigenvalues are orthogonal.</em>{" "}
              If <M>{tex`A\mathbf{v}_1 = \lambda_1 \mathbf{v}_1`}</M> and{" "}
              <M>{tex`A\mathbf{v}_2 = \lambda_2 \mathbf{v}_2`}</M> with{" "}
              <M>{tex`\lambda_1 \ne \lambda_2`}</M>:
              <Block>{tex`\lambda_1 \langle \mathbf{v}_1, \mathbf{v}_2\rangle = \langle A\mathbf{v}_1, \mathbf{v}_2\rangle = \langle \mathbf{v}_1, A\mathbf{v}_2\rangle = \lambda_2 \langle \mathbf{v}_1, \mathbf{v}_2\rangle.`}</Block>
              Subtracting, <M>{tex`(\lambda_1 - \lambda_2)\langle \mathbf{v}_1, \mathbf{v}_2\rangle = 0`}</M>,
              so <M>{tex`\langle \mathbf{v}_1, \mathbf{v}_2\rangle = 0`}</M>.
            </p>
            <p>
              <em>Existence of an orthonormal eigenbasis.</em> By induction on{" "}
              <M>n</M>. Take any unit eigenvector <M>{tex`\mathbf{v}_1`}</M>{" "}
              (exists because the characteristic polynomial has a real root by
              the previous step). Its orthogonal complement{" "}
              <M>{tex`V_1 = \mathbf{v}_1^\perp`}</M> is invariant under{" "}
              <M>A</M> (if <M>{tex`\mathbf{w} \perp \mathbf{v}_1`}</M> then{" "}
              <M>{tex`\langle A\mathbf{w}, \mathbf{v}_1\rangle = \langle \mathbf{w}, A\mathbf{v}_1\rangle = \lambda_1 \langle \mathbf{w}, \mathbf{v}_1\rangle = 0`}</M>).
              Apply the inductive hypothesis to <M>A</M> restricted to{" "}
              <M>{tex`V_1`}</M>.
            </p>
          </>
        }
      >
        <Figure caption="Move any slider; the dashed eigen-directions stay perpendicular and the eigenvalues stay real, no matter what symmetric M you pick.">
          <SpectralSymmetricDemo />
        </Figure>
      </Theorem>

      <h2>Decompositions and approximation</h2>

      <Theorem
        number="11"
        title="Existence of the SVD"
        statement={
          <>
            <p>
              For any real <M>{tex`A \in \mathbb{R}^{m\times n}`}</M>, there
              exist orthogonal <M>{tex`U \in \mathbb{R}^{m\times m}`}</M>,{" "}
              <M>{tex`V \in \mathbb{R}^{n\times n}`}</M>, and a diagonal{" "}
              <M>{tex`\Sigma \in \mathbb{R}^{m\times n}`}</M> with
              non-negative entries{" "}
              <M>{tex`\sigma_1 \ge \cdots \ge \sigma_r > 0 = \sigma_{r+1} = \cdots`}</M>{" "}
              such that:
            </p>
            <Block>{tex`A = U \Sigma V^\top.`}</Block>
          </>
        }
        intuition={
          <>
            Every linear map factors as <em>rotate, stretch each axis
            independently, rotate</em>. The stretches are the singular values;
            they encode everything about the geometry of <M>A</M>.
          </>
        }
        proof={
          <>
            <p>
              The Gram matrix <M>{tex`A^\top A`}</M> is symmetric and positive
              semidefinite, so by the spectral theorem (Theorem 10) it
              diagonalizes as{" "}
              <M>{tex`A^\top A = V \Lambda V^\top`}</M> with{" "}
              <M>{tex`\Lambda = \operatorname{diag}(\lambda_1, \dots, \lambda_n)`}</M>{" "}
              and <M>{tex`\lambda_i \ge 0`}</M>. Set{" "}
              <M>{tex`\sigma_i = \sqrt{\lambda_i}`}</M>.
            </p>
            <p>
              For each <M>i</M> with <M>{tex`\sigma_i > 0`}</M> define{" "}
              <M>{tex`\mathbf{u}_i = A\mathbf{v}_i / \sigma_i`}</M>. The{" "}
              <M>{tex`\mathbf{u}_i`}</M> are orthonormal:
              <Block>{tex`\langle \mathbf{u}_i, \mathbf{u}_j \rangle = \frac{1}{\sigma_i \sigma_j}\langle A\mathbf{v}_i, A\mathbf{v}_j\rangle = \frac{1}{\sigma_i \sigma_j}\langle \mathbf{v}_i, A^\top A \mathbf{v}_j\rangle = \frac{\lambda_j}{\sigma_i \sigma_j}\langle \mathbf{v}_i, \mathbf{v}_j\rangle = \delta_{ij}.`}</Block>
              Extend the <M>{tex`\mathbf{u}_i`}</M> to an orthonormal basis of{" "}
              <M>{tex`\mathbb{R}^m`}</M>; collect them as columns of <M>U</M>.
              By construction <M>{tex`A\mathbf{v}_i = \sigma_i \mathbf{u}_i`}</M>,
              i.e. <M>{tex`A V = U \Sigma`}</M>, hence{" "}
              <M>{tex`A = U \Sigma V^\top`}</M>.
            </p>
          </>
        }
      />

      <Theorem
        number="12"
        title="Eckart–Young–Mirsky theorem"
        statement={
          <>
            <p>
              Let <M>{tex`A = U \Sigma V^\top`}</M> with{" "}
              <M>{tex`\sigma_1 \ge \sigma_2 \ge \cdots \ge 0`}</M>. For any{" "}
              <M>{tex`k < \operatorname{rank}(A)`}</M>, the truncation:
            </p>
            <Block>{tex`A_k = \sum_{i=1}^{k} \sigma_i\, \mathbf{u}_i \mathbf{v}_i^\top`}</Block>
            <p>
              is the best rank-<M>k</M> approximation of <M>A</M> in{" "}
              <em>both</em> the Frobenius and spectral norms:
            </p>
            <Block>{tex`\min_{\operatorname{rank}(B) \le k} \|A - B\|_F = \|A - A_k\|_F = \sqrt{\sigma_{k+1}^2 + \cdots + \sigma_r^2}.`}</Block>
          </>
        }
        intuition={
          <>
            Spend your <M>k</M> dimensions on the loudest <M>k</M> directions
            and you can&apos;t do better. The reconstruction error you pay
            is exactly the energy left over in the small singular values.
          </>
        }
        proof={
          <>
            <p>
              <em>Frobenius case.</em> The Frobenius norm satisfies{" "}
              <M>{tex`\|A\|_F^2 = \sum_i \sigma_i^2`}</M> (sum of squared
              singular values), and the Frobenius norm is unitarily
              invariant. Any matrix <M>B</M> of rank{" "}
              <M>{tex`\le k`}</M> has its own SVD with at most <M>k</M> nonzero
              singular values. Rotate by <M>{tex`U^\top, V`}</M> on left and
              right; the problem becomes approximating{" "}
              <M>{tex`\Sigma`}</M> by a rank-<M>k</M> matrix, and the optimal
              such matrix in Frobenius norm is the one that keeps the top{" "}
              <M>k</M> entries — exactly <M>{tex`\Sigma_k`}</M>.
            </p>
            <p>
              <em>Spectral case.</em> Suppose{" "}
              <M>{tex`\|A - B\|_2 < \sigma_{k+1}`}</M> for some rank-<M>k</M>{" "}
              matrix <M>B</M>. The kernel of <M>B</M> has dimension at least{" "}
              <M>{tex`n - k`}</M>; the span of{" "}
              <M>{tex`\mathbf{v}_1, \dots, \mathbf{v}_{k+1}`}</M> has dimension{" "}
              <M>{tex`k+1`}</M>. These two subspaces of{" "}
              <M>{tex`\mathbb{R}^n`}</M> must intersect non-trivially (their
              dimensions sum to <M>{tex`> n`}</M>). Take a unit{" "}
              <M>{tex`\mathbf{w}`}</M> in the intersection: then{" "}
              <M>{tex`B\mathbf{w} = 0`}</M> and{" "}
              <M>{tex`\|A\mathbf{w}\| \ge \sigma_{k+1}`}</M>. But then{" "}
              <M>{tex`\|A - B\|_2 \ge \|(A-B)\mathbf{w}\| = \|A\mathbf{w}\| \ge \sigma_{k+1}`}</M>
              — a contradiction.
            </p>
          </>
        }
      >
        <Figure caption="Slide k between 0, 1, and 2. The pink parallelogram is the image of the unit square under the best rank-k approximation. The error you pay is exactly the leftover singular-value energy.">
          <EckartYoungDemo />
        </Figure>
      </Theorem>

      <Theorem
        number="13"
        title="Gram–Schmidt / QR factorization"
        statement={
          <>
            <p>
              Every matrix <M>{tex`A \in \mathbb{R}^{m\times n}`}</M> with
              linearly independent columns admits a factorization{" "}
              <M>{tex`A = QR`}</M>, where <M>{tex`Q \in \mathbb{R}^{m\times n}`}</M>{" "}
              has orthonormal columns and{" "}
              <M>{tex`R \in \mathbb{R}^{n\times n}`}</M> is upper triangular
              with positive diagonal. <M>Q</M> and <M>R</M> are unique under
              that sign convention.
            </p>
          </>
        }
        intuition={
          <>
            You can always rotate a list of independent vectors into an
            orthonormal basis &ldquo;by hand&rdquo; — subtract off the
            projections you&apos;ve already accounted for, normalize, repeat.
          </>
        }
        proof={
          <>
            <p>
              Let <M>{tex`\mathbf{a}_1, \dots, \mathbf{a}_n`}</M> be the
              columns of <M>A</M>. Recursively define:
            </p>
            <Block>{tex`\mathbf{u}_k = \mathbf{a}_k - \sum_{j=1}^{k-1} \langle \mathbf{a}_k, \mathbf{q}_j\rangle \mathbf{q}_j, \qquad \mathbf{q}_k = \frac{\mathbf{u}_k}{\|\mathbf{u}_k\|}.`}</Block>
            <p>
              By independence of the <M>{tex`\mathbf{a}_k`}</M>, each{" "}
              <M>{tex`\mathbf{u}_k \ne 0`}</M>. The resulting{" "}
              <M>{tex`\mathbf{q}_k`}</M> are orthonormal by construction.
              Rearranging the recursion expresses each <M>{tex`\mathbf{a}_k`}</M>{" "}
              as a combination of <M>{tex`\mathbf{q}_1, \dots, \mathbf{q}_k`}</M>{" "}
              with positive top coefficient — the columns of an upper
              triangular <M>R</M> with positive diagonal. Stacking gives{" "}
              <M>{tex`A = QR`}</M>. Uniqueness: any two such decompositions
              would yield <M>{tex`Q_1 Q_2^\top = R_1 R_2^{-1}`}</M>, an
              orthogonal upper-triangular matrix with positive diagonal, which
              must be the identity.
            </p>
          </>
        }
      />

      <Theorem
        number="14"
        variant="corollary"
        title="Polar decomposition"
        statement={
          <>
            <p>
              Every <M>{tex`A \in \mathbb{R}^{n\times n}`}</M> can be written:
            </p>
            <Block>{tex`A = U P,`}</Block>
            <p>
              where <M>U</M> is orthogonal and <M>P</M> is symmetric positive
              semidefinite. <M>P</M> is unique; <M>U</M> is unique when{" "}
              <M>A</M> is invertible.
            </p>
          </>
        }
        intuition={
          <>
            Any linear map is a stretch (in some orthonormal frame) followed
            by a rotation. SVD lets you read this off immediately.
          </>
        }
        proof={
          <>
            <p>
              Take an SVD <M>{tex`A = U_1 \Sigma V^\top`}</M> (Theorem 11).
              Set <M>{tex`U = U_1 V^\top`}</M> and{" "}
              <M>{tex`P = V \Sigma V^\top`}</M>. Then{" "}
              <M>{tex`UP = U_1 V^\top V \Sigma V^\top = U_1 \Sigma V^\top = A`}</M>.{" "}
              <M>U</M> is orthogonal (product of orthogonal matrices){" "}
              and <M>P</M> is symmetric positive semidefinite (it&apos;s{" "}
              <M>{tex`V \Sigma V^\top`}</M> with{" "}
              <M>{tex`\Sigma \succeq 0`}</M>).
            </p>
            <p>
              Uniqueness of <M>P</M>:{" "}
              <M>{tex`A^\top A = P U^\top U P = P^2`}</M>, and a positive
              semidefinite matrix has a unique positive semidefinite square
              root.
            </p>
          </>
        }
      />

      <Callout variant="mechinterp">
        <p>
          These results are the load-bearing facts you&apos;ll meet again the
          moment you start reading interpretability papers:
        </p>
        <ul className="!my-2 !pl-5 text-[0.9rem]">
          <li>
            <strong>Cauchy–Schwarz</strong> sits behind every cosine similarity
            you ever compute on residual stream activations.
          </li>
          <li>
            <strong>Rank–nullity</strong> tells you how much information a
            low-rank attention head can carry — and what gets crushed.
          </li>
          <li>
            <strong>Cyclic trace</strong> is why{" "}
            <M>{tex`\operatorname{tr}(W_O W_V x x^\top)`}</M> is well-defined
            no matter how you parenthesize, which matters for
            attribution patching.
          </li>
          <li>
            <strong>Spectral theorem</strong> underlies activation-covariance
            analyses and the entire PCA toolkit.
          </li>
          <li>
            <strong>SVD + Eckart–Young</strong> is the formal reason why
            you can summarize an attention head&apos;s OV circuit by its
            top singular directions.
          </li>
          <li>
            <strong>Polar decomposition</strong> shows up when papers split a
            weight matrix into a rotation and a stretch — useful for
            comparing learned weights across runs.
          </li>
        </ul>
      </Callout>

      <Callout variant="note">
        Theorems you might want next: the min-max characterisation of
        eigenvalues (Courant–Fischer), Weyl&apos;s inequalities for
        singular-value perturbations, the Sherman–Morrison formula, and
        the spectral theorem for normal matrices. Those live in your
        graduate textbook and in the references; come back here once
        you&apos;ve seen them.
      </Callout>
    </ChapterShell>
  );
}
