import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { LimitExplorer } from "@/components/viz/LimitExplorer";

export const metadata = {
  title: "Limits & continuity",
};

export default function LimitsPage() {
  return (
    <ChapterShell
      moduleSlug="calculus"
      chapterSlug="limits"
      eyebrow="Chapter 01"
      title="Limits & continuity"
      lede="Before we can talk about an 'instantaneous' rate of change, we need a way to talk about 'getting arbitrarily close' to a value without actually getting there. That's the entire job of a limit."
    >
      <h2>The idea, in one sentence</h2>
      <p>
        We write
      </p>
      <Block>{tex`\lim_{x \to a} f(x) = L`}</Block>
      <p>
        to mean: as <M>x</M> gets close to <M>a</M> from either side,{" "}
        <M>{tex`f(x)`}</M> gets close to <M>L</M>. We are not asking
        what <M>{tex`f(a)`}</M> equals — the function might not even be
        defined there. We&apos;re asking what value the function{" "}
        <em>approaches</em>.
      </p>

      <h2>The classic example</h2>
      <p>
        Consider
      </p>
      <Block>{tex`f(x) = \frac{x^2 - 1}{x - 1}.`}</Block>
      <p>
        At <M>{tex`x = 1`}</M>, the numerator and denominator are both
        zero, so the formula is{" "}
        <M>{tex`0 / 0`}</M> — undefined. But algebraically we can
        factor:
      </p>
      <Block>{tex`\frac{x^2 - 1}{x - 1} = \frac{(x-1)(x+1)}{x-1} = x + 1, \quad x \neq 1.`}</Block>
      <p>
        The function is identical to <M>{tex`x + 1`}</M> at every point
        except <M>{tex`x = 1`}</M>, where it has a single missing point.
        The limit at that hole is what the graph &ldquo;wants&rdquo; to
        be:
      </p>
      <Block>{tex`\lim_{x \to 1} \frac{x^2 - 1}{x - 1} = 2.`}</Block>

      <p>
        Pull the slider below to watch <M>h</M> shrink. The left
        and right approach points converge to the open circle even
        though the function is never defined there.
      </p>

      <Figure caption="Slide h toward 0. The red and green dots are f(a − h) and f(a + h). They approach the same value — that value is the limit, marked with an open circle.">
        <LimitExplorer />
      </Figure>

      <h2>One-sided limits</h2>
      <p>
        We can also ask the question from only one side. The{" "}
        <strong>right-hand limit</strong> and{" "}
        <strong>left-hand limit</strong> are
      </p>
      <Block>{tex`\lim_{x \to a^{+}} f(x), \qquad \lim_{x \to a^{-}} f(x).`}</Block>
      <p>
        The two-sided limit <M>{tex`\lim_{x \to a} f(x)`}</M> exists{" "}
        <em>only when</em> both one-sided limits exist and agree. The
        &ldquo;jump&rdquo; preset in the widget is the canonical case
        where they disagree:
      </p>
      <Block>{tex`\lim_{x \to 0^{-}} \mathrm{sign}(x) = -1, \quad \lim_{x \to 0^{+}} \mathrm{sign}(x) = +1, \quad \lim_{x \to 0} \mathrm{sign}(x)\ \text{does not exist}.`}</Block>

      <h2>Continuity</h2>
      <p>
        A function <M>f</M> is <strong>continuous</strong> at{" "}
        <M>{tex`x = a`}</M> when three things are all true:
      </p>
      <ol>
        <li>
          <M>{tex`f(a)`}</M> is defined.
        </li>
        <li>
          <M>{tex`\lim_{x \to a} f(x)`}</M> exists.
        </li>
        <li>
          The two are equal: <M>{tex`\lim_{x \to a} f(x) = f(a)`}</M>.
        </li>
      </ol>
      <p>
        Continuous functions are the well-behaved ones. They have no
        holes, no jumps, no vertical asymptotes. We&apos;ll spend the
        rest of this module assuming the functions we differentiate
        are at least continuous, and usually smoother than that.
      </p>

      <Callout variant="intuition">
        A limit is the answer to &ldquo;what value does <M>f</M> look
        like it&apos;s heading toward?&rdquo; You don&apos;t have to
        plug the input in. You don&apos;t even need the input to be in
        the domain. You just need the heading to be the same from both
        sides.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Real neural network functions are continuous (and almost
          everywhere differentiable). ReLUs make them non-smooth at the
          kinks, but never discontinuous — the limit from below and
          above both agree at 0. That&apos;s the reason backprop
          &ldquo;just works&rdquo; on networks with ReLUs, even though
          the textbook chain rule strictly assumes differentiability.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            What is{" "}
            <M>{tex`\displaystyle \lim_{x \to 0} \frac{\sin x}{x}`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "0",
            explain:
              "At x = 0 both numerator and denominator are 0 — the indeterminate form 0/0. Plugging in is the wrong move.",
          },
          {
            id: "b",
            label: "1",
            correct: true,
            explain:
              "A classic limit; the widget agrees. As x shrinks, sin x and x match to first order: sin x ≈ x.",
          },
          {
            id: "c",
            label: "Does not exist.",
            explain:
              "The function is symmetric around 0 and approaches the same value from both sides — the limit exists.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Evaluate
            </p>
            <Block>{tex`\lim_{x \to 0}\, \frac{(1 + x)^{1/x} - e}{x}.`}</Block>
            <p>
              The expression <M>{tex`(1 + x)^{1/x}`}</M> already tends to{" "}
              <M>e</M> as <M>{tex`x \to 0`}</M>, so this is a{" "}
              <M>{tex`0/0`}</M> indeterminate form. The numerator is
              going to <em>zero</em>, but how fast?
            </p>
          </>
        }
        hint={
          <>
            Take the log of the base, expand{" "}
            <M>{tex`\ln(1+x)`}</M> to <em>third</em> order in <M>x</M>,
            then re-exponentiate. You&apos;ll need terms up to{" "}
            <M>{tex`O(x^2)`}</M> in the exponent — the leading-order
            answer alone gives just <M>e</M>.
          </>
        }
        solution={
          <>
            <p>
              Write{" "}
              <M>{tex`(1+x)^{1/x} = \exp\!\bigl(\tfrac{1}{x} \ln(1+x)\bigr)`}</M>.
              Using the Taylor expansion
            </p>
            <Block>{tex`\ln(1 + x) = x - \tfrac{x^2}{2} + \tfrac{x^3}{3} + O(x^4),`}</Block>
            <p>we get</p>
            <Block>{tex`\frac{1}{x}\ln(1 + x) = 1 - \tfrac{x}{2} + \tfrac{x^2}{3} + O(x^3).`}</Block>
            <p>
              Subtract the leading <M>1</M> and exponentiate using{" "}
              <M>{tex`e^{1 + u} = e\,(1 + u + u^2/2 + \dots)`}</M> with{" "}
              <M>{tex`u = -x/2 + x^2/3 + O(x^3)`}</M>:
            </p>
            <Block>{tex`(1+x)^{1/x} = e\Bigl(1 - \tfrac{x}{2} + \tfrac{11 x^2}{24} + O(x^3)\Bigr).`}</Block>
            <p>
              Therefore{" "}
              <M>{tex`(1+x)^{1/x} - e = -\tfrac{e}{2}\,x + O(x^2)`}</M>,
              and dividing by <M>x</M>,
            </p>
            <Block>{tex`\lim_{x \to 0} \frac{(1+x)^{1/x} - e}{x} = -\frac{e}{2}.`}</Block>
            <p>
              The lesson: an indeterminate form can hide a{" "}
              <em>scale</em> in the numerator that only Taylor expansion
              cleanly recovers. L&apos;Hôpital here is a nightmare —
              you&apos;d differentiate <M>{tex`(1+x)^{1/x}`}</M>{" "}
              implicitly and end up doing the same expansion in disguise.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
