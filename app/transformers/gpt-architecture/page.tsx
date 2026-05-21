import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";

export const metadata = {
  title: "Stacking blocks: a GPT",
};

export default function GPTArchitecturePage() {
  return (
    <ChapterShell
      moduleSlug="transformers"
      chapterSlug="gpt-architecture"
      eyebrow="Chapter 06"
      title="Stacking blocks: a GPT"
      lede="Take L copies of the previous chapter&apos;s block, put a token embedding on the front and an unembedding on the back, train it to predict the next token. That is GPT — and modulo tokenizer choices and scale, it is most of every frontier language model."
    >
      <h2>The full architecture, end-to-end</h2>
      <p>
        Given a token sequence <M>{tex`t_1, \ldots, t_n`}</M> and
        token embedding matrix{" "}
        <M>{tex`W_E \in \mathbb{R}^{V \times d}`}</M>:
      </p>
      <ol>
        <li>
          <strong>Embed.</strong>{" "}
          <M>{tex`\mathbf{x}_0[i] = W_E[t_i, :] + p(i)`}</M>, with{" "}
          <M>p</M> the chosen positional encoding (or, for RoPE/ALiBi,
          omitted here and folded into attention).
        </li>
        <li>
          <strong>L blocks.</strong> For{" "}
          <M>{tex`\ell = 1, \ldots, L`}</M>, run a transformer block:
          attention then MLP, both with pre-norm and residual.
        </li>
        <li>
          <strong>Final norm.</strong> Apply one last LayerNorm:{" "}
          <M>{tex`\tilde{\mathbf{x}}_L = \mathrm{LN}_f(\mathbf{x}_L)`}</M>.
        </li>
        <li>
          <strong>Unembed.</strong>{" "}
          <M>{tex`\mathbf{z}[i] = W_U \tilde{\mathbf{x}}_L[i]`}</M>{" "}
          gives the next-token logits at every position. The
          unembedding is often tied:{" "}
          <M>{tex`W_U = W_E^{\top}`}</M>.
        </li>
        <li>
          <strong>Softmax.</strong>{" "}
          <M>{tex`p(t_{i+1} \mid t_{1:i}) = \mathrm{softmax}(\mathbf{z}[i] / T)`}</M>{" "}
          at temperature <M>T</M>.
        </li>
      </ol>
      <p>
        That is the entire forward pass. The only thing this
        chapter adds beyond the previous one is the embedding /
        unembedding pair on the ends, plus a careful treatment of
        the autoregressive structure.
      </p>

      <h2>Training: next-token cross-entropy</h2>
      <p>
        For a training sequence <M>{tex`t_1, \ldots, t_n`}</M>, the
        loss is the average negative log-likelihood of each
        token given its prefix:
      </p>
      <Block>{tex`\mathcal{L} = -\frac{1}{n-1} \sum_{i=1}^{n-1} \log p(t_{i+1} \mid t_{1:i}).`}</Block>
      <p>
        Two facts that aren&apos;t obvious until you write it out:
      </p>
      <ul>
        <li>
          <strong>Every position is a training signal.</strong> The
          causal mask means position <M>i</M>&apos;s output is a
          prediction for token <M>{tex`i+1`}</M>, computed from{" "}
          <em>only</em> the prefix. So a single sequence of length
          <M>n</M> contributes <M>{tex`n-1`}</M> independent
          prediction tasks. That&apos;s where the dramatic
          sample-efficiency of language modeling comes from.
        </li>
        <li>
          <strong>The loss is a cross-entropy in bits, divided by
          ln 2.</strong> The actual quantity we report
          (&ldquo;perplexity&rdquo;) is{" "}
          <M>{tex`\exp(\mathcal{L})`}</M>, the geometric mean
          probability the model assigns to the correct token. A
          perplexity of 20 means the model has narrowed to ~20
          plausible candidates per token on average.
        </li>
      </ul>

      <h2>Inference: autoregressive sampling</h2>
      <p>
        At deployment, the model is run repeatedly, one token at a
        time:
      </p>
      <ol>
        <li>
          Run the model on the current prompt; read off{" "}
          <M>{tex`p(t_{n+1} \mid t_{1:n})`}</M>.
        </li>
        <li>
          Sample a token from that distribution (greedy, top-k,
          top-p, or temperature sampling — see the Probability
          module&apos;s sampling chapter).
        </li>
        <li>
          Append it to the prompt; go to 1.
        </li>
      </ol>
      <p>
        The KV cache is the obvious optimization: every token from
        a previous step has the same key and value vectors as
        before, so we save them and only compute the new token&apos;s
        Q, K, V. This turns the cost per generated token from{" "}
        <M>{tex`O(n^2 d)`}</M> to <M>{tex`O(n d)`}</M> — exactly the
        difference between &ldquo;feasible&rdquo; and &ldquo;not&rdquo;
        for long-context generation.
      </p>

      <h2>What scaling adds</h2>
      <p>
        Modern frontier models are GPT in this exact sense, with
        three knobs turned up:
      </p>
      <ul>
        <li>
          <strong>Width <M>d</M></strong>: 768 (GPT-2 small), 12,288 (GPT-3),
          and reportedly larger for current-frontier models. Width
          increases the residual stream&apos;s capacity and the
          per-head MLP / attention parameters.
        </li>
        <li>
          <strong>Depth <M>L</M></strong>: 12 (GPT-2 small), 96 (GPT-3),
          and again larger today. Depth increases how many sequential
          read-write rounds the residual stream gets.
        </li>
        <li>
          <strong>Training data</strong>: ~1B tokens (GPT-2),
          300B (GPT-3), trillions today. Data and parameters scale
          together: too few of either and the model
          undertrains; the &ldquo;Chinchilla&rdquo; (Hoffmann et al.
          2022) result calibrates the ratio.
        </li>
      </ul>
      <p>
        Architecturally, the differences from GPT-2 in modern
        models are surprisingly small: pre-norm vs. RMSNorm,
        absolute vs. RoPE positions, ReLU/GELU vs. SwiGLU MLPs,
        encoder/decoder vs. decoder-only. Each is a 1–2% quality
        change at fixed compute. The architecture is mostly
        settled; everything else has moved.
      </p>

      <h2>What this means for mech interp</h2>
      <p>
        The clean factorization of the model into
        embedding → blocks → unembedding gives mech interp three
        kinds of objects to study:
      </p>
      <ul>
        <li>
          <strong>The embedding</strong>{" "}
          <M>{tex`W_E`}</M>: a <M>V</M> × <M>d</M> matrix mapping
          discrete tokens into the residual stream. Each row is a
          token&apos;s &ldquo;arrival&rdquo; vector. We&apos;ll see
          these used as readout directions in the next chapter.
        </li>
        <li>
          <strong>The unembedding</strong>{" "}
          <M>{tex`W_U`}</M>: a <M>d</M> × <M>V</M> matrix mapping the
          final residual stream to logits. Each column is a
          token&apos;s &ldquo;readout&rdquo; direction. The
          residual-stream component along{" "}
          <M>{tex`W_U[:, t]`}</M> is exactly &ldquo;the model&apos;s
          unnormalized log-probability of token <M>t</M>&rdquo; — at
          any layer, with a linear approximation of the
          intervening LayerNorm. This is the <em>logit lens</em>.
        </li>
        <li>
          <strong>The blocks</strong> in between: each contributes
          additively to the residual stream, and each can be
          attributed back to specific heads / MLP neurons via the
          decomposition from the last chapter.
        </li>
      </ul>

      <Callout variant="intuition">
        A GPT is six lines of pseudocode: embed, repeat (norm,
        attention, add; norm, MLP, add) for L layers, norm,
        unembed, softmax. Everything frontier models add on top of
        this — bigger numbers, RoPE, RMSNorm, SwiGLU — moves the
        loss curve a bit. The <em>shape</em> of computation is
        what you learned in the last five pages.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Three architectural facts that mech interp leans on
          repeatedly:
        </p>
        <ul>
          <li>
            <strong>Every layer&apos;s residual stream lives in
            the same{" "}
            <M>d</M>-dim space.</strong> So you can apply{" "}
            <M>{tex`W_U`}</M> to <M>{tex`\mathbf{x}_\ell`}</M> for
            any <M>{tex`\ell`}</M> and read out a meaningful
            distribution over tokens. This is the logit-lens
            trick — and it works because of the residual structure.
          </li>
          <li>
            <strong>The unembedding columns are token directions.</strong>{" "}
            Anything in the residual stream that aligns with{" "}
            <M>{tex`W_U[:, t]`}</M> contributes to predicting{" "}
            <M>t</M>. &ldquo;A head writes the {`"Paris"`} direction
            into the residual stream&rdquo; is precise: the head&apos;s
            output has high inner product with{" "}
            <M>{tex`W_U[:, \text{Paris}]`}</M>.
          </li>
          <li>
            <strong>The embedding columns are also token directions.</strong>{" "}
            With tied weights, <M>{tex`W_E[t, :]`}</M> and{" "}
            <M>{tex`W_U[:, t]`}</M> are the same vector. The
            embedding tells you what <em>arrives</em> in the
            residual stream when token <M>t</M> appears; the
            unembedding tells you what to <em>read off</em> when
            you want the model to predict <M>t</M>. Often the same
            direction does both jobs.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            A GPT has{" "}
            <M>{tex`d = 768, L = 12, h = 12, V = 50{,}257`}</M>{" "}
            (GPT-2 small). Which of these dominates the parameter
            count?
          </>
        }
        choices={[
          {
            id: "a",
            label: "The token embedding (50,257 × 768).",
            correct: true,
            explain:
              "W_E and W_U each have 50257 × 768 ≈ 38.6M parameters; tied or not they dominate the 12 × (4d² + 8d²) ≈ 84M of the blocks for small models. For large vocabularies the embedding is always a sizable fraction of the total — though as d grows, blocks dominate.",
          },
          {
            id: "b",
            label: "The attention weights, summed across all blocks.",
            explain:
              "12 × 4d² ≈ 28M — sizable but not dominant for GPT-2 small.",
          },
          {
            id: "c",
            label: "The MLP weights, summed across all blocks.",
            explain:
              "12 × 8d² ≈ 56M — close, but for GPT-2 small the embedding still wins. Past d ≈ 1500 or so, the MLPs dominate.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> A model with tied embeddings sets{" "}
              <M>{tex`W_U = W_E^{\top}`}</M>. Argue both for and
              against this design choice. Specifically: name a
              functional advantage that a fully separate{" "}
              <M>{tex`W_U`}</M> would have, and a regularization
              advantage that tying offers.
            </p>
            <p>
              <strong>(b)</strong> The KV cache stores keys and
              values for every previously generated token, at every
              layer. Estimate the cache size for a model with{" "}
              <M>{tex`d = 4096, L = 32, h = 32, n = 8192`}</M>{" "}
              tokens of context, in fp16. Then explain why grouped /
              multi-query attention (sharing K and V across heads)
              cuts this by 1–2 orders of magnitude — and what it
              costs in expressiveness.
            </p>
            <p>
              <strong>(c)</strong> Implement &ldquo;greedy decoding&rdquo;
              and &ldquo;temperature 0&rdquo; sampling: are they the
              same? Show that they are equivalent in the limit, but
              that direct &ldquo;<M>{tex`T \to 0`}</M>&rdquo; in code
              is numerically unstable. Sketch the safe implementation
              (the one PyTorch&apos;s{" "}
              <code>topk</code> / <code>argmax</code>-based decoders
              actually use).
            </p>
          </>
        }
        hint={
          <>
            For (a): tied weights couple two matrices that play
            asymmetric roles — the embedding has to look right to
            the first layer, the unembedding has to look right to
            the last. For (b): KV cache size = 2 (K, V) × L × n × d
            × 2 bytes; multiply through. For (c): softmax(x/T) as
            T → 0 puts all mass on argmax(x), but exp(x/T) overflows.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> For separate weights: the
              embedding wants to live in a basis that arriving
              tokens can be mixed in (so common tokens get distinct
              directions), while the unembedding wants to live in a
              basis that&apos;s well-correlated with what the final
              residual stream tends to look like — which is shaped
              by all the blocks in between, not just by the
              vocabulary. Tying them forces a compromise. For
              tying: it cuts roughly{" "}
              <M>V</M> &times; <M>d</M> parameters (substantial for
              small models), it&apos;s a strong inductive bias
              (&ldquo;the direction that means {`'token t'`} on
              input is the same that means it on output&rdquo;),
              and it empirically improves
              small-model loss. Modern large models often
              <em>untie</em> them since the parameter savings stop
              mattering.
            </p>
            <p>
              <strong>(b)</strong> Cache = 2 (K, V) × L × n × d ×
              fp16-bytes = 2 × 32 × 8192 × 4096 × 2 = 4.29&nbsp;GB,
              <em>per sequence</em>. At batch size 16 that&apos;s
              68 GB — bigger than the model itself. Multi-query
              attention shares one K and one V across all <M>h</M>{" "}
              heads, cutting KV-cache memory and bandwidth by{" "}
              <M>h</M> = 32×. Grouped-query attention (GQA) shares
              K, V across small groups of heads, recovering most of
              the multi-head expressiveness while still saving
              ~8×. The expressiveness cost is real but manageable:
              with multi-query each head&apos;s OV writes are still
              independent (since <M>{tex`W_O`}</M> is per-head),
              but the QK scoring side is shared — every head reads
              from the same key directions, just with different
              queries.
            </p>
            <p>
              <strong>(c)</strong>{" "}
              <M>{tex`\mathrm{softmax}(z / T)`}</M> as{" "}
              <M>{tex`T \to 0^{+}`}</M> converges to a one-hot on
              the argmax, so &ldquo;greedy&rdquo; and &ldquo;<M>{tex`T = 0`}</M>&rdquo;
              are mathematically identical. But naive code
              (<code>exp(z / T) / sum(exp(z / T))</code>) divides
              by tiny <M>T</M> and overflows. The safe
              implementation: at sample time, separate the policy
              (greedy / sampled) from the temperature variable,
              and treat <M>{tex`T = 0`}</M> as a sentinel that
              calls{" "}
              <code>argmax(z)</code> directly without computing the
              softmax. Equivalently, do the standard
              max-subtraction trick before exponentiating —{" "}
              <M>{tex`\mathrm{softmax}(z) = \mathrm{exp}(z - \max z) / \sum \mathrm{exp}(z - \max z)`}</M>{" "}
              — and apply the argmax shortcut only when{" "}
              <M>{tex`T = 0`}</M>.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
