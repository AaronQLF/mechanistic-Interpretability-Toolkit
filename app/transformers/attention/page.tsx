import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { AttentionDemo } from "@/components/viz/AttentionDemo";

export const metadata = {
  title: "Self-attention",
};

export default function AttentionPage() {
  return (
    <ChapterShell
      moduleSlug="transformers"
      chapterSlug="attention"
      eyebrow="Chapter 01"
      title="Self-attention"
      lede="Three learned projections, one dot product, one softmax. Self-attention is the operation that lets a token decide which other tokens in the context are worth listening to — and exactly how much. It is the only piece of new mathematics in the entire transformer."
    >
      <h2>The setup</h2>
      <p>
        Start with a sequence of <M>n</M> token embeddings, stacked as
        the rows of a matrix{" "}
        <M>{tex`X \in \mathbb{R}^{n \times d}`}</M>. Self-attention turns
        that into another <M>{tex`n \times d`}</M> matrix where each
        row is a <em>context-aware</em> version of the original
        token. Three learned matrices do the work:
      </p>
      <ul>
        <li>
          <strong>Query</strong>{" "}
          <M>{tex`W_Q \in \mathbb{R}^{d \times d_k}`}</M> — what each
          position is looking <em>for</em>.
        </li>
        <li>
          <strong>Key</strong>{" "}
          <M>{tex`W_K \in \mathbb{R}^{d \times d_k}`}</M> — what each
          position offers as a label, so other positions can find it.
        </li>
        <li>
          <strong>Value</strong>{" "}
          <M>{tex`W_V \in \mathbb{R}^{d \times d_v}`}</M> — what each
          position will <em>send</em> if it&apos;s attended to.
        </li>
      </ul>
      <p>
        Apply each projection rowwise to <M>X</M>:{" "}
        <M>{tex`Q = X W_Q`}</M>, <M>{tex`K = X W_K`}</M>,{" "}
        <M>{tex`V = X W_V`}</M>. Three matrices, all of shape{" "}
        <M>{tex`n \times d_\bullet`}</M>.
      </p>

      <h2>The operation</h2>
      <p>
        Scaled dot-product attention is exactly one equation:
      </p>
      <Block>{tex`\mathrm{Attn}(Q, K, V) = \mathrm{softmax}\!\left(\frac{Q K^{\top}}{\sqrt{d_k}}\right) V.`}</Block>
      <p>
        Read it left to right.{" "}
        <M>{tex`Q K^{\top}`}</M> is an{" "}
        <M>{tex`n \times n`}</M> matrix whose entry{" "}
        <M>{tex`(i, j)`}</M> is{" "}
        <M>{tex`q_i \cdot k_j`}</M> — the dot product of the query at
        position <M>i</M> with the key at position <M>j</M>. Bigger
        means more aligned. Divide by{" "}
        <M>{tex`\sqrt{d_k}`}</M> to keep the variance from blowing up
        with dimension. Run softmax on each <em>row</em> independently,
        producing a row of probabilities (an <em>attention pattern</em>)
        that sum to 1 across keys. Finally, multiply by <M>V</M>: every
        output row is a <em>convex combination</em> of value vectors,
        weighted by how much that position attended to each other.
      </p>

      <Figure caption="A six-token sentence with random embeddings and learned Q/K/V matrices. Pick a query position; the middle row shows its raw dot products with every key, the right shows what softmax does. Toggle the causal mask to kill the future before softmax sees it.">
        <AttentionDemo />
      </Figure>

      <h2>Three things to notice</h2>
      <p>
        <strong>1. Same operation, every position.</strong> The query at
        position <M>i</M> is built from <em>only</em>{" "}
        <M>{tex`x_i`}</M> via <M>{tex`q_i = W_Q^{\top} x_i`}</M>. The
        same is true for keys and values. The only place positions
        interact is the matrix <M>{tex`Q K^{\top}`}</M> — and that
        interaction is symmetric in&nbsp;form: you compute the same
        kind of dot product everywhere.
      </p>
      <p>
        <strong>2. Permutation-equivariant.</strong> Permute the rows of{" "}
        <M>X</M> and you permute the rows of the output the same way.
        The attention operation has no idea what order tokens come in.
        That&apos;s why we need positional encodings — the next
        chapter — or the model would treat &ldquo;dog bites man&rdquo;
        and &ldquo;man bites dog&rdquo; identically.
      </p>
      <p>
        <strong>3. The <M>{tex`\sqrt{d_k}`}</M> matters.</strong> If{" "}
        <M>{tex`q, k`}</M> have iid components with unit variance,
        their dot product has variance <M>{tex`d_k`}</M>. Without
        scaling, large <M>{tex`d_k`}</M> sends softmax into its
        saturated regime — gradients vanish and one key absorbs all
        the mass. Dividing by <M>{tex`\sqrt{d_k}`}</M> restores unit
        variance and keeps softmax &ldquo;learnable.&rdquo;
      </p>

      <h2>The causal mask</h2>
      <p>
        For autoregressive language modeling we need each position to
        only see the past. We do this by adding a mask <M>M</M> to the
        scores:
      </p>
      <Block>{tex`\mathrm{Attn}(Q,K,V) = \mathrm{softmax}\!\left(\frac{Q K^{\top}}{\sqrt{d_k}} + M\right) V, \qquad M_{ij} = \begin{cases} 0 & j \le i \\ -\infty & j > i \end{cases}.`}</Block>
      <p>
        Adding <M>{tex`-\infty`}</M> to a future-position score sends
        it to <M>0</M> after softmax. The query never gets to peek
        ahead, even though we computed all queries and keys in
        parallel. This is the only difference between encoder
        attention (no mask) and decoder attention (mask).
      </p>

      <h2>What attention &ldquo;is&rdquo;</h2>
      <p>
        It&apos;s a <em>differentiable, content-addressable lookup
        table</em>. Each token publishes a key (&ldquo;here&apos;s
        what I am&rdquo;) and a value (&ldquo;here&apos;s what I&apos;d
        send&rdquo;). Each token issues a query (&ldquo;here&apos;s
        what I&apos;m looking for&rdquo;). Softmax-weighted dot
        products select the relevant entries; the output is the
        weighted average of their values. Compare to MLP keys/values
        from the neural-networks module: same idea, but{" "}
        <em>across the sequence</em> instead of within a single
        token&apos;s residual stream.
      </p>

      <Callout variant="intuition">
        Attention is &ldquo;every token gets to ask every other
        token a question, and the answers get averaged with weights
        the questioner picks.&rdquo; The questions, the labels on
        the answers, and the answers themselves are all linear
        projections of the same input — three learned views of one
        residual stream.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Mech interp almost always studies attention through two
          objects:
        </p>
        <ul>
          <li>
            <strong>The attention pattern</strong>{" "}
            <M>{tex`A = \mathrm{softmax}(Q K^{\top}/\sqrt{d_k})`}</M>{" "}
            — an <M>{tex`n \times n`}</M> matrix you can{" "}
            <em>look at</em>. Many heads have visibly interpretable
            patterns: previous-token, current-token-copy,
            subject-tracker, induction.
          </li>
          <li>
            <strong>The output</strong>{" "}
            <M>{tex`AV`}</M> — what actually gets written into the
            residual stream. Attention patterns tell you{" "}
            <em>where</em> a head is reading from; the value- and
            output-projections tell you <em>what</em> it writes.
            Both are necessary; neither is sufficient. We separate
            them cleanly two chapters from now (QK / OV).
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            With <M>{tex`d_k = 64`}</M> and queries / keys drawn iid
            with unit variance per coordinate, what would the typical
            magnitude of an unscaled dot product{" "}
            <M>{tex`q \cdot k`}</M> be — and what does softmax do to
            it before scaling?
          </>
        }
        choices={[
          {
            id: "a",
            label: "≈ 1; softmax stays in its smooth regime.",
            explain:
              "Variance of a sum of d_k iid products is d_k, not 1. Typical magnitude is √d_k.",
          },
          {
            id: "b",
            label: "≈ 8; softmax saturates and gradients vanish for the loser keys.",
            correct: true,
            explain:
              "√64 = 8, so unscaled dot products live around ±8. Softmax of (8, 0, 0, …) is essentially one-hot — exactly the regime we wanted to avoid. Dividing by √d_k brings the scale back to ≈ 1.",
          },
          {
            id: "c",
            label: "≈ 64; identical behavior with or without scaling.",
            explain:
              "Variance scales with d_k, so magnitude scales with √d_k, not d_k. And softmax behaves very differently at scale 1 vs. 8.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Self-attention with the causal mask, written out
              row-by-row, is{" "}
              <M>{tex`\mathrm{out}_i = \sum_{j \le i} a_{ij}\, v_j`}</M>{" "}
              where <M>{tex`a_{ij} = \mathrm{softmax}_{j \le i}(q_i \cdot k_j / \sqrt{d_k})`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Show that <em>scaled dot-product
              attention has an exact temperature symmetry</em>: for
              any <M>{tex`c > 0`}</M>, the substitution{" "}
              <M>{tex`(W_Q, W_K) \to (cW_Q, W_K/c)`}</M> leaves the
              output of attention unchanged for every input. Use
              this to argue that the &ldquo;norms&rdquo; of{" "}
              <M>{tex`W_Q`}</M> and <M>{tex`W_K`}</M> separately are
              not interpretable, but their product through{" "}
              <M>{tex`W_Q W_K^{\top}`}</M> is.
            </p>
            <p>
              <strong>(b)</strong> Now consider the output side.
              Write the head output as{" "}
              <M>{tex`\mathrm{out}_i = A_{i,:}\, X W_V`}</M> where{" "}
              <M>{tex`A_{i,:}`}</M> is the attention pattern row.
              Show that the linear map{" "}
              <M>{tex`X \mapsto \mathrm{out}_i`}</M> factors through
              two rank-bounded operations and identify the rank
              bottleneck. Why is this a justification for the
              choice <M>{tex`d_v = d / h`}</M> per head in
              multi-head attention?
            </p>
            <p>
              <strong>(c)</strong> Suppose the causal mask is
              implemented additively (as in the chapter) but
              someone implements it incorrectly as a{" "}
              <em>multiplicative</em> mask after softmax: they
              compute <M>{tex`A = \mathrm{softmax}(QK^{\top}/\sqrt{d_k})`}</M>{" "}
              with no mask, then zero out the upper triangle of{" "}
              <M>A</M>, then divide each row by its remaining sum.
              Give a concrete example where this differs from the
              correct additive mask, and explain why training is
              still &ldquo;mostly&rdquo; OK with the wrong mask but
              evaluation is silently broken.
            </p>
          </>
        }
        hint={
          <>
            For (a): the scores are{" "}
            <M>{tex`q_i \cdot k_j = x_i^{\top} W_Q W_K^{\top} x_j`}</M>;
            the substitution preserves that product. For (b):{" "}
            <M>{tex`X W_V`}</M> has rank at most{" "}
            <M>{tex`d_v`}</M>; <M>{tex`A_{i,:}`}</M> is just{" "}
            <M>{tex`1 \times n`}</M>. For (c): with the buggy mask
            the future contributes through softmax normalization
            even after zeroing — try a 2-token input where the
            second key is huge and the first is tiny.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`q_i \cdot k_j = (x_i^{\top} W_Q)(W_K^{\top} x_j) = x_i^{\top}(W_Q W_K^{\top}) x_j`}</M>.
              Replacing <M>{tex`W_Q \to cW_Q`}</M>,{" "}
              <M>{tex`W_K \to W_K / c`}</M> changes neither the
              product <M>{tex`W_Q W_K^{\top}`}</M> nor any score.
              The mech-interp consequence: it is the joint matrix{" "}
              <M>{tex`W_Q W_K^{\top} \in \mathbb{R}^{d \times d}`}</M>{" "}
              — not the individual <M>{tex`W_Q`}</M>,{" "}
              <M>{tex`W_K`}</M> — that has interpretable structure.
              This is the &ldquo;QK circuit&rdquo; we&apos;ll
              dissect three chapters from now.
            </p>
            <p>
              <strong>(b)</strong>{" "}
              <M>{tex`X W_V \in \mathbb{R}^{n \times d_v}`}</M> has
              rank at most <M>{tex`d_v`}</M>. The output of one head
              for a single position lives in a{" "}
              <M>{tex`d_v`}</M>-dimensional subspace of{" "}
              <M>{tex`\mathbb{R}^d`}</M> (after the output
              projection <M>{tex`W_O`}</M>). So a single head can
              only write into a low-rank subspace. Multi-head with{" "}
              <M>{tex`h`}</M> heads of width{" "}
              <M>{tex`d_v = d/h`}</M> recovers full rank only when
              the heads&apos; subspaces don&apos;t overlap — and{" "}
              <em>each head</em> is an explicit choice of which
              subspace to write into. That&apos;s a lot of
              interpretability mileage out of one ratio.
            </p>
            <p>
              <strong>(c)</strong> Take{" "}
              <M>{tex`q_2 \cdot k_1 = -2`}</M>,{" "}
              <M>{tex`q_2 \cdot k_2 = +5`}</M>. Correct (additive
              mask, position 2 sees both): softmax is{" "}
              <M>{tex`(\sigma(-2-5), \sigma(5-(-2)))`}</M> normalized.
              Wrong (compute softmax over both, then zero key 2,
              then renormalize): softmax sees the future score{" "}
              <M>{tex`+5`}</M> in the denominator, so the kept
              weight on key 1 collapses much smaller than it would
              with a correct mask. Training can paper over this if
              the model learns to keep score magnitudes balanced;
              evaluation on out-of-distribution prompts (where one
              future token has an extreme score) silently
              under-weights the past. Reviewers and replication
              attempts have caught this exact bug in the wild.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
