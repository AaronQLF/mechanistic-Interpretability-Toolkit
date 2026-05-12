import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { DerivativeVisualizer } from "@/components/viz/DerivativeVisualizer";

export const metadata = {
  title: "The derivative",
};

export default function DerivativePage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="derivative"
      eyebrow="Chapter 02"
      title="The derivative"
      lede="The derivative is the slope of a curve, made precise. It's the rate at which a function changes at a single point — and a single point is exactly where rates of change feel like they shouldn't exist."
    >
      <h2>From secants to tangents</h2>
      <p>
        For a function <M>f</M> and two nearby points{" "}
        <M>{tex`x_0`}</M> and <M>{tex`x_0 + h`}</M>, the slope of the
        line through{" "}
        <M>{tex`\bigl(x_0, f(x_0)\bigr)`}</M> and{" "}
        <M>{tex`\bigl(x_0 + h, f(x_0 + h)\bigr)`}</M> is
      </p>
      <Block>{tex`\frac{f(x_0 + h) - f(x_0)}{h}.`}</Block>
      <p>
        That&apos;s the <strong>secant slope</strong>: the average rate
        of change of <M>f</M> over an interval of width <M>h</M>. As{" "}
        <M>h</M> shrinks to 0, the secant rotates into a{" "}
        <strong>tangent</strong> line. Its slope is the derivative.
      </p>

      <h2>The definition</h2>
      <Block>{tex`f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}.`}</Block>
      <p>
        Pull the <em>step h</em> slider in the widget toward zero. The
        secant rotates into the tangent. The two slope numbers in the
        panel — the secant slope and{" "}
        <M>{tex`f'(x_0)`}</M> — converge.
      </p>

      <Figure caption="Drag x₀ to move the tangent point. The orange line is the tangent. The dashed line is the secant of width h — slide h to zero and watch its slope match f ′(x₀).">
        <DerivativeVisualizer />
      </Figure>

      <h2>The differentiation rules you actually need</h2>
      <p>
        For the work in mech interp, you need surprisingly few rules.
        Memorize these three:
      </p>
      <ul>
        <li>
          <strong>Power.</strong>{" "}
          <M>{tex`\frac{d}{dx} x^n = n\, x^{n-1}`}</M>.
        </li>
        <li>
          <strong>Sum.</strong>{" "}
          <M>{tex`\frac{d}{dx}(f + g) = f' + g'`}</M>.
        </li>
        <li>
          <strong>Constant multiple.</strong>{" "}
          <M>{tex`\frac{d}{dx}(c\, f) = c\, f'`}</M>.
        </li>
      </ul>
      <p>
        Pair those with a small set of derivatives you already know — {" "}
        <M>{tex`\frac{d}{dx} \sin x = \cos x`}</M>,{" "}
        <M>{tex`\frac{d}{dx} e^x = e^x`}</M>,{" "}
        <M>{tex`\frac{d}{dx} \log x = 1/x`}</M> — and you can handle
        nearly anything that shows up in a neural network. The two
        rules that <em>do</em> the heavy lifting in deep learning, the
        chain rule and the gradient generalisation, each get their own
        chapter next.
      </p>

      <h2>A few derivatives worth seeing</h2>
      <p>
        Try the function selector in the widget. Pay attention to the
        sign of the slope, where it&apos;s zero, and how its magnitude
        responds to the curve&apos;s steepness:
      </p>
      <ul>
        <li>
          <strong>x²</strong> has slope <M>2x</M>. Zero at the origin
          (the bottom of the bowl), negative left of zero, positive
          right of zero.
        </li>
        <li>
          <strong>x³ − 2x</strong> has slope <M>{tex`3x^2 - 2`}</M>.
          Zero at <M>{tex`x = \pm\sqrt{2/3}`}</M> — the two turning
          points.
        </li>
        <li>
          <strong>σ(x)</strong> (the sigmoid) has slope{" "}
          <M>{tex`\sigma(x)(1-\sigma(x))`}</M>. Tiny when{" "}
          <M>{tex`|x|`}</M> is large — the &ldquo;vanishing
          gradient&rdquo; you&apos;ve heard about.
        </li>
        <li>
          <strong>ReLU(x)</strong> has slope 1 for <M>{tex`x > 0`}</M>,
          0 for <M>{tex`x < 0`}</M>, and is non-differentiable at the
          kink — which we ignore in practice.
        </li>
      </ul>

      <Callout variant="intuition">
        A derivative is a single-number summary of how the function
        looks <em>locally</em>: if I nudge <M>x</M> by a tiny{" "}
        <M>{tex`\delta`}</M>, how much does <M>f</M> change? Answer:
        roughly{" "}
        <M>{tex`f'(x)\,\delta`}</M>. That linearisation is the entire
        reason calculus is useful.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Every activation function in a neural network has a derivative
          you can write down. Backprop, which we&apos;ll meet in
          chapter 8, multiplies these derivatives together along the
          computation graph. The vanishing-gradient phenomenon is
          nothing more than what happens when many sigmoid derivatives
          (each at most <M>{tex`1/4`}</M>) get multiplied: the product
          shrinks fast.
        </p>
        <p>
          ReLU exists in deep learning because its derivative is{" "}
          <em>exactly 1</em> on the active side, so no gradient is
          attenuated by passing through it. This is a calculus fact, not
          a mystical empirical finding.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            What is <M>{tex`f'(x)`}</M> if <M>{tex`f(x) = 3x^2 + 5x - 7`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "6x + 5",
            correct: true,
            explain:
              "Power rule term-by-term: 3·2x + 5·1 − 0 = 6x + 5.",
          },
          {
            id: "b",
            label: "3x + 5",
            explain:
              "Power rule says d/dx [x²] = 2x, not x. The 3 carries through.",
          },
          {
            id: "c",
            label: "6x² + 5",
            explain:
              "Differentiation lowers the exponent by 1, not keeps it the same.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>Define</p>
            <Block>{tex`f(x) = \begin{cases} x^{2}\sin(1/x), & x \neq 0, \\ 0, & x = 0. \end{cases}`}</Block>
            <p>
              <strong>(a)</strong> Show that <M>f</M> is differentiable
              at every <M>{tex`x \in \mathbb{R}`}</M>, including{" "}
              <M>{tex`x = 0`}</M>, and compute <M>{tex`f'(0)`}</M> from
              the limit definition.
            </p>
            <p>
              <strong>(b)</strong> Compute <M>{tex`f'(x)`}</M> for{" "}
              <M>{tex`x \neq 0`}</M>, and show that{" "}
              <M>{tex`\lim_{x \to 0} f'(x)`}</M> does <em>not</em> exist.
              Conclude that <M>{tex`f'`}</M> is differentiable everywhere
              but is <em>not continuous</em> at <M>{tex`x = 0`}</M>.
            </p>
          </>
        }
        hint={
          <>
            For (a), bound{" "}
            <M>{tex`|x \sin(1/x)| \leq |x|`}</M> and squeeze. For (b),
            differentiate using product and chain rules off the origin,
            and look at the <M>{tex`\cos(1/x)`}</M> term as{" "}
            <M>{tex`x \to 0`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> The difference quotient at 0 is
            </p>
            <Block>{tex`\frac{f(h) - f(0)}{h} = \frac{h^2 \sin(1/h)}{h} = h\sin(1/h).`}</Block>
            <p>
              Since <M>{tex`|\sin(1/h)| \leq 1`}</M>, we have{" "}
              <M>{tex`|h \sin(1/h)| \leq |h|`}</M>, so by squeeze the
              limit is 0. Hence <M>{tex`f'(0) = 0`}</M>.
            </p>
            <p>
              <strong>(b)</strong> For <M>{tex`x \neq 0`}</M>, product
              and chain rules give
            </p>
            <Block>{tex`f'(x) = 2x \sin(1/x) + x^{2}\cos(1/x)\cdot(-1/x^{2}) = 2x\sin(1/x) - \cos(1/x).`}</Block>
            <p>
              The first term tends to 0 as{" "}
              <M>{tex`x \to 0`}</M>. The second oscillates between{" "}
              <M>{tex`-1`}</M> and <M>1</M> on every neighbourhood of 0,
              so <M>{tex`\lim_{x \to 0} f'(x)`}</M> does not exist.
            </p>
            <p>
              So <M>{tex`f'(0) = 0`}</M> exists, but{" "}
              <M>{tex`f'(x)`}</M> doesn&apos;t even tend to 0 as{" "}
              <M>{tex`x \to 0`}</M>. Differentiability of <M>f</M> does
              not imply continuity of <M>{tex`f'`}</M>. The textbook
              statement &ldquo;<M>{tex`f \in C^{1}`}</M>&rdquo; is
              strictly stronger than &ldquo;<M>f</M> differentiable.&rdquo;
              Most ML proofs that quietly use{" "}
              <M>{tex`C^{1}`}</M> assumptions break on functions like
              this — including, in spirit, ReLU networks at their kinks.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
