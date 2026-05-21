import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";

export const metadata = {
  title: "Capstone: the state of the field",
};

export default function CircuitsBridgePage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="mech-interp-bridge"
      eyebrow="Capstone"
      title="Capstone: the state of the field"
      lede="Six chapters of circuits, methods, and worked examples. This one is the honest accounting: what the field can explain in 2026, what it can&apos;t, and which of the open problems matter most for whether mech interp ever turns into a real science of neural networks."
    >
      <h2>What we can explain</h2>
      <p>
        A non-exhaustive list of behaviors that have been
        meaningfully reverse-engineered to circuit precision in
        small or medium transformers:
      </p>
      <ul>
        <li>
          <strong>Indirect Object Identification</strong> (Wang
          et al., GPT-2 small). Four-role circuit covered in
          Chapter 3.
        </li>
        <li>
          <strong>Induction / in-context learning</strong>{" "}
          (Olsson et al., universal). Two-head circuit covered
          in Chapter 2; replicates across nearly every
          transformer studied.
        </li>
        <li>
          <strong>Modular arithmetic and grokking</strong>{" "}
          (Nanda et al., Power et al.). Small algebraic models
          implementing addition mod <em>p</em> via Fourier
          features in their weights. The circuit is precise to
          the level of linear-algebraic identity.
        </li>
        <li>
          <strong>Greater-than detection</strong> (Hanna et al.).
          GPT-2 medium implements &ldquo;is X greater than Y?&rdquo;
          via a small, named subgraph whose components include
          numeric-comparison heads.
        </li>
        <li>
          <strong>Docstring completion</strong> (Heimersheim,
          Janiak). A specific code-related behavior in Pythia
          models traced through MLPs and attention.
        </li>
        <li>
          <strong>Many sparse-autoencoder feature
          discoveries</strong> (Anthropic, OpenAI). At the level
          of individual features &mdash; &ldquo;mentions of the
          Golden Gate Bridge&rdquo;, &ldquo;HTTP-related code&rdquo; &mdash;
          dictionaries of millions of features have been
          extracted and partially audited from
          frontier-scale models.
        </li>
        <li>
          <strong>Refusal directions</strong> (Arditi et al.,
          and follow-ons). The mechanism by which RLHF&apos;d
          models refuse harmful requests can be localized to a
          small number of directions in the residual stream
          that, when ablated, restore compliance.
        </li>
      </ul>
      <p>
        The pattern across these results: small to medium
        models, well-scoped behaviors, careful causal
        verification. The methodology does work.
      </p>

      <h2>What we can&apos;t (yet) explain</h2>
      <p>
        The honest list of where the field is currently stuck:
      </p>
      <ul>
        <li>
          <strong>Multi-step reasoning at scale.</strong> Why
          does a frontier model correctly solve a multi-step
          word problem? At the moment we have no
          circuit-precision answer for any non-trivial chain of
          reasoning in a model bigger than ~1B parameters. The
          tooling exists (patching, SAEs); the work is just
          enormous.
        </li>
        <li>
          <strong>The role of MLPs at depth.</strong> A
          frontier transformer has 60+ MLP blocks. We know each
          one is a key/value memory; we have very little
          coherent picture of how they compose with one another
          and with attention to produce high-level capabilities.
        </li>
        <li>
          <strong>Generalization between circuits.</strong>{" "}
          IOI&apos;s circuit on one syntactic template overlaps
          with — but isn&apos;t the same as — the circuit on a
          different template. We have no theory of what makes
          two circuits &ldquo;the same circuit, different
          presentation&rdquo; vs.&nbsp;&ldquo;different
          circuits.&rdquo;
        </li>
        <li>
          <strong>Training dynamics.</strong> Phase transitions
          like the induction-head bump are real phenomena;
          our predictive theory of when and why specific
          circuits emerge during training is rudimentary.
          Connections to grokking and phase transitions in
          statistical physics are tantalizing but informal.
        </li>
        <li>
          <strong>Frontier-model interpretability.</strong>{" "}
          Sparse autoencoders give us features; we still don&apos;t
          have circuit-level explanations of any high-stakes
          behavior in a deployed frontier system. The
          distance between &ldquo;feature X exists in this
          model&rdquo; and &ldquo;here is the algorithm by
          which the model produced this output&rdquo; is the
          gap the field is trying to close.
        </li>
      </ul>

      <h2>The open problems that matter most</h2>
      <p>
        A working researcher&apos;s short list:
      </p>
      <ol>
        <li>
          <strong>Scaling circuit analysis.</strong> Every
          tool covered in this module — direct logit
          attribution, activation patching, path patching, head
          naming — was demonstrated at GPT-2-small scale.
          Frontier models have 100× more components. The
          methodology has to scale automatically (auto-circuit
          discovery, learned naming) or it doesn&apos;t apply
          to the systems anyone cares about.
        </li>
        <li>
          <strong>Composition of circuits.</strong> Almost no
          paper has shown a clean &ldquo;circuit A composed with
          circuit B = circuit AB&rdquo; result on real models.
          Until we have a compositional theory, every new
          behavior requires fresh discovery work; the field has
          no leverage.
        </li>
        <li>
          <strong>SAE quality.</strong> Current SAEs deliver a
          minority of monosemantic features in a sea of
          partially-interpretable atoms. Better dictionary
          architectures (top-k, gated, hierarchical), better
          training objectives, and better evaluation are all
          actively researched. Whether SAEs are the right
          long-term tool is itself debated.
        </li>
        <li>
          <strong>Cross-model universality.</strong> Are the
          circuits we find in one model the same up to
          relabeling in another? Induction heads are universal;
          IOI is partially. We need a notion of equivalence
          between circuits in different models &mdash; ideally
          one that&apos;s testable, not just suggestive.
        </li>
        <li>
          <strong>Connection to capabilities.</strong> Most
          mech interp results explain narrow behaviors. The
          field&apos;s long-term value depends on extending to
          capabilities people actually care about: planning,
          deception detection, factual reliability, refusal
          robustness. Bridging from &ldquo;the IOI circuit&rdquo;
          to &ldquo;the planning circuit&rdquo; is a real
          methodological gap.
        </li>
      </ol>

      <h2>What this curriculum gave you</h2>
      <p>
        Across all six modules, the throughline:
      </p>
      <ul>
        <li>
          <strong>Linear algebra</strong>: vectors, matrices,
          SVD &mdash; the language every mech-interp object is
          written in.
        </li>
        <li>
          <strong>Probability</strong>: distributions,
          softmax, KL &mdash; the loss the model minimizes and
          the readout we measure with.
        </li>
        <li>
          <strong>Calculus</strong>: gradients, the chain
          rule, attribution &mdash; how the model trains and
          how attribution patching works.
        </li>
        <li>
          <strong>Neural networks</strong>: linear layers,
          MLPs, the residual stream &mdash; the building blocks.
        </li>
        <li>
          <strong>Transformers</strong>: attention, multi-head,
          QK / OV, position, the block, the architecture &mdash;
          where the building blocks meet.
        </li>
        <li>
          <strong>Mech-interp circuits</strong>: induction,
          IOI, patching, SAEs, diagrams &mdash; the practice
          of taking the architecture apart and naming what you
          find.
        </li>
      </ul>
      <p>
        Every result you&apos;ll read about in interpretability
        going forward will sit somewhere on this stack. The
        rest of the work &mdash; doing the analyses, training
        the SAEs, finding the next IOI &mdash; is now in your
        hands.
      </p>

      <Callout variant="intuition">
        Mech interp is the bet that neural networks aren&apos;t
        inscrutable, just hard. The toolkit you have now &mdash;
        residual streams, attention factorizations, patching,
        sparse codes &mdash; was assembled in less than a
        decade by a few hundred researchers. The behaviors it
        can explain today are narrow. The behaviors it can
        explain by the end of this decade depend on the people
        who pick up the tools and use them.
      </Callout>

      <Callout variant="note">
        That&apos;s the curriculum. The reading list:
        Anthropic&apos;s &ldquo;Mathematical Framework&rdquo;
        and Toy Models of Superposition; Wang et al. on IOI;
        Olsson et al. on induction heads; Bricken et al. on
        sparse autoencoders; Nanda&apos;s mech-interp tutorials;
        Geiger et al. on causal interventions. Anything by the
        ARENA program or the Anthropic / DeepMind / OpenAI
        interpretability teams is worth reading. Welcome to the
        field.
      </Callout>

      <Challenge
        prompt={
          <>
            <p>
              You&apos;ve finished six modules of curriculum.
              Suppose you&apos;re given a small frontier model
              and one week. Pick a behavior you would attempt to
              reverse-engineer end-to-end, and write a project
              plan: (i) the input distribution and behavioral
              metric, (ii) the localization steps you&apos;d
              take, (iii) the validation experiments, (iv) the
              honest description of what you&apos;d expect to
              find &mdash; and what you&apos;d expect{" "}
              <em>not</em> to find. The rubric: each step should
              correspond to a tool from this curriculum, and
              your &ldquo;not&rdquo; list should reveal what you
              think is genuinely hard about real circuit work.
            </p>
            <p>
              There&apos;s no &ldquo;correct&rdquo; answer for
              this exercise. The point is that you should now be
              able to write a plausible plan, with a tool
              vocabulary, that someone working in the field
              would recognize as a reasonable starting point.
              That&apos;s the whole goal of the curriculum:
              you&apos;re ready to read the papers, do the
              experiments, and contribute to figuring out the
              parts that are still open.
            </p>
          </>
        }
        hint={
          <>
            Pick something narrow: not &ldquo;reasoning&rdquo;
            but &ldquo;the model&apos;s ability to complete{" "}
            <em>n</em>-digit addition&rdquo;, or &ldquo;the
            mechanism for quotation handling in dialog&rdquo;,
            or &ldquo;how the model decides to refuse&rdquo;.
            Each of those is a real ongoing research project.
          </>
        }
        solution={
          <>
            <p>
              An example sketch (yours should be different).
            </p>
            <p>
              <strong>Behavior.</strong> The model correctly
              completes &ldquo;<em>X</em> in <em>year</em>&rdquo;
              prompts, where <em>X</em> is a famous historical
              figure and <em>year</em> is their birth year, with
              accuracy &gt;95% on a hand-curated set of 200
              figure-year pairs. The metric: top-1 accuracy on
              this set, plus the IO-style logit difference
              between &ldquo;was born&rdquo; (clean target) and
              &ldquo;died&rdquo; (corrupted target).
            </p>
            <p>
              <strong>Localization.</strong> Run direct logit
              attribution on every component (head + MLP) for the
              &ldquo;was born&rdquo; logit. Identify the top
              ~10. For each, run activation patching from a
              counterfactual prompt where the figure&apos;s name
              has been replaced with another (whose birth year
              is in a different century) and measure
              recovery fractions. Cross-check with the logit
              lens: at which layer does the right year start
              climbing in the residual stream?
            </p>
            <p>
              <strong>Validation.</strong> Path-patch each
              candidate edge in the proposed circuit. Train an
              SAE on the residual stream at the layer where
              the year first appears prominent; look for an atom
              that fires on &ldquo;date-related&rdquo; queries.
              Steer that atom and see whether the model&apos;s
              year predictions can be biased predictably.
              Repeat the entire analysis on a held-out set of
              figures the original analysis didn&apos;t use.
            </p>
            <p>
              <strong>What I&apos;d expect.</strong> A circuit
              with: an &ldquo;identify the named figure&rdquo;
              early-layer set of heads (likely involving
              previous-token / induction-style mechanisms),
              one or two MLP blocks at intermediate layers
              that act as the literal &ldquo;person → birth
              year&rdquo; lookup table (the key/value framing),
              and a small set of late-layer heads that lift
              the year into the unembedding direction. The
              MLPs are likely the load-bearing components, by
              analogy with the &ldquo;capital of France&rdquo;
              circuit and ROME-style edits.
            </p>
            <p>
              <strong>What I&apos;d expect{" "}
              <em>not</em> to find.</strong> Clean
              monosemanticity. The MLP neurons doing the
              factual lookup will almost certainly be
              polysemantic; ablating one will hurt many unrelated
              facts. The candidate circuit will be{" "}
              <em>partially</em> faithful and{" "}
              <em>partially</em> complete &mdash; ablating it
              will drop accuracy substantially but not to zero,
              because backup pathways or directly-from-embedding
              routes will preserve some performance. SAE atoms
              for &ldquo;birth year of person X&rdquo; will not
              exist as cleanly named features at the
              dictionary widths I can afford to train; they may
              exist at much wider dictionaries that I won&apos;t
              get to in a week. Generalization to held-out
              figures will be partial &mdash; better than chance,
              worse than the in-distribution result. And the
              full story will involve at least a couple of
              components I can&apos;t cleanly name.
            </p>
            <p>
              That last paragraph &mdash; the &ldquo;not
              find&rdquo; list &mdash; is what distinguishes a
              plan with mech-interp literacy from a plan that
              looks like one. Real circuit work is an
              accumulation of partial wins on partially-clean
              behaviors. If you can sketch the partial wins{" "}
              <em>and</em> the limits, you&apos;re ready to do
              the work.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
