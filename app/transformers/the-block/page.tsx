import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";

export const metadata = {
  title: "The transformer block",
};

export default function TheBlockPage() {
  return (
    <ChapterShell
      moduleSlug="transformers"
      chapterSlug="the-block"
      eyebrow="Chapter 05"
      title="The transformer block"
      lede="Take the residual stream from the neural-networks module, drop multi-head attention into one half and an MLP into the other, wrap each in a LayerNorm and a residual connection, and you have one transformer block. Stack L of them and you have the architecture."
    >
      <h2>The block, in six lines</h2>
      <p>
        A modern (pre-norm) transformer block computes:
      </p>
      <Block>{tex`\begin{aligned}
\mathbf{x}' &= \mathbf{x} + \mathrm{MHA}\big(\mathrm{LN}_1(\mathbf{x})\big) \\
\mathbf{x}'' &= \mathbf{x}' + \mathrm{MLP}\big(\mathrm{LN}_2(\mathbf{x}')\big)
\end{aligned}`}</Block>
      <p>
        Six lines of pseudocode, including the LayerNorms. Read
        them as two separate &ldquo;sub-blocks,&rdquo; each in the
        same shape: <em>normalize, compute, add</em>. The
        normalization is per-token; the &ldquo;compute&rdquo; is
        either multi-head attention or an MLP; the &ldquo;add&rdquo;
        is the residual connection. We&apos;ll spend the rest of
        this chapter on why every part is the way it is.
      </p>

      <h2>Why pre-norm</h2>
      <p>
        The original 2017 paper used <em>post-norm</em>:{" "}
        <M>{tex`\mathbf{x}' = \mathrm{LN}(\mathbf{x} + \mathrm{MHA}(\mathbf{x}))`}</M>.
        Modern transformers (GPT-2 onward) use{" "}
        <em>pre-norm</em> — LayerNorm{" "}
        <em>before</em> each sub-block, with the residual addition
        coming after. The reason is gradient flow:
      </p>
      <ul>
        <li>
          With post-norm, gradients have to pass through{" "}
          <em>every</em> LayerNorm to reach the embedding layer.
          Stacking deep enough pushes the LayerNorms toward
          regimes where their Jacobians vanish, and training
          becomes unstable past ~12 layers without elaborate
          warmup schedules.
        </li>
        <li>
          With pre-norm, the residual stream is never normalized
          directly. Gradients flow back to the embedding via the
          identity skip, untouched. You can train 100+ layer
          pre-norm transformers with vanilla AdamW; you cannot
          do that with post-norm.
        </li>
      </ul>
      <p>
        The cost: the residual stream is no longer normalized at
        any point, and its norm tends to <em>grow</em> with depth.
        Mech interp papers then have to be careful about
        magnitude when comparing residuals across layers.
      </p>

      <h2>Why two sub-blocks, in this order</h2>
      <p>
        Attention is for moving information <em>between</em>{" "}
        positions; the MLP is for processing information{" "}
        <em>within</em> a single position. They&apos;re
        complementary, and you need both:
      </p>
      <ul>
        <li>
          Attention is shallow per position — one weighted average,
          one linear write. Without an MLP, the model has no way to
          turn what it gathered into a non-linear conclusion.
        </li>
        <li>
          The MLP, by itself, can&apos;t look at any other token.
          Stacking pure MLPs would give you a powerful per-token
          classifier with zero contextual awareness.
        </li>
      </ul>
      <p>
        The order &ldquo;attention first, then MLP&rdquo; is
        empirical: gather context, then process. Reversed-order
        blocks work too, slightly worse. The same is true for
        &ldquo;parallel&rdquo; blocks (PaLM-style:{" "}
        <M>{tex`\mathbf{x}' = \mathbf{x} + \mathrm{MHA}(\mathrm{LN}_1) + \mathrm{MLP}(\mathrm{LN}_2)`}</M>),
        which trade a bit of quality for parallelism.
      </p>

      <h2>The residual stream as a bus</h2>
      <p>
        The single most important picture in the rest of this book.
        Forget the layered tower view; redraw the model as a{" "}
        <em>shared bus</em> (the residual stream) and a sequence
        of <em>independent components</em> (each head, each MLP)
        that read from it and write to it.
      </p>
      <Block>{tex`\mathbf{x}_{L} = \mathbf{x}_{0} + \sum_{\ell=1}^{L} \big( \mathrm{MHA}_\ell(\cdot) + \mathrm{MLP}_\ell(\cdot) \big).`}</Block>
      <p>
        That equation, expanded, shows that the final residual
        stream is the embedding plus the sum of every block&apos;s
        contribution. <em>Every</em> block has direct access to
        the embedding via the identity path; <em>every</em>{" "}
        block&apos;s contribution survives intact in the final
        residual stream. There is no &ldquo;information loss&rdquo;
        in the architectural sense — only redirection of bandwidth.
      </p>
      <p>
        A consequence that becomes load-bearing in mech interp:
        you can take any final-layer residual{" "}
        <M>{tex`\mathbf{x}_L`}</M> and{" "}
        <em>decompose</em> it into a sum of contributions from each
        component. A &ldquo;circuit&rdquo; is a small subset of
        those contributions whose joint behavior explains the
        model&apos;s output on a behavior of interest.
      </p>

      <h2>What the block <em>doesn&apos;t</em> have</h2>
      <p>
        Three things you might expect, that aren&apos;t there:
      </p>
      <ul>
        <li>
          <strong>No recurrence.</strong> Every position is
          processed in parallel; the only sequential dependency is
          the causal mask in attention. This is what made
          transformers tractable to train at scale.
        </li>
        <li>
          <strong>No explicit memory.</strong> The model carries
          state only in its current sequence&apos;s residual
          streams. There&apos;s no hidden state to carry from one
          forward pass to the next, modulo the KV cache (which is
          an optimization, not new memory).
        </li>
        <li>
          <strong>No parameter sharing across layers.</strong> Each
          block has its own weights. Some efficient variants
          (Universal Transformer, ALBERT) share weights across
          layers, with mixed empirical results.
        </li>
      </ul>

      <h2>Putting numbers on it</h2>
      <p>
        For GPT-2 small (<M>{tex`d = 768, h = 12, L = 12`}</M>), one
        block&apos;s parameters roughly:
      </p>
      <ul>
        <li>
          <strong>Attention</strong>:{" "}
          <M>{tex`4 d^{2}`}</M> from the four{" "}
          <M>{tex`d \times d`}</M> matrices{" "}
          (<M>{tex`W_Q, W_K, W_V, W_O`}</M>). About 2.36M.
        </li>
        <li>
          <strong>MLP</strong>:{" "}
          <M>{tex`8 d^{2}`}</M> from <M>{tex`W_1, W_2`}</M> with
          hidden width <M>{tex`4d`}</M>. About 4.72M.
        </li>
        <li>
          <strong>LayerNorms + biases</strong>: a few thousand
          parameters, negligible.
        </li>
      </ul>
      <p>
        So the MLP carries roughly twice the parameters of attention
        per block. Across the model, ~2/3 of weights live in MLPs,
        ~1/3 in attention. A surprising amount of mech interp work
        therefore studies MLPs.
      </p>

      <Callout variant="intuition">
        Two sub-blocks, two purposes. Attention moves information
        between tokens; the MLP processes information within a
        token. Both wrap their compute in &ldquo;normalize first,
        add to residual stream second.&rdquo; Stack L copies and
        you have the entire transformer.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The block structure is what makes circuit-level
          interpretability possible:
        </p>
        <ul>
          <li>
            <strong>Component decomposition.</strong>{" "}
            <M>{tex`\mathbf{x}_L = \mathbf{x}_0 + \sum_{\ell, i} \mathrm{head}_{\ell, i}(\cdot) + \sum_{\ell} \mathrm{MLP}_\ell(\cdot)`}</M>{" "}
            — every component has an additive, separable
            contribution to the final residual stream. This is
            exactly what makes &ldquo;the contribution of head 5.7
            to the Paris logit&rdquo; a well-defined quantity.
          </li>
          <li>
            <strong>Pre-norm is a LayerNorm gauge.</strong> The
            LayerNorm in front of each sub-block multiplies the
            residual stream by a per-token scaling factor. That
            factor isn&apos;t input-independent, which complicates
            simple linear analyses; the standard fix is{" "}
            <em>folding</em> the LayerNorm into the next layer&apos;s
            weights as a constant approximation.
          </li>
          <li>
            <strong>Path patching.</strong> Because contributions
            sum, you can trace the &ldquo;path&rdquo; from one
            component to a later one — what fraction of head{" "}
            <M>{tex`(\ell_2, h_2)`}</M>&apos;s input came directly
            from head <M>{tex`(\ell_1, h_1)`}</M> rather than from
            the embedding or from MLPs in between. The circuits
            module makes this precise.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            In a pre-norm transformer block, the residual stream
            is the input to LayerNorm but never directly normalized.
            What does this imply about the typical norm of the
            residual stream as you move deeper through layers?
          </>
        }
        choices={[
          {
            id: "a",
            label: "It stays roughly constant; the LayerNorms keep it pinned.",
            explain:
              "Each LayerNorm only normalizes the input to its sub-block — it never touches the running residual. The residual is the unnormalized accumulation.",
          },
          {
            id: "b",
            label: "It grows with depth, because each block adds a non-zero contribution.",
            correct: true,
            explain:
              "Right — every block adds a vector to the residual stream and never subtracts one. In practice the norm of the residual stream of a pre-norm transformer grows roughly with √L by depth L.",
          },
          {
            id: "c",
            label: "It shrinks with depth because LayerNorm divides by the standard deviation.",
            explain:
              "LayerNorm is applied to a copy of the residual, not to the residual itself. The output of LayerNorm goes into the sub-block; the original residual is preserved.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Show that the pre-norm block
              <Block>{tex`\mathbf{x}'' = \mathbf{x} + \mathrm{MHA}(\mathrm{LN}_1(\mathbf{x})) + \mathrm{MLP}(\mathrm{LN}_2(\mathbf{x} + \mathrm{MHA}(\mathrm{LN}_1(\mathbf{x}))))`}</Block>
              admits an exact decomposition of <M>{tex`\mathbf{x}''`}</M>{" "}
              as a sum of three terms (identity, attention contribution,
              MLP contribution). What stops this from being a
              <em>fully linear</em> decomposition (so that you could
              treat <M>{tex`\mathbf{x}''`}</M> as a clean superposition
              of features)?
            </p>
            <p>
              <strong>(b)</strong> Pre-norm transformers are
              empirically more stable to train than post-norm, but
              less so on validation loss at fixed depth. Sketch a
              hand-wavy gradient argument for the stability, then
              identify the trade-off you&apos;re paying. (Hint: think
              about the role of the residual identity in the
              backward pass.)
            </p>
            <p>
              <strong>(c)</strong> A team proposes a &ldquo;parallel
              block&rdquo; variant{" "}
              <M>{tex`\mathbf{x}'' = \mathbf{x} + \mathrm{MHA}(\mathrm{LN}(\mathbf{x})) + \mathrm{MLP}(\mathrm{LN}(\mathbf{x}))`}</M>{" "}
              (PaLM-style — both sub-blocks read from the same
              normalized input, in parallel). Argue why this is{" "}
              <em>strictly less expressive</em> than the sequential
              block, but only by a bounded amount, and give one
              practical reason it&apos;s nonetheless used in
              production models.
            </p>
          </>
        }
        hint={
          <>
            For (a): write each sub-block as &ldquo;input + delta&rdquo;
            and check what&apos;s linear in <M>{tex`\mathbf{x}`}</M>{" "}
            and what isn&apos;t. The MLP&apos;s input depends on the
            attention output. For (c): the sequential block lets the
            MLP see what attention did; the parallel block doesn&apos;t.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`\mathbf{x}'' = \mathbf{x} + \Delta_{\mathrm{Attn}} + \Delta_{\mathrm{MLP}}`}</M>{" "}
              where{" "}
              <M>{tex`\Delta_{\mathrm{Attn}} = \mathrm{MHA}(\mathrm{LN}_1(\mathbf{x}))`}</M>{" "}
              and{" "}
              <M>{tex`\Delta_{\mathrm{MLP}} = \mathrm{MLP}(\mathrm{LN}_2(\mathbf{x} + \Delta_{\mathrm{Attn}}))`}</M>.
              The decomposition is exact. It is{" "}
              <em>not</em> linear in <M>{tex`\mathbf{x}`}</M>{" "}
              because both the LayerNorms and the MLP&apos;s
              nonlinearity break linearity. In practice
              interpretability work either{" "}
              <em>folds the LayerNorm scale into the next weights</em>{" "}
              and treats it as locally linear, or{" "}
              <em>analyzes contributions input-by-input</em>{" "}
              (activation-conditioned).
            </p>
            <p>
              <strong>(b)</strong> In pre-norm, the gradient with
              respect to <M>{tex`\mathbf{x}`}</M> is{" "}
              <M>{tex`\nabla_{\mathbf{x}} = I + \nabla\Delta_{\mathrm{Attn}} + \nabla\Delta_{\mathrm{MLP}}`}</M>:
              the identity term is always there, so vanishing
              gradients require the perturbations to vanish, not the
              identity. In post-norm, gradients have to pass through
              the LayerNorm Jacobian on every layer, and stacking
              shrinks the signal multiplicatively. The trade-off:
              pre-norm leaves the residual stream{" "}
              <em>unnormalized</em>, so each block&apos;s LayerNorm
              has to do more &ldquo;rescaling&rdquo; work, and the
              effective expressive depth at fixed width is slightly
              lower. You&apos;re trading peak quality for
              optimization stability.
            </p>
            <p>
              <strong>(c)</strong> The sequential block can implement
              any function the parallel block can — set the MLP to
              ignore <M>{tex`\Delta_{\mathrm{Attn}}`}</M> in its input.
              The reverse is not true: the parallel block&apos;s MLP
              cannot condition on the result of attention at this
              layer; it has to wait for the next layer&apos;s
              normalization to see it. So expressiveness is strictly
              lower — but only by a one-layer delay. Practical use
              case: at very large model widths, attention and MLP
              dominate the latency budget; running them in parallel
              instead of sequentially gives a free ~15% speedup with
              negligible quality loss, which is why PaLM, Gemma,
              and several inference-optimized open models use the
              parallel form.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
