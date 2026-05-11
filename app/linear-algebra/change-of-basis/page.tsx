import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
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
        <M>{`\\mathbf{e}_1, \\mathbf{e}_2`}</M>:
      </p>
      <Block>{`\\mathbf{v} = v_1 \\mathbf{e}_1 + v_2 \\mathbf{e}_2 \\quad \\Longleftrightarrow \\quad [\\mathbf{v}]_E = (v_1, v_2).`}</Block>
      <p>
        Pick any other basis <M>{`\\mathbf{b}_1, \\mathbf{b}_2`}</M> and the
        same vector gets new coordinates:
      </p>
      <Block>{`\\mathbf{v} = c_1 \\mathbf{b}_1 + c_2 \\mathbf{b}_2 \\quad \\Longleftrightarrow \\quad [\\mathbf{v}]_B = (c_1, c_2).`}</Block>
      <p>
        The arrow itself never moved. Only the labels on the arrow changed.
      </p>

      <h2>The change-of-basis matrix</h2>
      <p>
        Build the matrix <M>B</M> whose columns are{" "}
        <M>{`\\mathbf{b}_1, \\mathbf{b}_2`}</M>. Then{" "}
        <M>{`B [\\mathbf{v}]_B = [\\mathbf{v}]_E`}</M> — multiplying by{" "}
        <M>B</M> takes <M>B</M>-coordinates back to standard coordinates.
        Going the other way:
      </p>
      <Block>{`[\\mathbf{v}]_B = B^{-1} [\\mathbf{v}]_E.`}</Block>

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
    </ChapterShell>
  );
}
