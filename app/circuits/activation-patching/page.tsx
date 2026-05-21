import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { ActivationPatchingDemo } from "@/components/viz/ActivationPatchingDemo";

export const metadata = {
  title: "Activation patching",
};

export default function ActivationPatchingPage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="activation-patching"
      eyebrow="Chapter 04"
      title="Activation patching"
      lede="Two forward passes, one swap, one measurement. Activation patching is the workhorse causal intervention of mech interp: it tells you which components carry which information, with logit-difference precision and almost no machinery."
    >
      <h2>The procedure</h2>
      <p>
        You have two prompts that differ in exactly the property
        you want to study:
      </p>
      <ul>
        <li>
          <strong>Clean prompt</strong> <M>{tex`x^c`}</M>: produces
          the answer you want to explain.
        </li>
        <li>
          <strong>Corrupted prompt</strong> <M>{tex`x^{*}`}</M>:
          identical in length and structure, but with the relevant
          fact changed. (For IOI, swap which name is the subject
          and which is the indirect object.)
        </li>
      </ul>
      <p>
        Then for any chosen component <M>C</M> at any chosen layer{" "}
        <M>{tex`\ell`}</M>:
      </p>
      <ol>
        <li>
          Run the model on <M>{tex`x^c`}</M>; cache <M>C</M>&apos;s
          output: <M>{tex`a^c`}</M>.
        </li>
        <li>
          Run the model on <M>{tex`x^{*}`}</M>; this time, when
          you reach <M>C</M> at layer <M>{tex`\ell`}</M>, replace
          its output with <M>{tex`a^c`}</M>.
        </li>
        <li>
          Measure how much the corrupted-prompt output now looks
          like the clean output. The standard scalar is the
          &ldquo;logit difference&rdquo;{" "}
          <M>{tex`\mathrm{logit}(\text{clean answer}) - \mathrm{logit}(\text{corrupted answer})`}</M>;
          divide by the difference between fully-clean and
          fully-corrupted runs to get a fraction in <M>{tex`[0, 1]`}</M>.
        </li>
      </ol>
      <p>
        That fraction is the &ldquo;recovery&rdquo; or &ldquo;causal
        contribution&rdquo; of component <M>C</M> at layer{" "}
        <M>{tex`\ell`}</M> to the behavior. A patch that fully
        flips the answer (recovery = 1) means: this one component
        carries all of the information that distinguishes clean
        from corrupted. A patch that does nothing (recovery = 0)
        means: this component plays no role.
      </p>

      <Figure caption="A toy model with 6 layers, attention + MLP per layer. Each cell shows a contribution to the final 'Paris' logit; clicking a cell patches it from the 'Madrid' counterfactual into the 'Paris' baseline. The bottom bar shows what fraction of the clean→corrupted gap was closed by the patch — only one cell here is doing real work.">
        <ActivationPatchingDemo />
      </Figure>

      <h2>What you can patch</h2>
      <p>
        Patching can target any activation in the network. The
        granularity-vs-precision trade-off:
      </p>
      <ul>
        <li>
          <strong>Whole layers (residual stream).</strong>{" "}
          Coarsest. Tells you which layer matters for the
          behavior, not which component within that layer. Useful
          first pass.
        </li>
        <li>
          <strong>Individual heads / MLP outputs.</strong>{" "}
          Standard granularity. Tells you which component
          contributed; this is how IOI&apos;s 26 heads were
          identified.
        </li>
        <li>
          <strong>Specific token positions.</strong> Patch only
          the residual stream at, say, the &ldquo;IO&rdquo;
          position. Tells you whether the relevant information
          flows through that specific token.
        </li>
        <li>
          <strong>Specific subspaces of the residual stream.</strong>{" "}
          Patch only along the &ldquo;name&rdquo; direction.
          Tells you which feature in the residual stream the
          component was using.
        </li>
        <li>
          <strong>Specific neurons in an MLP&apos;s hidden
          layer.</strong> Tells you which key/value memory cell
          carries the fact.
        </li>
      </ul>
      <p>
        Each finer level requires more careful counterfactuals —
        smaller patches have smaller effects, and noise dominates
        if your clean / corrupted setup isn&apos;t carefully
        matched.
      </p>

      <h2>Direct vs. path patching</h2>
      <p>
        Plain (sometimes called &ldquo;direct&rdquo;) activation
        patching swaps a component&apos;s output and lets the
        downstream model recompute everything that follows.
        That&apos;s a measurement of <em>total effect</em>: the
        component&apos;s direct contribution plus all the
        downstream effects of changing what it wrote.
      </p>
      <p>
        <strong>Path patching</strong> (Goldowsky-Dill et al.) is
        a refinement that isolates the contribution along a
        specific edge of the circuit graph. The protocol:
      </p>
      <ol>
        <li>
          Run clean and corrupted forward passes; cache all
          activations.
        </li>
        <li>
          On a fresh run with corrupted input, replace component{" "}
          <M>A</M>&apos;s output with the clean version, but{" "}
          <em>also</em> replace any other component <M>B</M>{" "}
          that comes <em>after</em> <M>A</M> with its corrupted
          activations — except for one specific{" "}
          &ldquo;sink&rdquo; component <M>D</M>, which receives
          its input from a residual stream computed using{" "}
          <M>A</M>&apos;s clean output.
        </li>
        <li>
          Measure the change in output. The result is the effect
          of the <M>{tex`A \to D`}</M> edge alone.
        </li>
      </ol>
      <p>
        In words: you let a component&apos;s clean signal travel
        only along the path to your chosen sink, and corrupt
        everything else. The result tells you how important that
        specific edge is, controlling for the rest of the
        component&apos;s downstream effects.
      </p>

      <h2>What can go wrong</h2>
      <p>
        Activation patching is sharp but has well-known
        failure modes:
      </p>
      <ul>
        <li>
          <strong>Mismatched counterfactuals.</strong> If the
          clean and corrupted prompts differ in more than the
          intended way (different lengths, different tokenization,
          different syntactic structure), your patch is testing
          something other than what you thought. Always check
          that prompts are length-matched and well-controlled.
        </li>
        <li>
          <strong>Patching off-distribution.</strong> Replacing a
          component&apos;s output with a clean activation
          while the rest of the model is on the corrupted path
          can produce a residual stream that the next layers have
          never seen. The recovery fraction can be misleadingly
          high or low because the downstream layers are operating
          out-of-distribution.
        </li>
        <li>
          <strong>Backup behavior.</strong> Ablate one head;
          another head learns to compensate during the same
          forward pass. The first head looks unimportant by
          ablation, but it&apos;s actually essential — its
          backup just covers for it. The fix is joint patching of
          multiple heads, or path-patching with multiple sinks.
        </li>
        <li>
          <strong>Noise on small effects.</strong> A patch that
          shifts the logit difference by 0.05 against a baseline
          gap of 5.0 is recovering 1% — well within run-to-run
          variance. Always quantify a noise floor by patching
          components you know don&apos;t matter.
        </li>
      </ul>

      <h2>Attribution patching: a fast approximation</h2>
      <p>
        For large models, doing a full patch per (component,
        layer, position) is expensive. <em>Attribution patching</em>{" "}
        (Nanda et al.) approximates the recovery fraction
        analytically using one extra backward pass:
      </p>
      <Block>{tex`\Delta L \approx \nabla_{a} L \big|_{a^c}\, \cdot\, (a^c - a^{*}).`}</Block>
      <p>
        That is a first-order Taylor expansion of the loss with
        respect to the patched activation. It costs one forward
        pass and one backward pass, regardless of how many
        components you want to score; the trade-off is that it&apos;s
        only accurate when the patched effect is small and
        approximately linear. In practice, attribution patching
        is excellent for finding the top components quickly,
        and full patching is reserved for verifying the candidates
        it identifies.
      </p>

      <Callout variant="intuition">
        Patching is the only causal tool we have. Looking at
        activations tells you what&apos;s correlated; patching
        tells you what would happen if a specific component had
        seen a different signal. Most claims that sound
        circuit-shaped — &ldquo;this head is doing X&rdquo; —
        ultimately come down to: I patched it, and X stopped
        happening.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A few practical rules from the people who do this all
          day:
        </p>
        <ul>
          <li>
            <strong>Always sanity-check the noise floor.</strong>{" "}
            Patch a component that you&apos;re sure doesn&apos;t
            matter (often: a layer-0 head on a task that
            requires later-layer reasoning). The recovery
            fraction there is your noise floor; anything below
            it is meaningless.
          </li>
          <li>
            <strong>Mean-ablate by default; zero-ablate only
            when you know what you&apos;re doing.</strong> Zero is
            off-distribution; the mean of a held-out set is
            in-distribution. Mean ablation is closer to
            &ldquo;remove the input-dependent part&rdquo; rather
            than &ldquo;remove everything.&rdquo;
          </li>
          <li>
            <strong>Patch by &ldquo;denoising&rdquo;, not
            &ldquo;noising&rdquo;.</strong> Run on the corrupted
            prompt and patch in clean activations one component
            at a time (denoising). The reverse — corrupting one
            component on a clean run — has a bigger
            distribution-shift problem and often gives less
            interpretable numbers.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            On the IOI task, you patch the output of head (9, 6) —
            a candidate name-mover — from the clean run into the
            corrupted run. The IO−S logit difference recovers 80%
            of the way back to its clean value. What can you
            conclude?
          </>
        }
        choices={[
          {
            id: "a",
            label: "Head (9, 6) implements 80% of the IOI behavior on its own.",
            explain:
              "Not quite. Recovery measures the *effect* of the patch, which includes head (9, 6)'s direct contribution plus downstream amplification. Multiple heads can each individually 'recover most of the gap' if they overlap.",
          },
          {
            id: "b",
            label: "Head (9, 6) is causally involved in IOI; its output carries most of the information that distinguishes clean from corrupted.",
            correct: true,
            explain:
              "This is the right reading. The patch is a causal-effect statement, not a sole-cause statement. Head (9, 6) is necessary on this measurement; whether it's *sufficient* requires a separate experiment (patch only that head from clean into a fully-corrupted run).",
          },
          {
            id: "c",
            label: "Head (9, 6) implements exactly the IO direction; you've identified the OV component.",
            explain:
              "The patch tells you the head matters causally, but doesn't directly identify the subspace. You'd need a finer patch (e.g. only the IO direction in W_OV) to make that claim.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Define &ldquo;recovery
              fraction&rdquo; precisely. Let{" "}
              <M>{tex`L^c`}</M> be the clean-prompt logit
              difference, <M>{tex`L^{*}`}</M> the corrupted, and{" "}
              <M>{tex`L^{p}`}</M> the patched-corrupted. Write the
              recovery fraction. What range does it live in, and
              what does a value greater than 1 or less than 0
              mean?
            </p>
            <p>
              <strong>(b)</strong> A common pitfall: you find that
              activation-patching head <M>{tex`H`}</M>&apos;s
              output recovers 90% of the IOI behavior, conclude
              that <M>{tex`H`}</M> is important, ablate{" "}
              <M>{tex`H`}</M> in a separate experiment, and find
              the model&apos;s accuracy drops only by 10%. How can
              both be true? (Hint: think about what &ldquo;recovery&rdquo;
              measures vs. what ablation measures, and consider
              backup behavior.)
            </p>
            <p>
              <strong>(c)</strong> Design a path-patching
              experiment to test whether head{" "}
              <M>{tex`(L_2, h_2)`}</M> is reading from the output
              of head <M>{tex`(L_1, h_1)`}</M> via{" "}
              K-composition (i.e. the earlier head writes into
              the later head&apos;s key projection). Be specific
              about: (i) the clean and corrupted prompts; (ii) which
              activation you cache and which you replace; (iii)
              what success looks like.
            </p>
          </>
        }
        hint={
          <>
            For (a):{" "}
            <M>{tex`(L^p - L^{*}) / (L^c - L^{*})`}</M>. For (b):
            backup heads can fire <em>only when</em> the primary
            is ablated. Activation patching doesn&apos;t trigger
            backup; ablation does. For (c): you want to patch
            head <M>{tex`(L_1, h_1)`}</M>&apos;s output into the
            corrupted run, but only let the patched signal
            travel along the edge to{" "}
            <M>{tex`(L_2, h_2)`}</M>&apos;s key — not its
            attention pattern, not later layers.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`R = (L^p - L^{*})/(L^c - L^{*})`}</M>. By
              construction, <M>{tex`R = 0`}</M> when{" "}
              <M>{tex`L^p = L^{*}`}</M> (patch had no effect) and{" "}
              <M>{tex`R = 1`}</M> when <M>{tex`L^p = L^c`}</M>{" "}
              (patch fully recovered). Values of <M>R</M> outside{" "}
              <M>{tex`[0, 1]`}</M> happen when the patched
              component is so disruptive it pushes the network
              past the clean baseline (recovery &gt; 1) or, in the
              other direction, when patching {`'helps'`} but in
              the wrong direction (recovery &lt; 0). Both are
              common when the component being patched is causally
              important <em>and</em> sits inside a non-linear
              regime; treat them as signs to look more carefully,
              not as bugs.
            </p>
            <p>
              <strong>(b)</strong> Activation patching measures
              what happens when <M>{tex`H`}</M>&apos;s output is
              <em>replaced</em> with the clean value while the
              rest of the model is on the corrupted path —
              everything in front of <M>{tex`H`}</M> still has the
              corrupted-prompt activations, and the model has no
              opportunity to compensate for <M>{tex`H`}</M> being
              &ldquo;different.&rdquo; Ablation, in contrast,
              removes <M>{tex`H`}</M> entirely; downstream heads
              that depend on{" "}
              <M>{tex`H`}</M>&apos;s output also lose their
              signal, which can trigger backup heads to fire.
              The 90% recovery says <M>{tex`H`}</M>{" "}
              <em>can</em> carry the IOI signal; the 10% ablation
              drop says <em>other heads will cover</em> when{" "}
              <M>{tex`H`}</M> is gone. Both numbers are correct;
              they answer different questions. Modern circuit work
              quotes both, plus a joint-ablation number on the full
              candidate circuit.
            </p>
            <p>
              <strong>(c)</strong> Setup: clean prompt where the
              behavior is correct; corrupted prompt where the
              relevant information has been changed (e.g. the
              specific token that should appear in head{" "}
              <M>{tex`(L_2, h_2)`}</M>&apos;s key direction). Run
              both, cache all activations. On a fresh run with the
              corrupted input:
              (i) replace head <M>{tex`(L_1, h_1)`}</M>&apos;s
              output with its clean activation;
              (ii) re-compute the residual stream forward, but
              when reaching head <M>{tex`(L_2, h_2)`}</M>, only
              feed the patched-residual into its <em>key</em>{" "}
              projection — feed corrupted activations into its
              query, value, and the rest of the model;
              (iii) re-run from there and read off the
              IO−S logit difference. Success = the recovery
              fraction here is similar to the recovery you get
              when patching head <M>{tex`(L_1, h_1)`}</M>&apos;s
              output unrestrictedly. That tells you the
              <M>{tex`(L_1, h_1) \to \mathrm{key of } (L_2, h_2)`}</M>{" "}
              edge is the relevant pathway. If, instead, the
              key-only patch recovers far less than the
              unrestricted patch, head{" "}
              <M>{tex`(L_1, h_1)`}</M>&apos;s effect is going
              elsewhere — through other heads, MLPs, or directly
              to the unembedding — and the
              K-composition story was wrong.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
