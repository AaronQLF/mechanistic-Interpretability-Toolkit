import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";

export const metadata = {
  title: "QK and OV circuits",
};

export default function QKOVPage() {
  return (
    <ChapterShell
      moduleSlug="transformers"
      chapterSlug="qk-ov"
      eyebrow="Chapter 03"
      title="QK and OV circuits"
      lede="A single attention head splits cleanly into two independent linear maps: one decides where to read from, the other decides what to write. Once you see the factorization, the four parameter matrices Q, K, V, O collapse into two interpretable objects."
    >
      <h2>The Anthropic factorization</h2>
      <p>
        Following the &ldquo;A Mathematical Framework for Transformer
        Circuits&rdquo; paper (Elhage et al. 2021), drop the bias
        terms and LayerNorm for a moment and write a single
        attention head&apos;s contribution to the residual stream
        at position <M>i</M> as
      </p>
      <Block>{tex`\mathrm{head}(X)_i\, W_O = \sum_{j} \underbrace{a_{ij}}_{\text{QK}}\; \underbrace{x_j\, W_V W_O}_{\text{OV}}.`}</Block>
      <p>
        Two factors. The scalar <M>{tex`a_{ij}`}</M> is the attention
        weight, decided by the query-key inner product. The vector{" "}
        <M>{tex`x_j W_V W_O`}</M> is what the head <em>writes</em>{" "}
        into the residual stream when it attends to position{" "}
        <M>j</M>. They depend on{" "}
        <em>different</em> learned matrices.
      </p>

      <h2>The QK circuit: where to read</h2>
      <p>
        The attention score is
      </p>
      <Block>{tex`s_{ij} = \frac{q_i \cdot k_j}{\sqrt{d_k}} = \frac{x_i^{\top} W_Q W_K^{\top} x_j}{\sqrt{d_k}}.`}</Block>
      <p>
        The matrices <M>{tex`W_Q`}</M> and <M>{tex`W_K`}</M> only
        ever appear in the combination{" "}
        <M>{tex`W_{QK} = W_Q W_K^{\top} \in \mathbb{R}^{d \times d}`}</M>.
        That single <M>{tex`d \times d`}</M> matrix is the{" "}
        <strong>QK circuit</strong>. It tells you, for any pair of
        residual-stream vectors{" "}
        <M>{tex`x_i, x_j`}</M>, how strongly position <M>i</M> wants
        to attend to position <M>j</M>: the bilinear form{" "}
        <M>{tex`x_i^{\top} W_{QK} x_j`}</M>.
      </p>
      <p>
        The previous chapter&apos;s temperature symmetry already told
        us that <M>{tex`W_Q`}</M> and <M>{tex`W_K`}</M>{" "}
        <em>individually</em> aren&apos;t interpretable —{" "}
        <M>{tex`W_{QK}`}</M> is. Two operational consequences:
      </p>
      <ul>
        <li>
          <strong>Reading the head&apos;s &ldquo;preferences&rdquo;.</strong>{" "}
          The top eigenvectors of{" "}
          <M>{tex`W_{QK} + W_{QK}^{\top}`}</M> (its symmetric part)
          are residual-stream directions where the head gives a
          strong score to itself — i.e. the head likes attending
          from a token of type <M>v</M> to a token of type{" "}
          <M>v</M>.
        </li>
        <li>
          <strong>Low rank in practice.</strong> The numerical rank
          of <M>{tex`W_{QK}`}</M> is at most{" "}
          <M>{tex`d_k`}</M> (=&nbsp;64 for GPT-2 small). The
          attention head can only express bilinear forms of that
          rank; this is one reason heads specialize in narrow
          relations.
        </li>
      </ul>

      <h2>The OV circuit: what to write</h2>
      <p>
        Now the value side. When the head decides to attend to
        position <M>j</M>, what gets written into the residual
        stream at position <M>i</M> is
      </p>
      <Block>{tex`x_j\, W_V W_O = x_j\, W_{OV}, \qquad W_{OV} = W_V W_O \in \mathbb{R}^{d \times d}.`}</Block>
      <p>
        Same trick: <M>{tex`W_V`}</M> and <M>{tex`W_O`}</M>{" "}
        individually have a temperature symmetry; only the product{" "}
        <M>{tex`W_{OV}`}</M> is interpretable. That single matrix
        is the <strong>OV circuit</strong>. It is a linear map from
        the residual-stream input at the source position to the
        residual-stream contribution at the destination position.
      </p>
      <p>
        Two interpretive moves on <M>{tex`W_{OV}`}</M>:
      </p>
      <ul>
        <li>
          <strong>Top eigenvectors.</strong> When{" "}
          <M>{tex`W_{OV}`}</M> has a large positive eigenvalue with
          eigenvector <M>v</M>, the head&apos;s effect is &ldquo;copy
          the <M>v</M>-component of the source into the destination
          residual stream.&rdquo; This is exactly what a{" "}
          <em>copying head</em> does.
        </li>
        <li>
          <strong>Composition with the unembedding.</strong> The
          matrix <M>{tex`W_{OV}\, W_U^{\top}`}</M> tells you, for
          each token <M>t</M> in the vocabulary, how much the head
          &ldquo;promotes <M>t</M>&rdquo; in the next-token logits
          when it attends to a position whose residual-stream
          contains some pattern. A common diagnostic: feed the
          unembedding column for token <M>t</M> through{" "}
          <M>{tex`W_{OV}^{\top}`}</M> and read off which residual
          directions fire — that&apos;s how Anthropic identifies
          &ldquo;this head copies the previous token.&rdquo;
        </li>
      </ul>

      <h2>Putting it together</h2>
      <p>
        A whole head is now described by two interpretable matrices
        of size <M>{tex`d \times d`}</M>:
      </p>
      <Block>{tex`\boxed{\;\;W_{QK}, W_{OV} \;\;}\quad\text{everything else is gauge.}`}</Block>
      <p>
        And the head&apos;s contribution to the residual stream at
        position <M>i</M> is
      </p>
      <Block>{tex`\sum_{j} \mathrm{softmax}_j\!\left(\frac{x_i^{\top} W_{QK} x_j}{\sqrt{d_k}}\right)\, x_j W_{OV}.`}</Block>
      <p>
        Read it: &ldquo;score every source <M>j</M> with the QK
        bilinear form, softmax, then write the OV-mapped source
        into the destination.&rdquo; Two factor maps, one
        non-linearity (softmax), one weighted sum. That is the
        complete description of one attention head.
      </p>

      <h2>Cross-head and cross-layer composition</h2>
      <p>
        Heads in different layers can compose. If head <M>{tex`(\ell, h_1)`}</M>{" "}
        writes into a direction <M>v</M> via its <M>{tex`W_{OV}`}</M>{" "}
        and head <M>{tex`(\ell', h_2)`}</M> with{" "}
        <M>{tex`\ell' > \ell`}</M> reads strongly from direction{" "}
        <M>v</M> via its <M>{tex`W_{QK}`}</M>, then the two heads
        form a small two-step computation. This is the technical
        meaning of the &ldquo;previous-token + induction&rdquo;
        circuit we&apos;ll build in detail in the circuits module:
        a previous-token head&apos;s OV writes the previous token
        into the next position, and the induction head&apos;s QK
        reads it.
      </p>
      <p>
        The framework gives us a useful piece of vocabulary:
      </p>
      <ul>
        <li>
          <strong>Q-composition.</strong> A later head&apos;s query
          reads from a direction that an earlier head wrote.
        </li>
        <li>
          <strong>K-composition.</strong> A later head&apos;s key
          reads from such a direction.
        </li>
        <li>
          <strong>V-composition.</strong> A later head&apos;s value
          reads from such a direction.
        </li>
      </ul>
      <p>
        Each of these is detectable by computing the relevant
        product of <M>{tex`W_{QK}`}</M> / <M>{tex`W_{OV}`}</M>{" "}
        matrices across layers and looking at its rank or top
        singular vectors. This is the bread and butter of
        circuit-finding work.
      </p>

      <Callout variant="intuition">
        Forget Q, K, V, O as four independent matrices. There are
        two: <em>QK decides where</em>, <em>OV decides what</em>.
        Everything in the rest of this book — induction heads, IOI,
        path patching, ablation studies — is built on top of those
        two objects.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The QK / OV factorization is not a metaphor; it&apos;s the
          actual architecture once you collapse the temperature
          symmetries. Practical implications:
        </p>
        <ul>
          <li>
            <strong>Eigenvalue spectra.</strong> A copying head&apos;s{" "}
            <M>{tex`W_{OV}`}</M> has a large positive eigenvalue
            structure on token-direction subspaces. A
            negative-copying head (one that <em>suppresses</em> its
            source) has the same structure with the opposite sign.
            You can detect both from <M>{tex`W_{OV}`}</M> alone.
          </li>
          <li>
            <strong>Cross-layer composition coefficients.</strong> The
            Anthropic paper defines &ldquo;composition score&rdquo;
            metrics — Frobenius norms of products like{" "}
            <M>{tex`W_{QK}^{(\ell_2)} W_{OV}^{(\ell_1)}`}</M> — that
            quantify how much later heads listen to earlier ones.
          </li>
          <li>
            <strong>Editing.</strong> If you want to remove a
            head&apos;s ability to do one specific thing, the
            cleanest place to intervene is on a low-rank update to{" "}
            <M>{tex`W_{OV}`}</M> (or <M>{tex`W_{QK}`}</M>) — not on
            the four raw matrices.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            A particular head in GPT-2 small has{" "}
            <M>{tex`W_{OV}`}</M> with one large eigenvalue close to{" "}
            <M>{tex`+1`}</M> and the rest near zero, and{" "}
            <M>{tex`W_{QK}`}</M> nearly diagonal. What kind of head
            is this?
          </>
        }
        choices={[
          {
            id: "a",
            label: "A copying head: it attends to a single position and copies its residual stream forward.",
            correct: true,
            explain:
              "Diagonal W_QK ≈ token attends to itself / its own type. W_OV ≈ identity on a 1-dim subspace = pass that direction through unchanged. Together: 'copy this direction from a like-typed position'.",
          },
          {
            id: "b",
            label: "An induction head, because both matrices are simple.",
            explain:
              "Induction heads are about copying after matching, not about diagonal QK. W_QK for an induction head looks like 'previous-token-shift composed with token-match' — not diagonal.",
          },
          {
            id: "c",
            label: "A polysemantic head — there's no clean structure here.",
            explain:
              "Almost the opposite — diagonal QK + low-rank OV is about as clean a structure as a head can have.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Show that the &ldquo;temperature&rdquo;
              symmetries of the four matrices{" "}
              <M>{tex`(W_Q, W_K, W_V, W_O)`}</M> are exactly captured
              by the gauge group{" "}
              <M>{tex`\mathrm{GL}(d_k) \times \mathrm{GL}(d_v)`}</M>:
              for any invertible{" "}
              <M>{tex`A \in \mathrm{GL}(d_k), B \in \mathrm{GL}(d_v)`}</M>,
              the substitution{" "}
              <M>{tex`(W_Q, W_K, W_V, W_O) \to (W_Q A, W_K A^{-\top}, W_V B, B^{-1} W_O)`}</M>{" "}
              leaves the head function invariant. Conclude that{" "}
              <M>{tex`(W_{QK}, W_{OV})`}</M> are the <em>maximal</em>{" "}
              invariants — every other functional summary you could
              build is a function of those two.
            </p>
            <p>
              <strong>(b)</strong> A &ldquo;skip trigram&rdquo; is a
              triple of tokens <M>{tex`(t_1, t_2, t_3)`}</M> such that
              the head, when reading position <M>{tex`t_1`}</M> from
              a residual stream containing <M>{tex`t_2`}</M>,
              promotes <M>{tex`t_3`}</M> in the next-token logits.
              Express the &ldquo;skip-trigram strength&rdquo; as a
              product of three matrices involving{" "}
              <M>{tex`W_E, W_{QK}, W_{OV}, W_U`}</M>, and explain why
              this product is finite-rank — and why that rank
              constrains the number of skip trigrams a head can
              support.
            </p>
            <p>
              <strong>(c)</strong> Suppose someone claims to have
              identified an &ldquo;induction head&rdquo; based purely
              on a previous-token-shifted attention pattern. Sketch a
              counter-example: a head whose attention pattern looks
              identical to a previous-token-shift but whose{" "}
              <M>{tex`W_{OV}`}</M> would prevent it from doing
              induction. What does this teach you about the role of
              the OV circuit in any &ldquo;circuit identification&rdquo;
              claim?
            </p>
          </>
        }
        hint={
          <>
            For (a): substitute the proposed gauge into the
            attention equation and verify nothing changes. For (b):
            score on the embedding side, output to logits via{" "}
            <M>{tex`W_U`}</M>, multiply through. For (c): consider a
            head with{" "}
            <M>{tex`W_{OV} = 0`}</M>, or one whose{" "}
            <M>{tex`W_{OV}`}</M> writes into a direction the
            unembedding ignores.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`W_Q A (W_K A^{-\top})^{\top} = W_Q A A^{-1} W_K^{\top} = W_{QK}`}</M>,
              and{" "}
              <M>{tex`(W_V B)(B^{-1} W_O) = W_V W_O = W_{OV}`}</M>.
              The transformation leaves both interpretable
              quantities fixed and changes only the &ldquo;internal&rdquo;
              representation of the head. Conversely, two settings of
              the four raw matrices that yield the same{" "}
              <M>{tex`(W_{QK}, W_{OV})`}</M> compute the same head
              function. Hence the maximal invariants under the gauge
              group are precisely <M>{tex`(W_{QK}, W_{OV})`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Promotion of token{" "}
              <M>{tex`t_3`}</M> in the next-token logits, when
              attending from token <M>{tex`t_1`}</M> to a position
              with token <M>{tex`t_2`}</M>, is — at first order in
              the simplified model — proportional to
              <Block>{tex`\big(\,e_{t_1}^{\top}\, W_E\,\big)\, W_{QK}\, \big(\,W_E^{\top} e_{t_2}\,\big) \cdot \big(\,e_{t_3}^{\top}\, W_U\,\big) W_{OV}^{\top}\, \big(\,W_E^{\top} e_{t_2}\,\big).`}</Block>
              The first scalar is the QK-circuit score; the second is
              the OV-circuit alignment between the source-token
              embedding and the target-token unembedding. Both
              factors are determined by products of the form
              <M>{tex`W_E^{\top} M W_E`}</M> or{" "}
              <M>{tex`W_U M W_E^{\top}`}</M>, which have rank at most{" "}
              <M>{tex`d_k`}</M> or <M>{tex`d_v`}</M>. So the head can
              support only a low-rank set of skip trigrams; the
              vocabulary triples it copies between are not
              independent.
            </p>
            <p>
              <strong>(c)</strong> Take any head with the
              previous-token-shift attention pattern (so its{" "}
              <M>{tex`W_{QK}`}</M> implements the right bilinear
              form) but with{" "}
              <M>{tex`W_{OV} = 0`}</M> on the relevant subspace. The
              head attends to the previous token but writes nothing
              about it into the residual stream — that&apos;s not
              induction, that&apos;s a no-op. The lesson: an
              attention pattern only tells you{" "}
              <em>where</em> a head reads, not <em>what</em> it does
              with what it reads. Any circuit claim that relies on
              attention patterns alone is missing half the picture.
              Real induction-head identification (Olsson et al.)
              checks both halves: a previous-token QK pattern{" "}
              <em>and</em> an OV that writes the source token into
              the destination residual stream.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
