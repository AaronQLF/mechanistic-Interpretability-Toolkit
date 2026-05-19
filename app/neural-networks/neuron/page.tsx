import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { BackpropToy } from "@/components/viz/BackpropToy";

export const metadata = {
  title: "The neuron",
};

export default function NeuronPage() {
  return (
    <ChapterShell
      moduleSlug="neural-networks"
      chapterSlug="neuron"
      eyebrow="Chapter 01"
      title="The neuron"
      lede="A neuron is a dot product, a number added to it, and a single squashing function. Three pieces, three names — weights, bias, activation. Every &ldquo;neural network&rdquo; in this module is a stack of these, and nothing more."
    >
      <h2>The definition</h2>
      <p>
        Pick an input vector{" "}
        <M>{tex`\mathbf{x} \in \mathbb{R}^{d}`}</M>. A{" "}
        <strong>neuron</strong> with weights{" "}
        <M>{tex`\mathbf{w} \in \mathbb{R}^{d}`}</M>, bias{" "}
        <M>{tex`b \in \mathbb{R}`}</M>, and activation function{" "}
        <M>{tex`\sigma : \mathbb{R} \to \mathbb{R}`}</M> outputs the
        scalar
      </p>
      <Block>{tex`y = \sigma(\mathbf{w} \cdot \mathbf{x} + b).`}</Block>
      <p>
        That is the entire definition. Three named pieces:
      </p>
      <ul>
        <li>
          <strong>Weights</strong> <M>{tex`\mathbf{w}`}</M>: how much
          each input coordinate counts. Same shape as the input.
        </li>
        <li>
          <strong>Bias</strong> <M>b</M>: a single number that shifts
          the score before the activation. Lets the neuron fire even
          when the input is all zeros.
        </li>
        <li>
          <strong>Activation</strong> <M>{tex`\sigma`}</M>: a fixed
          nonlinearity (sigmoid, ReLU, GELU…). Without it, a stack of
          neurons collapses to a single linear map. We&apos;ll
          dedicate a whole chapter to this in two pages.
        </li>
      </ul>

      <h2>It&apos;s a dot product, then a squash</h2>
      <p>
        The dot product <M>{tex`\mathbf{w} \cdot \mathbf{x}`}</M>{" "}
        already showed up in linear algebra: it&apos;s &ldquo;how
        aligned is <M>{tex`\mathbf{x}`}</M> with{" "}
        <M>{tex`\mathbf{w}`}</M>?&rdquo; Bigger when they point the
        same way, negative when they oppose, zero when perpendicular.
      </p>
      <p>
        So a neuron&apos;s job is to test the input against a stored
        direction <M>{tex`\mathbf{w}`}</M>, shift the score by{" "}
        <M>b</M>, and squash the result into a sensible range with{" "}
        <M>{tex`\sigma`}</M>. The vector{" "}
        <M>{tex`\mathbf{w}`}</M> is sometimes called the neuron&apos;s{" "}
        <em>feature</em> or <em>template</em>. The bias decides the
        threshold at which it &ldquo;fires.&rdquo;
      </p>

      <h2>The decision boundary</h2>
      <p>
        Set the squash aside for a moment. The pre-activation{" "}
        <M>{tex`z = \mathbf{w} \cdot \mathbf{x} + b`}</M> is positive
        on one side of a hyperplane and negative on the other:
      </p>
      <Block>{tex`\{\mathbf{x} \in \mathbb{R}^d : \mathbf{w} \cdot \mathbf{x} + b = 0\}.`}</Block>
      <p>
        That hyperplane is the neuron&apos;s <strong>decision
        boundary</strong>. <M>{tex`\mathbf{w}`}</M> is the normal to
        it; <M>{tex`-b/\|\mathbf{w}\|`}</M> is its distance from the
        origin. A neuron with sigmoid <M>{tex`\sigma`}</M> reports
        &ldquo;how confidently is <M>{tex`\mathbf{x}`}</M> on the
        positive side&rdquo; — between 0 and 1.
      </p>

      <Figure caption="A single neuron with weight a, bias b, sigmoid activation, and a squared-error loss against target t. Drag the sliders to feel how the dot product (a · x) and bias combine before σ squashes them.">
        <BackpropToy />
      </Figure>

      <h2>From one neuron to a layer</h2>
      <p>
        A <strong>layer</strong> is just <M>m</M> neurons fed the same
        input. Stack their weight vectors as the rows of a matrix{" "}
        <M>{tex`W \in \mathbb{R}^{m \times d}`}</M>, stack their
        biases into a vector <M>{tex`\mathbf{b} \in \mathbb{R}^{m}`}</M>,
        and the layer&apos;s output is
      </p>
      <Block>{tex`\mathbf{y} = \sigma(W\mathbf{x} + \mathbf{b}),`}</Block>
      <p>
        with <M>{tex`\sigma`}</M> applied <em>elementwise</em>. The
        next chapter is about that single-line equation. Once you see
        a layer as one matrix multiplication and one bias add, the
        whole rest of deep learning is a question of which matrices
        you stack, in what order, with what nonlinearities between.
      </p>

      <Callout variant="intuition">
        A neuron asks <em>one</em> yes/no question of the input —
        &ldquo;does <M>{tex`\mathbf{x}`}</M> look like my{" "}
        <M>{tex`\mathbf{w}`}</M>, after the bias?&rdquo; Squash the
        answer with <M>{tex`\sigma`}</M>. That&apos;s it. A network is
        a giant committee of yes/no questioners whose questions feed
        each other.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The vector <M>{tex`\mathbf{w}`}</M> is the
          interpretability target. When you read papers about
          &ldquo;feature directions in the residual stream&rdquo; or
          &ldquo;a neuron that detects line-ends,&rdquo; the object
          they&apos;re studying is a single <M>{tex`\mathbf{w}`}</M>{" "}
          and what it lights up on.
        </p>
        <p>
          Two practical handles you&apos;ll use later in mech interp:
        </p>
        <ul>
          <li>
            <strong>Maximum-activating examples.</strong> The inputs
            that send <M>{tex`\sigma(\mathbf{w} \cdot \mathbf{x} + b)`}</M>{" "}
            highest tell you what the neuron likes.
          </li>
          <li>
            <strong>Cosine with the unembedding.</strong>{" "}
            <M>{tex`\cos(\mathbf{w}, W_U[i])`}</M> tells you whether
            this neuron is voting for token <M>i</M>.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            For a neuron with weights{" "}
            <M>{tex`\mathbf{w} = (1, -1)`}</M> and bias{" "}
            <M>{tex`b = 0`}</M>, on which set of inputs{" "}
            <M>{tex`\mathbf{x} = (x_1, x_2)`}</M> is the
            pre-activation <em>exactly</em> zero?
          </>
        }
        choices={[
          {
            id: "a",
            label: "x₁ = 0 (the y-axis).",
            explain:
              "The pre-activation is 1·x₁ − 1·x₂. That is zero on x₁ = x₂, not x₁ = 0.",
          },
          {
            id: "b",
            label: "x₁ = x₂ (the diagonal).",
            correct: true,
            explain:
              "1·x₁ − 1·x₂ = 0 ↔ x₁ = x₂. The decision boundary is the line where w·x + b vanishes.",
          },
          {
            id: "c",
            label: "x₁ + x₂ = 0 (the anti-diagonal).",
            explain:
              "That would be the boundary for w = (1, 1), not (1, −1). Sign of each coordinate matters.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Consider a single sigmoid neuron with weights{" "}
              <M>{tex`\mathbf{w} \in \mathbb{R}^{d}`}</M>, bias{" "}
              <M>b</M>, and output{" "}
              <M>{tex`y = \sigma(\mathbf{w}\cdot\mathbf{x} + b)`}</M>.
            </p>
            <p>
              <strong>(a)</strong> Show that the decision boundary{" "}
              <M>{tex`y = 1/2`}</M> is the affine hyperplane{" "}
              <M>{tex`\mathbf{w}\cdot\mathbf{x} + b = 0`}</M>, and
              that the (signed) Euclidean distance from a point{" "}
              <M>{tex`\mathbf{x}_0`}</M> to that hyperplane is{" "}
              <M>{tex`(\mathbf{w}\cdot\mathbf{x}_0 + b)/\|\mathbf{w}\|`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Two networks share the same weights{" "}
              <M>{tex`\mathbf{w}`}</M> and bias <M>b</M> but differ in
              activation: one uses the sigmoid{" "}
              <M>{tex`\sigma(z) = 1/(1+e^{-z})`}</M>, the other uses{" "}
              <M>{tex`\tilde\sigma(z) = \sigma(c\,z)`}</M> for some
              fixed <M>{tex`c > 0`}</M>. Explain why they have the{" "}
              <em>same</em> decision boundary at output{" "}
              <M>{tex`1/2`}</M> but assign systematically different
              probabilities elsewhere. What single transformation of{" "}
              <M>{tex`(\mathbf{w}, b)`}</M> would make the two
              networks output identical probabilities for every input?
            </p>
            <p>
              <strong>(c)</strong> A neuron with ReLU activation,{" "}
              <M>{tex`y = \max(0,\, \mathbf{w}\cdot\mathbf{x} + b)`}</M>,
              has a decision boundary in a stronger sense: it is{" "}
              <em>exactly silent</em> on a half-space. Identify that
              half-space and prove that two ReLU neurons with weights{" "}
              <M>{tex`\mathbf{w}_1, \mathbf{w}_2`}</M> are
              indistinguishable from each other (same output on every
              input) iff <M>{tex`\mathbf{w}_1 = \mathbf{w}_2`}</M> and{" "}
              <M>{tex`b_1 = b_2`}</M> — there is{" "}
              <em>no</em> non-trivial scaling symmetry like in (b).
              Why does this matter for interpretability?
            </p>
          </>
        }
        hint={
          <>
            For (a): solve <M>{tex`\sigma(z) = 1/2`}</M>; for the
            distance formula, drop a perpendicular from{" "}
            <M>{tex`\mathbf{x}_0`}</M> onto the hyperplane and use
            that <M>{tex`\mathbf{w}/\|\mathbf{w}\|`}</M> is the unit
            normal. For (b): write{" "}
            <M>{tex`\tilde\sigma(c\,z) = \sigma((cw)\cdot x + cb)`}</M>.
            For (c): consider the half-space where{" "}
            <M>{tex`\mathbf{w}\cdot\mathbf{x} + b < 0`}</M>; on it the
            neuron is identically zero, so the network sees no
            difference between any two such weights — except on the{" "}
            <em>complementary</em> half-space.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> <M>{tex`\sigma(z) = 1/2`}</M> iff{" "}
              <M>{tex`z = 0`}</M>, so the decision boundary is{" "}
              <M>{tex`\mathbf{w}\cdot\mathbf{x} + b = 0`}</M> — an
              affine hyperplane with normal{" "}
              <M>{tex`\mathbf{w}`}</M>. For any{" "}
              <M>{tex`\mathbf{x}_0`}</M>, the orthogonal projection
              onto the hyperplane subtracts{" "}
              <M>{tex`(\mathbf{w}\cdot\mathbf{x}_0 + b)/\|\mathbf{w}\|^2`}</M>{" "}
              copies of <M>{tex`\mathbf{w}`}</M>; the signed distance
              is <M>{tex`(\mathbf{w}\cdot\mathbf{x}_0 + b)/\|\mathbf{w}\|`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Both <M>{tex`\sigma(z)`}</M> and{" "}
              <M>{tex`\sigma(cz)`}</M> equal <M>{tex`1/2`}</M> exactly
              when <M>{tex`z = 0`}</M>, so the decision boundary is
              identical. But the slope at the boundary is{" "}
              <M>{tex`1/4`}</M> for the first and{" "}
              <M>{tex`c/4`}</M> for the second, so the two networks
              assign different probabilities away from the boundary —{" "}
              <M>{tex`\tilde\sigma`}</M> is more confident when{" "}
              <M>{tex`c > 1`}</M>, less so when <M>{tex`c < 1`}</M>.
              The fix:{" "}
              <M>{tex`\tilde\sigma(\mathbf{w}\cdot\mathbf{x} + b) = \sigma(c\mathbf{w}\cdot\mathbf{x} + cb)`}</M>,
              so reparametrize the first network as{" "}
              <M>{tex`(\mathbf{w}', b') = (c\mathbf{w}, c\,b)`}</M>{" "}
              and you get identical outputs everywhere. This is the
              well-known &ldquo;temperature&rdquo; (or scale)
              symmetry of sigmoid neurons — it&apos;s exact, and it
              means you cannot read{" "}
              <M>{tex`\|\mathbf{w}\|`}</M> as a meaningful
              &ldquo;importance&rdquo; without fixing <M>c</M>.
            </p>
            <p>
              <strong>(c)</strong> The half-space{" "}
              <M>{tex`\{\mathbf{x} : \mathbf{w}\cdot\mathbf{x} + b \le 0\}`}</M>{" "}
              is the silent half: ReLU outputs <M>0</M> on all of it.
              On the active half-space, the neuron is the affine map{" "}
              <M>{tex`\mathbf{w}\cdot\mathbf{x} + b`}</M>. Two ReLU
              neurons agree everywhere iff they agree on both halves;
              on the active half they are linear functions, and two
              affine functions agree everywhere iff their linear part
              and bias coincide. So <M>{tex`\mathbf{w}_1 = \mathbf{w}_2`}</M>{" "}
              and <M>{tex`b_1 = b_2`}</M>. The mech-interp consequence:{" "}
              <em>norms of ReLU weights are meaningful</em>. There is
              no hidden gauge to fix; if a neuron has a large
              <M>{tex`\|\mathbf{w}\|`}</M>, that&apos;s a real
              statement about its sensitivity. (Compare softmax
              attention&apos;s well-known temperature symmetry, where
              <M>{tex`(\mathbf{q}, \mathbf{k}) \mapsto (c\mathbf{q}, \mathbf{k}/c)`}</M>{" "}
              leaves outputs unchanged — interpretation requires a
              fixed scale.)
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
