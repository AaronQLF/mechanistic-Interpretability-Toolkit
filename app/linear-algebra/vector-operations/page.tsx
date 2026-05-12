import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
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

      <Challenge
        prompt={
          <>
            <p>
              <strong>The Cauchy–Schwarz inequality and the triangle
              inequality.</strong>
            </p>
            <p>
              Define{" "}
              <M>{tex`\langle \mathbf{v}, \mathbf{w}\rangle = \sum_{i} v_{i} w_{i}`}</M>{" "}
              for{" "}
              <M>{tex`\mathbf{v}, \mathbf{w} \in \mathbb{R}^{n}`}</M>{" "}
              (a preview of the dot product, which gets a chapter of its
              own later). It is just a number.
            </p>
            <p>
              <strong>(a)</strong> Prove the{" "}
              <strong>Cauchy–Schwarz inequality</strong>:
            </p>
            <Block>{tex`\bigl|\langle \mathbf{v}, \mathbf{w}\rangle\bigr| \leq \|\mathbf{v}\|\, \|\mathbf{w}\|,`}</Block>
            <p>
              with equality iff <M>{tex`\mathbf{v}`}</M> and{" "}
              <M>{tex`\mathbf{w}`}</M> are scalar multiples of each
              other.
            </p>
            <p>
              <strong>(b)</strong> Use (a) to prove the{" "}
              <strong>triangle inequality</strong>:
            </p>
            <Block>{tex`\|\mathbf{v} + \mathbf{w}\| \leq \|\mathbf{v}\| + \|\mathbf{w}\|,`}</Block>
            <p>
              with equality iff one is a non-negative multiple of the
              other.
            </p>
            <p>
              <strong>(c)</strong> Sketch in one sentence why these two
              inequalities together justify treating{" "}
              <M>{tex`\|\mathbf{v} - \mathbf{w}\|`}</M> as a sensible{" "}
              <em>distance</em> between vectors.
            </p>
          </>
        }
        hint={
          <>
            For (a), consider the polynomial in <M>t</M>:{" "}
            <M>{tex`p(t) = \|\mathbf{v} - t \mathbf{w}\|^{2} \geq 0`}</M>.
            Expand it. A non-negative quadratic in <M>t</M> has
            discriminant <M>{tex`\leq 0`}</M> — that is exactly what you
            want.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> If{" "}
              <M>{tex`\mathbf{w} = \mathbf{0}`}</M>, both sides are 0 and
              we&apos;re done. Else for any{" "}
              <M>{tex`t \in \mathbb{R}`}</M>,
            </p>
            <Block>{tex`0 \leq \|\mathbf{v} - t\mathbf{w}\|^{2} = \|\mathbf{v}\|^{2} - 2 t\, \langle \mathbf{v}, \mathbf{w}\rangle + t^{2}\|\mathbf{w}\|^{2}.`}</Block>
            <p>
              This is a quadratic in <M>t</M> that is{" "}
              <M>{tex`\geq 0`}</M> for all real <M>t</M>, so its
              discriminant is non-positive:
            </p>
            <Block>{tex`\bigl(2 \langle \mathbf{v}, \mathbf{w}\rangle\bigr)^{2} - 4 \|\mathbf{v}\|^{2} \|\mathbf{w}\|^{2} \leq 0 \;\Longrightarrow\; \langle \mathbf{v}, \mathbf{w}\rangle^{2} \leq \|\mathbf{v}\|^{2} \|\mathbf{w}\|^{2}.`}</Block>
            <p>
              Equality holds exactly when the discriminant is 0, i.e.
              when there exists <M>t</M> with{" "}
              <M>{tex`\mathbf{v} - t\mathbf{w} = \mathbf{0}`}</M> —
              i.e. they&apos;re scalar multiples.
            </p>
            <p>
              <strong>(b)</strong> Square the candidate inequality:
            </p>
            <Block>{tex`\|\mathbf{v} + \mathbf{w}\|^{2} = \|\mathbf{v}\|^{2} + 2 \langle \mathbf{v}, \mathbf{w}\rangle + \|\mathbf{w}\|^{2} \leq \|\mathbf{v}\|^{2} + 2 \|\mathbf{v}\|\,\|\mathbf{w}\| + \|\mathbf{w}\|^{2} = (\|\mathbf{v}\| + \|\mathbf{w}\|)^{2},`}</Block>
            <p>
              using Cauchy–Schwarz on the middle term. Take square roots
              (both sides non-negative). Equality requires both
              Cauchy–Schwarz equality{" "}
              <em>and</em>{" "}
              <M>{tex`\langle \mathbf{v}, \mathbf{w}\rangle \geq 0`}</M>,
              i.e. one vector is a non-negative multiple of the other.
            </p>
            <p>
              <strong>(c)</strong> Define{" "}
              <M>{tex`d(\mathbf{v}, \mathbf{w}) = \|\mathbf{v} - \mathbf{w}\|`}</M>.
              The triangle inequality (applied to{" "}
              <M>{tex`\mathbf{v} - \mathbf{u}`}</M> and{" "}
              <M>{tex`\mathbf{u} - \mathbf{w}`}</M>) gives{" "}
              <M>{tex`d(\mathbf{v}, \mathbf{w}) \leq d(\mathbf{v}, \mathbf{u}) + d(\mathbf{u}, \mathbf{w})`}</M>{" "}
              — going through a third point can never be shorter. That,
              plus symmetry and{" "}
              <M>{tex`d(\mathbf{v}, \mathbf{v}) = 0`}</M>, makes{" "}
              <M>d</M> a genuine metric, and is what licenses every
              clustering algorithm and every nearest-neighbour search you
              will ever run on activations.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
