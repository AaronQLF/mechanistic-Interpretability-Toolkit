import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { GradientField } from "@/components/viz/GradientField";

export const metadata = {
  title: "Partial derivatives & the gradient",
};

export default function GradientPage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="gradient"
      eyebrow="Chapter 04"
      title="Partial derivatives & the gradient"
      lede="Real models live in thousands of dimensions. The derivative generalises to a vector — one slope per input direction — that points uphill on the loss surface. That vector is the gradient, and it is the single most important object in deep learning."
    >
      <h2>Partial derivatives</h2>
      <p>
        For a function of two variables{" "}
        <M>{tex`F(x, y)`}</M>, the <strong>partial derivative</strong>{" "}
        with respect to <M>x</M> is the ordinary 1D derivative you get
        by treating <M>y</M> as a constant:
      </p>
      <Block>{tex`\frac{\partial F}{\partial x} = \lim_{h \to 0} \frac{F(x + h,\ y) - F(x, y)}{h}.`}</Block>
      <p>
        Similarly for <M>{tex`\partial F / \partial y`}</M>. There is
        nothing new mathematically — you&apos;re just slicing the
        surface along one axis and differentiating the 1D curve you
        get.
      </p>
      <p>
        For <M>{tex`F(x, y) = x^2 + y^2`}</M>:
      </p>
      <Block>{tex`\frac{\partial F}{\partial x} = 2x, \qquad \frac{\partial F}{\partial y} = 2y.`}</Block>

      <h2>The gradient</h2>
      <p>
        Packing the partial derivatives into a vector gives the{" "}
        <strong>gradient</strong>:
      </p>
      <Block>{tex`\nabla F(x, y) = \begin{bmatrix} \partial F / \partial x \\ \partial F / \partial y \end{bmatrix}.`}</Block>
      <p>
        Two facts about <M>{tex`\nabla F`}</M> are worth burning into
        memory because we will use them constantly:
      </p>
      <ol>
        <li>
          <strong>The gradient points uphill.</strong> It is the
          direction in input space along which <M>F</M> increases
          fastest.
        </li>
        <li>
          <strong>Its length is the rate of steepest ascent.</strong>{" "}
          <M>{tex`\|\nabla F\|`}</M> is how fast <M>F</M> changes if
          you move along it at unit speed.
        </li>
      </ol>
      <p>
        We&apos;ll prove both in the next chapter via the directional
        derivative. For now, just play with the widget.
      </p>

      <Figure caption="A 2D scalar field as a colormap. The grey arrows show ∇F on a coarse grid — same direction, varying length. Drag the orange dot to read the local gradient and its magnitude.">
        <GradientField />
      </Figure>

      <h2>What the heatmap is telling you</h2>
      <p>
        Pay attention to three landscapes in the preset list:
      </p>
      <ul>
        <li>
          <strong>Bowl</strong> <M>{tex`F = x^2 + y^2`}</M>. The
          gradient is <M>{tex`(2x, 2y) = 2\mathbf{r}`}</M> — radially
          outward, zero at the origin. The minimum is unique.
        </li>
        <li>
          <strong>Ellipse</strong> <M>{tex`F = x^2 + 6y^2`}</M>. The
          gradient is <M>{tex`(2x, 12y)`}</M> — six times more sensitive
          to <M>y</M> than to <M>x</M>. This is the&nbsp;
          &ldquo;poorly conditioned&rdquo; case that punishes naive
          gradient descent.
        </li>
        <li>
          <strong>Saddle</strong> <M>{tex`F = x^2 - y^2`}</M>. The
          origin is a stationary point — <M>{tex`\nabla F = 0`}</M> — but
          it is neither a min nor a max. Around it, the gradient
          arrows form a saddle pattern: outward in <M>x</M>, inward in{" "}
          <M>y</M>.
        </li>
      </ul>

      <Callout variant="intuition">
        The gradient is a tiny arrow you can compute at any point. It
        always points in the direction of fastest <em>increase</em>{" "}
        of the function — never sideways, never downhill. Negate it
        and you get the direction of steepest descent. That single
        sign flip is gradient descent.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          For a neural network, the loss <M>{tex`\mathcal{L}(\theta)`}</M> is
          a function of millions or billions of parameters. The gradient{" "}
          <M>{tex`\nabla_\theta \mathcal{L}`}</M> is a vector with one
          entry per parameter — same shape, same arrows, same
          uphill-pointing property as the picture above. Training is
          the act of walking in the <em>opposite</em> direction.
        </p>
        <p>
          Interpretability papers also lean on{" "}
          <M>{tex`\nabla_x \mathcal{L}`}</M> — the gradient with respect
          to <em>inputs</em> rather than parameters. That&apos;s what
          saliency maps, integrated gradients, and adversarial
          examples all use.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            For <M>{tex`F(x, y) = 3x^2 + xy + 4y^2`}</M>, what is{" "}
            <M>{tex`\nabla F(1, 2)`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "(8, 17)",
            correct: true,
            explain:
              "∂F/∂x = 6x + y → 6 + 2 = 8. ∂F/∂y = x + 8y → 1 + 16 = 17.",
          },
          {
            id: "b",
            label: "(7, 17)",
            explain:
              "Close — but ∂F/∂x at (1, 2) is 6·1 + 2 = 8, not 7. Don't drop the y term.",
          },
          {
            id: "c",
            label: "(6, 8)",
            explain:
              "Those are the coefficients in the partials before plugging in (1, 2).",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Let <M>{tex`A \in \mathbb{R}^{m \times n}`}</M> and{" "}
              <M>{tex`\mathbf{b} \in \mathbb{R}^{m}`}</M>. Define the
              least-squares loss
            </p>
            <Block>{tex`F(\mathbf{x}) = \tfrac{1}{2}\,\|A\mathbf{x} - \mathbf{b}\|^{2}.`}</Block>
            <p>
              <strong>(a)</strong> Working <em>only</em> from the
              componentwise definition of the partial derivative, show
              that
            </p>
            <Block>{tex`\nabla F(\mathbf{x}) = A^{\top}(A\mathbf{x} - \mathbf{b}).`}</Block>
            <p>
              <strong>(b)</strong> Use this to derive the{" "}
              <em>normal equations</em>: the unique minimiser{" "}
              <M>{tex`\mathbf{x}^{\star}`}</M> (when{" "}
              <M>{tex`A^{\top}A`}</M> is invertible) satisfies{" "}
              <M>{tex`A^{\top} A\,\mathbf{x}^{\star} = A^{\top}\mathbf{b}`}</M>.
            </p>
          </>
        }
        hint={
          <>
            Expand{" "}
            <M>{tex`\|A\mathbf{x} - \mathbf{b}\|^{2} = \sum_{i}\bigl(\sum_{j} A_{ij} x_j - b_i\bigr)^{2}`}</M>{" "}
            and differentiate term-by-term with respect to a single{" "}
            <M>{tex`x_k`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Write{" "}
              <M>{tex`r_i(\mathbf{x}) = \sum_j A_{ij} x_j - b_i`}</M>{" "}
              (the <M>i</M>-th residual). Then{" "}
              <M>{tex`F = \tfrac{1}{2}\sum_i r_i^{2}`}</M>. By the chain
              rule,
            </p>
            <Block>{tex`\frac{\partial F}{\partial x_k} = \sum_{i} r_i \cdot \frac{\partial r_i}{\partial x_k} = \sum_{i} r_i \cdot A_{ik} = \sum_{i} (A^{\top})_{ki}\, r_i.`}</Block>
            <p>
              That&apos;s the <M>k</M>-th component of{" "}
              <M>{tex`A^{\top} \mathbf{r} = A^{\top}(A\mathbf{x} - \mathbf{b})`}</M>.
              Stacking over <M>k</M> gives the claimed gradient.
            </p>
            <p>
              <strong>(b)</strong> <M>F</M> is convex (its Hessian is{" "}
              <M>{tex`A^{\top}A \succeq 0`}</M>), so any stationary
              point is a global minimum. Setting{" "}
              <M>{tex`\nabla F = 0`}</M> gives{" "}
              <M>{tex`A^{\top} A\,\mathbf{x}^{\star} = A^{\top}\mathbf{b}`}</M>,
              the normal equations.
            </p>
            <p>
              This single derivation is the closed form behind linear
              regression, the Moore–Penrose pseudoinverse, and the
              gradient that gets fed into <em>every</em> linear-layer
              backward pass:{" "}
              <M>{tex`\partial L / \partial W = (\text{output gradient})^{\top}\, (\text{input})`}</M>.
              The shape that hits every transformer&apos;s training loop
              is born here.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
