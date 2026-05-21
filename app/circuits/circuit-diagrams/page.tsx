import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { CircuitDiagram } from "@/components/viz/CircuitDiagram";

export const metadata = {
  title: "Reading circuit diagrams",
};

export default function CircuitDiagramsPage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="circuit-diagrams"
      eyebrow="Chapter 06"
      title="Reading circuit diagrams"
      lede="Every mech-interp paper produces, sooner or later, a diagram. Boxes for components, arrows for residual-stream paths, labels for what each component is doing. This chapter is a short field guide to drawing them and, more importantly, reading them critically &mdash; including spotting where the diagram is hiding ambiguity."
    >
      <h2>The conventions, in one place</h2>
      <p>
        Most circuit diagrams follow a small set of conventions
        that aren&apos;t always stated explicitly. Once you know
        them, paper-figure literacy goes up a lot.
      </p>
      <ul>
        <li>
          <strong>Boxes</strong> are components. Common types:
          <em> embedding / unembedding</em>, individual{" "}
          <em>attention heads</em> (typically labeled{" "}
          <em>L.H</em>, e.g. &ldquo;9.6&rdquo;),{" "}
          <em>MLP blocks</em>, sometimes whole layers when
          finer-grained attribution isn&apos;t needed.
        </li>
        <li>
          <strong>Arrows</strong> are residual-stream paths. An
          arrow from box <em>A</em> to box <em>B</em> means
          &ldquo;information that <em>A</em> wrote into the
          residual stream is read by <em>B</em>&rdquo; —{" "}
          <em>not</em> &ldquo;activations physically flow from{" "}
          <em>A</em> to <em>B</em>.&rdquo; All flow goes through
          the residual stream; the arrow is shorthand for that
          path.
        </li>
        <li>
          <strong>Edge labels</strong> name what flows along the
          edge: a feature direction, a token identity, a
          positional signal. &ldquo;previous-token annotation&rdquo;
          on the edge from a previous-token head to an induction
          head is the load-bearing label that makes the
          induction circuit make sense.
        </li>
        <li>
          <strong>Layout typically encodes layer depth.</strong>{" "}
          Earlier components (lower layers) on the left, later on
          the right. Vertical position is usually arbitrary;
          sometimes paper authors group components into
          functional rows (e.g. duplicate-token row,
          name-mover row).
        </li>
        <li>
          <strong>Solid vs. dashed.</strong> Solid edges are the
          &ldquo;main&rdquo; circuit; dashed edges are residual
          / minor paths the analysis chose to ignore. The choice
          of which to omit is a modeling decision, and the paper
          should be explicit about it.
        </li>
      </ul>

      <Figure caption="A simplified IOI-style diagram. Six attention heads in three layers, plus embed and unembed. Hover any node to see everything downstream of it. Solid edges are the named circuit; dashed are residual paths the analysis chose not to track in detail.">
        <CircuitDiagram />
      </Figure>

      <h2>How to draw one</h2>
      <p>
        A workable recipe, given the analysis from the previous
        chapters:
      </p>
      <ol>
        <li>
          <strong>Pick the behavior.</strong> One sentence:
          &ldquo;On prompts of form X, predict token Y.&rdquo;
          Anchor the diagram to this.
        </li>
        <li>
          <strong>List the named components.</strong> Output of
          your localization step (direct logit attribution +
          activation patching). For each, name the role —
          duplicate-token, induction, name-mover. Don&apos;t
          include components whose patching effect is below the
          noise floor.
        </li>
        <li>
          <strong>Identify edges.</strong> For each pair of
          named components, ask: does the earlier one&apos;s OV
          write into a direction the later one&apos;s QK reads?
          Path-patch the edge to confirm. Add the edge if and
          only if there&apos;s causal evidence.
        </li>
        <li>
          <strong>Group functionally.</strong> If multiple
          components share a role, group them visually
          (&ldquo;the four name-movers&rdquo;) rather than
          drawing each separately. The diagram is for human
          readers; one box per role is more readable than one box
          per parameter slice.
        </li>
        <li>
          <strong>Label the edges.</strong> Name what flows.
          Vague labels (&ldquo;information&rdquo;) are useless;
          specific labels (&ldquo;token-identity-of-IO&rdquo;)
          are doing real work. If you can&apos;t name what flows
          along an edge, your circuit description has a hole.
        </li>
        <li>
          <strong>Be explicit about omissions.</strong> The MLPs
          you didn&apos;t include, the heads with sub-threshold
          effects, the &ldquo;backup&rdquo; pathways — note them
          in the caption. A diagram without omissions noted is a
          diagram lying about completeness.
        </li>
      </ol>

      <h2>How to read one critically</h2>
      <p>
        Same recipe, in reverse. When a paper shows you a
        circuit diagram:
      </p>
      <ul>
        <li>
          <strong>What&apos;s the behavior?</strong> If the paper
          can&apos;t state it crisply, or the diagram covers
          multiple loosely-related behaviors, the explanation is
          probably weaker than it looks. Diagrams paper over
          definitional looseness.
        </li>
        <li>
          <strong>What&apos;s missing?</strong> A diagram with no
          dashed edges, no &ldquo;backup&rdquo; pathways, no
          MLPs is suspicious. Real models have parallel paths
          and partial redundancy; a clean
          one-pathway diagram is either a small, well-behaved
          circuit (good) or a sanitized
          oversimplification (bad). The caption usually
          distinguishes them.
        </li>
        <li>
          <strong>What evidence supports each edge?</strong>{" "}
          Edges are claims. The strongest support is path
          patching of that specific edge. Weaker: activation
          patching of the source component (which lumps together
          all its downstream effects). Weakest: attention-pattern
          inspection only. A good paper will footnote each edge
          with its evidence type; a quick scan tells you whether
          to trust it.
        </li>
        <li>
          <strong>How robust is the labeling?</strong> &ldquo;Head
          9.6 is the name-mover&rdquo; is more robust than
          &ldquo;heads 9.6, 9.9, and 10.0 are jointly responsible
          for name-moving.&rdquo; Singular naming usually
          corresponds to a single, clean component; group
          naming usually corresponds to a smeared circuit where
          each component is doing a fraction of the same job.
          Both happen; only one supports clean intervention
          experiments.
        </li>
        <li>
          <strong>Does it generalize?</strong> A circuit
          identified on one syntactic template, with no
          replication on variants, is provisional. Modern papers
          that cover multiple templates should label which
          components are shared across them.
        </li>
      </ul>

      <h2>Common pictograms</h2>
      <p>
        A small visual vocabulary you&apos;ll see again and
        again:
      </p>
      <ul>
        <li>
          <strong>Component-by-position grid.</strong> An{" "}
          <em>L</em> × <em>n</em> grid, layers on the y-axis,
          token positions on the x-axis. Cells colored by{" "}
          activation-patch effect. The classic diagnostic for
          &ldquo;where in the network is this happening?&rdquo;
          A bright vertical band tells you the circuit is
          token-aligned; a horizontal band tells you a layer is
          doing something on every position.
        </li>
        <li>
          <strong>Attention pattern matrix.</strong> An <em>n</em>{" "}
          × <em>n</em> matrix per head, query rows by key
          columns. Used to identify head archetypes by visual
          pattern: diagonal (copy / current-token), shifted
          diagonal (previous-token), induction stripe (induction
          head), first-column (BOS sink).
        </li>
        <li>
          <strong>Head-by-head logit attribution bar.</strong>{" "}
          One bar per head; height = direct contribution to a
          target logit. Sorts the heads by how much they
          promote (or suppress) the target. The fastest way to
          identify candidate name-movers and their negative
          counterparts.
        </li>
        <li>
          <strong>Path expansion as a tree or DAG.</strong>{" "}
          Less common but useful for very-multi-layer circuits.
          Each path through the model gets one branch; branch
          weights show how much that path matters.
        </li>
        <li>
          <strong>Feature dictionary readout.</strong> A list of
          SAE atoms with their interpretations and top-activating
          examples. Increasingly the standard format for
          newer SAE-based circuit work.
        </li>
      </ul>

      <h2>An anti-pattern: the spaghetti diagram</h2>
      <p>
        The failure mode of an enthusiastic circuit author:
        every component is a node, every plausible edge is
        drawn, and the result is a tangle that&apos;s
        impossible to read. Typical symptoms:
      </p>
      <ul>
        <li>
          More than ~20 components per diagram.
        </li>
        <li>
          Edges that aren&apos;t labeled, or have generic labels
          (&ldquo;contributes&rdquo;, &ldquo;influences&rdquo;).
        </li>
        <li>
          No grouping by role; every head gets its own box.
        </li>
        <li>
          No indication of edge strength or causal evidence.
        </li>
      </ul>
      <p>
        The fix isn&apos;t a better drawing tool — it&apos;s a
        better localization. If the localization can&apos;t
        boil down to a small number of named roles, the
        circuit story isn&apos;t there yet, and a cleaner
        diagram would be lying. Sometimes the right move is to
        publish the spaghetti and acknowledge the messiness;
        that&apos;s an honest (if unsatisfying) outcome.
      </p>

      <Callout variant="intuition">
        A circuit diagram is a flowchart for a small program
        the model implements. Boxes are subroutines, edges are
        named data flows, the residual stream is the shared
        memory. Reading one is like reading a small piece of
        someone else&apos;s code: the names tell you the
        story; the structure tells you whether the story
        actually compiles.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          A few warnings from people who read these for a
          living:
        </p>
        <ul>
          <li>
            <strong>An arrow is not a wire.</strong> All
            information goes through the residual stream;
            arrows are shorthand for paths through it. Two
            arrows pointing into the same box may carry the
            same information; a box with one arrow in may
            also be using directly-from-embedding signals
            that aren&apos;t drawn.
          </li>
          <li>
            <strong>The unembedding is not a free pass.</strong>{" "}
            A diagram that says &ldquo;head X writes into the
            unembedding&rdquo; means &ldquo;X&apos;s output
            has high inner product with{" "}
            <em>some specific column</em> of <em>W</em>
            <sub>U</sub>.&rdquo; Don&apos;t treat &ldquo;writes
            to the unembedding&rdquo; as the
            general-purpose end of every story; it&apos;s a
            specific projection.
          </li>
          <li>
            <strong>Beware of seductive cleanness.</strong> A
            five-component, four-edge diagram of a model with
            150 components is almost certainly a
            simplification. That&apos;s often fine — the
            simplified story can be load-bearing — but
            it should come with explicit caveats about what
            the other 145 components are doing.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            You see a circuit diagram with five named heads, all
            connected by solid edges, and a single dashed edge
            from the embedding directly to the unembedding
            labeled &ldquo;baseline.&rdquo; Reading the figure
            critically, what is the dashed edge most likely
            telling you?
          </>
        }
        choices={[
          {
            id: "a",
            label: "The model has direct access to the embedding at every layer; this is just an architectural reminder.",
            explain:
              "Architecturally true, but a paper wouldn't draw an explicit edge for that — it's implicit in the residual structure.",
          },
          {
            id: "b",
            label: "There's a non-trivial direct contribution from embedding to logits — bigram-like predictions — that the named circuit's contribution is added on top of.",
            correct: true,
            explain:
              "Correct. Many papers explicitly factor out the 'direct path' (embedding → unembedding through residuals only) because it dominates on certain tokens. The named circuit is the *additional* mechanism on top of the bigram baseline.",
          },
          {
            id: "c",
            label: "It's a cosmetic edge with no analytical content.",
            explain:
              "Diagrams aren't usually cosmetic — every edge is doing analytical work or it shouldn't be there. The 'baseline' label is a strong hint.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> You&apos;re asked to review a
              circuit paper that shows a five-component diagram
              for a behavior. Each edge has a label, but no
              edge has a specific quantitative claim attached
              (e.g.&nbsp;&ldquo;path patching of this edge
              recovered <em>X</em>% of the gap&rdquo;). Write a
              one-paragraph review comment requesting the
              specific evidence you&apos;d need for each edge,
              and explain why edge-level evidence (not just
              component-level) is necessary.
            </p>
            <p>
              <strong>(b)</strong> A paper publishes a circuit
              diagram with 30 components and ~80 edges. The
              authors argue this isn&apos;t spaghetti because
              every edge is supported by patching evidence. You
              are skeptical. Identify two ways this could still
              be a problematic diagram even if every edge is
              individually well-supported. (Hint: think about
              joint behavior and presentation costs.)
            </p>
            <p>
              <strong>(c)</strong> Take any circuit you&apos;ve
              learned about in this module (induction, IOI, or
              the toy IOI in the figure above) and draw — in
              prose — what a &ldquo;debunking&rdquo; diagram
              would look like: the diagram you&apos;d publish if
              the original circuit story turned out to be
              wrong on some inputs but the circuit still
              performed well in the lab. What does honest
              circuit reporting look like in that case?
            </p>
          </>
        }
        hint={
          <>
            For (a): an edge is a causal claim; component-level
            patching tells you the source component matters but
            not <em>which</em> downstream path. For (b): even
            with per-edge evidence, the joint claim
            &ldquo;these 80 edges together implement behavior
            X&rdquo; needs <em>joint</em> evidence; and a
            30-component diagram is hard to use even when
            correct. For (c): the question is how to communicate
            scope honestly when the circuit is real but
            incomplete.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> &ldquo;The diagram describes
              eight edges, but the supporting evidence only
              shows component-level activation-patching results.
              Component-level evidence tells us the named
              components are causally important, but it lumps
              together <em>all</em> their downstream effects —
              it can&apos;t distinguish between &lsquo;component
              <em>A</em> affects component <em>B</em>{" "}
              directly&rsquo; and &lsquo;component <em>A</em>{" "}
              affects something else that affects <em>B</em>{" "}
              indirectly.&rsquo; To support each edge as drawn,
              please add path-patching results: for each edge{" "}
              <em>A → B</em>, patch <em>A</em>&apos;s output into
              the corrupted run while letting only the path to{" "}
              <em>B</em>&apos;s key/value/query/residual carry
              the patched signal, and report the recovery
              fraction. If the path-patched recovery is much
              smaller than the unrestricted activation patch, the
              edge is weaker than the diagram suggests; if it&apos;s
              comparable, the edge is well-supported.&rdquo;
            </p>
            <p>
              <strong>(b)</strong> Two failure modes: (i){" "}
              <em>Joint evidence is missing</em>. Per-edge
              patching tells you each edge matters when the rest
              of the circuit is intact, but doesn&apos;t tell you
              whether the 30 components together compute the
              behavior in the way the diagram describes. The
              minimum joint test: ablate everything outside the
              named circuit (the &ldquo;faithfulness&rdquo;
              criterion) and confirm behavior is preserved. If
              the paper hasn&apos;t done that, the joint claim
              is unsubstantiated even with per-edge support. (ii){" "}
              <em>Cognitive load defeats the purpose</em>. A
              30-component diagram is hard to use as an
              explanation; even if every line is right, it&apos;s
              not communicating a mechanism a reader can
              internalize. The right response might be to
              partition into nested diagrams (functional groups
              expand to their constituents on demand), drop
              components below an evidence threshold, or admit
              that the circuit is a small graph rather than a
              clean program.
            </p>
            <p>
              <strong>(c)</strong> An honest debunking diagram
              would keep the named components but add explicit
              shaded boxes around &ldquo;in-distribution&rdquo;
              components — those that are part of the original
              story — and unshaded boxes for &ldquo;backup&rdquo;
              or &ldquo;alternative&rdquo; components that take
              over on out-of-distribution inputs. Edges within
              the shaded region carry the original circuit&apos;s
              edge labels; edges that bridge shaded and
              unshaded regions are labeled with the input
              distribution under which they fire. The caption
              would say something like: &ldquo;On
              distribution <em>D</em>, the model uses the
              shaded subgraph (the originally-named circuit).
              On distribution <em>D&apos;</em>, the model uses
              the full graph; the unshaded components are
              <em>backup</em> mechanisms that activate
              specifically when distribution shifts.&rdquo; That
              format admits two things at once: the original
              circuit is real and operates as described in
              its scope, and the model has additional mechanisms
              outside that scope. Both are common; only the
              field&apos;s squeamishness about acknowledging
              partial-circuits stops more papers from drawing
              it this way.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
