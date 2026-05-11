import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SamplingExplorer } from "@/components/viz/SamplingExplorer";

export const metadata = {
  title: "Sampling: greedy, temperature, top-k, top-p",
};

export default function SamplingPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="sampling"
      eyebrow="Chapter 09"
      title="Sampling: greedy, temperature, top-k, top-p"
      lede="A language model gives you a distribution. To produce a word you have to pick one. There are four classic ways to make that pick — they're all knobs that trade off boring against incoherent."
    >
      <h2>The shape of every strategy</h2>
      <p>
        Every sampling strategy is a two-step recipe:
      </p>
      <ol>
        <li>
          Take the model&apos;s raw distribution and reshape it: zero
          out some tokens, sharpen or flatten what remains, renormalize.
        </li>
        <li>
          Draw one token from the reshaped distribution.
        </li>
      </ol>
      <p>
        The figure below is step 1 only — the reshaping. Tokens that
        get zeroed out are greyed; tokens that survive form the new
        distribution. Step 2 is then a single call to a categorical
        sampler.
      </p>

      <Figure caption="Top: a token's raw next-token distribution. Bottom: the same distribution after the chosen strategy. Greyed bars are zeroed; coloured bars are renormalized to sum to 1. The entropy H drops as you sharpen.">
        <SamplingExplorer />
      </Figure>

      <h2>Greedy decoding</h2>
      <p>
        Pick the highest-probability token, every time:
      </p>
      <Block>{tex`x_t = \arg\max_{x} p(x \mid x_{<t}).`}</Block>
      <p>
        Deterministic, fast, and prone to dead-ends and repetition. The
        model gets locked into whatever loop has the highest local
        probability, even when slightly downgrading the immediate token
        would unlock a much better continuation.
      </p>

      <h2>Temperature sampling</h2>
      <p>
        Replace softmax with softmax-at-temperature <M>T</M> (chapter 6)
        and sample. <M>{tex`T = 1`}</M> is the original distribution;{" "}
        <M>{tex`T \to 0`}</M> approaches greedy; <M>{tex`T \to \infty`}</M>{" "}
        approaches uniform. Most public APIs let you set this directly.
      </p>

      <h2>Top-k</h2>
      <p>
        Keep the <M>k</M> most probable tokens; zero out the rest;
        renormalize; sample. Very simple, very effective. The only
        catch: <M>k</M> is fixed, so on flat distributions you cut off
        too little (sampler stays incoherent) and on peaky distributions
        you cut off too much (sampler is forced to consider silly
        alternatives to a near-certain top token).
      </p>

      <h2>Top-p (nucleus)</h2>
      <p>
        Keep the smallest set of tokens whose cumulative probability
        exceeds <M>p</M>; zero out the rest; renormalize; sample. The
        set size <M>k</M> auto-adjusts to the shape of the distribution
        — peaky distributions shrink to one or two tokens, flat ones
        retain many. In practice this is the default in most modern
        text generation.
      </p>

      <Callout variant="intuition">
        <p>
          A useful mental model: greedy is &ldquo;pick the safest
          word.&rdquo; Temperature is a global thermostat between safe
          and creative. Top-k is &ldquo;allow surprises, but only from
          the top <M>k</M> candidates.&rdquo; Top-p is &ldquo;allow
          surprises, but only from candidates that together make up the
          top <M>p</M> of probability mass.&rdquo;
        </p>
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Sampling strategy is not a property of the model — it&apos;s a
          decoder choice that lives outside the network. Two consequences
          for interpretability:
        </p>
        <ul>
          <li>
            When you compare two models or two checkpoints, hold
            decoding fixed (greedy, or fixed seed and temperature).
            Otherwise you&apos;re measuring the decoder, not the model.
          </li>
          <li>
            The behaviour you care about (induction, refusal, in-context
            recall) is usually a property of the <em>distribution</em>{" "}
            the model outputs, not the specific token a sampler
            happened to pick. The right interpretability metric is
            almost always something like KL or logit difference, not
            string match against a sampled completion.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            With temperature <M>{tex`T = 1`}</M> and top-p <M>{tex`p = 1`}</M>,
            sampling becomes equivalent to what?
          </>
        }
        choices={[
          {
            id: "a",
            label: "Greedy decoding.",
            explain:
              "Greedy would require T → 0 or top-k = 1. With p = 1 the entire distribution is retained.",
          },
          {
            id: "b",
            label: "Sampling from the raw model distribution.",
            correct: true,
            explain:
              "T = 1 doesn't reshape; p = 1 keeps every token. This is just plain categorical sampling.",
          },
          {
            id: "c",
            label: "Uniform sampling.",
            explain:
              "That would require T → ∞ to flatten the distribution. T = 1 keeps the original shape.",
          },
        ]}
      />
    </ChapterShell>
  );
}
