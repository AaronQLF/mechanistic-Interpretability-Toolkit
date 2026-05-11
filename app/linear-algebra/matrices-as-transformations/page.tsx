import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { MatrixTransform2D } from "@/components/viz/MatrixTransform2D";

export const metadata = {
  title: "Matrices as transformations",
};

export default function MatricesPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="matrices-as-transformations"
      eyebrow="Chapter 04"
      title="Matrices as transformations"
      lede="Stop thinking of a matrix as a grid of numbers. Start thinking of it as a function that bends space — and the entire rest of linear algebra becomes intuitive."
    >
      <h2>The whole game in one sentence</h2>
      <p>
        A matrix is a function. Specifically, a 2×2 matrix takes a vector in{" "}
        <M>{`\\mathbb{R}^2`}</M> and gives back another vector in{" "}
        <M>{`\\mathbb{R}^2`}</M>. The columns of the matrix tell you exactly
        where the basis vectors land:
      </p>
      <Block>{`M = \\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix} \\quad \\text{means} \\quad M\\mathbf{e}_1 = \\begin{bmatrix} a \\\\ c \\end{bmatrix}, \\; M\\mathbf{e}_2 = \\begin{bmatrix} b \\\\ d \\end{bmatrix}.`}</Block>
      <p>
        That&apos;s the only fact you need to memorize. Every other fact
        about matrix multiplication, determinants, and inverses follows from
        this picture.
      </p>

      <h2>Linearity: the property that makes it work</h2>
      <p>
        Because <em>any</em> vector is a linear combination of the basis
        vectors,
      </p>
      <Block>{`\\mathbf{v} = v_1 \\mathbf{e}_1 + v_2 \\mathbf{e}_2,`}</Block>
      <p>
        and because the matrix preserves addition and scaling
        (<em>that&apos;s what &ldquo;linear&rdquo; means</em>), we get:
      </p>
      <Block>{`M\\mathbf{v} = v_1 (M\\mathbf{e}_1) + v_2 (M\\mathbf{e}_2) = \\begin{bmatrix} a v_1 + b v_2 \\\\ c v_1 + d v_2 \\end{bmatrix}.`}</Block>
      <p>
        Knowing where the two basis vectors go is enough to know where{" "}
        <em>everything</em> goes. That&apos;s the magic.
      </p>

      <h2>Watch space bend</h2>
      <p>
        Drag the four entries of <M>M</M>. The faint grid is the original
        plane; the bold colored grid is its image after applying <M>M</M>.
        The two thick arrows are <M>{`M\\mathbf{e}_1`}</M> and{" "}
        <M>{`M\\mathbf{e}_2`}</M> — the columns of <M>M</M>.
      </p>

      <Figure caption="The colored grid is the warped plane. Notice that lines stay lines, and parallel lines stay parallel — that's the geometric meaning of linearity.">
        <MatrixTransform2D />
      </Figure>

      <Callout variant="intuition">
        Linear transformations have three signatures: <em>(1)</em> the origin
        stays put, <em>(2)</em> straight lines stay straight, and{" "}
        <em>(3)</em> parallel lines stay parallel. If you ever lose any of
        those, you&apos;re no longer in linear-algebra-land.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Every weight matrix in a neural network — <M>{`W_Q`}</M>,{" "}
          <M>{`W_K`}</M>, <M>{`W_V`}</M>, <M>{`W_O`}</M>, the MLP&apos;s{" "}
          <M>{`W_{\\text{in}}`}</M> and <M>{`W_{\\text{out}}`}</M>, the
          unembedding <M>{`W_U`}</M> — is one of these transformations,
          taking vectors from one space (e.g. residual stream) to another
          (e.g. logits, query space, value space).
        </p>
        <p>
          When you read the columns of <M>{`W_U`}</M> as &ldquo;the direction
          in residual space that promotes token <em>k</em>,&rdquo; you are
          using exactly the picture above.
        </p>
      </Callout>

      <Quiz
        question="If a matrix M sends e₁ to (2, 0) and e₂ to (0, 2), what does it do to the vector (1, 1)?"
        choices={[
          { id: "a", label: "Sends it to (2, 2).", correct: true, explain: "M(1,1) = 1·M e₁ + 1·M e₂ = (2,0) + (0,2) = (2,2). It's a uniform 2× scale." },
          { id: "b", label: "Sends it to (1, 1).", explain: "Identity would do that — but this matrix doubles every coordinate." },
          { id: "c", label: "Sends it to (4, 0).", explain: "That ignores the contribution from e₂." },
        ]}
      />
    </ChapterShell>
  );
}
