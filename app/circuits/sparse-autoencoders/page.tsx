import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SAEDemo } from "@/components/viz/SAEDemo";

export const metadata = {
  title: "Sparse autoencoders",
};

export default function SparseAutoencodersPage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="sparse-autoencoders"
      eyebrow="Chapter 05"
      title="Sparse autoencoders"
      lede="The dense residual stream packs many features into d directions via superposition. The bet behind sparse autoencoders: there&apos;s a wider, sparser basis in which features become monosemantic. Train an SAE on a model&apos;s activations, read off the dictionary, and you have human-interpretable features &mdash; if everything goes well."
    >
      <h2>The motivating problem</h2>
      <p>
        From the neural-networks capstone: a transformer&apos;s
        residual stream has only <M>d</M> dimensions, but the
        model represents thousands or millions of distinct
        concepts. Superposition is the resolution — features
        share directions, accepting some interference for
        capacity. The cost of superposition for interpretability:
        any single dimension of the residual stream is
        <em>polysemantic</em>, firing for many unrelated
        features. You can&apos;t look at &ldquo;the residual
        stream channel for sentiment&rdquo; because there
        isn&apos;t one — sentiment is spread across a direction
        that overlaps with dozens of other features.
      </p>

      <h2>The proposal</h2>
      <p>
        Train a wide, sparse autoencoder on a dataset of
        activations. Architecturally:
      </p>
      <Block>{tex`f(\mathbf{x}) = \mathrm{ReLU}(W_{\mathrm{enc}}\mathbf{x} + \mathbf{b}_{\mathrm{enc}}), \quad \hat{\mathbf{x}} = W_{\mathrm{dec}} f(\mathbf{x}) + \mathbf{b}_{\mathrm{dec}}.`}</Block>
      <p>
        Two key choices distinguish this from a regular
        autoencoder:
      </p>
      <ul>
        <li>
          <strong>The hidden width is much larger than{" "}
          <M>d</M>.</strong> Typical: <M>{tex`m = 8d`}</M> to{" "}
          <M>{tex`m = 64d`}</M>. The bet is that features that
          were tangled together in <M>{tex`\mathbb{R}^d`}</M>{" "}
          un-tangle in <M>{tex`\mathbb{R}^m`}</M>.
        </li>
        <li>
          <strong>The hidden activation must be sparse.</strong>{" "}
          Train with an L1 penalty on <M>{tex`f(\mathbf{x})`}</M>{" "}
          (or, in newer variants, an L0 / top-k constraint).
          Sparsity is what forces the SAE to assign each input
          to a small number of dictionary atoms instead of
          smearing it across many.
        </li>
      </ul>
      <p>
        The training objective is reconstruction plus sparsity:
      </p>
      <Block>{tex`\mathcal{L}_{\mathrm{SAE}} = \|\mathbf{x} - \hat{\mathbf{x}}\|^2 + \lambda \|f(\mathbf{x})\|_1.`}</Block>
      <p>
        At convergence, every input <M>{tex`\mathbf{x}`}</M> is
        approximated by a sparse positive combination of
        dictionary atoms — the columns of{" "}
        <M>{tex`W_{\mathrm{dec}}`}</M>. Each atom is a candidate{" "}
        <em>feature direction</em>.
      </p>

      <Figure caption="A toy SAE on an 8-dimensional residual stream and a 16-feature dictionary with named atoms. The dense residual stream (left) is polysemantic — every coordinate mixes many features. The SAE code (middle) is sparse — only the few atoms whose feature is present fire, with their named identity attached. The reconstruction (right) approximates the input from those few atoms.">
        <SAEDemo />
      </Figure>

      <h2>Why this might work</h2>
      <p>
        Three justifications, of decreasing rigor:
      </p>
      <ol>
        <li>
          <strong>Linear-representation hypothesis.</strong> If
          features are stored as directions in the residual
          stream, then a wide-enough decoder can recover them as
          its columns. The dictionary doesn&apos;t have to
          discover features that aren&apos;t there; it has to
          align with directions the model already wrote.
        </li>
        <li>
          <strong>Capacity argument.</strong> Many real-world
          features are sparse: only a few apply to any given
          input. An SAE with a sparsity-promoting objective will,
          if it can find them, prefer a representation in which
          each input fires few atoms. This is closer to the
          &ldquo;true&rdquo; structure of natural data than the
          dense residual is.
        </li>
        <li>
          <strong>Empirical evidence.</strong> Anthropic, OpenAI,
          and others have published large-scale SAE training
          runs on Claude, GPT-4-class models, etc. Many of the
          recovered atoms are inspectable as monosemantic
          features — &ldquo;mentions of Marie Curie&rdquo;,
          &ldquo;DNA-related vocabulary&rdquo;, &ldquo;the
          Golden Gate Bridge.&rdquo; A nontrivial fraction of
          atoms remain hard to interpret.
        </li>
      </ol>

      <h2>Reading the dictionary</h2>
      <p>
        Given a trained SAE, the standard interpretation
        protocol:
      </p>
      <ul>
        <li>
          <strong>Activation maximization.</strong> For each atom{" "}
          <M>i</M>, find inputs <M>{tex`\mathbf{x}`}</M> for which{" "}
          <M>{tex`f_i(\mathbf{x})`}</M> is large. Read those
          inputs and try to label what they have in common.
        </li>
        <li>
          <strong>Logit lens through the decoder.</strong> Apply
          <M>{tex`W_U W_{\mathrm{dec}}[:, i]`}</M> to read off
          which tokens the atom promotes. An atom for &ldquo;dog
          breeds&rdquo; should promote &ldquo;poodle&rdquo;,
          &ldquo;dachshund&rdquo;, etc.
        </li>
        <li>
          <strong>Causal interventions.</strong> Force atom{" "}
          <M>i</M> to fire (or not fire) and see how the model&apos;s
          output changes — this is &ldquo;feature steering&rdquo;,
          and it works in practice for atoms whose
          interpretation is well-grounded.
        </li>
      </ul>
      <p>
        A clean atom passes all three: maximally-activating
        inputs share a clear theme, the decoder direction
        promotes the right tokens, and steering produces the
        expected behavior change. A &ldquo;dead&rdquo; atom
        (never fires) or an &ldquo;ultra-low-frequency&rdquo;
        atom (fires only on a handful of inputs and is hard to
        characterize) is a known failure mode.
      </p>

      <h2>Advanced: training one on a small model</h2>
      <p>
        You don&apos;t need a frontier model. The smallest serious
        project: pick one activation site in a small open-weight
        transformer, cache a few million activations, train one
        dictionary, and audit whether its atoms are readable. GPT-2
        small, TinyStories-33M, and Pythia-70M are big enough to
        carry real features yet small enough to run the whole loop
        on a single consumer GPU.
      </p>

      <Callout variant="note" title="The whole project, in three phases">
        <ol>
          <li>
            <strong>Cache.</strong> Run the model over text and save
            the activation at one site &rarr; a matrix{" "}
            <M>{tex`X \in \mathbb{R}^{N \times d}`}</M>, one row per
            token.
          </li>
          <li>
            <strong>Train.</strong> Fit a wide, sparse autoencoder on{" "}
            <M>X</M> &mdash; reconstruction error plus an L1 sparsity
            penalty.
          </li>
          <li>
            <strong>Audit.</strong> Read the learned atoms and keep
            only the ones you can actually name.
          </li>
        </ol>
      </Callout>

      <p className="!mb-2 font-sans text-xs font-semibold uppercase tracking-wide text-ink-muted">
        A concrete first target
      </p>
      <div className="my-3 overflow-hidden rounded-lg border border-line font-sans text-sm">
        <table className="w-full border-collapse">
          <tbody className="text-ink">
            <tr className="border-b border-line">
              <th scope="row" className="w-1/3 bg-paper-sunken px-4 py-2 text-left font-medium text-ink-muted">
                Model
              </th>
              <td className="px-4 py-2">GPT-2 small, TinyStories-33M, or Pythia-70M</td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="bg-paper-sunken px-4 py-2 text-left font-medium text-ink-muted">
                Activation site
              </th>
              <td className="px-4 py-2">
                <M>{tex`\mathrm{resid\_post}`}</M> after a middle layer (e.g. layer 6)
              </td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="bg-paper-sunken px-4 py-2 text-left font-medium text-ink-muted">
                Input width
              </th>
              <td className="px-4 py-2">
                <M>{tex`d = 768`}</M> (GPT-2 small)
              </td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="bg-paper-sunken px-4 py-2 text-left font-medium text-ink-muted">
                Dictionary width
              </th>
              <td className="px-4 py-2">
                <M>{tex`m = 16d = 12{,}288`}</M> atoms
              </td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="bg-paper-sunken px-4 py-2 text-left font-medium text-ink-muted">
                Training tokens
              </th>
              <td className="px-4 py-2">5&ndash;20 million</td>
            </tr>
            <tr className="border-b border-line">
              <th scope="row" className="bg-paper-sunken px-4 py-2 text-left font-medium text-ink-muted">
                Batch &amp; optimizer
              </th>
              <td className="px-4 py-2">
                4,096&ndash;32,768 &middot; AdamW, lr <M>{tex`3\times 10^{-4}`}</M>
              </td>
            </tr>
            <tr>
              <th scope="row" className="bg-paper-sunken px-4 py-2 text-left font-medium text-ink-muted">
                Stop when
              </th>
              <td className="px-4 py-2">reconstruction and active-atom count both plateau</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>1. Cache the activations</h3>
      <p>
        You&apos;re building a matrix{" "}
        <M>{tex`X \in \mathbb{R}^{N \times d}`}</M>: one row per token
        position, <M>d</M> columns of residual stream.
      </p>
      <ul>
        <li>
          <strong>Pick one site, not the whole model.</strong> A
          middle-layer <M>{tex`\mathrm{resid\_post}`}</M> reads better
          than early layers (features are lexical) or late layers
          (features are nearly logits).
        </li>
        <li>
          <strong>Match the model&apos;s diet.</strong> OpenWebText
          for GPT-2, TinyStories for a TinyStories model, code for a
          code model &mdash; the atoms you recover depend on what you
          feed it.
        </li>
        <li>
          <strong>Shuffle by token, not by document,</strong> so every
          minibatch sees diverse contexts.
        </li>
        <li>
          <strong>Normalize.</strong> Subtract the mean{" "}
          <M>{tex`\mu`}</M> and scale to unit norm so the SAE spends
          capacity on feature directions, not the global mean. Add{" "}
          <M>{tex`\mu`}</M> back only when re-inserting reconstructions
          into the model.
        </li>
      </ul>
      <h3>2. Train the dictionary</h3>
      <ul>
        <li>
          <strong>Minimize reconstruction + sparsity:</strong>{" "}
          <M>{tex`\|\mathbf{x} - \hat{\mathbf{x}}\|_2^2 + \lambda \|f(\mathbf{x})\|_1`}</M>.
        </li>
        <li>
          <strong>
            Tune <M>{tex`\lambda`}</M> for tens of active atoms per
            token.
          </strong>{" "}
          Almost everything fires &rarr; raise{" "}
          <M>{tex`\lambda`}</M>; mostly dead atoms &rarr; lower it or
          add a resampling / ghost-gradient trick.
        </li>
        <li>
          <strong>Keep every atom unit-norm</strong> after each step.
          Otherwise the encoder shrinks while the decoder grows,
          gaming the L1 penalty without improving reconstruction.
        </li>
        <li>
          <strong>Watch three numbers.</strong> Reconstruction{" "}
          <M>{tex`\|x-\hat{x}\|^2 / \|x-\mu\|^2`}</M>, sparsity
          (average <M>{tex`\|f(x)\|_0`}</M>), and dictionary health
          (fraction of atoms that ever fire). A healthy first run is
          low reconstruction error with sparse codes and few dead
          atoms.
        </li>
      </ul>
      <p>
        The module itself is tiny &mdash; in practice the slow part
        is the activation-caching pipeline and the audit UI around
        it, not this:
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`class SAE(nn.Module):
    def __init__(self, d_model, n_features):
        super().__init__()
        self.encoder = nn.Linear(d_model, n_features)
        self.decoder = nn.Linear(n_features, d_model, bias=True)

    def forward(self, x):
        f = F.relu(self.encoder(x))
        x_hat = self.decoder(f)
        return x_hat, f

sae = SAE(d_model=768, n_features=16 * 768).to(device)
opt = torch.optim.AdamW(sae.parameters(), lr=3e-4)

for x in activation_loader:
    x = normalize(x.to(device))
    x_hat, f = sae(x)

    recon = (x - x_hat).pow(2).mean()
    sparse = f.abs().mean()
    loss = recon + l1_coeff * sparse

    opt.zero_grad()
    loss.backward()
    opt.step()

    with torch.no_grad():
        sae.decoder.weight.div_(
            sae.decoder.weight.norm(dim=0, keepdim=True).clamp_min(1e-6)
        )`}</code>
      </pre>
      <h3>3. Audit before you believe it</h3>
      <ul>
        <li>
          <strong>Sample widely.</strong> For ~50 random atoms and
          the ~50 highest-firing ones, read the top-activating text
          snippets and try to name each.
        </li>
        <li>
          <strong>Cross-check every name.</strong> Run a decoder
          logit lens and a small steering nudge &mdash; the snippets,
          the promoted tokens, and the steering effect should all
          tell the same story.
        </li>
        <li>
          <strong>Demand repeated evidence.</strong> Never label an
          atom from a single anecdote; require the pattern to hold
          across many contexts.
        </li>
      </ul>

      <Callout variant="mechinterp">
        <p>
          Spend at least as long auditing atoms as you spent training
          them. An unaudited SAE is just a compressed activation
          dataset &mdash; the interpretability payoff only arrives
          once you can name what each atom fires on.
        </p>
      </Callout>

      <h2>What can go wrong</h2>
      <p>
        SAEs are an active research area; not every claim has
        settled. The known issues:
      </p>
      <ul>
        <li>
          <strong>Reconstruction error.</strong> No SAE perfectly
          reconstructs its input. The leftover{" "}
          <M>{tex`\mathbf{x} - \hat{\mathbf{x}}`}</M> represents
          features the SAE missed — and you have no guarantee
          they&apos;re not the most important ones.
        </li>
        <li>
          <strong>Feature splitting.</strong> A single underlying
          feature can be split across multiple atoms (e.g.
          &ldquo;dog (small)&rdquo; and &ldquo;dog (large)&rdquo;
          get separate atoms instead of one). Wider dictionaries
          tend to over-split; narrower ones tend to under-fit.
        </li>
        <li>
          <strong>Polysemantic atoms.</strong> Some atoms remain
          polysemantic even after SAE training, especially in
          attention layers. The promise of monosemanticity is
          not fully delivered.
        </li>
        <li>
          <strong>Dataset dependence.</strong> The atoms an SAE
          learns are functions of the training distribution. An
          SAE trained on web text will miss features that only
          appear in code; one trained on code will miss most
          natural-language features.
        </li>
        <li>
          <strong>Computational cost.</strong> Training an SAE
          per layer per model is expensive; the
          activations dataset alone runs to the terabytes for
          frontier models.
        </li>
      </ul>

      <h2>Where SAEs fit in the toolkit</h2>
      <p>
        Sparse autoencoders are not a replacement for circuit
        analysis; they&apos;re a basis change. The hope is that
        circuits expressed in the SAE basis are <em>cleaner</em>{" "}
        — &ldquo;atom 18374 (capital cities) feeds atom 22561
        (Paris)&rdquo; instead of &ldquo;polysemantic neuron 1432
        partially feeds polysemantic neuron 8794.&rdquo; The
        method composes with everything in the previous
        chapters: you can patch atoms (instead of components),
        compute attention via SAE-decoded keys/values, and
        inspect circuits across atom IDs. The frontier of mech
        interp work in 2025–2026 is building this composition
        out.
      </p>

      <Callout variant="intuition">
        Take the dense, polysemantic residual stream. Project it
        into a much wider, sparse basis where most coordinates
        are zero. If you did the projection right, each
        nonzero coordinate is a single named feature. SAEs are
        the bet that this is achievable; the open question is
        how cleanly.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          Practical recipe for using an SAE in a circuit
          analysis:
        </p>
        <ul>
          <li>
            <strong>Pick an activation site.</strong> Most
            commonly: the residual stream after a specific layer,
            or the output of an MLP. Different sites give very
            different dictionaries.
          </li>
          <li>
            <strong>Train an SAE there.</strong> Decoder width
            <M>{tex`m \approx 16d`}</M> is a reasonable default;
            tune the L1 coefficient until the average
            <M>{tex`\|f\|_0`}</M> is in the tens, not hundreds.
          </li>
          <li>
            <strong>Audit.</strong> For each atom, read 20
            top-activating inputs and label them. Throw away
            atoms you can&apos;t name; investigate
            high-frequency-but-uninterpretable atoms — they often
            indicate a feature that exists but you&apos;re
            struggling to articulate.
          </li>
          <li>
            <strong>Use the dictionary.</strong> Run logit-lens
            through the decoder, do steering, do
            patching at the atom level. The interpretability
            payoff is the operations you can run in
            human-interpretable terms.
          </li>
        </ul>
      </Callout>

      <Quiz
        question={
          <>
            An SAE trained on the residual stream of a small
            language model has 8000 atoms, of which roughly 30
            fire on any given input. After inspection you find
            that 10% of atoms are clean and monosemantic, 60% are
            partially interpretable, 25% are dead (never fire),
            and 5% fire frequently but resist labeling. What does
            this profile suggest?
          </>
        }
        choices={[
          {
            id: "a",
            label: "The SAE has fully solved monosemanticity.",
            explain:
              "10% clean atoms is meaningful but not a solved problem. Real SAEs do not yet deliver clean monosemanticity at scale.",
          },
          {
            id: "b",
            label: "The SAE is partially working: monosemanticity is achievable for some features, but the dictionary is still too narrow / too wide / both, and additional methodology (better sparsity penalty, ghost gradients, multiple-resolution dictionaries) is needed.",
            correct: true,
            explain:
              "This is essentially the consensus 2024–2026 picture. SAEs deliver real monosemantic features for some directions, leave most atoms partially interpretable, and have known failure modes (dead, ultra-frequent uninterpretable). Active research is on closing these gaps.",
          },
          {
            id: "c",
            label: "The SAE is broken — monosemanticity is impossible at this scale.",
            explain:
              "Too pessimistic. The 10% clean fraction is enough to do real circuit work; the existence of *some* clean features in the dictionary is a positive existence proof.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> Sparse autoencoders try to
              recover features the model has stored in
              superposition. Show that the L1 penalty
              <M>{tex`\lambda \|f(\mathbf{x})\|_1`}</M> is
              equivalent (up to a Lagrange-multiplier
              substitution) to a constraint
              <M>{tex`\|f(\mathbf{x})\|_1 \leq C`}</M> for some
              constant <M>C</M>. Why is L1 preferred to L0 in the
              loss, even though L0 is what we&apos;d ideally
              optimize? (Hint: gradient.)
            </p>
            <p>
              <strong>(b)</strong> A common observation: SAEs
              trained on attention outputs produce atoms that are
              less monosemantic than SAEs trained on MLP
              outputs. Propose an architecturally-grounded
              explanation for this asymmetry. (Hint: the
              attention output is a weighted sum of value
              vectors from many positions; the MLP output is a
              function of the residual stream at one position.)
            </p>
            <p>
              <strong>(c)</strong> Suppose you train an SAE on
              the residual stream after layer 8 of a transformer,
              find an atom that fires on &ldquo;mentions of
              Barack Obama&rdquo;, and want to test whether it&apos;s
              causally important for the model&apos;s ability to
              answer biographical questions about Obama. Sketch
              two experiments: one using activation patching at
              the atom level, and one using steering. What would
              tell you the atom is the &ldquo;Obama&rdquo;
              feature vs. just a correlated detector?
            </p>
          </>
        }
        hint={
          <>
            For (a): L0 has zero gradient almost everywhere; L1 is
            the convex relaxation. For (b): superposition lets a
            single position carry many features; an attention
            output mixes features <em>from many positions</em> at
            once — even more polysemantic. For (c): patching tests
            necessity; steering tests sufficiency. Both should
            agree if the atom is really the Obama feature.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> The constrained problem
              &ldquo;minimize{" "}
              <M>{tex`\|\mathbf{x} - \hat{\mathbf{x}}\|^2`}</M>{" "}
              subject to <M>{tex`\|f\|_1 \leq C`}</M>&rdquo; has
              the Lagrangian{" "}
              <M>{tex`\|\mathbf{x} - \hat{\mathbf{x}}\|^2 + \lambda(\|f\|_1 - C)`}</M>{" "}
              for some <M>{tex`\lambda \geq 0`}</M>. Up to a
              constant the same minima as the penalized form. L0
              would be the &ldquo;right&rdquo; sparsity measure
              (count of nonzeros) but it&apos;s discontinuous and
              has zero gradient almost everywhere — gradient
              descent gets no useful signal to push activations
              toward zero. L1 is the smallest convex relaxation
              that still pushes things toward sparsity, and it
                provides usable gradients everywhere except at
              <M>{tex`f = 0`}</M>. Newer SAE variants (top-k,
              JumpReLU, gated SAEs) replace the L1 with
              direct-sparsity tricks that avoid the bias L1
              introduces toward small magnitudes.
            </p>
            <p>
              <strong>(b)</strong> An MLP&apos;s output at
              position <M>i</M> is a function only of the
              residual stream at <M>i</M>; whatever superposition
              that residual contains, an SAE can in principle
              decompose. An attention head&apos;s output at
              position <M>i</M> is a softmax-weighted sum of
              value vectors{" "}
              <M>{tex`\sum_j a_{ij} V_j W_O`}</M> from{" "}
              <em>many other positions</em>. Two effects compound:
              (i) the input-distribution to the SAE is now a
              <em>mixture</em> over many possible source
              positions, so &ldquo;features&rdquo; in the
              attention-output sense are joint properties of
              source-and-attention-pattern; (ii) the value-side
              superposition at all those source positions is
              folded together, which can mix features that were
              well-separated at any one position. Empirically this
              is exactly what people see: SAEs on MLP outputs are
              cleaner than SAEs on attention outputs.
            </p>
            <p>
              <strong>(c)</strong> Patching: cache the SAE
              activation on a clean &ldquo;Obama&rdquo;-related
              prompt; on a corrupted prompt where Obama is
              replaced with another name, force the candidate
              atom to its clean (high) value, and re-decode the
              residual stream. If the model&apos;s downstream
              answer to a biographical question now matches the
              Obama-correct answer, the atom is causally
              sufficient for that information being present.
              Steering: on a totally unrelated prompt, force the
              atom to fire (or not fire) and see whether
              Obama-related text appears (or doesn&apos;t). Both
              should agree. The key falsification: a
              merely-correlated detector would fire on Obama
              mentions but, when forced to fire on an unrelated
              prompt, would <em>not</em> bias the output toward
              Obama-related content. A genuine feature would. If
              steering fails but patching succeeds, the atom is a
              local correlate but not the model&apos;s actual
              representation of the feature; treat it as
              suggestive, not conclusive.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
