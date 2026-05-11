import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { VectorAddition } from "@/components/viz/VectorAddition";
import { ScalarSlider } from "@/components/viz/ScalarSlider";

export const metadata = {
  title: "Vector operations",
};

export default function VectorOperationsPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="vector-operations"
      eyebrow="Chapter 02"
      title="Vector operations"
      lede="Two operations — adding two vectors, and scaling a vector by a number — are the entire alphabet of linear algebra. Everything else is built from these."
    >
      <h2>Adding vectors</h2>
      <p>
        To add two vectors, add them <em>component by component</em>:
      </p>
      <Block>{tex`\mathbf{v} + \mathbf{w} = \begin{bmatrix} v_1 \\ v_2 \end{bmatrix} + \begin{bmatrix} w_1 \\ w_2 \end{bmatrix} = \begin{bmatrix} v_1 + w_1 \\ v_2 + w_2 \end{bmatrix}.`}</Block>
      <p>
        Geometrically, this is the famous <strong>tip-to-tail</strong> rule:
        slide <M>{tex`\mathbf{w}`}</M> so its tail sits at the head of{" "}
        <M>{tex`\mathbf{v}`}</M>, and the sum is the arrow from the origin to
        where <M>{tex`\mathbf{w}`}</M> now ends. Drag either vector below; the
        parallelogram updates live.
      </p>

      <Figure caption="Vector addition. The dashed sides close the parallelogram — both ways of adding agree because addition is commutative.">
        <VectorAddition />
      </Figure>

      <h2>Scaling a vector</h2>
      <p>
        Multiplying a vector by a number — a <em>scalar</em> — stretches it
        without changing its line of action. Negative scalars flip it:
      </p>
      <Block>{tex`s\mathbf{v} = \begin{bmatrix} s\,v_1 \\ s\,v_2 \end{bmatrix}.`}</Block>

      <Figure caption="Slide the scalar. Notice that the scaled arrow always sits on the same line through the origin as v.">
        <ScalarSlider />
      </Figure>

      <h2>Length (norm)</h2>
      <p>
        The length of a vector is the Euclidean distance from the origin to
        its tip:
      </p>
      <Block>{tex`\lVert \mathbf{v} \rVert = \sqrt{v_1^2 + v_2^2 + \cdots + v_n^2}.`}</Block>
      <p>
        A unit vector is one with length 1. Any nonzero vector has a unit
        version, found by dividing by its own length:
      </p>
      <Block>{tex`\hat{\mathbf{v}} = \frac{\mathbf{v}}{\lVert \mathbf{v} \rVert}.`}</Block>

      <Callout variant="intuition">
        Two operations, one rule of thumb: <em>addition</em> moves you
        between vectors, <em>scaling</em> moves you along a vector. Together
        they let you reach any combination — which is what the next chapter
        is about.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          When a transformer block writes its output back to the residual
          stream, it&apos;s doing <em>vector addition</em>. The new residual
          is the old residual <strong>plus</strong> the block&apos;s
          contribution:
        </p>
        <Block>{tex`\mathbf{x}_{\ell+1} = \mathbf{x}_{\ell} + \text{Attn}(\mathbf{x}_{\ell}) + \text{MLP}(\mathbf{x}_{\ell}).`}</Block>
        <p>
          That additive structure is what makes the residual stream so
          interpretable — every component contributes a vector, and we can
          attribute outputs to specific contributors by reading off the
          corresponding direction.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            If <M>{tex`\mathbf{v} = (3, 4)`}</M>, what is{" "}
            <M>{tex`\lVert \mathbf{v} \rVert`}</M>?
          </>
        }
        choices={[
          { id: "a", label: "7", explain: "That would be the sum of the components — not their Pythagorean combination." },
          { id: "b", label: "5", correct: true, explain: "√(3² + 4²) = √25 = 5. The classic 3-4-5 triangle." },
          { id: "c", label: "12", explain: "That's the product of the components, which has no geometric meaning here." },
        ]}
      />
    </ChapterShell>
  );
}
