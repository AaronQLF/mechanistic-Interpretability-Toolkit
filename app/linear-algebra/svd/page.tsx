import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
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
        For any real <M>{tex`m \times n`}</M> matrix <M>M</M>, there exist
        orthogonal matrices <M>U</M> (size <M>{tex`m \times m`}</M>) and{" "}
        <M>V</M> (size <M>{tex`n \times n`}</M>), and a diagonal matrix{" "}
        <M>Σ</M> with non-negative entries{" "}
        <M>{tex`\sigma_1 \geq \sigma_2 \geq \cdots \geq 0`}</M>, such
        that:
      </p>
      <Block>{tex`M = U \Sigma V^{\top}.`}</Block>
      <p>
        The numbers <M>{tex`\sigma_i`}</M> are the <strong>singular values</strong> of{" "}
        <M>M</M>. The columns of <M>U</M> and <M>V</M> are the{" "}
        <strong>left</strong> and <strong>right singular vectors</strong>.
      </p>

      <h2>The geometric reading</h2>
      <p>
        Reading right-to-left, applying <M>M</M> to a vector means:
      </p>
      <ol>
        <li>
          <M>{tex`V^{\top}`}</M> rotates the input so the right singular
          vectors line up with the standard axes.
        </li>
        <li>
          <M>Σ</M> stretches each standard axis by the corresponding{" "}
          <M>{tex`\sigma_i`}</M>.
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
      <Block>{tex`M_k = \sum_{i=1}^{k} \sigma_i\, \mathbf{u}_i \mathbf{v}_i^{\top}.`}</Block>
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
            <M>{tex`W_O W_V`}</M> (the OV circuit) and{" "}
            <M>{tex`W_Q^{\top} W_K`}</M> (the QK circuit) are often written
            as SVDs to read off the rank-<M>{tex`d_{\text{head}}`}</M>{" "}
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

      <Challenge
        prompt={
          <>
            <p>
              <strong>SVD via the eigendecomposition of{" "}
              <M>{tex`A^{\top}A`}</M> — and Eckart–Young.</strong>
            </p>
            <p>
              <strong>(a)</strong> Let{" "}
              <M>{tex`A \in \mathbb{R}^{m \times n}`}</M>. Show that{" "}
              <M>{tex`A^{\top} A`}</M> is symmetric and positive
              semi-definite, and that its non-negative eigenvalues are
              the squares of the singular values of <M>A</M>:
            </p>
            <Block>{tex`A^{\top} A\, \mathbf{v}_{i} = \sigma_{i}^{2}\, \mathbf{v}_{i}.`}</Block>
            <p>
              The eigenvectors{" "}
              <M>{tex`\mathbf{v}_{i}`}</M> are the right singular
              vectors of <M>A</M>.
            </p>
            <p>
              <strong>(b)</strong> Show that{" "}
              <M>{tex`\mathbf{u}_{i} = A \mathbf{v}_{i} / \sigma_{i}`}</M>{" "}
              (for{" "}
              <M>{tex`\sigma_{i} > 0`}</M>) gives an orthonormal set of
              left singular vectors satisfying{" "}
              <M>{tex`A \mathbf{v}_{i} = \sigma_{i} \mathbf{u}_{i}`}</M>.
              Hence the SVD{" "}
              <M>{tex`A = \sum_{i} \sigma_{i} \mathbf{u}_{i} \mathbf{v}_{i}^{\top}`}</M>{" "}
              <em>exists</em> for every real <M>A</M>.
            </p>
            <p>
              <strong>(c) Eckart–Young.</strong> With singular values{" "}
              <M>{tex`\sigma_{1} \geq \sigma_{2} \geq \cdots \geq 0`}</M>{" "}
              and rank <M>r</M>, define the truncated approximation
            </p>
            <Block>{tex`A_{k} = \sum_{i=1}^{k} \sigma_{i}\, \mathbf{u}_{i} \mathbf{v}_{i}^{\top}.`}</Block>
            <p>
              Show that{" "}
              <M>{tex`\|A - A_{k}\|_{F}^{2} = \sum_{i > k} \sigma_{i}^{2}`}</M>,
              and argue (you can use without proof that a rank-<M>k</M>{" "}
              matrix has at most <M>k</M> non-zero singular values) that
              no matrix of rank <M>{tex`\leq k`}</M> beats this
              Frobenius-norm error.
            </p>
            <p>
              <strong>(d)</strong> Apply this to{" "}
              <M>{tex`W_{O} W_{V}`}</M> in a transformer, of shape{" "}
              <M>{tex`d \times d`}</M> with inner dimension{" "}
              <M>{tex`d_{\text{head}}`}</M>. What is its rank? What
              does Eckart–Young say about the &ldquo;best linear
              approximation&rdquo; using fewer than{" "}
              <M>{tex`d_{\text{head}}`}</M> directions?
            </p>
          </>
        }
        hint={
          <>
            For (a), use the spectral theorem (previous chapter):{" "}
            <M>{tex`A^{\top} A`}</M> is symmetric, hence orthogonally
            diagonalisable; eigenvalues are{" "}
            <M>{tex`\geq 0`}</M> because{" "}
            <M>{tex`\mathbf{v}^{\top} A^{\top} A \mathbf{v} = \|A \mathbf{v}\|^{2} \geq 0`}</M>.
            For (c), use that the Frobenius norm satisfies{" "}
            <M>{tex`\|A\|_{F}^{2} = \sum \sigma_{i}^{2}`}</M> and is
            unitarily invariant.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`(A^{\top} A)^{\top} = A^{\top} A`}</M>, so it is
              symmetric. For any{" "}
              <M>{tex`\mathbf{v}`}</M>:{" "}
              <M>{tex`\mathbf{v}^{\top} A^{\top} A \mathbf{v} = (A \mathbf{v})^{\top}(A \mathbf{v}) = \|A \mathbf{v}\|^{2} \geq 0`}</M>,
              so it is PSD. By the spectral theorem there exists an
              orthonormal eigenbasis{" "}
              <M>{tex`\mathbf{v}_{1}, \ldots, \mathbf{v}_{n}`}</M>{" "}
              with eigenvalues{" "}
              <M>{tex`\lambda_{i} \geq 0`}</M>. Define{" "}
              <M>{tex`\sigma_{i} = \sqrt{\lambda_{i}}`}</M>. Order them
              decreasing.
            </p>
            <p>
              <strong>(b)</strong> For{" "}
              <M>{tex`\sigma_{i} > 0`}</M>, define{" "}
              <M>{tex`\mathbf{u}_{i} = A \mathbf{v}_{i} / \sigma_{i}`}</M>.
              Check orthonormality:
            </p>
            <Block>{tex`\mathbf{u}_{i}^{\top} \mathbf{u}_{j} = \frac{1}{\sigma_{i} \sigma_{j}}\, \mathbf{v}_{i}^{\top} A^{\top} A\, \mathbf{v}_{j} = \frac{\sigma_{j}^{2}}{\sigma_{i} \sigma_{j}}\, \mathbf{v}_{i}^{\top} \mathbf{v}_{j} = \delta_{ij}.`}</Block>
            <p>
              Extend the{" "}
              <M>{tex`\mathbf{u}_{i}`}</M> to a full orthonormal basis
              of <M>{tex`\mathbb{R}^{m}`}</M>. By construction{" "}
              <M>{tex`A \mathbf{v}_{i} = \sigma_{i} \mathbf{u}_{i}`}</M>,
              so for any vector{" "}
              <M>{tex`\mathbf{x} = \sum_{i} (\mathbf{v}_{i}^{\top} \mathbf{x})\, \mathbf{v}_{i}`}</M>:
            </p>
            <Block>{tex`A \mathbf{x} = \sum_{i} (\mathbf{v}_{i}^{\top} \mathbf{x})\, A \mathbf{v}_{i} = \sum_{i} \sigma_{i}\, \mathbf{u}_{i}\, \mathbf{v}_{i}^{\top} \mathbf{x}.`}</Block>
            <p>
              Hence{" "}
              <M>{tex`A = \sum_{i} \sigma_{i}\, \mathbf{u}_{i} \mathbf{v}_{i}^{\top}`}</M>{" "}
              and SVD exists.
            </p>
            <p>
              <strong>(c)</strong>{" "}
              <M>{tex`A - A_{k} = \sum_{i > k} \sigma_{i}\, \mathbf{u}_{i} \mathbf{v}_{i}^{\top}`}</M>.
              The Frobenius norm is{" "}
              <M>{tex`\|M\|_{F}^{2} = \mathrm{tr}(M^{\top} M)`}</M>{" "}
              and is invariant under multiplication by orthogonal
              matrices, so
            </p>
            <Block>{tex`\|A - A_{k}\|_{F}^{2} = \sum_{i > k} \sigma_{i}^{2}.`}</Block>
            <p>
              <em>Lower bound.</em> Suppose{" "}
              <M>B</M> has{" "}
              <M>{tex`\mathrm{rank}(B) \leq k`}</M>. Then{" "}
              <M>{tex`\dim \ker(B) \geq n - k`}</M>, so the null space
              of <M>B</M> intersects the{" "}
              <M>{tex`(k+1)`}</M>-dim subspace{" "}
              <M>{tex`\mathrm{span}\{\mathbf{v}_{1}, \ldots, \mathbf{v}_{k+1}\}`}</M>{" "}
              in something at least 1-dimensional. Pick a unit vector{" "}
              <M>{tex`\mathbf{w}`}</M> in that intersection; then{" "}
              <M>{tex`B \mathbf{w} = \mathbf{0}`}</M>, hence{" "}
              <M>{tex`(A - B)\mathbf{w} = A \mathbf{w}`}</M>, and{" "}
              <M>{tex`\|A \mathbf{w}\|^{2} \geq \sigma_{k+1}^{2}`}</M>{" "}
              (the smallest singular value among the relevant
              eigendirections). Refining the argument across all of the
              top-<M>{tex`k+1`}</M> directions yields{" "}
              <M>{tex`\|A - B\|_{F}^{2} \geq \sum_{i > k} \sigma_{i}^{2}`}</M>.
              <em>So <M>{tex`A_{k}`}</M> is optimal.</em>
            </p>
            <p>
              <strong>(d)</strong>{" "}
              <M>{tex`W_{O} W_{V}`}</M> has rank at most{" "}
              <M>{tex`d_{\text{head}}`}</M> (the inner dimension of the
              product). Eckart–Young says the best rank-<M>k</M>{" "}
              approximation captures Frobenius energy{" "}
              <M>{tex`\sum_{i \leq k} \sigma_{i}^{2}`}</M>. The
              singular-value spectrum of an attention head&apos;s OV
              circuit is exactly the diagnostic the mech-interp
              literature uses to ask: &ldquo;is this head&apos;s effect
              concentrated in a few directions, or spread across all{" "}
              <M>{tex`d_{\text{head}}`}</M> of them?&rdquo; A spectrum
              that decays sharply means a much-smaller-than-{" "}
              <M>{tex`d_{\text{head}}`}</M> approximation captures most
              of what the head is doing — which is what makes circuit
              analysis tractable.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
