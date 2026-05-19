import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
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

      <Challenge
        prompt={
          <>
            <p>
              Sort the model&apos;s next-token distribution as{" "}
              <M>{tex`p_{(1)} \ge p_{(2)} \ge \cdots \ge p_{(K)}`}</M>{" "}
              and let{" "}
              <M>{tex`F_{k} = \sum_{i \le k} p_{(i)}`}</M> be the
              cumulative.
            </p>
            <p>
              <strong>(a)</strong> The top-<M>p</M> (nucleus) set is
              defined as the smallest prefix{" "}
              <M>{tex`\{(1), (2), \ldots, (k^{\star})\}`}</M> such
              that{" "}
              <M>{tex`F_{k^{\star}} \ge p`}</M>. Show that{" "}
              <M>{tex`k^{\star}`}</M> is well-defined and unique
              (assuming all{" "}
              <M>{tex`p_{(i)} > 0`}</M>; what subtlety arises with
              ties on the boundary?). Show that the renormalized
              distribution has support exactly the top-<M>p</M> set
              and produces every token in it with probability at
              least{" "}
              <M>{tex`p_{(k^{\star})}/F_{k^{\star}} \ge p_{(k^{\star})}`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Compose top-<M>k</M> and
              temperature{" "}
              <M>T</M>: keep the top-<M>k</M> tokens (in the original
              ranking), then apply softmax-at-temperature on their
              logits, then sample. Show this is{" "}
              <em>not</em> in general the same as applying
              temperature{" "}
              <em>first</em> and then truncating to top-<M>k</M> —
              even though both produce a distribution supported on
              <M>k</M> tokens. Identify the case where they{" "}
              <em>do</em> agree.
            </p>
            <p>
              <strong>(c)</strong> Two evaluators run the same model
              on the same prompt with the same logits. Evaluator A
              uses temperature 0 (greedy); evaluator B uses
              temperature 1 with top-<M>p</M>{" "}
              <M>{tex`= 0.01`}</M>. Show that they always pick the
              same token, in the absence of ties. What does this
              tell you about why the &ldquo;correct&rdquo; metric for
              comparing two models — or two checkpoints — must be
              defined on the <em>distribution</em>, not on a sampled
              completion?
            </p>
          </>
        }
        hint={
          <>
            For (a): the cumulative is non-decreasing; pick the
            smallest <M>k</M> with{" "}
            <M>{tex`F_{k} \ge p`}</M>. For (b): in general, the
            <em>set of top-k tokens</em> is determined by the
            ranking of logits, which temperature does not change —
            but the <em>distribution</em> over the kept set
            differs. For (c): top-<M>p</M> 0.01 selects tokens
            covering 1% of mass.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`F_{k}`}</M> is non-decreasing in{" "}
              <M>k</M> with{" "}
              <M>{tex`F_{0} = 0`}</M>,{" "}
              <M>{tex`F_{K} = 1`}</M>. For any{" "}
              <M>{tex`p \in (0, 1]`}</M> there is a unique smallest{" "}
              <M>{tex`k^{\star}`}</M> with{" "}
              <M>{tex`F_{k^{\star}} \ge p`}</M> (the first time the
              cumulative crosses or hits <M>p</M>). The subtlety:
              when{" "}
              <M>{tex`F_{k^{\star}} = p`}</M> exactly, both{" "}
              <M>{tex`k^{\star}`}</M> and{" "}
              <M>{tex`k^{\star} + 1`}</M> include enough mass; the
              standard convention is to take the smaller. Also,
              ties in{" "}
              <M>{tex`p_{(i)}`}</M> at the boundary make the
              &ldquo;sort&rdquo; ambiguous; implementations break
              ties by token index, which is reproducible but
              arbitrary.
            </p>
            <p>
              The renormalized distribution is{" "}
              <M>{tex`q_{(i)} = p_{(i)}/F_{k^{\star}}`}</M> for{" "}
              <M>{tex`i \le k^{\star}`}</M> and 0 otherwise. The
              smallest renormalized probability is{" "}
              <M>{tex`q_{(k^{\star})} = p_{(k^{\star})}/F_{k^{\star}}`}</M>;
              since{" "}
              <M>{tex`F_{k^{\star}} \le 1`}</M>, this is at least{" "}
              <M>{tex`p_{(k^{\star})}`}</M>. So nucleus sampling
              never <em>decreases</em> the probability of any kept
              token — every kept token gets at least its original
              mass.
            </p>
            <p>
              <strong>(b)</strong> Temperature scaling is monotone
              in logits, so it preserves the ranking; the set of
              top-<M>k</M> tokens is the same whether you apply
              temperature first or last. So both procedures end up
              with support on the same <M>k</M> tokens. But the
              renormalization differs:
              <Block>{tex`\text{(top-k then } T\text{)} \;\propto\; \exp(z_{(i)}/T) \quad \text{for } i \le k,`}</Block>
              <Block>{tex`(T\text{ then top-k}) \;\propto\; \mathrm{softmax}(\mathbf{z}/T)_{(i)} \;=\; \exp(z_{(i)}/T)/\sum_{j} \exp(z_{(j)}/T) \;\text{ then renormalize over top-k}.`}</Block>
              Both are proportional to{" "}
              <M>{tex`\exp(z_{(i)}/T)`}</M> with the same
              normalizer over the top-<M>k</M>, so{" "}
              <em>actually they are identical</em>. The agreement
              comes from the fact that softmax composes well with
              renormalization. Where they differ in practice is
              when temperature is applied <em>before</em> ranking
              and you use it to <em>determine</em> the top-<M>k</M>{" "}
              set — but ranking by logits and ranking by
              softmax-at-T-of-logits is the same.
            </p>
            <p>
              The genuinely non-commuting case is{" "}
              <em>top-<M>p</M></em> with temperature: the cumulative{" "}
              <M>{tex`F_{k}`}</M> over the temperature-scaled
              distribution is sharper at low <M>T</M> (one token
              dominates), so the chosen{" "}
              <M>{tex`k^{\star}`}</M> can differ from the
              original-distribution{" "}
              <M>{tex`k^{\star}`}</M>. Here, applying temperature
              before vs.&nbsp;after top-<M>p</M> gives genuinely
              different supports.
            </p>
            <p>
              <strong>(c)</strong> Greedy picks the argmax. Top-<M>p</M>
              with{" "}
              <M>{tex`p = 0.01`}</M> picks the smallest prefix whose
              mass is{" "}
              <M>{tex`\ge 0.01`}</M>; if{" "}
              <M>{tex`p_{(1)} \ge 0.01`}</M> (the most probable
              token has at least 1% mass — true for almost any
              language-model prompt), the prefix is{" "}
              <em>just the argmax</em>, and after renormalization
              its probability is 1. So evaluator B also samples the
              argmax, identical to greedy.
            </p>
            <p>
              The lesson: two very different-looking sampling
              configurations can produce identical token sequences
              even though their <em>distributions</em> are wildly
              different. If you compare two models by string-match
              on a single sampled completion, you can be fooled into
              thinking they behave the same when they secretly have
              very different next-token distributions. The right
              metric is on the distribution itself — KL,
              cross-entropy, logit difference — and the right
              experimental procedure controls the decoding strategy
              explicitly. This is the same lesson we drew in the
              chapter&apos;s mech-interp callout, restated as a
              theorem: model comparisons must factor through the
              distribution, not the sampler.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
