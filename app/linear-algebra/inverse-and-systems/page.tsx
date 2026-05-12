import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { LinearSystemSolver } from "@/components/viz/LinearSystemSolver";

export const metadata = {
  title: "Inverse & solving systems",
};

export default function InversePage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="inverse-and-systems"
      eyebrow="Chapter 07"
      title="Inverse & solving systems"
      lede="Solving Ax = b is asking 'what input did the transformation A receive to produce b?' The inverse of A is a transformation that undoes A — when one exists at all."
    >
      <h2>The inverse</h2>
      <p>
        The <strong>inverse</strong> of a square matrix <M>A</M>, written{" "}
        <M>{tex`A^{-1}`}</M>, is the unique matrix satisfying:
      </p>
      <Block>{tex`A^{-1} A = A A^{-1} = I.`}</Block>
      <p>
        Geometrically: if <M>A</M> is some bending of space, then{" "}
        <M>{tex`A^{-1}`}</M> bends it back. For 2×2:
      </p>
      <Block>{tex`A^{-1} = \frac{1}{\det A} \begin{bmatrix} d & -b \\ -c & a \end{bmatrix}.`}</Block>
      <p>
        That formula breaks the moment <M>{tex`\det A = 0`}</M>. There&apos;s a
        good reason: a matrix with zero determinant has crushed a dimension
        away, and you can&apos;t un-crush.
      </p>

      <h2>Solving a linear system</h2>
      <p>
        A system of two equations in two unknowns is just one matrix
        equation:
      </p>
      <Block>{tex`\begin{cases} a\,x + b\,y = c \\ d\,x + e\,y = f \end{cases} \quad \Longleftrightarrow \quad \begin{bmatrix} a & b \\ d & e \end{bmatrix} \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} c \\ f \end{bmatrix}.`}</Block>
      <p>
        Each equation is a line. The solution(s), if any, sit at the
        intersection. Three cases:
      </p>
      <ul>
        <li>
          <strong>Unique solution.</strong> The lines cross at one point.
          The matrix is invertible (<M>{tex`\det \ne 0`}</M>).
        </li>
        <li>
          <strong>No solution.</strong> Parallel lines. The matrix is
          singular and the right-hand side isn&apos;t in the image.
        </li>
        <li>
          <strong>Infinitely many solutions.</strong> The two equations
          describe the same line. The matrix is singular but the right-hand
          side <em>is</em> in the image.
        </li>
      </ul>

      <Figure caption="Two equations, two lines. Slide the coefficients and watch the intersection move, vanish (parallel), or melt into a whole line (coincident).">
        <LinearSystemSolver />
      </Figure>

      <Callout variant="intuition">
        Invertible = no information lost. Singular = at least one direction
        was thrown away. The whole linear-algebra distinction between
        &ldquo;nice&rdquo; and &ldquo;degenerate&rdquo; matrices comes back
        to that.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Most of a network&apos;s weight matrices are <em>not</em> square,
          and even when they are, you don&apos;t generally invert them.
          What matters is the same set of questions: which directions does a
          matrix preserve, and which does it destroy?
        </p>
        <p>
          When researchers fit a <strong>linear probe</strong> on top of an
          activation, they&apos;re solving exactly a linear system to find
          the direction that best predicts a label. When that system is
          ill-conditioned, the answer is unstable — a singular-matrix
          intuition translated to noisy data.
        </p>
      </Callout>

      <Quiz
        question="A 2×2 matrix has det = 0. Which of these is necessarily true?"
        choices={[
          {
            id: "a",
            label: "Ax = b has a solution for every b.",
            explain:
              "Singular matrices have a smaller image — most b's are unreachable.",
          },
          {
            id: "b",
            label: "There is some b for which Ax = b has no solution.",
            correct: true,
            explain:
              "Det 0 means the image is at most a line. Any b not on that line is unreachable.",
          },
          {
            id: "c",
            label: "A has an inverse.",
            explain: "Singular matrices have no inverse — that's the definition.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>The Sherman–Morrison formula: cheap inverses for
              rank-1 updates.</strong>
            </p>
            <p>
              Let <M>A</M> be an invertible{" "}
              <M>{tex`n \times n`}</M> matrix and let{" "}
              <M>{tex`\mathbf{u}, \mathbf{v} \in \mathbb{R}^{n}`}</M>.
              Define the rank-1 perturbation{" "}
              <M>{tex`A' = A + \mathbf{u} \mathbf{v}^{\top}`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Show that if{" "}
              <M>{tex`1 + \mathbf{v}^{\top} A^{-1} \mathbf{u} \neq 0`}</M>,
              then <M>{tex`A'`}</M> is invertible and
            </p>
            <Block>{tex`(A + \mathbf{u}\mathbf{v}^{\top})^{-1} = A^{-1} - \frac{A^{-1}\, \mathbf{u}\, \mathbf{v}^{\top}\, A^{-1}}{1 + \mathbf{v}^{\top} A^{-1} \mathbf{u}}.`}</Block>
            <p>
              <em>Proof technique.</em> Multiply the right-hand side by{" "}
              <M>{tex`A + \mathbf{u}\mathbf{v}^{\top}`}</M> and verify
              you get <M>I</M>.
            </p>
            <p>
              <strong>(b)</strong> Show that if{" "}
              <M>{tex`1 + \mathbf{v}^{\top} A^{-1} \mathbf{u} = 0`}</M>,
              then <M>{tex`A'`}</M> is <em>singular</em>. Find a
              non-zero vector in its kernel.
            </p>
            <p>
              <strong>(c)</strong> Suppose computing{" "}
              <M>{tex`A^{-1}`}</M> from scratch costs{" "}
              <M>{tex`O(n^{3})`}</M>. What is the cost of computing{" "}
              <M>{tex`(A')^{-1}`}</M> via Sherman–Morrison, given that
              you already have <M>{tex`A^{-1}`}</M>? Why does this
              matter for online learning, low-rank adapters (LoRA), and
              Kalman filters?
            </p>
          </>
        }
        hint={
          <>
            For (a), call the proposed right-hand side <M>X</M> and
            compute{" "}
            <M>{tex`(A + \mathbf{u}\mathbf{v}^{\top}) X`}</M>. Many
            terms collapse because{" "}
            <M>{tex`\mathbf{v}^{\top} A^{-1} \mathbf{u}`}</M> is just a
            scalar. For (b), look for a vector of the form{" "}
            <M>{tex`A^{-1} \mathbf{u}`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Let{" "}
              <M>{tex`s = 1 + \mathbf{v}^{\top} A^{-1} \mathbf{u}`}</M>
              {" "}(a scalar) and{" "}
              <M>{tex`X = A^{-1} - \tfrac{1}{s}\, A^{-1}\, \mathbf{u}\, \mathbf{v}^{\top}\, A^{-1}`}</M>.
              Compute:
            </p>
            <Block>{tex`(A + \mathbf{u}\mathbf{v}^{\top}) X = A X + \mathbf{u} \mathbf{v}^{\top} X.`}</Block>
            <p>
              The first piece is{" "}
              <M>{tex`A X = I - \tfrac{1}{s}\, \mathbf{u} \mathbf{v}^{\top} A^{-1}`}</M>.
              The second is{" "}
              <M>{tex`\mathbf{u}\mathbf{v}^{\top} A^{-1} - \tfrac{1}{s}\, \mathbf{u} (\mathbf{v}^{\top} A^{-1} \mathbf{u}) \mathbf{v}^{\top} A^{-1} = \mathbf{u} \mathbf{v}^{\top} A^{-1}\bigl(1 - \tfrac{s - 1}{s}\bigr) = \tfrac{1}{s}\, \mathbf{u} \mathbf{v}^{\top} A^{-1}`}</M>.
              Adding,{" "}
              <M>{tex`(A + \mathbf{u}\mathbf{v}^{\top}) X = I`}</M>.
              Symmetrically{" "}
              <M>{tex`X(A + \mathbf{u}\mathbf{v}^{\top}) = I`}</M>, so{" "}
              <M>{tex`X = (A')^{-1}`}</M>.
            </p>
            <p>
              <strong>(b)</strong> If{" "}
              <M>{tex`s = 0`}</M> then{" "}
              <M>{tex`\mathbf{v}^{\top} A^{-1} \mathbf{u} = -1`}</M>.
              Set{" "}
              <M>{tex`\mathbf{w} = A^{-1} \mathbf{u} \neq \mathbf{0}`}</M>{" "}
              (nonzero because <M>{tex`A^{-1}`}</M> is invertible).
              Then
            </p>
            <Block>{tex`(A + \mathbf{u}\mathbf{v}^{\top})\, \mathbf{w} = A \mathbf{w} + \mathbf{u} (\mathbf{v}^{\top} \mathbf{w}) = \mathbf{u} + \mathbf{u}\,(-1) = \mathbf{0}.`}</Block>
            <p>
              So <M>{tex`\mathbf{w} \in \ker(A')`}</M>, hence{" "}
              <M>{tex`A'`}</M> is singular.
            </p>
            <p>
              <strong>(c)</strong> Computing{" "}
              <M>{tex`A^{-1} \mathbf{u}`}</M> and{" "}
              <M>{tex`\mathbf{v}^{\top} A^{-1}`}</M> are both{" "}
              <M>{tex`O(n^{2})`}</M>. The scalar <M>s</M> is{" "}
              <M>{tex`O(n)`}</M>. Forming the rank-1 correction matrix
              and subtracting is{" "}
              <M>{tex`O(n^{2})`}</M>. So the total update cost is{" "}
              <M>{tex`O(n^{2})`}</M> — versus{" "}
              <M>{tex`O(n^{3})`}</M> from scratch. A factor of{" "}
              <M>n</M> is enormous in practice.
            </p>
            <p>
              <strong>Why this matters.</strong> Online algorithms
              (Kalman filters, recursive least squares) maintain an
              inverse covariance and update it once per sample —
              Sherman–Morrison makes that constant-time-per-feature.
              LoRA fine-tunes a model by adding a rank-<M>r</M> term{" "}
              <M>{tex`UV^{\top}`}</M> to each weight matrix; the same
              identity (and its rank-<M>r</M> generalisation, the
              Woodbury identity) is what makes inference with LoRA
              cheap. Whenever you see a paper write &ldquo;rank-1
              update&rdquo; or &ldquo;low-rank perturbation&rdquo;, this
              formula is hiding behind it.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
