import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { DirectionalDerivative } from "@/components/viz/DirectionalDerivative";

export const metadata = {
  title: "Directional derivatives",
};

export default function DirectionalDerivativePage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="directional-derivative"
      eyebrow="Chapter 05"
      title="Directional derivatives"
      lede="The gradient tells you the steepest direction. The directional derivative tells you how fast the function changes along any direction you pick — and it turns out to be a dot product."
    >
      <h2>The definition</h2>
      <p>
        Pick a point <M>{tex`\mathbf{p}`}</M> and a unit vector{" "}
        <M>{tex`\mathbf{u}`}</M> in input space. The <strong>directional
        derivative</strong> of <M>F</M> at <M>{tex`\mathbf{p}`}</M> in
        direction <M>{tex`\mathbf{u}`}</M> is the rate at which{" "}
        <M>F</M> changes as you step infinitesimally along{" "}
        <M>{tex`\mathbf{u}`}</M>:
      </p>
      <Block>{tex`D_{\mathbf{u}} F(\mathbf{p}) = \lim_{h \to 0} \frac{F(\mathbf{p} + h\mathbf{u}) - F(\mathbf{p})}{h}.`}</Block>
      <p>
        That&apos;s the 1D derivative of the slice of <M>F</M> along
        the line through <M>{tex`\mathbf{p}`}</M> in direction{" "}
        <M>{tex`\mathbf{u}`}</M>.
      </p>

      <h2>The dot-product identity</h2>
      <p>
        Apply the chain rule to{" "}
        <M>{tex`t \mapsto F(\mathbf{p} + t\mathbf{u})`}</M>: the
        derivative at <M>{tex`t = 0`}</M> is
      </p>
      <Block>{tex`D_{\mathbf{u}} F(\mathbf{p}) = \nabla F(\mathbf{p}) \cdot \mathbf{u}.`}</Block>
      <p>
        That single line is doing a lot of work. The directional
        derivative in any direction is a <em>dot product</em> with the
        gradient — no extra calculation needed beyond the partials
        you already have.
      </p>

      <h2>Why the gradient is the steepest direction</h2>
      <p>
        The dot product factors as{" "}
        <M>{tex`\nabla F \cdot \mathbf{u} = \|\nabla F\|\,\|\mathbf{u}\| \cos\theta = \|\nabla F\| \cos\theta`}</M>{" "}
        since <M>{tex`\mathbf{u}`}</M> has unit length. As{" "}
        <M>{tex`\theta`}</M> varies:
      </p>
      <ul>
        <li>
          <M>{tex`\theta = 0`}</M>: <M>{tex`\mathbf{u}`}</M> aligned with{" "}
          <M>{tex`\nabla F`}</M> — the directional derivative equals{" "}
          <M>{tex`\|\nabla F\|`}</M>, the maximum.
        </li>
        <li>
          <M>{tex`\theta = \pi`}</M>: <M>{tex`\mathbf{u}`}</M> opposite to{" "}
          <M>{tex`\nabla F`}</M> — directional derivative equals{" "}
          <M>{tex`-\|\nabla F\|`}</M>, the minimum (steepest descent).
        </li>
        <li>
          <M>{tex`\theta = \pi / 2`}</M>: orthogonal — directional
          derivative is 0. You&apos;re walking along a{" "}
          <em>level set</em>.
        </li>
      </ul>
      <p>
        Slide the angle <M>{tex`\theta`}</M> in the widget and watch the
        reading swing from <M>{tex`+\|\nabla F\|`}</M> to{" "}
        <M>{tex`-\|\nabla F\|`}</M> and back. Press &ldquo;align u with
        ∇F&rdquo; to see the maximum directly.
      </p>

      <Figure caption="The orange arrow is ∇F; the warm-orange arrow is the chosen unit direction u. The reading ∇F · u is largest when they're parallel and zero when they're perpendicular.">
        <DirectionalDerivative />
      </Figure>

      <h2>Level sets and the gradient&apos;s right angle</h2>
      <p>
        A <strong>level set</strong> of <M>F</M> is the set of points
        where <M>{tex`F = c`}</M> for some constant <M>c</M> — in 2D
        it&apos;s a curve, in 3D it&apos;s a surface, in <M>n</M> -D
        it&apos;s an{" "}
        <M>{tex`(n-1)`}</M>-dimensional sheet. Along a level set the
        function doesn&apos;t change, so the directional derivative is
        zero, so:
      </p>
      <Block>{tex`\nabla F \perp \text{level set through } \mathbf{p}.`}</Block>
      <p>
        The gradient is always perpendicular to its own level sets.
        You can <em>see</em> it in the widget: the gradient arrow
        always crosses the colormap&apos;s level curves at a right
        angle.
      </p>

      <Callout variant="intuition">
        The gradient is a hill-climbing arrow. The directional
        derivative is the projection of that arrow onto whatever
        direction you&apos;re actually walking in. Walk parallel and
        you get the full uphill rate; walk sideways and you get zero;
        walk backwards and you get exactly the negative.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Many interpretability metrics are directional derivatives in
          disguise. The <em>logit gradient with respect to an activation</em>{" "}
          tells you the linear effect of nudging that activation in
          any direction — a dot product with{" "}
          <M>{tex`\nabla_{\mathbf{x}} z`}</M>.
        </p>
        <p>
          Causal scrubbing and attribution patching use approximate
          directional derivatives along the path from a baseline
          activation to a clean one — a first-order approximation of
          the effect of replacing an entire intermediate value.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            Suppose <M>{tex`\nabla F(\mathbf{p}) = (3, 4)`}</M>. What
            is the <em>maximum</em> directional derivative of{" "}
            <M>F</M> at <M>{tex`\mathbf{p}`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "3",
            explain:
              "That's only the x-component of ∇F, not its magnitude.",
          },
          {
            id: "b",
            label: "5",
            correct: true,
            explain:
              "The maximum directional derivative is ‖∇F‖. √(3² + 4²) = 5.",
          },
          {
            id: "c",
            label: "7",
            explain:
              "That's 3 + 4 — but the magnitude is √(9 + 16), not 7.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>Define</p>
            <Block>{tex`f(x, y) = \begin{cases} \dfrac{x\,y^{2}}{x^{2} + y^{4}}, & (x, y) \neq (0, 0), \\ 0, & (x, y) = (0, 0). \end{cases}`}</Block>
            <p>
              <strong>(a)</strong> Show that for{" "}
              <em>every</em> unit vector{" "}
              <M>{tex`\mathbf{u} = (a, b)`}</M> the directional
              derivative <M>{tex`D_{\mathbf{u}} f(\mathbf{0})`}</M>{" "}
              <em>exists</em> and equals 0.
            </p>
            <p>
              <strong>(b)</strong> Show that{" "}
              <M>{tex`\lim_{(x,y) \to (0,0)} f(x, y)`}</M> does not
              exist by examining the path{" "}
              <M>{tex`x = y^{2}`}</M>. Conclude that <M>f</M> is{" "}
              <em>not continuous</em> at the origin — and so cannot be
              differentiable there in the multivariable sense, even
              though every directional derivative through 0 is fine.
            </p>
          </>
        }
        hint={
          <>
            For (a), parametrise{" "}
            <M>{tex`(x, y) = (a t, b t)`}</M> and compute{" "}
            <M>{tex`f(at, bt)/t`}</M> as <M>{tex`t \to 0`}</M>. For (b),
            evaluate <M>f</M> along <M>{tex`x = y^{2}`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Along the line{" "}
              <M>{tex`(at, bt)`}</M>,
            </p>
            <Block>{tex`\frac{f(at, bt)}{t} = \frac{1}{t}\cdot \frac{(at)(bt)^{2}}{(at)^{2} + (bt)^{4}} = \frac{a b^{2}\, t^{2}}{a^{2} + b^{4}\, t^{2}}.`}</Block>
            <p>
              As <M>{tex`t \to 0`}</M> the numerator{" "}
              <M>{tex`\to 0`}</M> and (assuming{" "}
              <M>{tex`a \neq 0`}</M>) the denominator{" "}
              <M>{tex`\to a^{2} \neq 0`}</M>, so the limit is{" "}
              <M>0</M>. If <M>{tex`a = 0`}</M> then{" "}
              <M>{tex`f(0, bt) = 0`}</M> for all <M>t</M>, so the limit
              is again <M>0</M>. Every directional derivative at{" "}
              <M>{tex`\mathbf{0}`}</M> is <M>0</M>.
            </p>
            <p>
              <strong>(b)</strong> On the parabola{" "}
              <M>{tex`x = y^{2}`}</M>,
            </p>
            <Block>{tex`f(y^{2}, y) = \frac{y^{2}\cdot y^{2}}{y^{4} + y^{4}} = \frac{1}{2},`}</Block>
            <p>
              for every <M>{tex`y \neq 0`}</M>. So along this path{" "}
              <M>f</M> approaches <M>{tex`1/2`}</M>, not <M>0</M>. The
              two-variable limit cannot exist; <M>f</M> is not
              continuous at <M>{tex`\mathbf{0}`}</M>.
            </p>
            <p>
              <strong>The lesson.</strong> &ldquo;All directional
              derivatives exist&rdquo; is{" "}
              <em>strictly weaker</em> than &ldquo;differentiable&rdquo;
              in <M>{tex`\mathbb{R}^{n}`}</M>. The proper definition of
              differentiability requires a single linear map (the
              Jacobian) that approximates <M>f</M> uniformly in{" "}
              <em>all</em> directions — not just along straight lines.
              This is one of the most common stumbling blocks when
              moving from 1D calculus to multivariable, and it&apos;s
              the reason the Jacobian deserves its own chapter next.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
