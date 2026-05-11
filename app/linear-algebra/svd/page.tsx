import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { SVD2DDecomposer } from "@/components/viz/SVD2DDecomposer";

export const metadata = {
  title: "Singular Value Decomposition",
};

export default function SvdPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="svd"
      eyebrow="Chapter 11"
      title="Singular Value Decomposition"
      lede="Every linear map, no matter how weird, is just three things: rotate, stretch each axis independently, rotate again. SVD is that statement, and it is the most useful theorem in linear algebra."
    >
      <h2>The statement</h2>
      <p>
        For any real <M>{`m \\times n`}</M> matrix <M>M</M>, there exist
        orthogonal matrices <M>U</M> (size <M>{`m \\times m`}</M>) and{" "}
        <M>V</M> (size <M>{`n \\times n`}</M>), and a diagonal matrix{" "}
        <M>Σ</M> with non-negative entries{" "}
        <M>{`\\sigma_1 \\geq \\sigma_2 \\geq \\cdots \\geq 0`}</M>, such
        that:
      </p>
      <Block>{`M = U \\Sigma V^{\\top}.`}</Block>
      <p>
        The numbers <M>{`\\sigma_i`}</M> are the <strong>singular values</strong> of{" "}
        <M>M</M>. The columns of <M>U</M> and <M>V</M> are the{" "}
        <strong>left</strong> and <strong>right singular vectors</strong>.
      </p>

      <h2>The geometric reading</h2>
      <p>
        Reading right-to-left, applying <M>M</M> to a vector means:
      </p>
      <ol>
        <li>
          <M>{`V^{\\top}`}</M> rotates the input so the right singular
          vectors line up with the standard axes.
        </li>
        <li>
          <M>Σ</M> stretches each standard axis by the corresponding{" "}
          <M>{`\\sigma_i`}</M>.
        </li>
        <li>
          <M>U</M> rotates the result into the output frame.
        </li>
      </ol>
      <p>
        That&apos;s every linear map, ever. Step through the decomposition
        below.
      </p>

      <Figure caption="Walk through M → Vᵀ → ΣVᵀ → UΣVᵀ. Slide k down to 1 to see the best rank-1 approximation overlaid in pink.">
        <SVD2DDecomposer />
      </Figure>

      <h2>Low-rank approximation</h2>
      <p>
        The singular values are sorted from largest to smallest. If you keep
        only the top <M>k</M> of them and zero out the rest, the resulting
        matrix is the best possible rank-<M>k</M> approximation of <M>M</M>{" "}
        (in Frobenius and spectral norm). Formally:
      </p>
      <Block>{`M_k = \\sum_{i=1}^{k} \\sigma_i\\, \\mathbf{u}_i \\mathbf{v}_i^{\\top}.`}</Block>
      <p>
        That&apos;s the Eckart–Young theorem. It&apos;s why SVD shows up
        anywhere people compress, denoise, or interpret a matrix.
      </p>

      <Callout variant="intuition">
        SVD finds the directions in <em>input</em> space that are stretched
        most, and the directions in <em>output</em> space they get stretched
        into. Big singular values are the &ldquo;loud&rdquo; directions; tiny
        ones are noise you can usually throw away.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Most weight matrices in a transformer are <em>not</em> square,
          which means eigenvalues don&apos;t directly apply but SVD does.
          Two of the most important uses:
        </p>
        <ul>
          <li>
            <strong>Low-rank factorization of attention.</strong>{" "}
            <M>{`W_O W_V`}</M> (the OV circuit) and{" "}
            <M>{`W_Q^{\\top} W_K`}</M> (the QK circuit) are often written
            as SVDs to read off the rank-<M>{`d_{\\text{head}}`}</M>{" "}
            structure of what an attention head does.
          </li>
          <li>
            <strong>Activation analysis.</strong> SVD on a matrix of
            activations gives the principal directions of variation in the
            residual stream — the &ldquo;axes that matter&rdquo; in a
            data-driven sense.
          </li>
        </ul>
      </Callout>

      <Quiz
        question="If a 2×2 matrix M has singular values 3 and 0, what does that tell you geometrically?"
        choices={[
          {
            id: "a",
            label: "M is invertible.",
            explain: "A zero singular value means at least one direction collapses to a point — not invertible.",
          },
          {
            id: "b",
            label: "M crushes the plane onto a single line, stretched by 3.",
            correct: true,
            explain: "The first singular value stretches by 3; the zero one collapses an axis. Net effect: rank 1.",
          },
          {
            id: "c",
            label: "M rotates by 90°.",
            explain: "Pure rotations have all singular values equal to 1.",
          },
        ]}
      />
    </ChapterShell>
  );
}
