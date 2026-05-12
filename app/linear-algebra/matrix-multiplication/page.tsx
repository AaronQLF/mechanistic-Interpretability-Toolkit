import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { Compose2Matrices } from "@/components/viz/Compose2Matrices";

export const metadata = {
  title: "Matrix multiplication",
};

export default function MatMulPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="matrix-multiplication"
      eyebrow="Chapter 05"
      title="Matrix multiplication"
      lede="Matrix multiplication is what happens when you do one transformation after another. Once you see that, the formula stops looking like an arbitrary rule and starts looking inevitable."
    >
      <h2>Composition, not multiplication</h2>
      <p>
        Suppose <M>B</M> is one transformation and <M>A</M> is another. Apply
        them one after the other:
      </p>
      <Block>{tex`(A B) \mathbf{v} = A(B\mathbf{v}).`}</Block>
      <p>
        The product <M>AB</M> is defined to be the single matrix that does
        the same thing as &ldquo;<M>B</M> first, then <M>A</M>.&rdquo; The
        rule for filling in its entries — which we&apos;ll see next — falls
        out of nothing more than that.
      </p>

      <h2>The formula, derived</h2>
      <p>
        We know <M>{tex`(AB)\mathbf{e}_1 = A(B\mathbf{e}_1)`}</M>. But{" "}
        <M>{tex`B\mathbf{e}_1`}</M> is just the first column of <M>B</M>, and{" "}
        applying <M>A</M> to it gives:
      </p>
      <Block>{tex`A \begin{bmatrix} b_{11} \\ b_{21} \end{bmatrix} = \begin{bmatrix} a_{11} b_{11} + a_{12} b_{21} \\ a_{21} b_{11} + a_{22} b_{21} \end{bmatrix}.`}</Block>
      <p>
        That&apos;s the first column of <M>AB</M>. Each column of <M>AB</M>{" "}
        is what <M>A</M> does to the corresponding column of <M>B</M>. The
        familiar &ldquo;row times column&rdquo; rule is just a re-bookkeeping
        of this.
      </p>

      <h2>Order matters</h2>
      <p>
        Composition of functions doesn&apos;t commute, and neither does
        matrix multiplication. Pour milk then cereal vs. cereal then milk —
        very different.
      </p>

      <Figure caption="Same A and B, different orders. Toggle to see how the warped grid changes — these are two different transformations.">
        <Compose2Matrices />
      </Figure>

      <Callout variant="intuition">
        Read <M>AB</M> right-to-left, like a recipe stack. The matrix nearest
        the vector acts first.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A transformer&apos;s attention layer effectively factors as{" "}
          <M>{tex`W_O W_V`}</M> (the &ldquo;OV circuit&rdquo;) and{" "}
          <M>{tex`W_Q^\top W_K`}</M> (the &ldquo;QK circuit&rdquo;). Treating
          these products as <em>single low-rank matrices</em>, then
          interpreting them, is the standard interpretability move.
        </p>
        <p>
          The whole forward pass is, in essence, a long matrix-multiply chain
          punctuated by nonlinearities. Understanding what each factor does
          is exactly the kind of work mech interp is.
        </p>
      </Callout>

      <Quiz
        question="Why do we say 'AB v means apply B first'?"
        choices={[
          { id: "a", label: "Because B is on the right, and matrix multiplication groups right-to-left when read by a vector.", correct: true, explain: "AB v = A (B v). The B sits next to v, so it goes first." },
          { id: "b", label: "Because A is bigger.", explain: "Size has nothing to do with order of operations." },
          { id: "c", label: "Convention only — both orders give the same result.", explain: "They give the same result only when A and B commute, which is rare." },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>The trace and an impossibility theorem.</strong>
            </p>
            <p>
              The <strong>trace</strong> of a square matrix is the sum
              of its diagonal entries:{" "}
              <M>{tex`\mathrm{tr}(A) = \sum_{i} A_{ii}`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Prove the cyclic property: for any
              two <M>{tex`n \times n`}</M> matrices <M>A</M> and{" "}
              <M>B</M>,
            </p>
            <Block>{tex`\mathrm{tr}(AB) = \mathrm{tr}(BA).`}</Block>
            <p>
              <strong>(b)</strong> Conclude that there is no pair of{" "}
              <M>{tex`n \times n`}</M> real matrices <M>A</M> and{" "}
              <M>B</M> satisfying the &ldquo;canonical commutation
              relation&rdquo;
            </p>
            <Block>{tex`AB - BA = I.`}</Block>
            <p>
              (Quantum mechanics&apos; position–momentum relation{" "}
              <M>{tex`[\hat{x}, \hat{p}] = i\hbar`}</M>{" "}
              <em>cannot</em> be modelled by finite matrices — that is
              why it forces an infinite-dimensional Hilbert space.)
            </p>
            <p>
              <strong>(c)</strong> Now flip it: produce two <em>specific
              non-commuting</em> 2×2 matrices whose commutator{" "}
              <M>{tex`AB - BA`}</M> is non-zero (it just can&apos;t be{" "}
              <M>I</M>). Compute the commutator explicitly.
            </p>
          </>
        }
        hint={
          <>
            For (a), expand both sides into double sums and swap the
            indices of summation. For (b), take the trace of both sides
            of the relation. For (c), try{" "}
            <M>{tex`A = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}`}</M>{" "}
            and{" "}
            <M>{tex`B = \begin{pmatrix} 0 & 0 \\ 1 & 0 \end{pmatrix}`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`(AB)_{ii} = \sum_{k} A_{ik} B_{ki}`}</M>, so
            </p>
            <Block>{tex`\mathrm{tr}(AB) = \sum_{i} \sum_{k} A_{ik} B_{ki} = \sum_{k} \sum_{i} B_{ki} A_{ik} = \sum_{k} (BA)_{kk} = \mathrm{tr}(BA).`}</Block>
            <p>
              The proof is just commuting two scalar multiplications and
              re-ordering the summations.
            </p>
            <p>
              <strong>(b)</strong> If{" "}
              <M>{tex`AB - BA = I`}</M>, take traces of both sides:
            </p>
            <Block>{tex`\mathrm{tr}(AB) - \mathrm{tr}(BA) = \mathrm{tr}(I) = n.`}</Block>
            <p>
              The left side is 0 by (a). So <M>{tex`0 = n`}</M>, a
              contradiction for any{" "}
              <M>{tex`n \geq 1`}</M>. No finite-dimensional solution
              exists.
            </p>
            <p>
              <strong>(c)</strong> With the suggested <M>A</M> and{" "}
              <M>B</M>:
            </p>
            <Block>{tex`AB = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}, \quad BA = \begin{bmatrix} 0 & 0 \\ 0 & 1 \end{bmatrix}, \quad AB - BA = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}.`}</Block>
            <p>
              That commutator is non-zero (matrices don&apos;t commute)
              and traceless (consistent with (a)). It also happens to be
              the Pauli{" "}
              <M>{tex`\sigma_{z}`}</M>, which is a coincidence of toy
              size, not of substance.
            </p>
            <p>
              <strong>Why this matters in mech interp.</strong>{" "}
              Attention scores are inner products{" "}
              <M>{tex`q^{\top} k`}</M>; QK and OV circuits are products
              of weight matrices. Whenever you reorder a product to
              expose structure (e.g.,{" "}
              <M>{tex`W_{Q}^{\top} W_{K}`}</M> or rewriting{" "}
              <M>{tex`W_{O} W_{V}`}</M> as a single low-rank operator),
              you are using exactly the algebraic facts that the trace
              identity is a small case of. The trace itself becomes a
              recurring tool: <em>activation patching contributions</em>,{" "}
              <em>logit attribution</em>, and{" "}
              <em>Frobenius-norm regularisers</em> are all traces in
              disguise.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
