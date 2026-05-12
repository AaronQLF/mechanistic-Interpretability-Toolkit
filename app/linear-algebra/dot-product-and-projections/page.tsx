import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { DotProductExplorer } from "@/components/viz/DotProductExplorer";
import { ProjectionWidget } from "@/components/viz/ProjectionWidget";

export const metadata = {
  title: "Dot product & projections",
};

export default function DotProductPage() {
  return (
    <ChapterShell
      moduleSlug="linear-algebra"
      chapterSlug="dot-product-and-projections"
      eyebrow="Chapter 08"
      title="Dot product & projections"
      lede="Of all the operations in this module, the dot product is the one mech interp leans on most. It's how we measure similarity between feature vectors, how attention scores are computed, and how a logit is read off a residual stream."
    >
      <h2>Two definitions, one operation</h2>
      <p>
        The <strong>dot product</strong> of two vectors has two equivalent
        formulas. One is computational, one is geometric:
      </p>
      <Block>{tex`\mathbf{v} \cdot \mathbf{w} = v_1 w_1 + v_2 w_2 + \cdots + v_n w_n.`}</Block>
      <Block>{tex`\mathbf{v} \cdot \mathbf{w} = \lVert \mathbf{v} \rVert \, \lVert \mathbf{w} \rVert \cos\theta,`}</Block>
      <p>
        where <M>θ</M> is the angle between them. The fact that these two
        formulas describe the same number is the secret sauce — it lets you
        compute geometry from coordinates and vice versa.
      </p>

      <h2>Sign tells you alignment</h2>
      <ul>
        <li>
          <M>{tex`\mathbf{v} \cdot \mathbf{w} > 0`}</M> — they point in
          roughly the same direction (acute angle).
        </li>
        <li>
          <M>{tex`\mathbf{v} \cdot \mathbf{w} = 0`}</M> — they&apos;re{" "}
          <em>orthogonal</em> (perpendicular).
        </li>
        <li>
          <M>{tex`\mathbf{v} \cdot \mathbf{w} < 0`}</M> — they roughly
          oppose each other (obtuse angle).
        </li>
      </ul>

      <Figure caption="Drag either arrow. Watch how the dot product flips sign as the angle crosses 90°.">
        <DotProductExplorer />
      </Figure>

      <h2>Cosine similarity</h2>
      <p>
        Divide the dot product by the lengths and you remove all magnitude
        information, keeping only the angle:
      </p>
      <Block>{tex`\cos\theta = \frac{\mathbf{v} \cdot \mathbf{w}}{\lVert \mathbf{v} \rVert \, \lVert \mathbf{w} \rVert}.`}</Block>
      <p>
        That ratio is what people usually mean by <em>cosine similarity</em>.
        It ranges from <M>{tex`-1`}</M> (opposite) through <M>0</M>{" "}
        (orthogonal) to <M>1</M> (same direction).
      </p>

      <h2>Projection: the shadow</h2>
      <p>
        The <strong>projection</strong> of <M>{tex`\mathbf{v}`}</M> onto{" "}
        <M>{tex`\mathbf{u}`}</M> is the closest vector to{" "}
        <M>{tex`\mathbf{v}`}</M> that lies along the line through{" "}
        <M>{tex`\mathbf{u}`}</M> — the shadow of <M>{tex`\mathbf{v}`}</M> when
        light shines perpendicular to <M>{tex`\mathbf{u}`}</M>:
      </p>
      <Block>{tex`\text{proj}_{\mathbf{u}}(\mathbf{v}) = \frac{\mathbf{v} \cdot \mathbf{u}}{\mathbf{u} \cdot \mathbf{u}}\, \mathbf{u}.`}</Block>
      <p>
        Note the dot product appearing twice. Projection <em>is</em> a dot
        product, dressed up with a normalization.
      </p>

      <Figure caption="Projection of v onto the line spanned by u. The dashed segment is the residual — perpendicular to u by construction.">
        <ProjectionWidget />
      </Figure>

      <Callout variant="intuition">
        Dot product: how aligned. Projection: how much of one vector lives
        along another&apos;s direction. Together they&apos;re the closest
        thing in linear algebra to a measuring tape.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          <strong>Logit lens.</strong> The unembedding{" "}
          <M>{tex`W_U \in \mathbb{R}^{|V| \times d}`}</M> turns a residual
          stream <M>{tex`\mathbf{x}`}</M> into a logit per token. The logit for
          token <M>k</M> is exactly the dot product of{" "}
          <M>{tex`\mathbf{x}`}</M> with the <M>k</M>-th row of{" "}
          <M>{tex`W_U`}</M>. Each row is the &ldquo;direction in residual
          space&rdquo; that promotes that token.
        </p>
        <p>
          <strong>Attention scores.</strong> Inside an attention head, the
          score between query <M>{tex`\mathbf{q}`}</M> and key{" "}
          <M>{tex`\mathbf{k}`}</M> is <M>{tex`\mathbf{q} \cdot \mathbf{k} / \sqrt{d_k}`}</M>{" "}
          — a scaled dot product. Attention is, fundamentally, similarity by
          dot product.
        </p>
        <p>
          <strong>Probing.</strong> When you want to ask &ldquo;does this
          activation encode whether the sentence is positive?&rdquo; you fit
          a probe vector <M>{tex`\mathbf{p}`}</M> and read off{" "}
          <M>{tex`\mathbf{p} \cdot \mathbf{x}`}</M>. The probe is a
          direction; activation along it is the answer.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            If <M>{tex`\mathbf{v} \cdot \mathbf{w} = 0`}</M> and neither is
            zero, what can you conclude?
          </>
        }
        choices={[
          {
            id: "a",
            label: "They have the same length.",
            explain:
              "Lengths can be anything. Zero dot product is an angle condition, not a magnitude one.",
          },
          {
            id: "b",
            label: "They are perpendicular.",
            correct: true,
            explain:
              "v·w = ‖v‖‖w‖cosθ = 0 with both norms nonzero implies cosθ = 0, i.e. θ = 90°.",
          },
          {
            id: "c",
            label: "They are parallel.",
            explain:
              "Parallel vectors give v·w = ±‖v‖‖w‖ — the maximum magnitude, not zero.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>Gram–Schmidt: turn any basis into an orthonormal
              basis.</strong>
            </p>
            <p>
              Let{" "}
              <M>{tex`\mathbf{a}_{1}, \mathbf{a}_{2}, \ldots, \mathbf{a}_{k}`}</M>{" "}
              be a linearly independent list in{" "}
              <M>{tex`\mathbb{R}^{n}`}</M>. Define recursively:
            </p>
            <Block>{tex`\mathbf{u}_{i} = \mathbf{a}_{i} - \sum_{j < i} \frac{\mathbf{a}_{i} \cdot \mathbf{q}_{j}}{\mathbf{q}_{j} \cdot \mathbf{q}_{j}}\, \mathbf{q}_{j}, \qquad \mathbf{q}_{i} = \frac{\mathbf{u}_{i}}{\|\mathbf{u}_{i}\|}.`}</Block>
            <p>
              That is: take{" "}
              <M>{tex`\mathbf{a}_{i}`}</M>, subtract its projection onto
              every previous{" "}
              <M>{tex`\mathbf{q}_{j}`}</M>, then normalise.
            </p>
            <p>
              <strong>(a)</strong> Show that{" "}
              <M>{tex`\mathbf{u}_{i} \neq \mathbf{0}`}</M> for every{" "}
              <M>i</M> (so the normalisation step is well-defined).
            </p>
            <p>
              <strong>(b)</strong> Show that{" "}
              <M>{tex`\mathbf{q}_{i} \cdot \mathbf{q}_{j} = \delta_{ij}`}</M>{" "}
              (the result is orthonormal).
            </p>
            <p>
              <strong>(c)</strong> Show that for every <M>{tex`i`}</M>,
            </p>
            <Block>{tex`\mathrm{span}\{\mathbf{q}_{1}, \ldots, \mathbf{q}_{i}\} = \mathrm{span}\{\mathbf{a}_{1}, \ldots, \mathbf{a}_{i}\}.`}</Block>
            <p>
              <strong>(d)</strong> Use the procedure to factor any{" "}
              <M>{tex`m \times k`}</M> matrix <M>A</M> with linearly
              independent columns into <M>{tex`A = QR`}</M>, where{" "}
              <M>{tex`Q \in \mathbb{R}^{m \times k}`}</M> has
              orthonormal columns and{" "}
              <M>{tex`R \in \mathbb{R}^{k \times k}`}</M> is upper
              triangular with positive diagonal. (This is the QR
              decomposition.)
            </p>
          </>
        }
        hint={
          <>
            For (a), if{" "}
            <M>{tex`\mathbf{u}_{i} = \mathbf{0}`}</M> then{" "}
            <M>{tex`\mathbf{a}_{i}`}</M> would be a combination of the
            earlier{" "}
            <M>{tex`\mathbf{q}_{j}`}</M>, hence (by (c)) of the earlier{" "}
            <M>{tex`\mathbf{a}_{j}`}</M> — contradicting independence.
            For (b), induct on <M>i</M>: by construction{" "}
            <M>{tex`\mathbf{u}_{i}`}</M> is orthogonal to every{" "}
            <M>{tex`\mathbf{q}_{j}`}</M> with <M>{tex`j < i`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a) and (c) by simultaneous induction.</strong>{" "}
              Base case <M>{tex`i = 1`}</M>:{" "}
              <M>{tex`\mathbf{u}_{1} = \mathbf{a}_{1} \neq \mathbf{0}`}</M>{" "}
              by independence, and{" "}
              <M>{tex`\mathrm{span}\{\mathbf{q}_{1}\} = \mathrm{span}\{\mathbf{a}_{1}\}`}</M>{" "}
              since the two are positive multiples of one another.
            </p>
            <p>
              Inductive step. Assume both hold up to index{" "}
              <M>{tex`i - 1`}</M>. The vector{" "}
              <M>{tex`\sum_{j < i} \tfrac{\mathbf{a}_{i} \cdot \mathbf{q}_{j}}{\mathbf{q}_{j} \cdot \mathbf{q}_{j}} \mathbf{q}_{j}`}</M>{" "}
              lies in{" "}
              <M>{tex`\mathrm{span}\{\mathbf{q}_{1}, \ldots, \mathbf{q}_{i-1}\} = \mathrm{span}\{\mathbf{a}_{1}, \ldots, \mathbf{a}_{i-1}\}`}</M>.
              If{" "}
              <M>{tex`\mathbf{u}_{i} = \mathbf{0}`}</M> we&apos;d have{" "}
              <M>{tex`\mathbf{a}_{i}`}</M> in that span — contradicting
              independence. So{" "}
              <M>{tex`\mathbf{u}_{i} \neq \mathbf{0}`}</M>, and{" "}
              <M>{tex`\mathbf{q}_{i}`}</M> is well-defined. Also{" "}
              <M>{tex`\mathbf{q}_{i} \in \mathrm{span}\{\mathbf{a}_{1}, \ldots, \mathbf{a}_{i}\}`}</M>{" "}
              and conversely{" "}
              <M>{tex`\mathbf{a}_{i} \in \mathrm{span}\{\mathbf{q}_{1}, \ldots, \mathbf{q}_{i}\}`}</M>,
              so the spans match.
            </p>
            <p>
              <strong>(b)</strong> By construction, for{" "}
              <M>{tex`j < i`}</M>:
            </p>
            <Block>{tex`\mathbf{u}_{i} \cdot \mathbf{q}_{j} = \mathbf{a}_{i} \cdot \mathbf{q}_{j} - \sum_{\ell < i} \frac{\mathbf{a}_{i} \cdot \mathbf{q}_{\ell}}{\mathbf{q}_{\ell} \cdot \mathbf{q}_{\ell}}\,\mathbf{q}_{\ell} \cdot \mathbf{q}_{j}.`}</Block>
            <p>
              By the inductive hypothesis the{" "}
              <M>{tex`\mathbf{q}_{\ell}`}</M> are orthonormal, so{" "}
              <M>{tex`\mathbf{q}_{\ell} \cdot \mathbf{q}_{j} = \delta_{\ell j}`}</M>,
              and the only surviving term is{" "}
              <M>{tex`\mathbf{a}_{i} \cdot \mathbf{q}_{j} - \mathbf{a}_{i} \cdot \mathbf{q}_{j} = 0`}</M>.
              Dividing by{" "}
              <M>{tex`\|\mathbf{u}_{i}\|`}</M> gives{" "}
              <M>{tex`\mathbf{q}_{i} \cdot \mathbf{q}_{j} = 0`}</M>; and{" "}
              <M>{tex`\mathbf{q}_{i} \cdot \mathbf{q}_{i} = 1`}</M> by
              normalisation.
            </p>
            <p>
              <strong>(d)</strong> The recursion can be rearranged to
              express each{" "}
              <M>{tex`\mathbf{a}_{i}`}</M> as
            </p>
            <Block>{tex`\mathbf{a}_{i} = \sum_{j \leq i} R_{ji}\, \mathbf{q}_{j},`}</Block>
            <p>
              where{" "}
              <M>{tex`R_{ji} = \mathbf{a}_{i} \cdot \mathbf{q}_{j}`}</M>{" "}
              for <M>{tex`j < i`}</M> and{" "}
              <M>{tex`R_{ii} = \|\mathbf{u}_{i}\| > 0`}</M>. Stacking
              the columns gives <M>{tex`A = QR`}</M> with <M>R</M>{" "}
              upper-triangular and positive on the diagonal.
            </p>
            <p>
              <strong>Why this matters.</strong> QR is how every
              well-implemented least-squares solver works (numerically
              stable, no need to form{" "}
              <M>{tex`A^{\top} A`}</M>); it underlies orthogonalising
              attention heads, building orthonormal feature directions
              for probes, and the orthogonal initialisation schemes
              transformers train better with. Gram–Schmidt is the
              algorithm; QR is the matrix statement.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
