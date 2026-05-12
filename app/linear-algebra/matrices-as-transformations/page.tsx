import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
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
        <M>{tex`\mathbb{R}^2`}</M> and gives back another vector in{" "}
        <M>{tex`\mathbb{R}^2`}</M>. The columns of the matrix tell you exactly
        where the basis vectors land:
      </p>
      <Block>{tex`M = \begin{bmatrix} a & b \\ c & d \end{bmatrix} \quad \text{means} \quad M\mathbf{e}_1 = \begin{bmatrix} a \\ c \end{bmatrix}, \; M\mathbf{e}_2 = \begin{bmatrix} b \\ d \end{bmatrix}.`}</Block>
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
      <Block>{tex`\mathbf{v} = v_1 \mathbf{e}_1 + v_2 \mathbf{e}_2,`}</Block>
      <p>
        and because the matrix preserves addition and scaling
        (<em>that&apos;s what &ldquo;linear&rdquo; means</em>), we get:
      </p>
      <Block>{tex`M\mathbf{v} = v_1 (M\mathbf{e}_1) + v_2 (M\mathbf{e}_2) = \begin{bmatrix} a v_1 + b v_2 \\ c v_1 + d v_2 \end{bmatrix}.`}</Block>
      <p>
        Knowing where the two basis vectors go is enough to know where{" "}
        <em>everything</em> goes. That&apos;s the magic.
      </p>

      <h2>Watch space bend</h2>
      <p>
        Drag the four entries of <M>M</M>. The faint grid is the original
        plane; the bold colored grid is its image after applying <M>M</M>.
        The two thick arrows are <M>{tex`M\mathbf{e}_1`}</M> and{" "}
        <M>{tex`M\mathbf{e}_2`}</M> — the columns of <M>M</M>.
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
          Every weight matrix in a neural network — <M>{tex`W_Q`}</M>,{" "}
          <M>{tex`W_K`}</M>, <M>{tex`W_V`}</M>, <M>{tex`W_O`}</M>, the MLP&apos;s{" "}
          <M>{tex`W_{\text{in}}`}</M> and <M>{tex`W_{\text{out}}`}</M>, the
          unembedding <M>{tex`W_U`}</M> — is one of these transformations,
          taking vectors from one space (e.g. residual stream) to another
          (e.g. logits, query space, value space).
        </p>
        <p>
          When you read the columns of <M>{tex`W_U`}</M> as &ldquo;the direction
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

      <Challenge
        prompt={
          <>
            <p>
              <strong>The rotation matrix derives the trig sum
              identities.</strong>
            </p>
            <p>
              Let <M>{tex`R_{\theta}`}</M> be the matrix that rotates
              every vector in <M>{tex`\mathbb{R}^{2}`}</M>{" "}
              counter-clockwise by angle <M>{tex`\theta`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Using only the rule &ldquo;the columns
              of a matrix are the images of the basis vectors,&rdquo;
              derive
            </p>
            <Block>{tex`R_{\theta} = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}.`}</Block>
            <p>
              <strong>(b)</strong> Apply <M>{tex`R_{\beta}`}</M> first,
              then <M>{tex`R_{\alpha}`}</M> to the basis vector{" "}
              <M>{tex`\mathbf{e}_{1}`}</M>. The result must equal{" "}
              <M>{tex`R_{\alpha + \beta}\, \mathbf{e}_{1}`}</M> (a
              rotation by <M>{tex`\alpha`}</M> following one by{" "}
              <M>{tex`\beta`}</M> is a rotation by{" "}
              <M>{tex`\alpha + \beta`}</M>). Equate components.
            </p>
            <p>
              <strong>(c)</strong> Conclude
            </p>
            <Block>{tex`\cos(\alpha + \beta) = \cos\alpha \cos\beta - \sin\alpha \sin\beta,`}</Block>
            <Block>{tex`\sin(\alpha + \beta) = \sin\alpha \cos\beta + \cos\alpha \sin\beta.`}</Block>
            <p>
              The trig sum identities are not a fact about angles —
              they are a fact about how rotations compose.
            </p>
          </>
        }
        hint={
          <>
            For (a), draw <M>{tex`\mathbf{e}_{1}`}</M> on the unit
            circle and rotate by <M>{tex`\theta`}</M>; its head lands at{" "}
            <M>{tex`(\cos\theta, \sin\theta)`}</M>. Then rotate{" "}
            <M>{tex`\mathbf{e}_{2}`}</M>. For (b), compute{" "}
            <M>{tex`R_{\alpha}\bigl(R_{\beta}\, \mathbf{e}_{1}\bigr)`}</M>
            {" "}using the matrix-on-vector rule from this chapter.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`\mathbf{e}_{1} = (1, 0)`}</M> sits on the unit
              circle at angle 0. Rotating by <M>{tex`\theta`}</M>{" "}
              moves it to angle <M>{tex`\theta`}</M>, i.e.{" "}
              <M>{tex`(\cos\theta, \sin\theta)`}</M>. Similarly{" "}
              <M>{tex`\mathbf{e}_{2}`}</M> at angle{" "}
              <M>{tex`\pi/2`}</M> moves to angle{" "}
              <M>{tex`\pi/2 + \theta`}</M>, i.e.{" "}
              <M>{tex`(-\sin\theta, \cos\theta)`}</M>. Stack these as
              columns to get <M>{tex`R_{\theta}`}</M>.
            </p>
            <p>
              <strong>(b)</strong>{" "}
              <M>{tex`R_{\beta}\, \mathbf{e}_{1} = (\cos\beta, \sin\beta)`}</M>.
              Apply <M>{tex`R_{\alpha}`}</M>:
            </p>
            <Block>{tex`R_{\alpha} \begin{bmatrix} \cos\beta \\ \sin\beta \end{bmatrix} = \begin{bmatrix} \cos\alpha \cos\beta - \sin\alpha \sin\beta \\ \sin\alpha \cos\beta + \cos\alpha \sin\beta \end{bmatrix}.`}</Block>
            <p>
              On the other hand, applying{" "}
              <M>{tex`R_{\alpha + \beta}`}</M> directly to{" "}
              <M>{tex`\mathbf{e}_{1}`}</M> gives{" "}
              <M>{tex`(\cos(\alpha + \beta), \sin(\alpha + \beta))`}</M>.
            </p>
            <p>
              <strong>(c)</strong> Two columns of two ways must match.
              The first components give the cosine identity; the second
              components give the sine identity.
            </p>
            <p>
              The lesson reaches further than trig: any time a group of
              transformations is closed under composition, equating
              &ldquo;do them in sequence&rdquo; with &ldquo;do the
              composed one&rdquo; produces algebraic identities for free.
              In a transformer, the same trick recovers identities for
              positional encodings (the rotation matrices behind RoPE),
              for orthogonal weight reparameterisations, and for any
              place where a structured matrix family commutes with
              itself.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
