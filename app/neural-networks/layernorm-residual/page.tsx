import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { LayerNormDemo } from "@/components/viz/LayerNormDemo";

export const metadata = {
  title: "Layer normalization & residual connections",
};

export default function LayerNormResidualPage() {
  return (
    <ChapterShell
      moduleSlug="neural-networks"
      chapterSlug="layernorm-residual"
      eyebrow="Chapter 06"
      title="Layer normalization & residual connections"
      lede="Two architectural tricks that turned deep networks from a hopeful idea into the default. One renormalizes activations to keep gradients sane; the other adds a highway around every block so the gradient has a way home."
    >
      <h2>The problem they solve</h2>
      <p>
        From the calculus capstone: a deep network&apos;s gradient is
        a long product of per-layer Jacobians. If those Jacobians have
        operator norm <M>{tex`< 1`}</M>, the gradient vanishes; if{" "}
        <M>{tex`> 1`}</M>, it explodes. Either way, training stops
        working past a few dozen layers. Activations have the same
        pathology in the forward direction: their magnitudes drift
        layer by layer until everything saturates or underflows.
      </p>
      <p>
        Two architectural patches, used together, neutralize both
        problems and let people train networks 100+ layers deep.
        They&apos;re both in every modern transformer.
      </p>

      <h2>Layer normalization</h2>
      <p>
        For each token&apos;s residual stream{" "}
        <M>{tex`\mathbf{x} \in \mathbb{R}^{d}`}</M>, compute the mean
        and variance <em>across that vector&apos;s coordinates</em>{" "}
        (not across the batch &mdash; that&apos;s batch norm,
        different beast):
      </p>
      <Block>{tex`\mu = \frac{1}{d}\sum_{j=1}^{d} x_j, \qquad \sigma^2 = \frac{1}{d}\sum_{j=1}^{d}(x_j - \mu)^2.`}</Block>
      <p>
        Then re-centre and re-scale, with a small{" "}
        <M>{tex`\varepsilon`}</M> for numerical safety, and finally
        apply a learned per-coordinate scale and shift{" "}
        <M>{tex`\gamma, \beta \in \mathbb{R}^{d}`}</M>:
      </p>
      <Block>{tex`\mathrm{LN}(\mathbf{x}) = \gamma \odot \frac{\mathbf{x} - \mu}{\sqrt{\sigma^2 + \varepsilon}} + \beta.`}</Block>
      <p>
        The middle expression has{" "}
        <em>mean 0 and variance 1</em>, by construction, no matter
        what the input was. The learned <M>{tex`\gamma, \beta`}</M>{" "}
        re-introduce capacity: if the layer wants its output to have
        a particular scale or shift, it can learn one. The point is
        that the <em>statistics don&apos;t depend on the input
        magnitudes</em>; they&apos;re fixed by construction.
      </p>

      <Figure caption="LayerNorm in action. Edit any input bar; the middle column always has mean 0, std 1. The right column applies the learned γ (scale) and β (shift). Drag γ and β to feel the parameterization.">
        <LayerNormDemo />
      </Figure>

      <h2>Variants worth naming</h2>
      <ul>
        <li>
          <strong>Pre-norm vs.&nbsp;post-norm.</strong> The original
          transformer applied LayerNorm <em>after</em> each block (
          <M>{tex`\mathbf{x} + \mathrm{Block}(\mathbf{x})`}</M>{" "}
          followed by LN). Modern transformers (GPT-2 onward) apply
          it <em>before</em>:{" "}
          <M>{tex`\mathbf{x} + \mathrm{Block}(\mathrm{LN}(\mathbf{x}))`}</M>.
          Pre-norm is much easier to train at depth.
        </li>
        <li>
          <strong>RMSNorm.</strong> Drops the mean-subtraction and
          the <M>{tex`\beta`}</M>. Cheaper, similar performance:
          <Block>{tex`\mathrm{RMS}(\mathbf{x}) = \gamma \odot \frac{\mathbf{x}}{\sqrt{\frac{1}{d}\sum_j x_j^2 + \varepsilon}}.`}</Block>
          Used in LLaMA, T5, and most newer open models.
        </li>
        <li>
          <strong>Batch norm.</strong> Normalizes across the{" "}
          <em>batch</em> dimension instead of the feature dimension.
          Standard in vision; bad in language because batch sizes
          and sequence lengths vary. Ignore for transformers.
        </li>
      </ul>

      <h2>Residual connections</h2>
      <p>
        The second trick is even simpler. Let{" "}
        <M>{tex`f`}</M> be a sub-block (attention, MLP, anything).
        Replace <M>{tex`\mathbf{x} \mapsto f(\mathbf{x})`}</M> with
      </p>
      <Block>{tex`\mathbf{x} \mapsto \mathbf{x} + f(\mathbf{x}).`}</Block>
      <p>
        That extra <M>{tex`\mathbf{x} +`}</M> is the{" "}
        <strong>residual connection</strong> (a.k.a. skip
        connection). The block now learns a <em>correction</em> to
        the input rather than the input itself. A transformer block
        is, in full,
      </p>
      <Block>{tex`\mathbf{x} \mapsto \mathbf{x} + \mathrm{Attn}(\mathrm{LN}_1(\mathbf{x})), \quad \mathbf{x} \mapsto \mathbf{x} + \mathrm{MLP}(\mathrm{LN}_2(\mathbf{x})).`}</Block>
      <p>
        Apply this <M>L</M> times in a stack. The result, viewed at
        any layer, is the sum of contributions from every preceding
        block plus the original embedding.
      </p>

      <h2>The residual stream</h2>
      <p>
        Reading the equation above the right way is the key
        interpretability move of the past five years. At any layer{" "}
        <M>{tex`\ell`}</M> of an <M>L</M>-layer transformer, the
        residual stream is
      </p>
      <Block>{tex`\mathbf{x}_{\ell} = \mathrm{embed}(t) + \sum_{k=1}^{\ell} \Bigl(\mathrm{Attn}_k(\mathrm{LN}(\mathbf{x}_{k-1})) + \mathrm{MLP}_k(\mathrm{LN}(\mathbf{x}_{k-1}))\Bigr).`}</Block>
      <p>
        That is: the residual stream is a <em>shared communication
        bus</em>. Every block reads from it, every block adds to it,
        and the unembedding at the end reads the final value. The
        residual stream isn&apos;t a layer &mdash; it&apos;s the
        cable that all the layers attach to. Most modern mech-interp
        vocabulary is some statement about this bus.
      </p>

      <Callout variant="intuition">
        LayerNorm pins the magnitude of every token&apos;s vector to
        a sphere of fixed size, so subsequent layers always see
        well-scaled inputs. Residual connections turn the network
        into &ldquo;copy the input forward, then add a learned
        correction&rdquo; — a much friendlier optimization landscape
        than &ldquo;learn the entire output from scratch.&rdquo;
        Together they remove the two main reasons deep networks used
        to fail.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Both pieces show up constantly in interpretability papers:
        </p>
        <ul>
          <li>
            <strong>The residual stream</strong> is{" "}
            <em>the</em> object of mech interp. Logit lens, activation
            patching, sparse autoencoders &mdash; all of them
            intervene on or read from the residual stream.
          </li>
          <li>
            <strong>Direct logit attribution</strong> uses the
            additivity of the residual stream to say &ldquo;exactly
            this much of the final logits came from this attention
            head, and exactly that much from this MLP block.&rdquo;
            Only the linearity of the sum makes the decomposition
            exact.
          </li>
          <li>
            <strong>LayerNorm complicates everything.</strong>{" "}
            LayerNorm is <em>not</em> linear in{" "}
            <M>{tex`\mathbf{x}`}</M> &mdash; the division by{" "}
            <M>{tex`\sigma`}</M> is input-dependent. Many papers
            either ignore this (&ldquo;treat LN as the identity for
            the purposes of attribution&rdquo;), linearize it locally
            (&ldquo;LN-as-fold-into-W&rdquo; tricks), or rewrite
            with the linear part of LN absorbed into the next
            matrix. There is real subtlety here.
          </li>
          <li>
            <strong>Residuals make ablations recoverable.</strong>{" "}
            If you zero out one block&apos;s contribution, the
            residual stream still has every <em>other</em>{" "}
            block&apos;s contribution intact &mdash; that&apos;s why
            single-block ablations rarely catastrophically break a
            model. The skip path is doing work whether you wanted it
            to or not.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            LayerNorm normalizes each token&apos;s feature vector to
            mean 0 and std 1. Which of the following is{" "}
            <em>not</em> true of the post-LN vector{" "}
            <M>{tex`\hat{\mathbf{x}} = (\mathbf{x} - \mu)/\sigma`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "Its norm equals √d (deterministically).",
            explain:
              "True: ‖x̂‖² = Σ ((x_j − μ)/σ)² = d · σ²/σ² = d.",
          },
          {
            id: "b",
            label: "It is a linear function of x.",
            correct: true,
            explain:
              "False. μ and σ are functions of x, so the division by σ is nonlinear in x. Treating LN as linear is a common mech-interp approximation, but it's an approximation.",
          },
          {
            id: "c",
            label: "Its mean across the d coordinates is 0.",
            explain:
              "True by construction — that's exactly what the mean subtraction does.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              Consider a depth-<M>L</M> pre-norm residual network:{" "}
              <M>{tex`\mathbf{x}_{\ell} = \mathbf{x}_{\ell-1} + f_{\ell}(\mathrm{LN}(\mathbf{x}_{\ell-1}))`}</M>.
              Assume LN is approximately the identity (we relax this
              in part c).
            </p>
            <p>
              <strong>(a)</strong> Show by induction that
              <Block>{tex`\mathbf{x}_{L} = \mathbf{x}_{0} + \sum_{\ell=1}^{L} f_{\ell}(\mathbf{x}_{\ell-1}).`}</Block>
              In words: the final residual stream is the input plus a
              sum of every layer&apos;s contribution. Why does this
              additive structure justify &ldquo;direct logit
              attribution&rdquo; &mdash; the practice of writing the
              final logit difference as a sum of per-component
              contributions?
            </p>
            <p>
              <strong>(b)</strong> The Jacobian of the residual map at
              one layer is{" "}
              <M>{tex`I + J_{\ell}`}</M> with{" "}
              <M>{tex`J_{\ell} = \partial f_{\ell}/\partial \mathbf{x}`}</M>.
              Show that
              <Block>{tex`\frac{\partial \mathbf{x}_{L}}{\partial \mathbf{x}_{0}} = \prod_{\ell = L}^{1}(I + J_{\ell}) = I + \sum_{\ell} J_{\ell} + \sum_{\ell > \ell'} J_{\ell} J_{\ell'} + \cdots`}</Block>
              and identify which term in this expansion corresponds
              to a &ldquo;path of length <M>k</M>&rdquo; through the
              network. (You did this in the calculus backprop
              challenge; recap it here in residual-stream language.)
            </p>
            <p>
              <strong>(c)</strong> Now restore the LN nonlinearity.
              For a vector <M>{tex`\mathbf{x}`}</M> with mean 0
              (already), <M>{tex`\mathrm{LN}(\mathbf{x}) = \mathbf{x} / \|\mathbf{x}\|/\sqrt{d}`}</M>,
              up to <M>{tex`\gamma, \beta`}</M>. Derive the Jacobian{" "}
              <M>{tex`\partial \mathrm{LN}/\partial \mathbf{x}`}</M>{" "}
              at such an <M>{tex`\mathbf{x}`}</M> and show it equals{" "}
              <M>{tex`(1/\|\mathbf{x}\|)\, P^\perp_{\mathbf{x}}`}</M>{" "}
              (up to factors), where{" "}
              <M>{tex`P^\perp_{\mathbf{x}} = I - \mathbf{x}\mathbf{x}^{\top}/\|\mathbf{x}\|^2`}</M>{" "}
              is the projection onto the orthogonal complement of{" "}
              <M>{tex`\mathbf{x}`}</M>. What does this tell you about
              what kinds of perturbations LN <em>amplifies</em> vs.{" "}
              <em>kills</em> &mdash; and why &ldquo;treat LN as
              linear&rdquo; is locally fine but globally
              dangerous in interpretability work?
            </p>
          </>
        }
        hint={
          <>
            For (a): expand one layer at a time. For (b): every term
            in the product expansion is a string{" "}
            <M>{tex`J_{\ell_k} J_{\ell_{k-1}} \cdots J_{\ell_1}`}</M>{" "}
            with strictly decreasing layer indices &mdash; that&apos;s
            a path. For (c): for a function{" "}
            <M>{tex`g(\mathbf{x}) = \mathbf{x}/\|\mathbf{x}\|`}</M>,
            differentiate using{" "}
            <M>{tex`\partial \|\mathbf{x}\|/\partial \mathbf{x} = \mathbf{x}/\|\mathbf{x}\|`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> Base case{" "}
              <M>{tex`\mathbf{x}_1 = \mathbf{x}_0 + f_1(\mathbf{x}_0)`}</M>{" "}
              is immediate. Inductive step:{" "}
              <M>{tex`\mathbf{x}_{L} = \mathbf{x}_{L-1} + f_L(\mathbf{x}_{L-1}) = \mathbf{x}_0 + \sum_{\ell < L} f_\ell(\mathbf{x}_{\ell-1}) + f_L(\mathbf{x}_{L-1})`}</M>.
              The final residual stream is a literal sum. Apply{" "}
              <M>{tex`W_U`}</M> on both sides:{" "}
              <M>{tex`W_U \mathbf{x}_L = W_U \mathbf{x}_0 + \sum_\ell W_U f_\ell(\cdot)`}</M>.
              Each term is an <em>additive contribution to the
              logits</em> from one block. Subtracting the logit for a
              wrong answer from the correct one gives a sum of
              per-block contributions to the &ldquo;logit
              difference&rdquo; &mdash; the workhorse metric of
              activation patching. The decomposition is{" "}
              <em>exact</em> because the residual stream is a sum.
            </p>
            <p>
              <strong>(b)</strong> Each term in the expanded product
              is a product{" "}
              <M>{tex`J_{\ell_k} J_{\ell_{k-1}} \cdots J_{\ell_1}`}</M>{" "}
              with{" "}
              <M>{tex`\ell_k > \ell_{k-1} > \cdots > \ell_1`}</M> — a
              specific ordered subset of layers. Read right-to-left:
              the gradient flows from the output back through layer{" "}
              <M>{tex`\ell_k`}</M>, then layer{" "}
              <M>{tex`\ell_{k-1}`}</M>, …, ending at layer{" "}
              <M>{tex`\ell_1`}</M>. That is a <em>path</em> of length{" "}
              <M>k</M> through the network, taking the residual
              shortcut at every layer not in the path. The leading{" "}
              <M>I</M> is the &ldquo;direct path&rdquo;: skip every
              block, send the embedding straight to the output. The
              first sum is single-layer paths; higher-order terms are
              compositions. This is the algebraic backbone of the
              transformer-circuits framework.
            </p>
            <p>
              <strong>(c)</strong> Write{" "}
              <M>{tex`g(\mathbf{x}) = \mathbf{x}/\|\mathbf{x}\|`}</M>;
              then{" "}
              <M>{tex`\partial g/\partial \mathbf{x} = (1/\|\mathbf{x}\|)(I - \mathbf{x}\mathbf{x}^{\top}/\|\mathbf{x}\|^2)`}</M>.
              The factor{" "}
              <M>{tex`(I - \mathbf{x}\mathbf{x}^{\top}/\|\mathbf{x}\|^2) = P^\perp_{\mathbf{x}}`}</M>{" "}
              is the projector onto vectors orthogonal to{" "}
              <M>{tex`\mathbf{x}`}</M>. Multiply by the{" "}
              <M>{tex`\sqrt{d}`}</M> normalization and you get
              the LN Jacobian.
            </p>
            <p>
              Geometric meaning: LN is locally linear, but the local
              linearization{" "}
              <em>kills the radial direction</em>. A perturbation
              parallel to <M>{tex`\mathbf{x}`}</M> is invisible to
              the rest of the network (LN normalizes it away). A
              perturbation perpendicular to{" "}
              <M>{tex`\mathbf{x}`}</M> is preserved (and rescaled by
              <M>{tex`1/\|\mathbf{x}\|`}</M>). For activation
              patching this matters in two ways. (1) Patching a
              residual stream component along the current{" "}
              <M>{tex`\mathbf{x}`}</M> direction has{" "}
              <em>zero</em> first-order effect &mdash; an easy way
              to be fooled into thinking a feature doesn&apos;t
              matter. (2) Treating LN as the identity is fine when
              two compared streams are close (the projector is
              approximately the same), but for large interventions
              the projector itself shifts and a linear approximation
              breaks. The cleanest fix in the literature is to
              &ldquo;fold LN into the next layer&rdquo; analytically,
              treating the{" "}
              <M>{tex`(P^\perp_{\mathbf{x}})/\|\mathbf{x}\|`}</M>{" "}
              factor as part of the matrix being studied.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
