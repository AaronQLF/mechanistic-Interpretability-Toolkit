import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { GradientDescentLab } from "@/components/viz/GradientDescentLab";

export const metadata = {
  title: "Gradient descent",
};

export default function GradientDescentPage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="gradient-descent"
      eyebrow="Chapter 07"
      title="Gradient descent"
      lede="Walk downhill in small steps. Step in the direction opposite to the gradient. Repeat. That's the entire algorithm that fits every neural network — and it has more failure modes than you'd think."
    >
      <h2>The update rule</h2>
      <p>
        Given a scalar function <M>{tex`F(\boldsymbol{\theta})`}</M> we
        want to minimise, the gradient-descent update is:
      </p>
      <Block>{tex`\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta\, \nabla F(\boldsymbol{\theta}_t).`}</Block>
      <p>
        <M>{tex`\eta`}</M> is the <strong>learning rate</strong>: the
        size of each step. Everything in the line above is a vector
        the same shape as <M>{tex`\boldsymbol{\theta}`}</M>. From the
        last two chapters: <M>{tex`-\nabla F`}</M> is the direction of
        fastest decrease.
      </p>

      <h2>What can go wrong</h2>
      <p>
        Three failure modes are worth feeling. Play with the widget
        between paragraphs.
      </p>
      <ul>
        <li>
          <strong>Tiny η — too slow.</strong> The path crawls. You
          reach the minimum eventually, but you waste compute.
        </li>
        <li>
          <strong>Big η — overshoot.</strong> The step lands across
          the valley from where it started. With <M>{tex`\eta`}</M>{" "}
          too large, the trajectory bounces and can even diverge to
          infinity.
        </li>
        <li>
          <strong>Ill-conditioning.</strong> The{" "}
          <em>ellipse</em> preset has gradient{" "}
          <M>{tex`(2x, 12y)`}</M> — six times steeper in <M>y</M>{" "}
          than in <M>x</M>. The same step size feels too small for{" "}
          <M>x</M> and too large for <M>y</M>; the path zig-zags.
          This is the case that motivates momentum and adaptive
          optimisers (Adam, RMSProp).
        </li>
      </ul>

      <Figure caption="Drag the grey start dot. Pick a function. Step or hit Run. The dashed line is the gradient ∇F, the warm-orange arrow is the actual step −η ∇F. The black trace records the path so far.">
        <GradientDescentLab />
      </Figure>

      <h2>The saddle problem</h2>
      <p>
        The <em>saddle</em> preset has{" "}
        <M>{tex`\nabla F = (2x, -2y)`}</M>. Near the origin the
        gradient is small, so steps are small, but the origin is{" "}
        <em>not</em> a minimum — it&apos;s a saddle. Standard gradient
        descent does <em>not</em> get stuck at saddles (gravity wins
        eventually), but it slows down dramatically near them. In
        high dimensions, where saddles are exponentially more common
        than minima, this is the actual reason training stalls.
      </p>

      <h2>The right metaphor</h2>
      <p>
        Imagine the function as a landscape and a ball dropped at the
        start point. Gravity pulls the ball straight downhill (which
        is what gradient descent does at every step). The ball
        doesn&apos;t see the rest of the terrain — it only knows the
        local slope. With a small enough step size, it eventually
        comes to rest at a valley floor. Whether that valley is{" "}
        <em>the</em> minimum or just a local one is a question the
        algorithm cannot answer on its own.
      </p>

      <h2>From toy to training</h2>
      <p>
        Real models replace the explicit function above with one whose
        gradient is computed via backprop (next chapter), and replace
        the deterministic step with a <strong>stochastic</strong> one
        that estimates the gradient on a mini-batch of data. The
        update rule is unchanged. The vibe is the same.
      </p>

      <Callout variant="intuition">
        Gradient descent is gradient descent. Adam is gradient descent
        with per-parameter step sizes that learn from past gradients.
        Momentum is gradient descent that remembers velocity. Newton
        is gradient descent that also uses curvature. Everything in
        modern optimisation is some flavour of &ldquo;follow the
        local downhill, with a smarter step.&rdquo;
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Pre-training a large language model takes about{" "}
          <M>{tex`10^{20}`}</M> gradient-descent steps in a space of{" "}
          <M>{tex`10^{11}`}</M> dimensions. Every single weight in the
          final checkpoint exists because a gradient told it to move,
          one tiny step at a time.
        </p>
        <p>
          Most interpretability work assumes a model that&apos;s
          finished training and has zero gradient with respect to its
          loss on the data. But there&apos;s also a growing line of
          work — <em>circuit-by-circuit</em>, <em>gradient routing</em>{" "}
          — that uses gradients <em>at inference time</em> to ask
          counterfactual questions about the model.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            On the <em>ellipse</em> preset, raising the learning rate
            past a certain point makes the trajectory{" "}
            <em>diverge</em>. Why?
          </>
        }
        choices={[
          {
            id: "a",
            label: "The gradient becomes incorrect at large η.",
            explain:
              "The gradient is the same regardless of η. What changes is how far you walk along it.",
          },
          {
            id: "b",
            label: "Steps along the steep y-direction overshoot.",
            correct: true,
            explain:
              "The y partial is 12y, so the y-step is 12·η·y. Once η > 1/6 the y-step is larger than y itself, and each iteration grows.",
          },
          {
            id: "c",
            label: "The function is unbounded above.",
            explain:
              "It is unbounded as ‖θ‖ → ∞, but that doesn't on its own cause divergence — small enough η still converges.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Let <M>{tex`A \in \mathbb{R}^{n \times n}`}</M> be
              symmetric positive-definite with eigenvalues{" "}
              <M>{tex`0 < \lambda_{\min} \leq \cdots \leq \lambda_{\max}`}</M>,
              and consider the quadratic loss
            </p>
            <Block>{tex`F(\mathbf{x}) = \tfrac{1}{2}\, \mathbf{x}^{\top} A\, \mathbf{x}.`}</Block>
            <p>
              <strong>(a)</strong> Show that gradient descent with step{" "}
              <M>{tex`\eta`}</M> is the linear iteration{" "}
              <M>{tex`\mathbf{x}_{t+1} = (I - \eta A)\, \mathbf{x}_{t}`}</M>,
              and conclude that GD converges from every starting point
              iff <M>{tex`0 < \eta < 2/\lambda_{\max}`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Find the step size{" "}
              <M>{tex`\eta^{\star}`}</M> that minimises the worst-case
              contraction rate, and show it is
            </p>
            <Block>{tex`\eta^{\star} = \frac{2}{\lambda_{\min} + \lambda_{\max}}, \qquad \text{rate} = \frac{\kappa - 1}{\kappa + 1}, \quad \kappa = \frac{\lambda_{\max}}{\lambda_{\min}}.`}</Block>
            <p>
              <strong>(c)</strong> Interpret the &ldquo;ellipse&rdquo;
              preset in the widget — where{" "}
              <M>{tex`A = \mathrm{diag}(2, 12)`}</M>, so{" "}
              <M>{tex`\kappa = 6`}</M> — through this lens. What
              optimal step size and rate does the formula predict, and
              why does naive GD <em>actually</em> achieve a much worse
              rate?
            </p>
          </>
        }
        hint={
          <>
            For (a), diagonalise:{" "}
            <M>{tex`A = Q \Lambda Q^{\top}`}</M> and look at the
            iteration in the eigenbasis. For (b), each eigen-coordinate
            contracts by <M>{tex`|1 - \eta \lambda_{i}|`}</M>; the
            worst-case is at the extremes. Solve the minimax over{" "}
            <M>{tex`\eta`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`\nabla F(\mathbf{x}) = A\mathbf{x}`}</M>, so
            </p>
            <Block>{tex`\mathbf{x}_{t+1} = \mathbf{x}_{t} - \eta\, A \mathbf{x}_{t} = (I - \eta A)\, \mathbf{x}_{t}.`}</Block>
            <p>
              Diagonalise <M>{tex`A = Q \Lambda Q^{\top}`}</M> with{" "}
              <M>{tex`\Lambda = \mathrm{diag}(\lambda_{i})`}</M>, and let{" "}
              <M>{tex`\tilde{\mathbf{x}} = Q^{\top}\mathbf{x}`}</M>. Then
              each coordinate{" "}
              <M>{tex`\tilde{x}_{i, t+1} = (1 - \eta \lambda_{i})\, \tilde{x}_{i, t}`}</M>{" "}
              evolves independently and contracts iff{" "}
              <M>{tex`|1 - \eta \lambda_{i}| < 1`}</M>, i.e.{" "}
              <M>{tex`0 < \eta < 2/\lambda_{i}`}</M>. Convergence for{" "}
              <em>every</em> starting point requires this for all{" "}
              <M>i</M>; the binding constraint is the largest
              eigenvalue, giving{" "}
              <M>{tex`0 < \eta < 2 / \lambda_{\max}`}</M>.
            </p>
            <p>
              <strong>(b)</strong> The contraction factor in coordinate{" "}
              <M>i</M> is <M>{tex`|1 - \eta \lambda_{i}|`}</M>. The
              worst (slowest) coordinate dominates. As <M>{tex`\eta`}</M>{" "}
              grows from 0:
            </p>
            <ul>
              <li>
                The factor for{" "}
                <M>{tex`\lambda_{\min}`}</M> is{" "}
                <M>{tex`1 - \eta \lambda_{\min}`}</M> (positive,
                decreasing).
              </li>
              <li>
                The factor for{" "}
                <M>{tex`\lambda_{\max}`}</M> is{" "}
                <M>{tex`|1 - \eta \lambda_{\max}|`}</M>; it decreases
                until <M>{tex`\eta = 1/\lambda_{\max}`}</M> then
                increases.
              </li>
            </ul>
            <p>
              The optimum balances the two, i.e.{" "}
              <M>{tex`1 - \eta \lambda_{\min} = \eta \lambda_{\max} - 1`}</M>,
              giving
            </p>
            <Block>{tex`\eta^{\star} = \frac{2}{\lambda_{\min} + \lambda_{\max}},\qquad \text{rate} = 1 - \eta^{\star}\lambda_{\min} = \frac{\lambda_{\max} - \lambda_{\min}}{\lambda_{\max} + \lambda_{\min}} = \frac{\kappa - 1}{\kappa + 1}.`}</Block>
            <p>
              <strong>(c)</strong> For{" "}
              <M>{tex`A = \mathrm{diag}(2, 12)`}</M>:{" "}
              <M>{tex`\eta^{\star} = 2/14 \approx 0.143`}</M>, rate{" "}
              <M>{tex`5/7 \approx 0.71`}</M>. Each step shaves off only
              ~29% of the error. The widget&apos;s zig-zag is exactly
              this: a single step size cannot be small enough for the
              steep <M>y</M>-direction <em>and</em> large enough for the
              shallow <M>x</M>-direction. Adam, RMSProp, and momentum
              all exist to attack this <M>\kappa</M>-dependence:
              they effectively rescale per coordinate so the conditioning
              becomes <M>{tex`\kappa = 1`}</M> and the rate becomes 0
              (one-step convergence on a quadratic).
            </p>
            <p>
              For real neural networks the loss isn&apos;t quadratic,
              but{" "}
              <M>{tex`\kappa(\nabla^{2} L)`}</M> at the optimum still
              controls the local convergence rate. This is the textbook
              reason curvature-aware optimisers exist.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
