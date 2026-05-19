import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { EmbeddingLookup } from "@/components/viz/EmbeddingLookup";

export const metadata = {
  title: "Embeddings & one-hot vectors",
};

export default function EmbeddingsPage() {
  return (
    <ChapterShell
      moduleSlug="neural-networks"
      chapterSlug="embeddings"
      eyebrow="Chapter 04"
      title="Embeddings & one-hot vectors"
      lede="A network can&apos;t do arithmetic on the word &ldquo;cat.&rdquo; It can do arithmetic on a vector. The bridge between &mdash; one-hot vectors and the embedding matrix that consumes them &mdash; is one line of code and the whole reason language models are possible."
    >
      <h2>The problem: discrete in, continuous network</h2>
      <p>
        A vocabulary is a finite set: <M>V</M> tokens, each with an
        integer index <M>{tex`0, 1, \ldots, |V|-1`}</M>. A neural
        network is a stack of dot products and nonlinearities &mdash;
        operations on real vectors. We need to convert &ldquo;token
        index <M>i</M>&rdquo; into a vector the network can multiply
        with a matrix.
      </p>

      <h2>The one-hot detour</h2>
      <p>
        The simplest possible vector representation of token index{" "}
        <M>i</M> is the <strong>one-hot vector</strong>{" "}
        <M>{tex`\mathbf{e}_i \in \{0, 1\}^{|V|}`}</M>: all zeros
        except for a single <M>1</M> in position <M>i</M>:
      </p>
      <Block>{tex`\mathbf{e}_i = (0, \ldots, 0, \underbrace{1}_{\text{position }i}, 0, \ldots, 0)^{\top}.`}</Block>
      <p>
        These vectors are mutually orthogonal and unit length, so
        they form an orthonormal basis of <M>{tex`\mathbb{R}^{|V|}`}</M>.
        That sounds neat &mdash; but it&apos;s a wildly inefficient
        representation. A vocab of 50,000 tokens would require a
        50,000-dimensional input layer, with all but one entry zero
        on every forward pass.
      </p>

      <h2>The embedding matrix</h2>
      <p>
        The fix is to apply a single learned linear layer to the
        one-hot vector. Call its weights{" "}
        <M>{tex`W_E \in \mathbb{R}^{|V| \times d}`}</M>:
      </p>
      <Block>{tex`\mathrm{embed}(i) = \mathbf{e}_i^{\top} W_E = W_E[i, :].`}</Block>
      <p>
        The right-hand side is just &ldquo;the <M>i</M>-th row of{" "}
        <M>{tex`W_E`}</M>.&rdquo; Multiplying a one-hot by a matrix
        is a row lookup &mdash; no actual arithmetic happens, you
        just go fetch a row. In code:{" "}
        <code>W_E[token_index]</code>.
      </p>

      <Figure caption="Click any token. The one-hot vector (left) picks out one row of W_E (centre); that row is the embedding vector (right). The whole 'matmul' is a single memory access.">
        <EmbeddingLookup />
      </Figure>

      <h2>The dimensions, by the numbers</h2>
      <ul>
        <li>
          <strong>Vocabulary size <M>{tex`|V|`}</M>.</strong> Number
          of distinct tokens. GPT-2: 50,257. LLaMA-3: 128,000.
        </li>
        <li>
          <strong>Embedding dimension <M>{tex`d`}</M>.</strong> The
          width of the network&apos;s residual stream. GPT-2 small:
          768. GPT-3 175B: 12,288.
        </li>
        <li>
          <strong>Embedding matrix <M>{tex`W_E`}</M>.</strong> Has{" "}
          <M>{tex`|V| \times d`}</M> learnable parameters. For
          GPT-2 small that&apos;s ~38M &mdash; about a third of the
          model&apos;s total parameter count.
        </li>
      </ul>

      <h2>Why we never actually build the one-hot</h2>
      <p>
        In every real implementation the embedding lookup is just{" "}
        <code>W_E[token_indices]</code>. The one-hot vector is a
        useful piece of <em>conceptual</em> machinery: it tells you
        what the lookup <em>is</em> mathematically, which is a
        special case of a matrix multiplication. That mathematical
        framing is what lets us compose embeddings with the rest of
        the network in a single linear-algebra picture, and it&apos;s
        what lets us interpret the embedding as a <em>direction</em>{" "}
        in <M>{tex`\mathbb{R}^{d}`}</M> rather than a magic table
        lookup.
      </p>

      <h2>The unembedding, looking the other way</h2>
      <p>
        At the end of a transformer, the residual stream{" "}
        <M>{tex`\mathbf{x} \in \mathbb{R}^{d}`}</M> is mapped back to
        a vector of logits over the vocabulary by the{" "}
        <strong>unembedding</strong> matrix{" "}
        <M>{tex`W_U \in \mathbb{R}^{d \times |V|}`}</M>:
      </p>
      <Block>{tex`\mathbf{z} = W_U^{\top} \mathbf{x}, \qquad p_i = \mathrm{softmax}(\mathbf{z})_i.`}</Block>
      <p>
        The <M>i</M>-th column of <M>{tex`W_U`}</M> is the &ldquo;readout
        direction&rdquo; for token <M>i</M>: the residual stream wants
        to look like that column for the model to predict token{" "}
        <M>i</M>. In many models{" "}
        <M>{tex`W_U = W_E^{\top}`}</M> (weight tying); in others
        they&apos;re trained independently.
      </p>

      <Callout variant="intuition">
        Embedding turns &ldquo;token index <M>i</M>&rdquo; into{" "}
        &ldquo;a row of <M>{tex`W_E`}</M>.&rdquo; Unembedding turns
        &ldquo;a residual stream vector&rdquo; back into &ldquo;a
        score per token.&rdquo; Everything in between is the network
        doing arithmetic on these vectors. The whole question of
        what a transformer represents is the question of what
        directions in <M>{tex`\mathbb{R}^{d}`}</M> mean.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Embeddings are interpretability gold:
        </p>
        <ul>
          <li>
            <strong>Cosine similarity in embedding space</strong> finds
            tokens that the model treats as semantically related &mdash;
            the famous &ldquo;king &minus; man + woman &approx;
            queen&rdquo; demonstration is computed in word-embedding
            space.
          </li>
          <li>
            <strong>Logit lens</strong> projects intermediate residual
            streams back through{" "}
            <M>{tex`W_U`}</M> to get a token distribution at <em>any</em>{" "}
            layer &mdash; you read what the model is &ldquo;already
            considering.&rdquo;
          </li>
          <li>
            <strong>Embedding probes</strong> use{" "}
            <M>{tex`W_E`}</M> rows as fixed feature directions to test
            whether internal activations encode known token-level
            properties (part of speech, sentiment, etc.).
          </li>
          <li>
            <strong>Tokenizer choices matter.</strong> A model that
            splits &ldquo;chocolate&rdquo; into{" "}
            <code>[choc, olate]</code> embeds two vectors; one that
            keeps it as a single token embeds one. Mech-interp
            comparisons across models that don&apos;t share a
            tokenizer are subtle for exactly this reason.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            What is{" "}
            <M>{tex`\mathbf{e}_i^{\top} W_E`}</M> (with{" "}
            <M>{tex`\mathbf{e}_i`}</M> a one-hot for index{" "}
            <M>i</M>)?
          </>
        }
        choices={[
          {
            id: "a",
            label: "A scalar — the i-th diagonal entry of W_E.",
            explain:
              "Wrong shape. e_i^T W_E is a vector, and W_E need not even be square.",
          },
          {
            id: "b",
            label: "The i-th column of W_E.",
            explain:
              "Close, but it's the i-th row that gets selected. e_i^T pulls out a row; W_E e_i would pull out a column from W_E^T.",
          },
          {
            id: "c",
            label: "The i-th row of W_E.",
            correct: true,
            explain:
              "Multiplying e_i^T on the left selects exactly the i-th row of the matrix on the right. That row is the embedding vector for token i.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Let{" "}
              <M>{tex`W_E \in \mathbb{R}^{|V| \times d}`}</M> be a
              learned token embedding and{" "}
              <M>{tex`W_U \in \mathbb{R}^{d \times |V|}`}</M> the
              corresponding unembedding (treat them as independent for
              now). For tokens <M>i</M> and <M>j</M> denote{" "}
              <M>{tex`\mathbf{u}_i = W_E[i,:]^{\top}`}</M> and{" "}
              <M>{tex`\mathbf{v}_j = W_U[:,j]`}</M>.
            </p>
            <p>
              <strong>(a)</strong> The <em>logit-lens score</em> for
              predicting token <M>j</M> from a residual stream{" "}
              <M>{tex`\mathbf{x}`}</M> is{" "}
              <M>{tex`z_j = \mathbf{v}_j \cdot \mathbf{x}`}</M>. If the
              residual stream is exactly the embedding of token <M>i</M>{" "}
              (no other layers have run, so{" "}
              <M>{tex`\mathbf{x} = \mathbf{u}_i`}</M>), show that the
              softmax distribution at the output is determined entirely
              by the matrix{" "}
              <M>{tex`B = W_E W_U \in \mathbb{R}^{|V| \times |V|}`}</M>.
              What is the entry <M>{tex`B_{ij}`}</M> in words?
            </p>
            <p>
              <strong>(b)</strong> Suppose we tie weights:{" "}
              <M>{tex`W_U = W_E^{\top}`}</M>. Show that <M>B</M>{" "}
              becomes a Gram matrix and is symmetric and positive
              semidefinite. What does its rank tell you about the
              maximum number of <em>independent</em> &ldquo;feature
              directions&rdquo; the network can read out at the
              output? Tie this back to{" "}
              <M>{tex`d \ll |V|`}</M> in real models.
            </p>
            <p>
              <strong>(c)</strong> A common interpretability claim is
              that &ldquo;the embedding{" "}
              <M>{tex`\mathbf{u}_{\text{queen}} - \mathbf{u}_{\text{king}}`}</M>{" "}
              encodes the gender direction.&rdquo; Translate this into
              a precise statement about the matrix <M>B</M>: which
              other token pairs <M>{tex`(p, q)`}</M> should obey{" "}
              <M>{tex`\mathbf{u}_p - \mathbf{u}_q \approx \mathbf{u}_{\text{queen}} - \mathbf{u}_{\text{king}}`}</M>?
              What practical experiment would falsify the claim?
            </p>
          </>
        }
        hint={
          <>
            For (a): expand{" "}
            <M>{tex`z_j = (W_U)_{:,j}^{\top}\, W_E[i,:]^{\top}`}</M>.
            For (b): a Gram matrix has the form <M>{tex`A^{\top} A`}</M>;
            its rank equals the rank of <M>A</M>. For (c): &ldquo;same
            direction&rdquo; means parallel difference vectors, which
            you can test with cosine similarity.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`z_j = \mathbf{v}_j \cdot \mathbf{u}_i = (W_U)_{:,j}^{\top} W_E[i,:]^{\top} = (W_E W_U)_{ij} = B_{ij}`}</M>.
              The softmax of the row{" "}
              <M>{tex`B_{i,:}`}</M> is the model&apos;s next-token
              distribution after embedding token <M>i</M> alone. So{" "}
              <M>{tex`B_{ij}`}</M> is &ldquo;how much the embedding of
              token <M>i</M> wants to predict token <M>j</M> with no
              context.&rdquo; In a freshly initialized network these
              are nearly uniform; in a trained one they encode
              token-level co-occurrence statistics &mdash; which is
              why the 0-layer logit lens already does better than
              chance.
            </p>
            <p>
              <strong>(b)</strong> With{" "}
              <M>{tex`W_U = W_E^{\top}`}</M>,{" "}
              <M>{tex`B = W_E W_E^{\top}`}</M>, a Gram matrix.
              Symmetric (<M>{tex`B^{\top} = (W_E W_E^{\top})^{\top} = B`}</M>)
              and positive semidefinite. Its rank equals{" "}
              <M>{tex`\operatorname{rank}(W_E) \le \min(|V|, d) = d`}</M>{" "}
              (since <M>{tex`d \ll |V|`}</M>). The output layer can
              therefore read out at most <M>d</M> linearly independent
              token directions &mdash; <em>far</em> fewer than the{" "}
              <M>{tex`|V|`}</M> tokens it&apos;s trying to
              distinguish. Hence the residual stream must pack many
              tokens into the same <M>d</M>-dimensional space &mdash;
              the formal source of the famous{" "}
              <em>superposition</em> phenomenon.
            </p>
            <p>
              <strong>(c)</strong> If &ldquo;gender&rdquo; is a single
              direction <M>{tex`\mathbf{g} \in \mathbb{R}^{d}`}</M>{" "}
              and queen/king is &ldquo;woman/man&rdquo; minus the
              same royal stem, we expect{" "}
              <M>{tex`\mathbf{u}_{\text{queen}} - \mathbf{u}_{\text{king}} \approx \mathbf{g}`}</M>{" "}
              and similarly{" "}
              <M>{tex`\mathbf{u}_{\text{aunt}} - \mathbf{u}_{\text{uncle}} \approx \mathbf{g}`}</M>,{" "}
              <M>{tex`\mathbf{u}_{\text{actress}} - \mathbf{u}_{\text{actor}} \approx \mathbf{g}`}</M>,
              etc. Concretely: pick many gendered pairs, compute
              difference vectors, and check that their pairwise cosine
              similarities are high. If the cosines are tightly
              clustered around a single axis, the &ldquo;direction
              hypothesis&rdquo; survives. If they spray across the
              sphere, then &ldquo;gender&rdquo; is not a single
              embedding direction &mdash; it&apos;s either entangled
              with other features (Bolukbasi et al., Vargas &amp;
              Cotterell, etc.) or only emerges in higher layers, not
              in <M>{tex`W_E`}</M> itself. The same recipe falsifies
              countless &ldquo;the model encodes <M>X</M> linearly&rdquo;
              claims in the literature.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
