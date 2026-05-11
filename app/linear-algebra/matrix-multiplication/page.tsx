import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
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
      <Block>{`(A B) \\mathbf{v} = A(B\\mathbf{v}).`}</Block>
      <p>
        The product <M>AB</M> is defined to be the single matrix that does
        the same thing as &ldquo;<M>B</M> first, then <M>A</M>.&rdquo; The
        rule for filling in its entries — which we&apos;ll see next — falls
        out of nothing more than that.
      </p>

      <h2>The formula, derived</h2>
      <p>
        We know <M>{`(AB)\\mathbf{e}_1 = A(B\\mathbf{e}_1)`}</M>. But{" "}
        <M>{`B\\mathbf{e}_1`}</M> is just the first column of <M>B</M>, and{" "}
        applying <M>A</M> to it gives:
      </p>
      <Block>{`A \\begin{bmatrix} b_{11} \\\\ b_{21} \\end{bmatrix} = \\begin{bmatrix} a_{11} b_{11} + a_{12} b_{21} \\\\ a_{21} b_{11} + a_{22} b_{21} \\end{bmatrix}.`}</Block>
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
          <M>{`W_O W_V`}</M> (the &ldquo;OV circuit&rdquo;) and{" "}
          <M>{`W_Q^\\top W_K`}</M> (the &ldquo;QK circuit&rdquo;). Treating
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
    </ChapterShell>
  );
}
