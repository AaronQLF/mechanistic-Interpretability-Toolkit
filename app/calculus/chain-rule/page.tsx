import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { ChainRuleComposer } from "@/components/viz/ChainRuleComposer";

export const metadata = {
  title: "The chain rule",
};

export default function ChainRulePage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="chain-rule"
      eyebrow="Chapter 03"
      title="The chain rule"
      lede="The chain rule is the differentiation rule that lets calculus survive composition. Everything in deep learning depends on it. We're spending a whole chapter on this for a reason."
    >
      <h2>The statement</h2>
      <p>
        If <M>y = g(x)</M> and <M>z = h(y)</M>, then the composition{" "}
        <M>{tex`z = h(g(x))`}</M> has derivative
      </p>
      <Block>{tex`\frac{dz}{dx} = \frac{dz}{dy} \cdot \frac{dy}{dx} = h'(g(x)) \cdot g'(x).`}</Block>
      <p>
        In words: the rate at which <M>z</M> changes with respect to{" "}
        <M>x</M> equals the rate at which <M>z</M> changes with{" "}
        <M>y</M>, times the rate at which <M>y</M> changes with{" "}
        <M>x</M>. Rates multiply along the chain.
      </p>

      <h2>Why it has to be true</h2>
      <p>
        Near a point, every differentiable function is approximately
        linear. If a small nudge{" "}
        <M>{tex`\delta x`}</M> produces an approximate nudge{" "}
        <M>{tex`\delta y = g'(x)\,\delta x`}</M>, and that <M>{tex`\delta y`}</M>{" "}
        produces an approximate nudge{" "}
        <M>{tex`\delta z = h'(y)\,\delta y`}</M>, then by substitution
      </p>
      <Block>{tex`\delta z = h'(y) \cdot g'(x) \cdot \delta x.`}</Block>
      <p>
        Divide both sides by <M>{tex`\delta x`}</M> and take the limit.
        That is the proof. The chain rule is just the statement that
        local linearisations compose by multiplication — which they
        have to, because they are scalars.
      </p>

      <Figure caption="Three panels: g(x), then h(y), then h(g(x)). Drag x. The tangent slope of the composition (right panel) equals h ′(g(x)) · g ′(x), exactly the product reported below.">
        <ChainRuleComposer />
      </Figure>

      <h2>Reading the widget</h2>
      <p>
        In the figure, drag <M>x</M>. The first panel shows{" "}
        <M>{tex`y = g(x)`}</M>; its tangent has slope <M>{tex`g'(x)`}</M>.
        The second panel shows <M>{tex`z = h(y)`}</M>; its tangent
        slope is <M>{tex`h'(y)`}</M>, evaluated at the <M>y</M> the
        first panel produced. The third panel shows the composition{" "}
        <M>{tex`z = h(g(x))`}</M>; its tangent slope, no matter which
        functions you pick, equals the product of the other two slopes.
      </p>

      <h2>The chain rule in Leibniz notation</h2>
      <p>
        Leibniz notation makes the chain rule look like a fraction
        cancellation:
      </p>
      <Block>{tex`\frac{dz}{dx} = \frac{dz}{dy} \cdot \frac{dy}{dx}.`}</Block>
      <p>
        The <M>{tex`dy`}</M>s &ldquo;cancel.&rdquo; This is not real
        cancellation — these are not fractions — but the notation was
        designed so the bookkeeping works out as if they were. That
        suggestive shape extends cleanly to longer chains:
      </p>
      <Block>{tex`\frac{dz}{dx} = \frac{dz}{du} \cdot \frac{du}{dv} \cdot \frac{dv}{dw} \cdot \frac{dw}{dx}.`}</Block>
      <p>
        A 50-layer neural network is exactly this kind of long chain,
        with thousands of variables at every step instead of single
        scalars. The same algebra, written one layer at a time, is what
        backpropagation does.
      </p>

      <Callout variant="intuition">
        Imagine a stack of dials, each connected to the next by a gear.
        The chain rule says: if you spin the bottom dial by{" "}
        <M>{tex`\delta x`}</M>, the top dial spins by the{" "}
        <em>product</em> of all the gear ratios. Each layer&apos;s
        derivative is one gear ratio.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A transformer&apos;s output is built from dozens of layers
          stacked in sequence. To compute how much an early activation
          influences a final logit, you multiply the local Jacobian of
          every layer along the path. That product is the chain rule
          in matrix form (next: Jacobians).
        </p>
        <p>
          Attribution methods like <em>integrated gradients</em>,{" "}
          <em>activation patching</em>, and{" "}
          <em>attribution patching</em> all live or die by how
          accurately they evaluate this product. We&apos;ll come back
          to that in the capstone.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            If <M>{tex`f(x) = (3x + 1)^2`}</M>, what is{" "}
            <M>{tex`f'(x)`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "2(3x + 1)",
            explain:
              "Close — you've taken d/dy[y²] = 2y but forgotten the inside derivative. Multiply by g ′(x) = 3.",
          },
          {
            id: "b",
            label: "6(3x + 1)",
            correct: true,
            explain:
              "Chain rule: d/dx[(3x+1)²] = 2(3x+1) · 3 = 6(3x+1). Outer × inner.",
          },
          {
            id: "c",
            label: "9x² + 6x + 1",
            explain:
              "That's f(x) expanded, not f ′(x). You'd still need to differentiate it.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Let <M>{tex`f(x) = x^{x^{x}}`}</M> for <M>{tex`x > 0`}</M>{" "}
              (read right-associatively, i.e.{" "}
              <M>{tex`x^{(x^x)}`}</M>).
            </p>
            <p>
              <strong>(a)</strong> Find <M>{tex`f'(x)`}</M> in closed
              form.
            </p>
            <p>
              <strong>(b)</strong> Evaluate <M>{tex`f'(1)`}</M>.
            </p>
            <p>
              You will need to apply logarithmic differentiation{" "}
              <em>twice</em> — the chain rule once is not enough.
            </p>
          </>
        }
        hint={
          <>
            Let <M>{tex`g(x) = x^{x}`}</M> so that{" "}
            <M>{tex`f(x) = x^{g(x)}`}</M>. First find{" "}
            <M>{tex`g'(x)`}</M> by writing{" "}
            <M>{tex`\ln g = x \ln x`}</M>. Then take{" "}
            <M>{tex`\ln f = g(x) \ln x`}</M> and differentiate.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Let <M>{tex`g(x) = x^x`}</M>. Then{" "}
              <M>{tex`\ln g = x \ln x`}</M>, so
            </p>
            <Block>{tex`\frac{g'(x)}{g(x)} = \ln x + 1 \;\Longrightarrow\; g'(x) = x^{x}(\ln x + 1).`}</Block>
            <p>
              Now <M>{tex`f(x) = x^{g(x)}`}</M> gives{" "}
              <M>{tex`\ln f = g(x)\, \ln x`}</M>. Differentiating both
              sides:
            </p>
            <Block>{tex`\frac{f'(x)}{f(x)} = g'(x)\,\ln x + g(x)\cdot \frac{1}{x} = x^{x}(\ln x + 1)\ln x + \frac{x^{x}}{x}.`}</Block>
            <p>Multiplying back by <M>f</M>,</p>
            <Block>{tex`f'(x) = x^{x^{x}}\Bigl[\, x^{x}(\ln x + 1)\ln x + x^{x - 1}\,\Bigr].`}</Block>
            <p>
              <strong>(b)</strong> At <M>{tex`x = 1`}</M>:{" "}
              <M>{tex`x^{x} = 1`}</M>, <M>{tex`\ln x = 0`}</M>,{" "}
              <M>{tex`x^{x-1} = 1`}</M>, <M>{tex`x^{x^x} = 1`}</M>. The
              bracket reduces to{" "}
              <M>{tex`1 \cdot 1 \cdot 0 + 1 = 1`}</M>, so{" "}
              <M>{tex`f'(1) = 1`}</M>.
            </p>
            <p>
              The takeaway: a tower of compositions{" "}
              <M>{tex`x \to x^x \to x^{x^x}`}</M> produces a chain of
              chain rules. Each layer contributes a factor; the answer is
              the cleaned-up product of all of them. This is exactly what
              backprop is going to do, except the &ldquo;layers&rdquo;
              will be matrices instead of scalars.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
