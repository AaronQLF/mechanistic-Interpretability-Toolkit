import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";

export const metadata = {
  title: "Indirect Object Identification",
};

export default function IOIPage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="ioi"
      eyebrow="Chapter 03"
      title="Indirect Object Identification"
      lede="Wang et al. (2022) gave the first end-to-end mechanistic explanation of a non-trivial behavior in GPT-2 small: 26 attention heads across 5 layers, partitioned into four named roles, that together implement &lsquo;when Mary and John went to the store, John gave a drink to Mary&rsquo;. It is, deservedly, the canonical worked example of the field."
    >
      <h2>The behavior</h2>
      <p>
        Take prompts of the form
      </p>
      <Block>{tex`\text{When } S_1 \text{ and } IO \text{ went to the store, } S_2 \text{ gave the [object] to}`}</Block>
      <p>
        with <M>{tex`S_1 = S_2`}</M> (the subject mentioned twice)
        and <M>IO</M> a different name (the indirect object). The
        correct continuation is <M>IO</M>: e.g. &ldquo;When Mary
        and John went to the store, Mary gave the drink to{" "}
        <em>John</em>.&rdquo; GPT-2 small gets this right at &gt;
        99% accuracy on a clean dataset. The question Wang et al.
        asked: <em>which heads are doing it?</em>
      </p>

      <h2>Four roles, twenty-six heads</h2>
      <p>
        After a year of patching experiments, ablations, and
        attention-pattern analysis, the IOI circuit comes down to
        four classes of heads:
      </p>
      <ol>
        <li>
          <strong>Duplicate Token Heads.</strong> Layers 0–3.
          Detect that <M>{tex`S_1 = S_2`}</M> by attending the
          second mention back to the first. They write a feature
          into the residual stream meaning &ldquo;the token at
          this position has appeared before.&rdquo;
        </li>
        <li>
          <strong>Induction Heads.</strong> Layers 5–6.{" "}
          <em>Yes, the same heads from the previous chapter.</em>{" "}
          They reinforce the duplicate-token signal by also
          attending from <M>{tex`S_2`}</M> back to the first
          occurrence and writing its position-feature into the
          residual stream.
        </li>
        <li>
          <strong>S-Inhibition Heads.</strong> Layer 7. They read
          the duplicate-token / induction features and write
          something like &ldquo;don&apos;t attend to this position&rdquo;
          into the residual stream at the final position. The
          name reflects what they do: <em>inhibit</em> attention
          to the subject.
        </li>
        <li>
          <strong>Name Mover Heads.</strong> Layers 9–10. The big
          show. They attend from the final position to whatever
          name <em>isn&apos;t</em> being inhibited (i.e. <M>IO</M>),
          and their OV writes the IO&apos;s embedding into the
          residual stream — which is exactly what the unembedding
          reads off as the predicted next token.
        </li>
      </ol>
      <p>
        Plus a smaller cast of supporting roles (negative
        name-movers that suppress instead of promote, backup
        name-movers that take over when the primary ones are
        ablated, etc.) — 26 named heads in total. The dataflow:
      </p>
      <Block>{tex`\text{Embed} \to \text{Duplicate \& Induction} \to \text{S-Inhibition} \to \text{Name Movers} \to \text{Unembed}.`}</Block>

      <h2>Why this circuit is non-trivial</h2>
      <p>
        Two things that elevate IOI past &ldquo;cute toy&rdquo;:
      </p>
      <ul>
        <li>
          <strong>It uses suppression, not just promotion.</strong>{" "}
          The wrong-answer name (<M>{tex`S`}</M>) is dealt with by
          actively suppressing it via S-Inhibition, not by ignoring
          it. Take away the S-Inhibition heads and the model
          starts predicting{" "}
          <M>{tex`S`}</M> at the final position, even though no
          name-mover ever explicitly wrote &ldquo;{`S`}&rdquo;
          into the residual stream — the suppression was holding
          back a default that&apos;s already there.
        </li>
        <li>
          <strong>It has redundancy.</strong> Ablate the primary
          name-movers and the model&apos;s accuracy drops only
          modestly — &ldquo;backup&rdquo; name-movers in earlier
          layers take over. This is not a clean
          single-pathway circuit; it&apos;s a small graph with
          parallel paths and self-correction. Real circuits in
          real models are like this; pure
          single-pathway-circuit pictures rarely survive contact
          with patching experiments.
        </li>
      </ul>

      <h2>The methodology that produced it</h2>
      <p>
        Wang et al.&apos;s paper is also a methods contribution.
        Roughly:
      </p>
      <ol>
        <li>
          <strong>Direct logit attribution.</strong> For every
          head, compute the inner product of its output with{" "}
          <M>{tex`(W_U[:, IO] - W_U[:, S])`}</M> — the
          &ldquo;IO − S logit difference.&rdquo; This identifies
          the name-mover heads as the dominant positive
          contributors, and (negative-name-mover) heads as the
          dominant negative contributors.
        </li>
        <li>
          <strong>Activation patching.</strong> Construct a
          counterfactual prompt where the names are swapped (so
          the correct answer flips), patch the output of one head
          at a time from the original to the counterfactual, and
          measure the change in IO − S logit difference.
          Path-patch through specific layers to localize{" "}
          <em>which</em> components are sending signals to the
          name-movers (this is how the duplicate-token and
          induction heads were identified — by their causal
          effect on later S-inhibition heads).
        </li>
        <li>
          <strong>Attention pattern visualization.</strong> Once a
          head is implicated, look at its attention pattern on
          the relevant prompts. Is it attending where the
          functional story predicts? If yes, name it. If no,
          revisit.
        </li>
        <li>
          <strong>Replication on out-of-distribution variants.</strong>{" "}
          Rerun the analysis on prompts with different syntactic
          forms, longer sentences, multiple distractors. Heads
          that no longer behave the same get a footnote;
          robustness gets quantified.
        </li>
      </ol>
      <p>
        The next chapter — Activation Patching — covers the
        mechanics in detail. The point here is that IOI was
        discovered by combining all four steps in a tight loop, not
        by staring at attention patterns alone.
      </p>

      <h2>What IOI doesn&apos;t explain</h2>
      <p>
        Three honest caveats:
      </p>
      <ul>
        <li>
          <strong>It&apos;s a single template.</strong> The
          analysis covers prompts of one specific syntactic form.
          Variants — &ldquo;Mary said to John, {`'I'`}ll bring the
          drinks{`'`}; he replied{" "}
          <em>...</em>&rdquo; — use overlapping but distinct
          components. The full &ldquo;model handles
          coreference&rdquo; story is much bigger than IOI.
        </li>
        <li>
          <strong>It&apos;s GPT-2 small only.</strong> Bigger
          models almost certainly do something analogous, but the
          exact head identities differ, and there&apos;s some
          evidence the larger models implement IOI in fewer
          layers (because they have more total capacity per
          layer).
        </li>
        <li>
          <strong>It doesn&apos;t explain
          &ldquo;learning&rdquo;.</strong> The paper takes a
          fully-trained model and reverse-engineers it. How the
          model arrived at this particular circuit during training
          is a separate (and largely open) question.
        </li>
      </ul>
      <p>
        These are not weaknesses; they&apos;re the standard
        epistemic shape of a mech-interp result in 2026. A
        well-scoped circuit on a well-scoped behavior, with
        explicit boundaries.
      </p>

      <Callout variant="intuition">
        IOI is the &ldquo;hello world&rdquo; of real circuits.
        Four roles: detect that a name was repeated, suppress
        attending to the repeat, attend to the other one, copy
        it forward. The richness comes from the suppression step
        — the model is doing something subtler than &ldquo;copy
        the right answer.&rdquo; It&apos;s actively pushing the
        wrong answer down.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Things you&apos;ll see derived from the IOI playbook
          throughout the literature:
        </p>
        <ul>
          <li>
            <strong>The IO − S logit difference</strong> as a
            scalar &ldquo;circuit performance&rdquo; metric. Many
            follow-on papers re-use this exact quantity to
            measure how much of the behavior survives an
            intervention.
          </li>
          <li>
            <strong>Negative components.</strong> The
            negative-name-movers and copy-suppression heads in
            IOI taught the field that real circuits have
            &ldquo;wrong-answer dampers,&rdquo; and that you
            can&apos;t explain a behavior by listing only the
            promoting heads.
          </li>
          <li>
            <strong>Backup behavior.</strong> The discovery that
            heads at earlier layers will partially compensate for
            ablations of later heads is a routine confound in
            modern circuit work. The fix: patch{" "}
            <em>multiple</em> heads jointly, or use path
            patching to control for indirect effects.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            On the prompt &ldquo;When Mary and John went to the
            store, John gave the drink to&rdquo;, you ablate the
            S-Inhibition heads and rerun the model. What changes?
          </>
        }
        choices={[
          {
            id: "a",
            label: "Accuracy is unaffected — without inhibition the name-movers still attend to Mary.",
            explain:
              "Without S-Inhibition, the name-movers default to attending to *whichever name they like more*, which empirically is the more recent / repeated one (i.e. John). So accuracy drops sharply.",
          },
          {
            id: "b",
            label: "The model now predicts John (the subject) with high probability.",
            correct: true,
            explain:
              "Right. S-Inhibition was the only thing keeping the name-movers from attending to the subject; remove it and they default to the most recent matching name, which is John. That's the effect Wang et al. observed and used to validate the S-Inhibition role.",
          },
          {
            id: "c",
            label: "The model predicts a generic continuation like 'her' or 'him'.",
            explain:
              "Possible in principle, but the architecture doesn't have a 'generic pronoun' head — it has name-movers. With inhibition gone, those still fire, just on the wrong name.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Sketch a path-patching protocol
              that distinguishes the roles of the
              duplicate-token, induction, and S-inhibition heads.
              For each pair (source head, target component) you
              would patch, write down what you&apos;re testing.
            </p>
            <p>
              <strong>(b)</strong> The IOI circuit features
              negative name-movers — heads whose direct logit
              attribution on the IO is{" "}
              <em>negative</em>. What functional role might these
              play, and what would happen on a held-out variant of
              the task that didn&apos;t require them? Give a
              concrete prediction.
            </p>
            <p>
              <strong>(c)</strong> A skeptic argues that the IOI
              circuit isn&apos;t a real explanation — it&apos;s
              just a re-labeling of which heads are active on this
              prompt. Construct the strongest version of that
              argument, then describe an experiment that would
              decisively answer it. (Hint: think about predicting
              behavior on inputs the analysis wasn&apos;t built on.)
            </p>
          </>
        }
        hint={
          <>
            For (a): every patch isolates a directed edge in the
            graph. Patch from a duplicate-token head&apos;s output
            into an S-inhibition head&apos;s input — does the
            S-inhibition head behave normally if the
            duplicate-token signal is held to the counterfactual
            value? For (b): negative name-movers might be
            calibrating the magnitude of the IO signal, or they
            might be off-task suppressors that fire rarely in
            distribution. For (c): the skeptic&apos;s strongest
            move is &ldquo;your circuit description has zero
            predictive power on inputs you didn&apos;t use to
            build it.&rdquo;
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> A protocol with three
              representative patches:
            </p>
            <ol>
              <li>
                <em>DT → S-Inhibition.</em> Run on a normal
                prompt, then on a counterfactual where{" "}
                <M>{tex`S_1 \neq S_2`}</M>. Patch the duplicate-token
                heads&apos; output into the residual stream just
                before the S-inhibition heads on the original
                run. If the S-inhibition heads now behave
                differently, they were causally listening to the
                duplicate-token signal.
              </li>
              <li>
                <em>Induction → S-Inhibition.</em> Same setup;
                this time patch the induction heads&apos;
                contribution. If the S-inhibition heads change
                only when both DT and induction signals are
                patched, they&apos;re using the union — both
                pieces of information.
              </li>
              <li>
                <em>S-Inhibition → Name Movers.</em> Patch the
                S-inhibition heads&apos; output into the input
                of the name-movers, varying which name is
                inhibited. If the name-movers&apos; attention
                pattern flips between IO and S in lockstep with
                the patched signal, they&apos;re causally
                downstream of S-inhibition.
              </li>
            </ol>
            <p>
              Each patch isolates one directed edge of the
              circuit graph; together they verify the claimed
              dataflow.
            </p>
            <p>
              <strong>(b)</strong> Plausible roles for negative
              name-movers: (i) they suppress copies of the IO
              that the unembedding might pick up from too-eagerly
              firing copy heads, calibrating the
              IO-vs-everything-else logit gap; (ii) they fire on
              cases that <em>look like</em> IOI but aren&apos;t
              (e.g. when both names are mentioned by both subject
              positions), preventing a wrong copy. Concrete
              prediction: on a task where the &ldquo;correct&rdquo;
              behavior is to <em>not</em> copy any name (e.g.
              prompts where the next token is a non-name like
              &ldquo;them&rdquo;), negative name-movers should
              fire substantially more than positive
              name-movers, and ablating them should{" "}
              <em>increase</em> the model&apos;s tendency to
              hallucinate a name. Wang et al.&apos;s paper has a
              version of this experiment.
            </p>
            <p>
              <strong>(c)</strong> Strongest skeptic argument: a
              circuit description has no predictive power if it
              merely names which heads were active on prompts you
              already studied. Decisive answer: <em>generalize</em>{" "}
              the circuit. Generate held-out prompts the analysis
              has never seen — different names, different
              syntactic structure, different objects, different
              lengths — and predict in advance which heads will
              be active and how an ablation will affect the
              output. If the circuit description correctly
              predicts ablation effects on a battery of held-out
              variants (within some honest tolerance), it has
              real predictive content. If it requires re-tuning
              the named components for every new prompt, the
              skeptic was right and you have a description, not
              an explanation. Most circuits in the literature
              survive this test partially — strongly within the
              same syntactic family, weakly across families. The
              real ongoing question for the field is how
              circuit-level explanations compose across
              templates.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
