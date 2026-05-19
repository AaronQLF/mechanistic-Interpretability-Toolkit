import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { MatrixTransform2D } from "@/components/viz/MatrixTransform2D";

export const metadata = {
  title: "Linear layers",
};

export default function LinearLayerPage() {
  return (
    <ChapterShell
      moduleSlug="neural-networks"
      chapterSlug="linear-layer"
      eyebrow="Chapter 02"
      title="Linear layers"
      lede="Take the row-of-neurons picture from last chapter and write it as one matrix multiplication. That is a linear layer. The matrix is what the layer learns; the bias shifts the result; nothing else is happening."
    >
      <h2>The definition</h2>
      <p>
        A <strong>linear layer</strong> with weight matrix{" "}
        <M>{tex`W \in \mathbb{R}^{m \times d}`}</M> and bias{" "}
        <M>{tex`\mathbf{b} \in \mathbb{R}^{m}`}</M> is the affine map
      </p>
      <Block>{tex`f(\mathbf{x}) = W\mathbf{x} + \mathbf{b}, \qquad \mathbf{x} \in \mathbb{R}^{d},\ f(\mathbf{x}) \in \mathbb{R}^{m}.`}</Block>
      <p>
        That&apos;s every &ldquo;Linear&rdquo; layer in PyTorch, every
        &ldquo;Dense&rdquo; layer in Keras, every fully-connected
        layer ever shipped. The matrix has{" "}
        <M>{tex`m \times d`}</M> learnable scalars; the bias adds{" "}
        <M>m</M> more. Together that&apos;s the layer&apos;s
        parameter count.
      </p>

      <h2>Two ways to read the same equation</h2>
      <p>
        The equation <M>{tex`\mathbf{y} = W\mathbf{x} + \mathbf{b}`}</M>{" "}
        admits two equally useful readings, and you should be able to
        switch between them at will.
      </p>
      <ol>
        <li>
          <strong>Row view (a stack of neurons).</strong> The{" "}
          <M>i</M>-th output is{" "}
          <M>{tex`y_i = W_{i,:} \cdot \mathbf{x} + b_i`}</M> — the
          dot product of the <M>i</M>-th row of <M>W</M> with the
          input. Each row is one neuron&apos;s weight vector. The
          layer is <M>m</M> neurons running in parallel.
        </li>
        <li>
          <strong>Column view (a sum of feature contributions).</strong>{" "}
          Equivalently,{" "}
          <M>{tex`W\mathbf{x} = \sum_{j=1}^{d} x_j\, W_{:,j}`}</M> —
          a linear combination of the columns of <M>W</M>, weighted
          by the entries of <M>{tex`\mathbf{x}`}</M>. The output
          lives in the column space of <M>W</M>.
        </li>
      </ol>
      <p>
        Both readings are correct. Mech interp papers move between
        them constantly: row view when you ask &ldquo;what does this
        neuron detect?&rdquo;, column view when you ask &ldquo;what
        does this input direction <em>write into</em> the next
        layer?&rdquo;
      </p>

      <h2>The geometry</h2>
      <p>
        Strip the bias for a second. The map{" "}
        <M>{tex`\mathbf{x} \mapsto W\mathbf{x}`}</M> is a linear
        transformation: it rotates, stretches, and possibly squashes
        space. The picture from{" "}
        <em>Matrices as transformations</em> applies verbatim. The
        bias <M>{tex`\mathbf{b}`}</M> then translates the result.
        Together: an <em>affine</em> map.
      </p>

      <Figure caption="A 2 → 2 linear layer (no bias). Drag the entries of M to see how the layer transforms the unit square. det M is the volume scaling; det = 0 means information has been crushed.">
        <MatrixTransform2D />
      </Figure>

      <h2>Bias as broadcasting</h2>
      <p>
        In code, the bias is added <em>after</em> the matmul:
      </p>
      <Block>{tex`\mathbf{y} = W\mathbf{x} + \mathbf{b}.`}</Block>
      <p>
        When you process a whole batch of inputs at once,{" "}
        <M>{tex`X \in \mathbb{R}^{B \times d}`}</M>, the equation
        becomes
      </p>
      <Block>{tex`Y = X W^{\top} + \mathbf{b}^{\top},`}</Block>
      <p>
        where <M>{tex`\mathbf{b}^{\top}`}</M> is added{" "}
        <em>broadcast</em> across every row. Same bias for every input
        in the batch. Same matrix <M>W</M> for every input in the
        batch. The layer doesn&apos;t know &mdash; or care &mdash;
        which row in the batch you fed it.
      </p>

      <h2>Why this is &ldquo;the&rdquo; layer</h2>
      <p>
        Linear layers are everywhere because dot products are the
        cheapest way to compare a vector against a learned template,
        and matrix multiplication is the cheapest way to do{" "}
        <em>many</em> dot products at once on a GPU. Almost every
        non-linear cleverness in modern deep learning is a thin
        wrapper around matrix multiplications:
      </p>
      <ul>
        <li>
          <strong>Convolutions</strong> are linear layers with
          structure (shared, sparse weights).
        </li>
        <li>
          <strong>Attention</strong> is three linear layers (Q, K, V)
          followed by a softmax-weighted average and a fourth linear
          layer (O). Every weight is in a matmul.
        </li>
        <li>
          <strong>The MLP block</strong> in a transformer is two
          linear layers with a single nonlinearity sandwiched between.
          That&apos;s chapter five.
        </li>
      </ul>

      <Callout variant="intuition">
        A linear layer is a question-asker:{" "}
        <em>m parallel dot-product comparisons</em>, each between the
        input and a stored direction. The matrix is the list of
        directions; the bias is the threshold for each. Stack two
        such layers with a nonlinearity between them and you get the
        MLP. Everything else is plumbing.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The two views in this chapter are the load-bearing
          half of <em>A Mathematical Framework for Transformer
          Circuits</em>:
        </p>
        <ul>
          <li>
            <strong>Reading directions.</strong> The rows of a layer&apos;s
            <M>W</M> tell you what features it{" "}
            <em>reads</em> from its input. They live in the input
            space.
          </li>
          <li>
            <strong>Writing directions.</strong> The columns of the
            <em>next</em> layer&apos;s <M>W</M> tell you what features
            it <em>writes</em> into the residual stream when it fires.
            They live in the output space.
          </li>
        </ul>
        <p>
          A &ldquo;circuit&rdquo; is a path: a feature is{" "}
          <em>written</em> by one layer&apos;s columns, then{" "}
          <em>read</em> by a later layer&apos;s rows that have high
          dot product with it. This is the basis for the QK / OV
          decomposition of attention.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            A linear layer with input dim 768 and output dim 3072 has
            how many learnable parameters (weights + bias)?
          </>
        }
        choices={[
          {
            id: "a",
            label: "3,072 (just the bias).",
            explain:
              "That counts only the bias. The matrix W has 768 × 3072 entries on top of that.",
          },
          {
            id: "b",
            label: "768 × 3072 = 2,359,296.",
            explain:
              "Almost — that&apos;s W alone. Each output coordinate also has a bias.",
          },
          {
            id: "c",
            label: "768 × 3072 + 3072 = 2,362,368.",
            correct: true,
            explain:
              "W is m × d = 3072 × 768 = 2,359,296 entries; the bias adds m = 3072 more. Total 2,362,368.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Suppose <M>{tex`f_1(\mathbf{x}) = W_1 \mathbf{x} + \mathbf{b}_1`}</M>{" "}
              and <M>{tex`f_2(\mathbf{y}) = W_2 \mathbf{y} + \mathbf{b}_2`}</M>{" "}
              are two consecutive linear layers, with no nonlinearity
              between them.
            </p>
            <p>
              <strong>(a)</strong> Show that{" "}
              <M>{tex`(f_2 \circ f_1)(\mathbf{x}) = W \mathbf{x} + \mathbf{b}`}</M>{" "}
              for some single matrix <M>W</M> and vector{" "}
              <M>{tex`\mathbf{b}`}</M> you should write down. Conclude
              that two stacked linear layers <em>are</em> a single
              linear layer — and so a network with no nonlinearity is
              a single matmul, no matter how deep.
            </p>
            <p>
              <strong>(b)</strong> Suppose{" "}
              <M>{tex`W_1 \in \mathbb{R}^{r \times d}`}</M> and{" "}
              <M>{tex`W_2 \in \mathbb{R}^{m \times r}`}</M> with{" "}
              <M>{tex`r \ll \min(d, m)`}</M>. Bound{" "}
              <M>{tex`\operatorname{rank}(W_2 W_1)`}</M> and explain
              why this exact factorization (a low-rank{" "}
              <em>bottleneck</em>) is how LoRA, attention&apos;s OV
              circuit <M>{tex`W_O W_V`}</M>, and most adapter
              fine-tuning schemes work. What property of{" "}
              <M>{tex`W_2 W_1`}</M> are they all exploiting?
            </p>
            <p>
              <strong>(c)</strong> Now restore a nonlinearity{" "}
              <M>{tex`\sigma`}</M> between the two layers, so the
              composition is{" "}
              <M>{tex`f_2(\sigma(f_1(\mathbf{x})))`}</M>. Argue
              informally why <em>no</em> single linear layer can
              reproduce this map for a generic <M>{tex`\sigma`}</M>{" "}
              — and pinpoint exactly which step of part (a) breaks.
            </p>
          </>
        }
        hint={
          <>
            For (a): expand{" "}
            <M>{tex`W_2(W_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2`}</M>.
            For (b): the rank of a product is at most the rank of
            either factor. For (c): in (a) you used linearity to push{" "}
            <M>{tex`W_2`}</M> through the parentheses; with a
            nonlinearity you can&apos;t do that.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`f_2(f_1(\mathbf{x})) = W_2(W_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2 = (W_2 W_1)\mathbf{x} + (W_2 \mathbf{b}_1 + \mathbf{b}_2)`}</M>.
              So <M>{tex`W = W_2 W_1`}</M> and{" "}
              <M>{tex`\mathbf{b} = W_2 \mathbf{b}_1 + \mathbf{b}_2`}</M>.
              By induction, any depth-<M>L</M> network of pure linear
              layers collapses to a single one. This is{" "}
              <em>why</em> nonlinearities are non-negotiable: without
              one, depth buys you nothing.
            </p>
            <p>
              <strong>(b)</strong>{" "}
              <M>{tex`\operatorname{rank}(W_2 W_1) \le \min(\operatorname{rank}(W_2), \operatorname{rank}(W_1)) \le r`}</M>.
              So the composed map is at most rank <M>r</M> — a
              low-rank <M>{tex`m \times d`}</M> matrix factored
              through an <M>r</M>-dimensional bottleneck.
              LoRA writes <M>{tex`\Delta W = BA`}</M> with rank-<M>r</M>{" "}
              factors and trains those instead of the full{" "}
              <M>{tex`m \times d = md`}</M> matrix — paying{" "}
              <M>{tex`r(m + d)`}</M> parameters. Attention&apos;s
              OV circuit factors as{" "}
              <M>{tex`W_O W_V`}</M> with{" "}
              <M>{tex`W_V \in \mathbb{R}^{d_{\text{head}} \times d}`}</M>{" "}
              and a tiny <M>{tex`d_{\text{head}}`}</M>; the head can
              only express rank-<M>{tex`d_{\text{head}}`}</M>{" "}
              read/write maps. They&apos;re all exploiting the same
              fact: <em>a product of two thin rectangles is a low-rank
              matrix</em>, and most useful linear maps inside neural
              networks turn out to be empirically low-rank, so the
              bottleneck loses very little.
            </p>
            <p>
              <strong>(c)</strong> The key step of (a) was
              <Block>{tex`W_2(W_1 \mathbf{x} + \mathbf{b}_1) = W_2 W_1 \mathbf{x} + W_2 \mathbf{b}_1.`}</Block>
              That distributive law is exactly{" "}
              <em>linearity of <M>{tex`W_2`}</M></em>, and it works
              because matrix multiplication distributes over addition.
              Insert a nonlinearity:
              <Block>{tex`W_2 \, \sigma(W_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2.`}</Block>
              Now <M>{tex`\sigma`}</M> is between you and{" "}
              <M>{tex`W_2`}</M>; it does not commute with linear
              operators (precisely because it&apos;s nonlinear), so
              the inner argument cannot be hoisted out. The output
              depends on <M>{tex`\mathbf{x}`}</M> through{" "}
              <M>{tex`\sigma`}</M>&apos;s nonlinear shape — which a
              single affine map cannot reproduce except in the trivial
              case <M>{tex`\sigma(z) = z`}</M>. This single observation
              is why the universal approximation theorem requires{" "}
              <em>some</em> nonlinearity, no matter which one.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
