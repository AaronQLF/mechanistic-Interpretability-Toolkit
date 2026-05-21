import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { PositionalEncodingViz } from "@/components/viz/PositionalEncodingViz";

export const metadata = {
  title: "Positional encodings",
};

export default function PositionalEncodingPage() {
  return (
    <ChapterShell
      moduleSlug="transformers"
      chapterSlug="positional-encoding"
      eyebrow="Chapter 04"
      title="Positional encodings"
      lede="Self-attention is permutation-equivariant: it can&apos;t tell &lsquo;dog bites man&rsquo; from &lsquo;man bites dog&rsquo; on architecture alone. Positional encodings put order back in. Sinusoidal, learned, RoPE, ALiBi: four standard answers, and a question every modern paper still re-litigates."
    >
      <h2>The problem</h2>
      <p>
        Take an input matrix <M>{tex`X \in \mathbb{R}^{n \times d}`}</M>{" "}
        and any permutation matrix{" "}
        <M>{tex`P \in \mathbb{R}^{n \times n}`}</M>. Then
      </p>
      <Block>{tex`\mathrm{Attn}(P X) = P\, \mathrm{Attn}(X).`}</Block>
      <p>
        Permute the input rows; the output rows permute the same way.
        Equivalently: if you shuffle the tokens, the attention
        operation produces the same outputs in shuffled order. The
        function the model computes is a function of the{" "}
        <em>multiset</em> of tokens, not the sequence. For language
        modeling this is catastrophic. We have to break the symmetry
        by putting position information into <M>X</M> itself.
      </p>

      <h2>Strategy 1: absolute encodings (sinusoidal, learned)</h2>
      <p>
        Pick a function <M>{tex`p : \mathbb{N} \to \mathbb{R}^{d}`}</M>{" "}
        that maps each position to a vector. Add it to the embeddings:
      </p>
      <Block>{tex`X_{\text{in}} = X_{\text{embed}} + P, \qquad P_{i, :} = p(i).`}</Block>
      <p>
        That&apos;s it. The original transformer paper used the
        sinusoidal choice
      </p>
      <Block>{tex`p(i)_{2k} = \sin(i / 10000^{2k/d}), \qquad p(i)_{2k+1} = \cos(i / 10000^{2k/d}),`}</Block>
      <p>
        for <M>{tex`k = 0, 1, \ldots, d/2 - 1`}</M>. Slow channels (low{" "}
        <M>k</M>) wrap rarely, fast channels (high <M>k</M>) wrap
        quickly. The motivation: a linear function of <M>{tex`p(i)`}</M>{" "}
        can rotate to <M>{tex`p(i + \Delta)`}</M> for any fixed
        offset <M>{tex`\Delta`}</M>, so the model can learn to attend
        &ldquo;<M>k</M> positions back.&rdquo; A learned encoding —
        <M>P</M> as a free parameter matrix — works comparably for
        sequences shorter than training length, but generalizes worse
        to longer sequences.
      </p>
      <p>
        The cost: position information is mixed into the residual
        stream from the very first layer. Every downstream attention
        head, every MLP, has to share the same <M>d</M>-dimensional
        vector with the token-content signal. Treat this as
        &ldquo;each position takes up some bandwidth on the residual
        stream.&rdquo;
      </p>

      <h2>Strategy 2: rotary positional encoding (RoPE)</h2>
      <p>
        RoPE (Su et al. 2021) replaces &ldquo;add a vector&rdquo; with{" "}
        &ldquo;rotate the query and key.&rdquo; Pair up coordinates
        of <M>{tex`q, k \in \mathbb{R}^{d_k}`}</M> into{" "}
        <M>{tex`d_k / 2`}</M> two-vectors and apply a 2D rotation by
        angle <M>{tex`\theta_k \cdot i`}</M> to the pair indexed by{" "}
        <M>k</M> at position <M>i</M>:
      </p>
      <Block>{tex`R_{\theta, i} = \begin{pmatrix} \cos(i\theta) & -\sin(i\theta) \\ \sin(i\theta) & \cos(i\theta) \end{pmatrix}, \quad q_i \mapsto R_{\theta, i}\, q_i, \quad k_j \mapsto R_{\theta, j}\, k_j.`}</Block>
      <p>
        The angles <M>{tex`\theta_k = 1/10000^{2k/d_k}`}</M> are the
        sinusoidal base again. The crucial property is that the
        post-rotation dot product depends only on the{" "}
        <em>relative</em> position:
      </p>
      <Block>{tex`(R_{\theta, i} q)^{\top} (R_{\theta, j} k) = q^{\top} R_{\theta, j - i} k.`}</Block>
      <p>
        Rotating both sides costs you nothing about translation
        invariance. The QK score becomes a function of <M>{tex`j - i`}</M>{" "}
        without anyone explicitly subtracting the positions. RoPE
        gives the network an exact relative-position bias, applied
        every layer, with no parameters added.
      </p>

      <h2>Strategy 3: ALiBi (linear attention bias)</h2>
      <p>
        ALiBi (Press et al. 2021) skips the embedding altogether and
        adds a bias to the attention scores:
      </p>
      <Block>{tex`s_{ij} = \frac{q_i \cdot k_j}{\sqrt{d_k}} - m_h\, |i - j|,`}</Block>
      <p>
        where <M>{tex`m_h`}</M> is a fixed (per-head) slope, e.g.{" "}
        <M>{tex`m_h = 1/2^h`}</M>. No learned parameters at all. Each
        head gets a different penalty, so different heads end up
        focusing on different windows of context. ALiBi&apos;s big
        practical advantage is{" "}
        <em>extrapolation</em>: you can apply a model trained at
        sequence length 1k to inputs of length 100k and it
        degrades gracefully, because the bias formula still makes
        sense outside the training range.
      </p>

      <Figure caption="Toggle between the three encodings. Sinusoidal shows position vectors p(i) directly. RoPE shows the post-rotation Q·K dot product as a function of (i, j) — it depends only on i − j. ALiBi shows the additive bias matrix.">
        <PositionalEncodingViz />
      </Figure>

      <h2>Which one should you use?</h2>
      <p>
        Honest answer: the field hasn&apos;t fully settled, and the
        empirical differences are smaller than the rhetoric. Some
        rough rules of thumb:
      </p>
      <ul>
        <li>
          <strong>Sinusoidal absolute</strong>: simple, classical,
          fine for fixed-length tasks. Generalizes poorly past
          training length.
        </li>
        <li>
          <strong>Learned absolute</strong>: marginal gains over
          sinusoidal in-distribution; same extrapolation problem.
        </li>
        <li>
          <strong>RoPE</strong>: the modern default for open-source
          LLMs (LLaMA, Mistral, Qwen). Clean math, exact relative
          position, plays well with rotary-aware kernels.
        </li>
        <li>
          <strong>ALiBi</strong>: chosen specifically for length
          extrapolation. MPT and BLOOM use it; less common in
          frontier models today.
        </li>
      </ul>

      <Callout variant="intuition">
        Attention without position is a bag-of-tokens operation. The
        question every positional encoding answers is: <em>how much
        of the sequence&apos;s order do you want the model to see,
        and where do you want it injected?</em> Absolute encodings
        write order into the residual stream once; RoPE and ALiBi
        write it directly into the attention scores, every layer.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Positional encodings have direct interpretability
          consequences:
        </p>
        <ul>
          <li>
            <strong>Absolute encodings consume residual-stream
            bandwidth.</strong> A small but non-trivial fraction of
            the residual stream&apos;s directions are spoken for by
            position; superposition has to share with that.
          </li>
          <li>
            <strong>RoPE makes &ldquo;previous-token&rdquo; heads
            very cheap.</strong> The QK pattern that fires at relative
            position −1 is achievable by a rank-1 RoPE-aligned{" "}
            <M>{tex`W_{QK}`}</M>; the same pattern under sinusoidal
            absolute encoding requires the head to learn a more
            complex bilinear form.
          </li>
          <li>
            <strong>ALiBi makes long-range heads explicit.</strong>{" "}
            The per-head slope <M>{tex`m_h`}</M> directly determines
            the head&apos;s receptive field. A head with very small
            <M>{tex`m_h`}</M> can attend across the whole document; a
            head with large <M>{tex`m_h`}</M> is forced to be local.
          </li>
          <li>
            <strong>Probes for position.</strong> You can train a
            linear probe on the residual stream to predict absolute
            position; the easier the probe&apos;s job, the more the
            position information is &ldquo;floating around&rdquo; in
            the residual stream rather than being consumed by the
            attention scores.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            With the standard sinusoidal encoding, the channel{" "}
            <M>{tex`p(i)_{2k}`}</M> is{" "}
            <M>{tex`\sin(i / 10000^{2k/d})`}</M>. For{" "}
            <M>{tex`d = 768`}</M>, roughly how many positions does
            it take for the slowest sinusoid (<M>{tex`k = d/2 - 1`}</M>)
            to complete one full cycle?
          </>
        }
        choices={[
          {
            id: "a",
            label: "≈ 100 positions.",
            explain:
              "The slowest channel has wavelength 2π · 10000^{(d-2)/d} ≈ 2π · 10000, which is far more than 100.",
          },
          {
            id: "b",
            label: "≈ 60,000 positions.",
            correct: true,
            explain:
              "Wavelength = 2π · 10000^{(d-2)/d} ≈ 2π · 10000 ≈ 6.28 × 10^4. The slowest channel only barely changes across realistic context lengths — it acts as a near-constant offset.",
          },
          {
            id: "c",
            label: "It depends only on d, not on the base 10000.",
            explain:
              "Wavelength scales with the base raised to ≈ 1, so the base dominates. Try setting base = 1: every channel becomes constant.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Show formally that without any
              positional encoding, a transformer&apos;s output is
              equivariant under permutations of the input tokens (in
              the absence of causal masking). Where exactly does the
              causal mask break this equivariance, and why isn&apos;t
              that &ldquo;enough&rdquo; positional information for a
              language model? (Hint: a causal mask gives you{" "}
              <em>order</em>, not <em>position</em>.)
            </p>
            <p>
              <strong>(b)</strong> Prove that RoPE makes the
              attention score a function of <M>{tex`j - i`}</M>{" "}
              alone, given that{" "}
              <M>{tex`R_{\theta, i}^{\top} R_{\theta, j} = R_{\theta, j-i}`}</M>.
              Then show that this is{" "}
              <em>not</em> the case if you apply RoPE to the value
              vectors as well as the queries and keys: explain what
              would go wrong in the head&apos;s output.
            </p>
            <p>
              <strong>(c)</strong> A team trains a model with
              learned absolute positional embeddings up to length
              2048 and then deploys it with prompts of length 4096.
              Predict the failure mode in detail. Then propose a
              fix that uses no extra training: shifting the rotation
              base, &ldquo;position interpolation&rdquo;
              (Chen et al. 2023), or YaRN (Peng et al. 2023). Pick
              one and explain why it works specifically for RoPE
              models.
            </p>
          </>
        }
        hint={
          <>
            For (a): apply the permutation, follow it through softmax
            on rows. For (b): R is a rotation, so the inner product
            is preserved when you apply the inverse rotation to one
            side. For (c): the model has never seen positions in
            [2048, 4096], so any learned positional embedding there
            is just whatever was there at init.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`\mathrm{Attn}(PX) = \mathrm{softmax}((PX)(PX)^{\top}/\sqrt{d_k})(PX) = P\,\mathrm{softmax}(XX^{\top}/\sqrt{d_k})\,P^{\top}\,P\,X = P\,\mathrm{Attn}(X)`}</M>{" "}
              (using <M>{tex`P^{\top} P = I`}</M> and that softmax
              applied row-by-row commutes with row permutations).
              The causal mask <em>breaks</em> this only because the
              mask depends on the index; it tells the model
              &ldquo;tokens later in the sequence don&apos;t exist
              yet,&rdquo; which is information about <em>order</em>{" "}
              but not about <em>position</em>. A token at position
              42 looks identical to one at position 4 except for who
              came before it; without an explicit position signal
              the model can&apos;t attend &ldquo;3 tokens back&rdquo;
              vs. &ldquo;13 tokens back.&rdquo;
            </p>
            <p>
              <strong>(b)</strong>{" "}
              <M>{tex`(R_{\theta, i} q)^{\top}(R_{\theta, j} k) = q^{\top} R_{\theta, i}^{\top} R_{\theta, j} k = q^{\top} R_{\theta, j-i} k`}</M>.
              Applying RoPE to values would rotate the value
              vector by an angle that depends on the source
              position <M>j</M>: the head&apos;s output at the
              destination would then carry a position-dependent
              orientation that has nothing to do with the
              destination&apos;s own position. Subsequent layers
              would have to undo that rotation, defeating the
              point. RoPE is applied to Q and K only.
            </p>
            <p>
              <strong>(c)</strong> The model has never seen
              positional embeddings for positions{" "}
              <M>{tex`> 2048`}</M>, so those rows of <M>P</M>{" "}
              contain whatever the optimizer left at initialization
              — random vectors. Tokens at positions 2049+ get
              random position information added to them, which the
              model cannot interpret; loss spikes and the output
              degenerates. A no-extra-training fix specific to
              RoPE: <em>position interpolation</em>. If the model
              was trained with rotation angles{" "}
              <M>{tex`i \theta_k`}</M> over <M>{tex`i \in [0, 2048]`}</M>,
              evaluate it with{" "}
              <M>{tex`(i \cdot 2048 / L) \theta_k`}</M> for{" "}
              <M>{tex`i \in [0, L]`}</M>. The rotation angles stay
              in the trained range; the model effectively sees a
              &ldquo;slowed-down&rdquo; sequence and recovers most
              of its accuracy on lengths up to <M>{tex`8L`}</M> with
              very modest fine-tuning. YaRN refines this by
              applying different scaling factors to different
              frequency bands. Both rely on the fact that RoPE&apos;s
              positional structure is geometric and can be
              re-parametrized after training.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
