import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { JacobianVisualizer } from "@/components/viz/JacobianVisualizer";

export const metadata = {
  title: "The Jacobian",
};

export default function JacobianPage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="jacobian"
      eyebrow="Chapter 06"
      title="The Jacobian"
      lede="A scalar function has one derivative per input direction. A vector-valued function has one of those per output direction too — a whole matrix. That matrix is the Jacobian, and it's how the chain rule scales up to neural networks."
    >
      <h2>From gradient to Jacobian</h2>
      <p>
        Suppose <M>{tex`G : \mathbb{R}^n \to \mathbb{R}^m`}</M>{" "}
        maps <M>n</M> inputs to <M>m</M> outputs. Each output{" "}
        <M>{tex`G_i`}</M> is a scalar function with its own gradient.
        Stack those gradients as rows and you get the{" "}
        <strong>Jacobian</strong>:
      </p>
      <Block>{tex`J_G(\mathbf{p}) = \begin{bmatrix} \partial G_1 / \partial x_1 & \cdots & \partial G_1 / \partial x_n \\ \vdots & \ddots & \vdots \\ \partial G_m / \partial x_1 & \cdots & \partial G_m / \partial x_n \end{bmatrix}.`}</Block>
      <p>
        It&apos;s an <M>m \times n</M> matrix. Row <M>i</M> is{" "}
        <M>{tex`\nabla G_i`}</M>; column <M>j</M> is the derivative of
        every output with respect to input <M>{tex`x_j`}</M>.
      </p>

      <h2>What it does locally</h2>
      <p>
        The first-order Taylor expansion around a point reads:
      </p>
      <Block>{tex`G(\mathbf{p} + \boldsymbol{\delta}) \approx G(\mathbf{p}) + J_G(\mathbf{p})\, \boldsymbol{\delta}.`}</Block>
      <p>
        In English: <strong>every smooth map is locally a linear
        map plus a constant</strong>, and the Jacobian{" "}
        <em>is</em> that linear map. Zoom into a small enough
        neighbourhood and any curve you applied <M>G</M> to looks like
        a straight line; any square looks like a parallelogram.
      </p>

      <Figure caption="Left: a small square around the point p (blue). Right: G applied to that square is a slightly curved shape (blue outline). The orange parallelogram is the local linearisation — J(p) applied to the same square. Shrink the side ε and the two shapes become identical.">
        <JacobianVisualizer />
      </Figure>

      <h2>Determinant: how much area gets stretched</h2>
      <p>
        When <M>{tex`n = m`}</M>, the Jacobian is square. Its
        determinant tells you the local area / volume scale factor:
      </p>
      <Block>{tex`\operatorname{vol}\bigl(G(\text{tiny box})\bigr) \approx |\det J_G(\mathbf{p})| \cdot \operatorname{vol}(\text{tiny box}).`}</Block>
      <p>
        If <M>{tex`\det J = 0`}</M> at a point, <M>G</M> crushes some
        direction onto a lower-dimensional image there — locally rank
        deficient. The sign of the determinant tells you whether
        orientation is preserved or flipped, just like in the linear
        algebra module.
      </p>

      <h2>The chain rule, in matrix form</h2>
      <p>
        Compose two maps <M>{tex`G : \mathbb{R}^n \to \mathbb{R}^m`}</M>{" "}
        and <M>{tex`H : \mathbb{R}^m \to \mathbb{R}^k`}</M>. The
        Jacobian of <M>{tex`H \circ G`}</M> at <M>{tex`\mathbf{p}`}</M>{" "}
        is a matrix product:
      </p>
      <Block>{tex`J_{H \circ G}(\mathbf{p}) = J_H\bigl(G(\mathbf{p})\bigr) \cdot J_G(\mathbf{p}).`}</Block>
      <p>
        This is the chain rule. The previous chapter&apos;s scalar
        version is the special case where every matrix is{" "}
        <M>1 \times 1</M>. Backprop is what you get when you implement
        this matrix product layer by layer, right to left — but
        we&apos;ll save the algorithm for chapter 8.
      </p>

      <Callout variant="intuition">
        The gradient is a single arrow that says &ldquo;here&apos;s
        the steepest direction.&rdquo; The Jacobian is a whole matrix
        that says &ldquo;here&apos;s the entire linear map that
        approximates me locally.&rdquo; The gradient is one row of a
        Jacobian — the Jacobian of a scalar-valued function.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Every layer of a neural network is a smooth map between
          activation spaces. Its Jacobian is a matrix; the gradient of
          the loss flowing backwards is a vector-matrix product with
          this Jacobian at every layer.
        </p>
        <p>
          A few specific Jacobians worth knowing:
        </p>
        <ul>
          <li>
            <strong>Linear layer</strong>{" "}
            <M>{tex`G(\mathbf{x}) = W \mathbf{x} + \mathbf{b}`}</M>:
            Jacobian is just <M>W</M>.
          </li>
          <li>
            <strong>Elementwise nonlinearity</strong>{" "}
            <M>{tex`G(\mathbf{x})_i = \sigma(x_i)`}</M>: Jacobian is a
            diagonal matrix of <M>{tex`\sigma'(x_i)`}</M>.
          </li>
          <li>
            <strong>Softmax</strong>:{" "}
            <M>{tex`J = \mathrm{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^{\top}`}</M>{" "}
            — a clean rank-deficient matrix that drops out beautifully
            against cross-entropy in backprop.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            For <M>{tex`G(x, y) = (x^2 - y^2,\ 2xy)`}</M>, what is{" "}
            <M>{tex`J_G(1, 0)`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "[[2, 0], [0, 2]]",
            correct: true,
            explain:
              "∂/∂x of (x²−y², 2xy) is (2x, 2y) = (2, 0). ∂/∂y is (−2y, 2x) = (0, 2). Stack as columns.",
          },
          {
            id: "b",
            label: "[[2, 0], [2, 0]]",
            explain:
              "The bottom-right entry is ∂(2xy)/∂y = 2x. At x = 1 that's 2, not 0.",
          },
          {
            id: "c",
            label: "[[1, 0], [0, 1]]",
            explain:
              "That would be the Jacobian of the identity. G is genuinely nonlinear here.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              The softmax map{" "}
              <M>{tex`\sigma : \mathbb{R}^{n} \to \mathbb{R}^{n}`}</M>{" "}
              is
            </p>
            <Block>{tex`p_{i} = \sigma(\mathbf{z})_{i} = \frac{e^{z_{i}}}{\sum_{k} e^{z_{k}}}.`}</Block>
            <p>
              <strong>(a)</strong> Show that
            </p>
            <Block>{tex`\frac{\partial p_{i}}{\partial z_{j}} = p_{i}\bigl(\delta_{ij} - p_{j}\bigr),`}</Block>
            <p>
              and conclude that{" "}
              <M>{tex`J_{\sigma} = \mathrm{diag}(\mathbf{p}) - \mathbf{p}\mathbf{p}^{\top}`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Show that the all-ones vector{" "}
              <M>{tex`\mathbf{1}`}</M> is a left null vector of{" "}
              <M>{tex`J_{\sigma}`}</M>, and explain in one sentence what
              that means about softmax — i.e. why it&apos;s a fact you
              should expect <em>before</em> doing the algebra.
            </p>
            <p>
              <strong>(c)</strong> Now combine softmax with cross-entropy
              loss <M>{tex`L = -\sum_{i} y_{i} \log p_{i}`}</M> for a
              one-hot target <M>{tex`\mathbf{y}`}</M>, and show that
            </p>
            <Block>{tex`\frac{\partial L}{\partial \mathbf{z}} = \mathbf{p} - \mathbf{y}.`}</Block>
            <p>
              The two ugly Jacobians cancel into a single subtraction.
              This is why every neural-network training loop uses
              softmax + cross-entropy together.
            </p>
          </>
        }
        hint={
          <>
            For (a), differentiate the quotient{" "}
            <M>{tex`e^{z_i} / S`}</M> where{" "}
            <M>{tex`S = \sum_{k} e^{z_k}`}</M>, and treat the cases{" "}
            <M>{tex`i = j`}</M> and <M>{tex`i \neq j`}</M> separately —
            then notice they collapse using the Kronecker delta. For (c),
            apply the chain rule:{" "}
            <M>{tex`\partial L / \partial \mathbf{z} = J_{\sigma}^{\top}\, \partial L / \partial \mathbf{p}`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Let{" "}
              <M>{tex`S = \sum_{k} e^{z_{k}}`}</M>. By the quotient rule,
            </p>
            <Block>{tex`\frac{\partial p_{i}}{\partial z_{j}} = \frac{\delta_{ij}\, e^{z_{i}} \cdot S - e^{z_{i}}\cdot e^{z_{j}}}{S^{2}} = \delta_{ij}\, p_{i} - p_{i} p_{j} = p_{i}(\delta_{ij} - p_{j}).`}</Block>
            <p>
              In matrix form,{" "}
              <M>{tex`(J_{\sigma})_{ij} = p_{i}\delta_{ij} - p_{i} p_{j}`}</M>,
              i.e.{" "}
              <M>{tex`J_{\sigma} = \mathrm{diag}(\mathbf{p}) - \mathbf{p} \mathbf{p}^{\top}`}</M>.
            </p>
            <p>
              <strong>(b)</strong>{" "}
              <M>{tex`\mathbf{1}^{\top} J_{\sigma} = \mathbf{p}^{\top} - (\mathbf{1}^{\top}\mathbf{p})\, \mathbf{p}^{\top} = \mathbf{p}^{\top} - \mathbf{p}^{\top} = \mathbf{0}^{\top}`}</M>.
              That&apos;s expected: softmax outputs always sum to{" "}
              <M>1</M>, so summing every row of the Jacobian must give 0
              — perturbing the inputs cannot change the output sum.
            </p>
            <p>
              <strong>(c)</strong> With one-hot{" "}
              <M>{tex`\mathbf{y}`}</M>,{" "}
              <M>{tex`\partial L / \partial p_{i} = -y_{i}/p_{i}`}</M>.
              Chain rule:
            </p>
            <Block>{tex`\frac{\partial L}{\partial z_{j}} = \sum_{i} \frac{\partial L}{\partial p_{i}} \cdot \frac{\partial p_{i}}{\partial z_{j}} = \sum_{i} \Bigl(-\frac{y_{i}}{p_{i}}\Bigr) p_{i}(\delta_{ij} - p_{j}) = -\sum_{i} y_{i}(\delta_{ij} - p_{j}).`}</Block>
            <p>
              Expanding:{" "}
              <M>{tex`= -y_{j} + p_{j}\sum_{i} y_{i} = -y_{j} + p_{j}`}</M>{" "}
              since <M>{tex`\sum_{i} y_{i} = 1`}</M>. So{" "}
              <M>{tex`\partial L/\partial \mathbf{z} = \mathbf{p} - \mathbf{y}`}</M>.
            </p>
            <p>
              That&apos;s the most-used gradient expression in deep
              learning. The rank-deficient softmax Jacobian (singular!
              that <M>{tex`\mathbf{1}`}</M>-null space) and the singular
              <M>{tex`-y/p`}</M> blow-up of cross-entropy <em>cancel</em>{" "}
              to produce a clean, bounded vector. Implementing softmax
              and cross-entropy as separate layers and then chaining
              their gradients numerically is a known footgun: the
              cancellation has to be done symbolically, in advance.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
