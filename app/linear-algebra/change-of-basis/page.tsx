import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { BasisSwitcher } from "@/components/viz/BasisSwitcher";

export const metadata = {
  title: "Change of basis",
};

export default function ChangeOfBasisPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="change-of-basis"
      eyebrow="Chapter 09"
      title="Change of basis"
      lede="A vector doesn't have coordinates — coordinates are something you choose. Change the basis and the same vector wears different numbers. Mech interp lives or dies by picking a good basis."
    >
      <h2>Coordinates are a choice</h2>
      <p>
        Until now we&apos;ve been writing every vector as a pair of numbers
        without saying out loud what those numbers <em>are</em>. The numbers
        are coordinates with respect to the standard basis{" "}
        <M>{tex`\mathbf{e}_1, \mathbf{e}_2`}</M>:
      </p>
      <Block>{tex`\mathbf{v} = v_1 \mathbf{e}_1 + v_2 \mathbf{e}_2 \quad \Longleftrightarrow \quad [\mathbf{v}]_E = (v_1, v_2).`}</Block>
      <p>
        Pick any other basis <M>{tex`\mathbf{b}_1, \mathbf{b}_2`}</M> and the
        same vector gets new coordinates:
      </p>
      <Block>{tex`\mathbf{v} = c_1 \mathbf{b}_1 + c_2 \mathbf{b}_2 \quad \Longleftrightarrow \quad [\mathbf{v}]_B = (c_1, c_2).`}</Block>
      <p>
        The arrow itself never moved. Only the labels on the arrow changed.
      </p>

      <h2>The change-of-basis matrix</h2>
      <p>
        Build the matrix <M>B</M> whose columns are{" "}
        <M>{tex`\mathbf{b}_1, \mathbf{b}_2`}</M>. Then{" "}
        <M>{tex`B [\mathbf{v}]_B = [\mathbf{v}]_E`}</M> — multiplying by{" "}
        <M>B</M> takes <M>B</M>-coordinates back to standard coordinates.
        Going the other way:
      </p>
      <Block>{tex`[\mathbf{v}]_B = B^{-1} [\mathbf{v}]_E.`}</Block>

      <Figure caption="Drag v, b₁, or b₂. The standard coordinates and the B-coordinates of the same arrow update side-by-side.">
        <BasisSwitcher />
      </Figure>

      <Callout variant="intuition">
        Think of basis vectors as the directions of your local rulers. Change
        the rulers and the readings change. The thing being measured doesn&apos;t.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The standard basis of the residual stream is <em>neuron-aligned</em>{" "}
          — the <M>i</M>-th coordinate is the <M>i</M>-th neuron&apos;s
          activation. But neurons are usually polysemantic; they don&apos;t
          encode one clean concept.
        </p>
        <p>
          A <strong>sparse autoencoder</strong> learns a different basis —
          a <em>feature basis</em> — in which a single coordinate fires for
          a single concept (when the model is in the right regime). That&apos;s
          a literal change of basis: same residual vectors, more readable
          numbers.
        </p>
        <p>
          More broadly: every time you stare at a transformer and think
          &ldquo;these neurons don&apos;t mean anything,&rdquo; the move is
          to look for a basis in which they would.
        </p>
      </Callout>

      <Quiz
        question="If b₁ = (2, 0) and b₂ = (0, 2), what are the B-coordinates of v = (4, 6)?"
        choices={[
          {
            id: "a",
            label: "(4, 6).",
            explain: "That's the standard coordinates. The B basis stretches each axis by 2, so B-coords are halved.",
          },
          {
            id: "b",
            label: "(2, 3).",
            correct: true,
            explain: "v = 2·(2,0) + 3·(0,2). The B basis is twice as coarse, so each coordinate is half.",
          },
          {
            id: "c",
            label: "(8, 12).",
            explain: "That doubles instead of halves. The mapping is v / 2 in each coordinate.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>Similar matrices, and what survives a change of
              basis.</strong>
            </p>
            <p>
              Let <M>T</M> be a linear map{" "}
              <M>{tex`\mathbb{R}^{n} \to \mathbb{R}^{n}`}</M>. In the
              standard basis it has matrix <M>A</M>. In a new basis{" "}
              <M>B</M> (with change-of-basis matrix <M>P</M> whose
              columns are the new basis vectors expressed in the
              standard basis) it has matrix <M>{tex`A'`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Show that
            </p>
            <Block>{tex`A' = P^{-1} A P.`}</Block>
            <p>
              Two matrices related this way are called{" "}
              <strong>similar</strong>.
            </p>
            <p>
              <strong>(b)</strong> Use the cyclic property of trace to
              show that <M>A</M> and <M>{tex`A'`}</M> have the{" "}
              <em>same trace</em>.
            </p>
            <p>
              <strong>(c)</strong> Show that <M>A</M> and{" "}
              <M>{tex`A'`}</M> have the same determinant. (You may use{" "}
              <M>{tex`\det(XY) = \det X \det Y`}</M> and{" "}
              <M>{tex`\det(X^{-1}) = 1/\det X`}</M>.)
            </p>
            <p>
              <strong>(d)</strong> Conclude that the trace and the
              determinant are properties of the <em>linear map</em>{" "}
              itself — not of the matrix used to represent it. Identify
              one fact about a linear map that is <em>not</em>{" "}
              basis-invariant. (Hint: most matrix entries.)
            </p>
          </>
        }
        hint={
          <>
            For (a), let <M>{tex`\mathbf{v}`}</M> have standard
            coordinates{" "}
            <M>{tex`[\mathbf{v}]_{E}`}</M> and B-coordinates{" "}
            <M>{tex`[\mathbf{v}]_{B}`}</M>. The chapter showed{" "}
            <M>{tex`[\mathbf{v}]_{E} = P\, [\mathbf{v}]_{B}`}</M>. Apply{" "}
            <M>T</M> in both pictures and equate.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> The action of <M>T</M> in the
              standard basis is{" "}
              <M>{tex`[T \mathbf{v}]_{E} = A\, [\mathbf{v}]_{E}`}</M>.
              In the new basis it&apos;s{" "}
              <M>{tex`[T \mathbf{v}]_{B} = A'\, [\mathbf{v}]_{B}`}</M>.
              Use{" "}
              <M>{tex`[\mathbf{v}]_{E} = P\, [\mathbf{v}]_{B}`}</M> and{" "}
              <M>{tex`[T \mathbf{v}]_{E} = P\, [T \mathbf{v}]_{B}`}</M>:
            </p>
            <Block>{tex`P\, A'\, [\mathbf{v}]_{B} = A\, P\, [\mathbf{v}]_{B}.`}</Block>
            <p>
              This holds for every{" "}
              <M>{tex`[\mathbf{v}]_{B}`}</M>, so{" "}
              <M>{tex`P A' = A P`}</M> as matrices, and left-multiplying
              by <M>{tex`P^{-1}`}</M> gives{" "}
              <M>{tex`A' = P^{-1} A P`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Using cyclicity from the matrix-mult
              chapter,
            </p>
            <Block>{tex`\mathrm{tr}(A') = \mathrm{tr}(P^{-1} A P) = \mathrm{tr}(A P P^{-1}) = \mathrm{tr}(A).`}</Block>
            <p>
              <strong>(c)</strong>
            </p>
            <Block>{tex`\det(A') = \det(P^{-1}) \det(A) \det(P) = \frac{1}{\det P}\, \det A\, \det P = \det A.`}</Block>
            <p>
              <strong>(d)</strong> Trace and determinant only depend on
              the linear map. The full matrix entries do{" "}
              <em>not</em> — pick any non-diagonal{" "}
              <M>{tex`A`}</M> and a basis whose columns are
              eigenvectors; in that basis{" "}
              <M>{tex`A' = P^{-1} A P`}</M> is diagonal, so most
              entries are zero. The off-diagonal entries are
              basis-dependent; the trace and determinant aren&apos;t.
            </p>
            <p>
              <strong>Why this matters.</strong> When transformer
              papers talk about &ldquo;the OV circuit&rdquo;{" "}
              <M>{tex`W_{O} W_{V}`}</M> they often write it in different
              bases — sometimes the standard residual basis, sometimes
              the eigenbasis of the unembedding, sometimes the SAE
              feature basis. Trace and determinant are stable under all
              of those rewrites; entry-by-entry interpretations are not.
              Properties that survive change of basis (trace,
              determinant, rank, eigenvalues, singular values) are
              precisely the ones worth quoting in mech-interp results.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
