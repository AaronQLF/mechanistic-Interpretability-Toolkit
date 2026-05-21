import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { InductionHeadDemo } from "@/components/viz/InductionHeadDemo";

export const metadata = {
  title: "Induction heads",
};

export default function InductionHeadsPage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="induction-heads"
      eyebrow="Chapter 02"
      title="Induction heads"
      lede="Two attention heads, two layers, one job: when you see a token you&apos;ve seen before, copy whatever came after it last time. Olsson et al. showed in 2022 that this circuit forms abruptly during training, that it lives at the same place in many model families, and that it&apos;s the proximate mechanism behind in-context learning."
    >
      <h2>The behavior</h2>
      <p>
        Show a transformer a sequence of the form
      </p>
      <Block>{tex`\ldots\, A_1\, B_1\, \ldots\, A_2\, ?`}</Block>
      <p>
        — two occurrences of token <M>A</M>, with token <M>B</M>{" "}
        following the first. After enough training, the model
        predicts <M>B</M> at the position marked <M>?</M> with high
        probability, even when <M>{tex`(A, B)`}</M> is a pair the
        model has never seen during training. That&apos;s
        in-context learning in its purest form: the network is
        using context as a key/value store. The mechanism that does
        it is the induction circuit.
      </p>

      <h2>The circuit, in two heads</h2>
      <p>
        The circuit lives across two layers and uses exactly two
        attention heads. We&apos;ll call them{" "}
        <M>{tex`H_{\mathrm{prev}}`}</M> (in some early layer) and{" "}
        <M>{tex`H_{\mathrm{ind}}`}</M> (in some later layer). Their
        roles:
      </p>
      <ol>
        <li>
          <strong>Phase 1 — previous-token head{" "}
          <M>{tex`H_{\mathrm{prev}}`}</M>.</strong> Its QK pattern
          is essentially &ldquo;every position attends to the
          position one slot back.&rdquo; Its OV writes the
          source-position&apos;s token embedding into the
          destination&apos;s residual stream. After this head
          fires, position <M>i</M> carries (in addition to its own
          identity) a representation of token <M>{tex`t_{i-1}`}</M>{" "}
          — its &ldquo;left context.&rdquo;
        </li>
        <li>
          <strong>Phase 2 — induction head{" "}
          <M>{tex`H_{\mathrm{ind}}`}</M>.</strong> Its QK is set up
          so that the query at the current position matches against
          keys whose &ldquo;previous-token annotation&rdquo; (the
          thing <M>{tex`H_{\mathrm{prev}}`}</M> wrote) equals the
          current token. Its OV then copies the source-position
          token forward — i.e., the token that came{" "}
          <em>after</em> the previous occurrence of the current
          token gets written into the residual stream.
        </li>
      </ol>
      <p>
        Read it once more, slowly. When the model sees{" "}
        <M>{tex`A_2`}</M>:
      </p>
      <ul>
        <li>
          Position <M>{tex`B_1`}</M> already has{" "}
          <M>{tex`A_1`}</M> written into its residual stream by{" "}
          <M>{tex`H_{\mathrm{prev}}`}</M> (since <M>{tex`A_1`}</M>{" "}
          came one slot before <M>{tex`B_1`}</M>).
        </li>
        <li>
          The query at <M>{tex`A_2`}</M> looks for keys whose
          previous-token annotation equals <M>{tex`A_2`}</M>; only{" "}
          <M>{tex`B_1`}</M>&apos;s key matches.
        </li>
        <li>
          The OV at the matched position copies{" "}
          <M>{tex`B_1`}</M>&apos;s identity into{" "}
          <M>{tex`A_2`}</M>&apos;s residual stream — so the model
          predicts <M>{tex`B`}</M>.
        </li>
      </ul>

      <Figure caption="The induction circuit step by step on the prompt 'A B C A B C A B'. Step 1 runs the previous-token head, annotating each position with its left-neighbor. Step 2 runs the induction head: the final 'B' attends to positions whose annotation matches 'B' — that's the second 'B' (whose annotation is 'A'... wait, follow the demo). Step 3 reads off the predicted next token.">
        <InductionHeadDemo />
      </Figure>

      <h2>What makes it work: K-composition</h2>
      <p>
        The circuit is the canonical example of <em>K-composition</em>{" "}
        from the QK/OV chapter. <M>{tex`H_{\mathrm{prev}}`}</M>{" "}
        writes a feature into the residual stream;{" "}
        <M>{tex`H_{\mathrm{ind}}`}</M>&apos;s key projection reads
        from precisely that feature. We can quantify it:
      </p>
      <Block>{tex`\text{(K-composition score)} = \frac{\| W_K^{(\mathrm{ind})} W_{OV}^{(\mathrm{prev})} \|_F}{\| W_K^{(\mathrm{ind})} \|_F \| W_{OV}^{(\mathrm{prev})} \|_F}.`}</Block>
      <p>
        High composition score means the second head&apos;s key
        listens to what the first head wrote. Low score means the
        two heads operate in independent subspaces.
      </p>
      <p>
        Equivalently, you can describe induction with a virtual
        <em>4-headed</em> bilinear: the score the induction head
        gives to the (right) source position decomposes as a
        product of factors involving{" "}
        <M>{tex`W_E, W_{OV}^{(\mathrm{prev})}, W_{QK}^{(\mathrm{ind})}, W_E^{\top}`}</M>.
        Anthropic&apos;s &ldquo;skip-trigram&rdquo; analysis is
        exactly this product, and the rank of the product
        constrains how many <M>{tex`(A, B)`}</M> pairs the head
        can copy reliably.
      </p>

      <h2>The phase transition</h2>
      <p>
        One of the surprising empirical facts about induction
        heads: they form <em>abruptly</em> during training. The
        in-context-learning loss curve has a clear
        &ldquo;bump&rdquo; — a sudden drop coinciding with the
        emergence of a head whose attention pattern shows the
        characteristic induction stripe. Before the bump, the
        model has no in-context learning ability; after it, it has
        most of what it&apos;ll ever have.
      </p>
      <p>
        This is striking because most of training is smooth.
        Whatever &ldquo;clicks&rdquo; for induction heads is
        unusually discrete. One reading (Olsson et al.):{" "}
        <M>{tex`H_{\mathrm{prev}}`}</M> and{" "}
        <M>{tex`H_{\mathrm{ind}}`}</M> are{" "}
        <em>useless individually</em> — both have to exist before
        either is rewarded — so gradient descent has to find them
        jointly, and the joint solution has a steep wall in front
        of it.
      </p>

      <h2>Why this matters</h2>
      <p>
        Induction heads aren&apos;t just an interesting curiosity.
        Three claims that elevate them:
      </p>
      <ul>
        <li>
          <strong>Universality.</strong> Induction-like heads have
          been found in essentially every transformer language
          model that&apos;s been carefully studied — GPT-2, Pythia,
          various Anthropic models — at remarkably consistent
          relative positions. The model family doesn&apos;t matter
          much; the architecture and training distribution do.
        </li>
        <li>
          <strong>Scaling.</strong> The number and quality of
          induction heads grow with model size. Larger models have
          more sophisticated variants — &ldquo;fuzzy&rdquo;
          induction heads that match on similar tokens, multi-step
          induction heads, etc. The mechanism generalizes
          smoothly.
        </li>
        <li>
          <strong>Emergence proxy.</strong> The induction-head
          phase transition lines up closely with the broader
          emergence of in-context learning, which is in turn close
          to the onset of useful few-shot behavior. Induction
          heads are the simplest known proxy for &ldquo;the model
          can learn from its prompt.&rdquo;
        </li>
      </ul>

      <Callout variant="intuition">
        Induction is a key/value lookup over your own context.
        The previous-token head builds the keys (each position
        knows what came before it); the induction head queries
        with the current token and reads off whatever followed it
        last time. Two heads, one trick, one of the deepest
        results in mech interp so far.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Practical things that follow from the induction-head
          framework:
        </p>
        <ul>
          <li>
            <strong>Detection.</strong> You can identify induction
            heads in any new model with a trivial protocol: feed it
            random repeated sequences (e.g.&nbsp;random tokens
            concatenated with themselves) and look for heads
            whose attention pattern shows the induction stripe.
          </li>
          <li>
            <strong>Ablation tells you the loss attribution.</strong>{" "}
            Mean-ablate every induction head in a model and
            measure the loss change on natural language. The
            difference is, roughly, &ldquo;how much of this
            model&apos;s predictive ability comes from in-context
            learning&rdquo; — typically a meaningful fraction
            for medium-sized LMs.
          </li>
          <li>
            <strong>Direct connection to algorithmic tasks.</strong>{" "}
            Induction-like circuits appear in models trained on
            modular arithmetic, sequence repetition, and
            syntactic tasks. The same general two-head pattern
            shows up far outside language modeling.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            On a sequence{" "}
            <span className="font-mono">A B C A</span>, the
            attention pattern of an induction head at position 4
            (the second{" "}
            <span className="font-mono">A</span>) should put most
            of its mass on which key position?
          </>
        }
        choices={[
          {
            id: "a",
            label: "Position 1 (the first 'A') — that's where the previous occurrence was.",
            explain:
              "Close, but think one step further. The induction head wants the key that has 'A' as its previous-token annotation, not the position that *is* A. That's position 2 ('B'), whose previous token (position 1) is 'A'.",
          },
          {
            id: "b",
            label: "Position 2 (the 'B') — its previous-token annotation is 'A', and the head queries with 'A'.",
            correct: true,
            explain:
              "Right. The induction head uses the previous-token-annotated keys built by H_prev, so the match is on annotations, not on positions. Position 2 has annotation 'A' (= position 1's token), and 'A' is what the current query is.",
          },
          {
            id: "c",
            label: "Position 4 (itself) — the head copies from its own residual stream.",
            explain:
              "That would be a copy / current-token head. Induction heads attend earlier in the sequence to find the relevant past context.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Write the induction-head&apos;s
              attention score for query position <M>i</M> attending
              to key position <M>j</M> as a bilinear form involving
              the embeddings, the previous-token head&apos;s OV,
              and the induction head&apos;s QK. Use the path
              expansion from the previous chapter.
            </p>
            <p>
              <strong>(b)</strong> Consider a degenerate case: the
              previous-token head is replaced with the identity (so
              every position writes its own embedding into itself,
              not its left neighbor&apos;s). What happens to the
              induction head&apos;s behavior? Use this to argue
              that the previous-token head is &ldquo;doing real
              work&rdquo; — not just a pre-processing step the
              model could absorb into the induction head itself.
            </p>
            <p>
              <strong>(c)</strong> Sketch a falsification test for
              the claim &ldquo;head{" "}
              <M>{tex`H_{\mathrm{ind}}`}</M> is an induction
              head.&rdquo; Be specific about the input distribution
              you&apos;d use, what you&apos;d measure, and what
              result would force you to retract the claim. (Hint:
              think about random repeats, permutations of the
              repeat, and partial matches.)
            </p>
          </>
        }
        hint={
          <>
            For (a): the key at position <M>j</M> is built from{" "}
            <M>{tex`x_j + H_{\mathrm{prev}}(\cdot)_j`}</M>, where
            the second term contains{" "}
            <M>{tex`W_E[t_{j-1}, :] W_{OV}^{(\mathrm{prev})}`}</M>.
            Take the inner product with the query at <M>i</M>{" "}
            (which depends on <M>{tex`t_i`}</M>) through{" "}
            <M>{tex`W_{QK}^{(\mathrm{ind})}`}</M>. For (b): if every
            key has its own embedding instead of its
            previous-token&apos;s embedding, what does the induction
            QK become?
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> The score is, dropping
              LayerNorm and constants:
              <Block>{tex`s_{ij} \propto e_{t_i}^{\top}\, W_E\, W_{QK}^{(\mathrm{ind})}\, W_{OV}^{(\mathrm{prev})\,\top}\, W_E^{\top}\, e_{t_{j-1}}.`}</Block>
              The interpretation: the query side contributes{" "}
              <M>{tex`W_E[t_i, :]`}</M>, the key side has been
              augmented to <M>{tex`W_E[t_{j-1}, :] W_{OV}^{(\mathrm{prev})}`}</M>{" "}
              by the previous-token head, and{" "}
              <M>{tex`W_{QK}^{(\mathrm{ind})}`}</M> is the induction
              head&apos;s bilinear form. The head &ldquo;wants&rdquo;{" "}
              this score to be high when <M>{tex`t_i = t_{j-1}`}</M>{" "}
              — i.e.&nbsp;a token-identity match between the
              current query and the previous-token annotation of
              the candidate key.
            </p>
            <p>
              <strong>(b)</strong> If{" "}
              <M>{tex`W_{OV}^{(\mathrm{prev})} = I`}</M> (each
              position writes its own embedding instead of the
              previous one), the augmented key at position{" "}
              <M>j</M> just contains{" "}
              <M>{tex`W_E[t_j, :]`}</M> (twice, but doubled
              doesn&apos;t change the qualitative pattern). The
              induction head&apos;s match condition becomes{" "}
              <M>{tex`t_i = t_j`}</M> instead of{" "}
              <M>{tex`t_i = t_{j-1}`}</M> — that&apos;s a copy /
              current-token head, not an induction head. So the
              previous-token head&apos;s job — shifting tokens by
              one position — is what makes induction work, not
              just a wash. You can&apos;t fold the shift into a
              single attention head, because attention reads the
              residual stream at one position and produces a
              weighted average of vectors at <em>other</em>{" "}
              positions; the &ldquo;shift by one&rdquo; has to
              happen{" "}
              <em>before</em> the matching step.
            </p>
            <p>
              <strong>(c)</strong> Test 1: feed random-token
              sequences of the form{" "}
              <M>{tex`X_1 X_2 \ldots X_{n} X_1 X_2 \ldots X_n`}</M>{" "}
              (a random sequence concatenated with itself).
              Measure the head&apos;s attention pattern at the
              second copy. A genuine induction head should show
              the &ldquo;diagonal-shifted-by-n&rdquo; pattern:
              query <M>i</M> in the second half should attend to
              key <M>{tex`i - n + 1`}</M> in the first half. Test
              2: shuffle the tokens within the first copy of the
              sequence (so the repeats are no longer in order).
              The induction-head pattern should follow the
              shuffle — query for token <M>X</M> should still
              find its match wherever <M>X</M> ended up. If the
              attention pattern stays diagonal-shifted regardless
              of shuffling, the head is using positional
              information rather than token identity, and it&apos;s
              not a true induction head. Test 3: replace one
              token in the second half with a synonym or a
              near-token. A clean induction head won&apos;t fire;
              a &ldquo;fuzzy&rdquo; induction head will, and you
              should advertise that distinction explicitly. Any
              of these tests failing is grounds to retract or
              refine the claim.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
