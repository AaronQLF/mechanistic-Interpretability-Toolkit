import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { SAEDemo } from "@/components/viz/SAEDemo";

export const metadata = {
  title: "Hands on: training your own SAE",
};

export default function HandsOnPage() {
  return (
    <ChapterShell
      moduleSlug="circuits"
      chapterSlug="hands-on"
      eyebrow="Chapter 06"
      title="Hands on: training your own SAE"
      lede="Everything in the previous chapter was conceptual. This one is the build manual. We go from an empty conda environment to a trained, audited, causally-validated sparse autoencoder on a small open-weight transformer &mdash; with every decision, hyperparameter, and failure mode named. The last section is personal: this is also the project I&apos;m doing for my MILA M.Sc. thesis, and I write up what it looks like from inside."
    >
      <h2>What you&apos;ll have at the end</h2>
      <p>
        By the end of this chapter you should have, on your own
        hardware:
      </p>
      <ul>
        <li>
          A reproducible activation-caching pipeline that reads
          tokens from a corpus, runs them through an open-weight
          transformer with hooks, and writes activations at one
          chosen site to disk.
        </li>
        <li>
          A trained sparse autoencoder &mdash; vanilla, top-k, or
          JumpReLU &mdash; whose loss, sparsity, and
          dead-feature fraction you tracked across training.
        </li>
        <li>
          An evaluation report: reconstruction loss, average{" "}
          <M>{tex`\|f(x)\|_0`}</M>, fraction of dead atoms, and
          the downstream cross-entropy of the host model when the
          activation is replaced by the SAE reconstruction.
        </li>
        <li>
          A dictionary audit: for each atom, the top-activating
          token contexts, the decoder-logit-lens top tokens, and
          a tentative human-readable label.
        </li>
        <li>
          At least one <em>causal</em> validation experiment per
          atom of interest: activation patching at the atom level,
          steering, or both, with a clean → corrupted recovery
          fraction.
        </li>
      </ul>
      <p>
        Everything in this chapter targets the smallest sensible
        setup: a single consumer GPU (e.g.{" "}
        <code>RTX 3090</code> / <code>4090</code>, or an{" "}
        <code>A100</code> if your lab gives you access), a
        small open-weight model (<code>GPT-2 small</code>,{" "}
        <code>Pythia-160M</code>, <code>Gemma-2-2B</code>,
        or <code>TinyStories-33M</code>), and one activation site.
        Frontier-scale SAEs are an engineering project an order
        of magnitude larger; the conceptual moves are the same.
      </p>

      <Callout variant="note">
        I am writing this from inside the project &mdash; this
        is the tooling I am building for my MILA M.Sc. thesis on
        automated causal validation of SAE features. Where I
        have an opinion I have not seen consensus on, I say so;
        where the field has settled, I say that too. The last
        section of the chapter is a candid description of the
        research program this chapter feeds into.
      </Callout>

      <h2>1. Set up the environment</h2>
      <p>
        Start with a clean Python environment. SAE work has a few
        opinionated dependencies and you want them pinned. The
        following is what I run on a fresh machine:
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`# CUDA 12.x box, Python 3.11
conda create -n sae python=3.11 -y
conda activate sae

# Core
pip install --upgrade pip
pip install "torch==2.4.*" --index-url https://download.pytorch.org/whl/cu121
pip install "transformers>=4.44" "datasets>=2.20" "accelerate>=0.33"

# Mech interp toolchain
pip install transformer-lens nnsight einops jaxtyping

# Tracking + utilities
pip install wandb tqdm safetensors zstandard pyarrow
pip install matplotlib seaborn umap-learn scikit-learn

# Optional but recommended: an existing SAE library to compare against
pip install sae-lens  # Joseph Bloom & co
`}</code>
      </pre>
      <p>
        A few notes on what I pick and why:
      </p>
      <ul>
        <li>
          <strong><code>transformer-lens</code></strong> gives you
          hooked forward passes &mdash; you can grab any
          activation tensor in the model by name (
          <code>blocks.6.hook_resid_post</code>,{" "}
          <code>blocks.6.mlp.hook_post</code>, etc.) without
          modifying model code. This is the path of least
          resistance for SAE training on GPT-2 / Pythia.
        </li>
        <li>
          <strong><code>nnsight</code></strong> is the alternative
          if you want to work with HuggingFace models out of the
          box (Gemma, Mistral, LLaMA-class) without waiting for
          someone to port them into TransformerLens.
        </li>
        <li>
          <strong><code>sae-lens</code></strong> is worth
          installing even if you write your own SAE: it ships
          pretrained dictionaries for many sites in GPT-2 and
          Gemma, which gives you a sanity-check baseline before
          you commit to a multi-week training run of your own.
        </li>
        <li>
          <strong>Storage matters more than you expect.</strong>{" "}
          Activation datasets dwarf the model. Cache to local NVMe
          if you have it, not a network share.
        </li>
      </ul>

      <h3>Repo layout I use</h3>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`sae-causal/
├── configs/
│   ├── gpt2-small_resid6.yaml
│   └── pythia-160m_mlp4.yaml
├── data/
│   ├── activations/            # the cache (huge, gitignored)
│   └── tokens/                 # tokenized corpus shards
├── src/
│   ├── activations/
│   │   ├── cache.py            # producer: model → tensors on disk
│   │   └── loader.py           # consumer: shuffled minibatches
│   ├── sae/
│   │   ├── model.py            # SAE / TopKSAE / JumpReLUSAE
│   │   ├── train.py            # the loop
│   │   └── eval.py             # recon / sparsity / downstream CE
│   ├── interp/
│   │   ├── label.py            # automated labeling via a frontier LLM
│   │   ├── patch.py            # atom-level activation patching
│   │   └── steer.py            # feature-steering experiments
│   └── viz/
│       └── neuronpedia_export.py
├── scripts/
│   ├── 01_cache_activations.py
│   ├── 02_train_sae.py
│   ├── 03_evaluate.py
│   ├── 04_label.py
│   └── 05_validate_causally.py
└── tests/
`}</code>
      </pre>
      <p>
        The numbered scripts in <code>scripts/</code> are the
        whole pipeline as a chain of single-purpose entry points.
        I cannot stress enough how much pain this saves: you
        will retrain the SAE many times and re-cache activations
        rarely, so making them separate scripts with on-disk
        artifacts between them is the right factoring.
      </p>

      <h2>2. Pick the model and the activation site</h2>
      <p>
        Two coupled decisions: <em>which model</em> and{" "}
        <em>which tensor inside that model</em>. Both have
        real consequences for what your SAE will see.
      </p>

      <h3>Model</h3>
      <ul>
        <li>
          <strong>GPT-2 small (124M).</strong> 12 layers,{" "}
          <M>{tex`d_{\mathrm{model}} = 768`}</M>, well-studied,
          works in TransformerLens out of the box, and the
          existing literature (Anthropic&apos;s original SAE
          paper, sae-lens release) gives you a baseline to
          benchmark against. This is what I&apos;d pick for a
          first project, full stop.
        </li>
        <li>
          <strong>Pythia 70M / 160M.</strong> Open training
          checkpoints, useful if you want to study how features
          emerge through training, not just at convergence.
        </li>
        <li>
          <strong>TinyStories-33M.</strong> Trained on a
          deliberately narrow distribution. Features are
          gratifyingly clean because the data is, which makes it
          a good debugging target for your pipeline but a bad
          stand-in for real-world LLM behavior.
        </li>
        <li>
          <strong>Gemma-2 2B / 9B.</strong> What you graduate to.
          DeepMind released Gemma Scope, a full suite of
          pretrained SAEs at every site, so this is the model to
          target if you want to build on existing dictionaries
          rather than train from scratch.
        </li>
      </ul>

      <h3>Activation site</h3>
      <p>
        The same model has many places you could attach an SAE.
        Each gives a meaningfully different dictionary.
      </p>
      <ul>
        <li>
          <strong>Residual stream post-layer{" "}
          <M>{tex`\ell`}</M>{" "}
          (<code>resid_post</code>).</strong> The
          most common choice. Represents &ldquo;everything the
          model has computed up to and including layer{" "}
          <M>{tex`\ell`}</M>.&rdquo; Mid-layer
          (<M>{tex`\ell = 6`}</M> in GPT-2 small) is usually the
          sweet spot for interpretable features.
        </li>
        <li>
          <strong>MLP post-activation
          (<code>mlp.hook_post</code>).</strong> The output of
          the MLP block before it&apos;s added back to the residual
          stream. Often produces the cleanest monosemantic atoms
          because MLPs are key-value memories and the SAE is
          decomposing exactly the values they emit.
        </li>
        <li>
          <strong>Attention output
          (<code>attn.hook_z</code> or{" "}
          <code>hook_attn_out</code>).</strong> The output of an
          attention layer. Empirically these dictionaries are
          messier (see the previous chapter&apos;s challenge for
          why &mdash; attention mixes value vectors from many
          positions, so the input distribution to the SAE is
          itself a mixture).
        </li>
        <li>
          <strong>MLP neurons themselves
          (<code>mlp.hook_pre</code> or <code>hook_post</code>{" "}
          dimension-wise).</strong> A degenerate case: here the
          input is already a single feature axis per
          coordinate, and the SAE is just &ldquo;decompose this
          polysemantic neuron into sub-features.&rdquo;
        </li>
      </ul>

      <Callout variant="mechinterp">
        For your first end-to-end run, I recommend:{" "}
        <strong>GPT-2 small,{" "}
        <code>blocks.6.hook_resid_post</code></strong>, dictionary
        width <M>{tex`m = 16 \cdot 768 = 12288`}</M>. That
        configuration has a known-good answer (sae-lens ships a
        pretrained dictionary you can compare against) and is
        small enough to train in a few hours on one consumer GPU.
      </Callout>

      <h2>3. Build the activation cache</h2>
      <p>
        This is the step everyone underestimates. The math of
        SAEs is trivial; the engineering of feeding them tokens
        is not. You want a pipeline that:
      </p>
      <ol>
        <li>Streams a tokenized corpus through the model.</li>
        <li>Hooks the chosen tensor and writes it to disk.</li>
        <li>
          Drops the model&apos;s irrelevant outputs to save memory.
        </li>
        <li>
          Shuffles activations <em>across documents</em>, not
          just within them, because gradient updates on
          activations from one document overfit the local
          context.
        </li>
        <li>
          Resumes cleanly if killed (you will kill it).
        </li>
      </ol>

      <p>
        Here is the skeleton I use. It writes shards of
        ~1M tokens each as <code>safetensors</code> files.
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`# src/activations/cache.py
import torch
from transformer_lens import HookedTransformer
from datasets import load_dataset
from safetensors.torch import save_file
from pathlib import Path

def cache_activations(
    model_name: str = "gpt2",
    hook_name: str = "blocks.6.hook_resid_post",
    dataset_name: str = "Skylion007/openwebtext",
    out_dir: str = "data/activations/gpt2_resid6",
    n_tokens: int = 20_000_000,
    ctx_len: int = 256,
    batch_size: int = 32,
    shard_size: int = 1_000_000,
    device: str = "cuda",
):
    model = HookedTransformer.from_pretrained(model_name, device=device)
    model.eval()

    ds = load_dataset(dataset_name, split="train", streaming=True)
    tokenizer = model.tokenizer

    out = Path(out_dir); out.mkdir(parents=True, exist_ok=True)
    shard_idx, buf, total = 0, [], 0

    def flush():
        nonlocal shard_idx, buf
        x = torch.cat(buf, dim=0).cpu().contiguous()
        save_file({"acts": x}, out / f"shard_{shard_idx:05d}.safetensors")
        shard_idx += 1
        buf.clear()

    text_iter = (ex["text"] for ex in ds)
    batch_texts = []

    with torch.no_grad():
        for txt in text_iter:
            batch_texts.append(txt)
            if len(batch_texts) < batch_size:
                continue
            tokens = tokenizer(
                batch_texts, return_tensors="pt",
                padding="max_length", truncation=True,
                max_length=ctx_len,
            ).input_ids.to(device)
            batch_texts = []

            _, cache = model.run_with_cache(tokens, names_filter=hook_name)
            acts = cache[hook_name]            # [B, T, d]
            mask = (tokens != tokenizer.pad_token_id).unsqueeze(-1)
            acts = acts[mask.expand_as(acts)].view(-1, acts.shape[-1])

            buf.append(acts)
            total += acts.shape[0]

            if sum(b.shape[0] for b in buf) >= shard_size:
                flush()
            if total >= n_tokens:
                break

    if buf:
        flush()
    print(f"Cached {total:,} activation vectors in {shard_idx} shards.")
`}</code>
      </pre>

      <p>
        Then a matching loader that shuffles across shards:
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`# src/activations/loader.py
import torch, random
from pathlib import Path
from safetensors.torch import load_file

class ShardedActivationLoader:
    def __init__(self, shard_dir, batch_size=4096, shuffle_buffer=8):
        self.paths = sorted(Path(shard_dir).glob("shard_*.safetensors"))
        self.batch_size = batch_size
        self.shuffle_buffer = shuffle_buffer

    def __iter__(self):
        paths = self.paths.copy()
        random.shuffle(paths)
        buf = []
        for p in paths:
            x = load_file(p)["acts"]
            buf.append(x)
            if len(buf) < self.shuffle_buffer:
                continue
            big = torch.cat(buf, dim=0)
            perm = torch.randperm(big.shape[0])
            big = big[perm]
            for i in range(0, big.shape[0], self.batch_size):
                chunk = big[i : i + self.batch_size]
                if chunk.shape[0] == self.batch_size:
                    yield chunk
            buf = []
`}</code>
      </pre>

      <p>
        A few practical numbers for a residual-stream SAE on
        GPT-2 small with <M>{tex`d = 768`}</M>:
      </p>
      <ul>
        <li>
          One activation vector is <M>{tex`768 \times 4 = 3072`}</M>{" "}
          bytes in fp32 (<M>{tex`1536`}</M> bytes in fp16).
        </li>
        <li>
          20M tokens × 3 KB ≈ <strong>60 GB</strong> of cache in
          fp32, or 30 GB in fp16. Use fp16 unless you have a
          specific reason not to.
        </li>
        <li>
          On an RTX 4090, caching 20M tokens of GPT-2 small at
          context length 256 takes about 30&ndash;45 minutes if
          you&apos;re I/O-bound, much less if the dataset is
          local.
        </li>
      </ul>

      <Callout variant="pitfall">
        <p>
          Two mistakes I&apos;ve made and you should not:
        </p>
        <ul>
          <li>
            <strong>Don&apos;t cache <em>every</em> layer</strong>{" "}
            at once unless you actually need them all. Cache one
            site per run. Disk and bandwidth dominate.
          </li>
          <li>
            <strong>Don&apos;t forget BOS / padding tokens
            exist.</strong> Their activations are
            distributionally weird and bias the SAE toward atoms
            that fire on &ldquo;sentence start&rdquo; instead of
            real features. Mask them out before saving.
          </li>
        </ul>
      </Callout>

      <h2>4. Normalize before you train</h2>
      <p>
        Raw activations have a non-zero mean and an L2 norm that
        scales with the layer index. If you feed them straight
        into an SAE, the dictionary spends capacity modeling the
        mean activation instead of feature directions, and the L1
        penalty interacts badly with whatever the natural scale
        of that site happens to be.
      </p>

      <p>
        The standard recipe: compute the mean{" "}
        <M>{tex`\mu \in \mathbb{R}^d`}</M> over the cache, and a
        per-site scaling constant{" "}
        <M>{tex`s = \mathbb{E}[\|x - \mu\|_2] / \sqrt{d}`}</M>{" "}
        (so that after normalization the average norm is{" "}
        <M>{tex`\sqrt{d}`}</M>, which is what unit-variance
        Gaussian noise gives you in <M>{tex`d`}</M> dimensions).
        Then train on:
      </p>
      <Block>{tex`\tilde{x} = (x - \mu) / s.`}</Block>
      <p>
        Save <M>{tex`\mu`}</M> and <M>{tex`s`}</M> alongside the
        SAE checkpoint. At inference time, when you patch the
        SAE&apos;s reconstruction back into the model, you have
        to un-normalize: <M>{tex`x \approx s\,\hat{\tilde{x}} + \mu`}</M>.
      </p>

      <h2>5. Choose an SAE architecture</h2>
      <p>
        Three variants are worth knowing in 2026. Each is a
        different bet on how to enforce sparsity.
      </p>

      <h3>Vanilla SAE (Anthropic 2023)</h3>
      <p>
        ReLU encoder, linear decoder, L1 penalty on the code.
        Simple, well-understood, and a good baseline.
      </p>
      <Block>{tex`f(x) = \mathrm{ReLU}(W_e (x - b_d) + b_e), \quad \hat{x} = W_d f(x) + b_d.`}</Block>
      <Block>{tex`\mathcal{L} = \|x - \hat{x}\|_2^2 + \lambda \sum_i |f_i(x)| \cdot \|W_{d,i}\|_2.`}</Block>
      <p>
        Note the L1 is weighted by the decoder column norm
        <M>{tex`\|W_{d,i}\|_2`}</M>; this is what removes the
        encoder/decoder rescaling degeneracy without forcing
        unit-norm decoder columns at every step.
      </p>

      <h3>Top-k SAE (OpenAI 2024)</h3>
      <p>
        Replace the L1 penalty with an explicit top-k constraint:
        keep only the <M>{tex`k`}</M> largest activations per
        token, zero the rest. No L1, no shrinkage bias on
        magnitudes, and an exact sparsity target you set.
      </p>
      <Block>{tex`f(x) = \mathrm{TopK}_k(W_e (x - b_d) + b_e), \quad \mathcal{L} = \|x - \hat{x}\|_2^2 + \alpha \mathcal{L}_{\mathrm{aux}}.`}</Block>
      <p>
        The auxiliary term <M>{tex`\mathcal{L}_{\mathrm{aux}}`}</M>{" "}
        is the &ldquo;dead-feature revival&rdquo; loss: a small
        secondary reconstruction using the top-k of <em>only</em>{" "}
        the currently-dead features, which gives them a gradient
        even when they&apos;re below the threshold.
      </p>

      <h3>JumpReLU / Gated SAE (DeepMind 2024)</h3>
      <p>
        Replaces ReLU with a step-wise activation that has a
        learnable threshold per atom, decoupling the
        decide-to-fire signal from the magnitude. Empirically the
        best reconstruction/sparsity Pareto frontier as of the
        last published benchmarks.
      </p>

      <p>
        For a first build, train both vanilla and top-k and
        compare. Code for both, with the encoder/decoder/bias
        layout I use:
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`# src/sae/model.py
import torch
import torch.nn as nn
import torch.nn.functional as F

class SAE(nn.Module):
    """Vanilla L1 SAE with decoder-norm-weighted sparsity penalty."""
    def __init__(self, d_in: int, d_sae: int):
        super().__init__()
        self.d_in, self.d_sae = d_in, d_sae

        # Decoder first so we can initialize encoder as its transpose.
        self.W_dec = nn.Parameter(torch.randn(d_sae, d_in) / d_in**0.5)
        self.b_dec = nn.Parameter(torch.zeros(d_in))
        self.W_enc = nn.Parameter(self.W_dec.detach().clone().T.contiguous())
        self.b_enc = nn.Parameter(torch.zeros(d_sae))

        with torch.no_grad():
            self.W_dec.data /= self.W_dec.data.norm(dim=-1, keepdim=True)

    def encode(self, x):
        return F.relu((x - self.b_dec) @ self.W_enc + self.b_enc)

    def decode(self, f):
        return f @ self.W_dec + self.b_dec

    def forward(self, x):
        f = self.encode(x)
        x_hat = self.decode(f)
        return x_hat, f

    @torch.no_grad()
    def normalize_decoder(self):
        norms = self.W_dec.data.norm(dim=-1, keepdim=True).clamp_min(1e-8)
        self.W_dec.data /= norms

    def l1_penalty(self, f):
        # Weight each atom's penalty by its decoder column norm.
        return (f.abs() * self.W_dec.norm(dim=-1)).sum(dim=-1).mean()


class TopKSAE(SAE):
    def __init__(self, d_in: int, d_sae: int, k: int):
        super().__init__(d_in, d_sae)
        self.k = k

    def encode(self, x):
        pre = (x - self.b_dec) @ self.W_enc + self.b_enc
        vals, idx = pre.topk(self.k, dim=-1)
        out = torch.zeros_like(pre)
        out.scatter_(-1, idx, F.relu(vals))
        return out
`}</code>
      </pre>

      <h2>6. The training loop</h2>
      <p>
        Now the loop itself. Most of the complexity is in the
        instrumentation, not the math.
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`# src/sae/train.py
import torch, wandb
from torch.optim import Adam

def train(sae, loader, *, steps, lr=3e-4, l1_coeff=1e-3,
          warmup=1000, log_every=50, device="cuda"):
    sae.to(device).train()
    opt = Adam(sae.parameters(), lr=lr, betas=(0.9, 0.999))

    # Track per-atom activation frequency for dead-feature detection.
    n_acts = torch.zeros(sae.d_sae, device=device)
    n_seen = 0

    it = iter(loader)
    for step in range(steps):
        try:
            x = next(it)
        except StopIteration:
            it = iter(loader); x = next(it)
        x = x.to(device, dtype=torch.float32)

        x_hat, f = sae(x)
        recon = (x_hat - x).pow(2).sum(-1).mean()
        sparsity = sae.l1_penalty(f) if hasattr(sae, "l1_penalty") else torch.tensor(0.0)

        coeff = l1_coeff * min(1.0, step / warmup)   # warm up the penalty
        loss = recon + coeff * sparsity

        opt.zero_grad(set_to_none=True)
        loss.backward()

        # Remove gradient component parallel to the decoder direction
        # (Anthropic trick: keeps unit-norm decoder columns stable).
        with torch.no_grad():
            g = sae.W_dec.grad
            w = sae.W_dec.data
            proj = (g * w).sum(-1, keepdim=True) * w
            g.sub_(proj)

        opt.step()
        sae.normalize_decoder()

        with torch.no_grad():
            n_acts += (f > 1e-6).float().sum(0)
            n_seen += x.shape[0]

        if step % log_every == 0:
            l0 = (f > 1e-6).float().sum(-1).mean().item()
            dead = ((n_acts / max(n_seen, 1)) < 1e-6).float().mean().item()
            print(f"step {step:>7}  recon {recon.item():.4f}  "
                  f"L1 {sparsity.item():.4f}  L0 {l0:.1f}  "
                  f"dead {100*dead:.1f}%")
            wandb.log(dict(step=step, recon=recon.item(),
                           l1=sparsity.item(), l0=l0, dead=dead,
                           coeff=coeff))

    return sae
`}</code>
      </pre>

      <p>
        Hyperparameters I default to on the GPT-2 small,{" "}
        <code>resid_post</code>, <M>{tex`m = 16d`}</M> setup:
      </p>
      <ul>
        <li>
          <strong>Optimizer.</strong> Adam, <M>{tex`\beta_1 = 0.9`}</M>,{" "}
          <M>{tex`\beta_2 = 0.999`}</M>. Not AdamW &mdash; weight
          decay fights the unit-norm decoder constraint.
        </li>
        <li>
          <strong>Learning rate.</strong> <M>{tex`3 \times 10^{-4}`}</M>,
          constant or with a linear warmup over the first 1000
          steps. Higher LRs make the dictionary collapse to a
          few atoms; lower ones train fine but slowly.
        </li>
        <li>
          <strong>Batch size.</strong> 4096 activation vectors.
          Larger if you have the memory; SAEs benefit from
          big batches because the loss is a sum of independent
          per-token terms.
        </li>
        <li>
          <strong>L1 coefficient.</strong> Start at{" "}
          <M>{tex`\lambda = 10^{-3}`}</M> and sweep over{" "}
          <M>{tex`\{10^{-4}, 3 \times 10^{-4}, 10^{-3}, 3 \times 10^{-3}, 10^{-2}\}`}</M>.
          Pick the one that gives average{" "}
          <M>{tex`\|f\|_0 \in [30, 100]`}</M> on validation.
        </li>
        <li>
          <strong>Steps.</strong> 100k&ndash;500k steps × 4k
          batch = 0.4&ndash;2.0B token-activations seen. Stop
          when validation loss plateaus.
        </li>
        <li>
          <strong>L1 warmup.</strong> Linearly ramp{" "}
          <M>{tex`\lambda`}</M> from 0 to its target over the
          first 1000&ndash;5000 steps. Without warmup, the
          sparsity penalty kills atoms before they&apos;ve
          learned anything to be sparse about.
        </li>
      </ul>

      <Figure caption="A toy 8-dim residual stream and 16-atom dictionary, the same widget from the previous chapter. Useful here as a sanity image of what the trained loop is supposed to produce: a sparse code (middle) that decodes to a near-perfect reconstruction (right). On a real model the code has thousands of atoms instead of 16; the geometry is identical.">
        <SAEDemo />
      </Figure>

      <h2>7. Dead features and how to revive them</h2>
      <p>
        The single most reliable failure mode of SAE training is
        a slow march of atoms into death &mdash; their activations
        drop to zero, their gradients drop to zero with them
        (because ReLU and L1 are both flat at zero), and they
        never recover. By the end of training you can have
        30&ndash;70% of your dictionary doing nothing.
      </p>
      <p>
        Three fixes, in increasing order of complexity:
      </p>
      <ol>
        <li>
          <strong>Neuron resampling (Anthropic).</strong> Every{" "}
          <M>{tex`N`}</M> steps (say 25k), find atoms that
          haven&apos;t fired in the last <M>{tex`M`}</M> tokens
          (say 5M). For each dead atom, re-initialize its
          encoder and decoder vectors using activations the SAE
          currently reconstructs poorly &mdash; specifically,
          sample a high-loss input <M>{tex`x`}</M> and set
          <M>{tex`W_{d,i} = (x - \hat{x}) / \|x - \hat{x}\|`}</M>.
          Reset the optimizer state for those parameters.
        </li>
        <li>
          <strong>Ghost gradients (Anthropic 2024).</strong> A
          softer fix: even when a dead atom isn&apos;t in the
          top-k (or has zero ReLU output), give it a small
          auxiliary gradient by including a parallel
          reconstruction using only the dead atoms&apos;{" "}
          pre-activation values. Pushes them toward firing
          without resetting them.
        </li>
        <li>
          <strong>Top-k with aux loss (OpenAI 2024).</strong>{" "}
          The top-k formulation makes the dead-atom problem
          much milder because every atom always has a
          meaningful pre-activation; combined with a small
          dead-only auxiliary reconstruction the dead fraction
          stays under a few percent without resampling.
        </li>
      </ol>

      <p>
        Here is the resampling routine:
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`@torch.no_grad()
def resample_dead(sae, opt, loader, n_acts, n_seen, threshold=1e-6,
                  n_samples=20_000, device="cuda"):
    freq = n_acts / max(n_seen, 1)
    dead = (freq < threshold).nonzero(as_tuple=True)[0]
    if len(dead) == 0:
        return 0

    # Sample activations weighted by current SAE loss.
    losses, samples = [], []
    for x in loader:
        x = x.to(device).float()
        x_hat, _ = sae(x)
        l = (x - x_hat).pow(2).sum(-1)
        samples.append(x); losses.append(l)
        if sum(s.shape[0] for s in samples) >= n_samples:
            break
    X = torch.cat(samples, 0); L = torch.cat(losses, 0)
    probs = (L / L.sum()).clamp_min(1e-12)
    idx = torch.multinomial(probs, len(dead), replacement=True)
    chosen = X[idx]                                    # [n_dead, d]

    norms = chosen.norm(dim=-1, keepdim=True).clamp_min(1e-8)
    new_dec = chosen / norms
    avg_alive_enc_norm = sae.W_enc.data[
        :, (freq >= threshold)].norm(dim=0).mean().clamp_min(1e-8)
    new_enc = (chosen / norms) * (0.2 * avg_alive_enc_norm)

    sae.W_dec.data[dead] = new_dec
    sae.W_enc.data[:, dead] = new_enc.T
    sae.b_enc.data[dead] = 0.0

    # Reset Adam state for those parameters.
    for p in (sae.W_dec, sae.W_enc, sae.b_enc):
        state = opt.state.get(p, {})
        if "exp_avg" in state:
            state["exp_avg"][..., dead] = 0
            state["exp_avg_sq"][..., dead] = 0
    return len(dead)
`}</code>
      </pre>

      <h2>8. Evaluation: four numbers you actually report</h2>
      <p>
        Training loss is necessary but not sufficient. A trained
        SAE has to be scored on a separate held-out activation
        cache, and you report (at minimum) the following four
        numbers:
      </p>
      <ol>
        <li>
          <strong>Normalized reconstruction loss.</strong>{" "}
          <M>{tex`1 - \mathbb{E}[\|x - \hat{x}\|^2] / \mathrm{Var}(x)`}</M>.
          Equivalently, the fraction of variance the SAE
          captures. 0.9+ is good for residual-stream SAEs at
          moderate sparsity; 0.95+ is excellent.
        </li>
        <li>
          <strong>Average <M>{tex`\|f(x)\|_0`}</M>.</strong> The
          number of features active per token. Order-of-tens is
          the regime where atoms are usually interpretable;
          hundreds means under-sparse, single-digit usually
          means under-fit.
        </li>
        <li>
          <strong>Dead-feature fraction.</strong> Atoms that
          fire on fewer than 1 in <M>{tex`10^6`}</M> tokens.
          Below 5% is good; above 30% means resampling
          isn&apos;t working.
        </li>
        <li>
          <strong>Downstream cross-entropy loss recovered.</strong>{" "}
          The killer metric. Run the host model on a held-out
          corpus, replace the activation at your site with the
          SAE&apos;s reconstruction, and measure how much the
          model&apos;s next-token cross-entropy degrades.
          Report:
          <Block>{tex`\mathrm{CE\text{-}recovered} = 1 - \frac{\mathrm{CE}_{\hat{x}} - \mathrm{CE}_{\mathrm{clean}}}{\mathrm{CE}_{\mathrm{zero}} - \mathrm{CE}_{\mathrm{clean}}}.`}</Block>
          1.0 means the SAE reconstructed everything the model
          needed; 0.0 means it&apos;s no better than zeroing the
          activation.
        </li>
      </ol>

      <p>
        Code for the downstream metric:
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`@torch.no_grad()
def ce_recovered(model, sae, tokens, hook_name, mu, s):
    sae.eval()
    def replace(act, hook):
        flat = act.reshape(-1, act.shape[-1])
        normed = (flat - mu) / s
        x_hat, _ = sae(normed)
        recon = x_hat * s + mu
        return recon.reshape_as(act)
    def zero(act, hook):
        return torch.zeros_like(act)

    ce_clean = model(tokens, return_type="loss")
    ce_recon = model.run_with_hooks(
        tokens, return_type="loss", fwd_hooks=[(hook_name, replace)])
    ce_zero  = model.run_with_hooks(
        tokens, return_type="loss", fwd_hooks=[(hook_name, zero)])
    return 1 - (ce_recon - ce_clean) / (ce_zero - ce_clean + 1e-8)
`}</code>
      </pre>

      <h2>9. Auditing the dictionary</h2>
      <p>
        Now you have a trained SAE. It probably has{" "}
        <M>{tex`m = 12{,}288`}</M> atoms. You will not read 12,288
        atoms by hand. The audit pipeline:
      </p>

      <h3>9a. Top-activating examples</h3>
      <p>
        For each atom <M>{tex`i`}</M>, scan a large evaluation
        corpus and keep the top <M>{tex`K`}</M>{" "}
        (say <M>{tex`K = 20`}</M>) token contexts where
        <M>{tex`f_i(x)`}</M> is highest. Show the activating
        token plus 10 tokens of left context. This is the raw
        material for every other audit step.
      </p>

      <h3>9b. Logit lens through the decoder</h3>
      <p>
        Take the <M>{tex`i`}</M>-th decoder row{" "}
        <M>{tex`W_{d,i}`}</M>, multiply by the unembedding{" "}
        <M>{tex`W_U`}</M>, and read off the top-promoted tokens.
        Atoms that fire on &ldquo;dog breeds&rdquo; should
        promote tokens like <code>poodle</code>, <code>terrier</code>.
      </p>

      <h3>9c. Automated labels</h3>
      <p>
        This is the part of my thesis. The protocol: build a
        prompt that gives a frontier LLM (Claude, GPT-4-class)
        the top-20 activating contexts for atom{" "}
        <M>{tex`i`}</M>, optionally the decoder-logit-lens top
        tokens, and asks for a short label plus a one-sentence
        description. Score consistency by sampling multiple
        labels and checking semantic agreement.
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`# src/interp/label.py (sketch)
LABELLER_PROMPT = """You are a mechanistic interpretability researcher.
Below are the 20 highest-activating contexts for a single feature in
a sparse autoencoder trained on the residual stream of GPT-2 small.
The token where the feature fired is marked <<like_this>>.

The feature also promotes these output tokens when active:
{top_logits}

Top activating contexts (most active first):
{contexts}

Produce:
1. A short label (<= 6 words).
2. A one-sentence description of when the feature fires.
3. A confidence score from 1 to 5.
4. Two predictions: what *should* and what *should not* activate
   this feature, that a follow-up causal test could check.
"""

def label_feature(client, contexts, top_logits):
    msg = LABELLER_PROMPT.format(
        contexts="\\n\\n".join(contexts),
        top_logits=", ".join(top_logits),
    )
    out = client.messages.create(
        model="claude-3-7-sonnet-latest",
        max_tokens=400,
        messages=[{"role": "user", "content": msg}],
    )
    return parse_labeller_output(out.content[0].text)
`}</code>
      </pre>

      <p>
        This is roughly the Bills et al. 2023 protocol applied to
        SAE latents instead of raw neurons. The interesting part
        &mdash; the part I&apos;m proposing to add &mdash; is
        what you do with the &ldquo;predictions&rdquo; the
        labeller produces.
      </p>

      <h2>10. Causal validation: the part the field is still
      figuring out</h2>
      <p>
        A label is a hypothesis. The whole point of mech interp
        is that hypotheses about model internals can be checked
        causally. Two tools, both from the activation-patching
        chapter, transposed to atom-level:
      </p>

      <h3>10a. Atom-level activation patching</h3>
      <p>
        Setup: a clean prompt and a corrupted prompt that differ
        in the property your candidate atom is supposed to
        encode. (For an &ldquo;Eiffel Tower&rdquo; atom: clean
        = &ldquo;The Eiffel Tower is in&rdquo;, corrupted =
        &ldquo;The Statue of Liberty is in&rdquo;.) Run the
        model on both. For the corrupted run, intercept the
        residual stream at your SAE&apos;s site, encode it
        through the SAE, replace atom <M>{tex`i`}</M>&apos;s
        activation with its clean value, decode, and let the
        model finish. If the corrupted prompt now predicts
        &ldquo;Paris&rdquo; with appreciable probability,
        atom <M>{tex`i`}</M> causally mediates the
        Eiffel-Tower-→-Paris computation.
      </p>
      <pre className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100 dark:border-slate-800">
        <code>{`@torch.no_grad()
def patch_atom(model, sae, hook_name, mu, s, clean_tokens,
               corrupted_tokens, atom_idx, position):
    # Cache the SAE code on the clean run.
    _, clean_cache = model.run_with_cache(
        clean_tokens, names_filter=hook_name)
    clean_act = (clean_cache[hook_name] - mu) / s
    _, clean_f = sae(clean_act.reshape(-1, clean_act.shape[-1]))
    clean_f = clean_f.reshape(*clean_act.shape[:-1], -1)

    def hook(act, h):
        flat = act.reshape(-1, act.shape[-1])
        normed = (flat - mu) / s
        _, f = sae(normed)
        f = f.reshape(*act.shape[:-1], -1)
        f[:, position, atom_idx] = clean_f[:, position, atom_idx]
        recon = sae.decode(f.reshape(-1, f.shape[-1]))
        return (recon * s + mu).reshape_as(act)

    logits = model.run_with_hooks(
        corrupted_tokens, return_type="logits",
        fwd_hooks=[(hook_name, hook)])
    return logits
`}</code>
      </pre>

      <h3>10b. Feature steering</h3>
      <p>
        The complementary experiment. Take a totally unrelated
        prompt. Force atom <M>{tex`i`}</M> to fire (or fire
        harder than usual) and sample from the model. If the
        atom is genuinely the &ldquo;Eiffel Tower&rdquo;
        feature, Eiffel-Tower-flavored text should appear in the
        completions. (This is exactly what Anthropic&apos;s
        &ldquo;Golden Gate Claude&rdquo; demo did.)
      </p>

      <h3>10c. The faithfulness score</h3>
      <p>
        For each labelled atom, my thesis proposes computing a
        scalar <em>faithfulness score</em> that combines the
        patching recovery and the steering effect into one
        number. Conceptually:
      </p>
      <Block>{tex`\mathrm{Faith}(i) = \alpha \cdot R_{\mathrm{patch}}(i) + (1 - \alpha) \cdot E_{\mathrm{steer}}(i),`}</Block>
      <p>
        where <M>{tex`R_{\mathrm{patch}}(i)`}</M> is the
        clean-→-corrupted recovery fraction when you patch only
        atom <M>{tex`i`}</M>, and <M>{tex`E_{\mathrm{steer}}(i)`}</M>{" "}
        measures the change in model output along the
        label-predicted direction when atom <M>{tex`i`}</M> is
        steered. The labeller&apos;s predictions about what
        should and shouldn&apos;t activate the feature are what
        define those measurements.
      </p>

      <Callout variant="pitfall">
        <p>
          A clean atom passes both tests. The interesting cases
          are when the two diverge:
        </p>
        <ul>
          <li>
            <strong>High patching, low steering.</strong> The
            atom is a downstream <em>consequence</em> of the
            real feature, not the feature itself. Patching it
            into a corrupted run is informative because it
            carries the signal; steering it on an unrelated
            prompt does nothing because it isn&apos;t what the
            model is computing from.
          </li>
          <li>
            <strong>Low patching, high steering.</strong> The
            atom is a sufficient direction in activation space
            but the model isn&apos;t using it as its primary
            encoding for that feature on the test inputs. Your
            label is too broad.
          </li>
        </ul>
        <p>
          A real faithfulness benchmark has to handle both.
          Reporting only one is the &ldquo;just-so story&rdquo;
          pattern the field is trying to leave behind.
        </p>
      </Callout>

      <h2>11. A first end-to-end run, with timings</h2>
      <p>
        The complete pipeline on a single RTX 4090, GPT-2 small,
        residual stream after layer 6, dictionary width{" "}
        <M>{tex`m = 12288`}</M>:
      </p>
      <ul>
        <li>
          <strong>Caching 20M token activations:</strong> ~45 min
          (~30 GB in fp16 on local NVMe).
        </li>
        <li>
          <strong>Training (200k steps, batch 4096):</strong>{" "}
          ~3&ndash;4 hours. WandB will show recon dropping,
          L0 stabilizing in the 30&ndash;80 range, dead fraction
          ideally under 10%.
        </li>
        <li>
          <strong>Evaluation:</strong> 5 minutes for the four
          headline numbers on a fresh 1M-token holdout.
        </li>
        <li>
          <strong>Top-activating contexts + auto-labels:</strong>{" "}
          ~30 min of model forward passes plus ~$15 of frontier
          LLM API calls for all 12,288 atoms at 20 contexts
          each, depending on the labelling model.
        </li>
        <li>
          <strong>Per-atom causal validation:</strong> seconds
          per atom for one prompt pair; budget hours if you want
          to validate hundreds of atoms across diverse tasks.
        </li>
      </ul>
      <p>
        That&apos;s a one-week project for a first-time builder
        and a one-day project once you have the scaffolding.
      </p>

      <h2>12. Common failure modes (a field guide)</h2>
      <ul>
        <li>
          <strong>L0 collapses to ~1.</strong> Penalty too high,
          or LR too high early in training. Lower{" "}
          <M>{tex`\lambda`}</M>, add a warmup, or switch to
          top-k where L0 is a hard constraint.
        </li>
        <li>
          <strong>L0 stays in the hundreds.</strong> Penalty too
          low. The SAE is essentially the identity in disguise
          and atoms aren&apos;t meaningfully sparse.
        </li>
        <li>
          <strong>Recon excellent, downstream CE-recovered
          poor.</strong> The SAE is reconstructing the
          activation in L2 but missing structure the model
          actually uses. Often a sign of low-norm feature
          directions that L2 doesn&apos;t penalize but the model
          reads from.
        </li>
        <li>
          <strong>Many atoms fire only on BOS / padding.</strong>{" "}
          You didn&apos;t mask special tokens in the cache.
          Re-cache.
        </li>
        <li>
          <strong>Auto-labeller produces nonsense for a
          specific atom but the atom looks meaningful by
          eye.</strong> You&apos;re likely showing the labeller
          contexts that don&apos;t isolate what the atom keys
          on. Try showing fewer-token windows, or include the
          token <em>after</em> the activating one as well.
        </li>
        <li>
          <strong>Steering does nothing.</strong> Steering on
          residual-stream atoms often requires multi-token
          interventions (apply the boost across all positions or
          just from the prompt start) and higher boost
          magnitudes than you&apos;d guess (5&ndash;20× the
          atom&apos;s typical activation). Don&apos;t conclude
          &ldquo;atom is dead&rdquo; from a single steering
          attempt at strength 1.
        </li>
      </ul>

      <h2>13. Personal: why I&apos;m building this, and what
      goes after it</h2>
      <p>
        This chapter is also a research notebook. I&apos;m
        Haroun Guessous, an M.Sc. candidate in Computer Science
        at Université de Montréal / MILA, and the project I&apos;m
        proposing for my thesis is:{" "}
        <strong>Automated Causal Validation of Sparse Autoencoder
        Features in Transformer Language Models</strong>. The
        previous twelve sections describe the easier half of
        that work &mdash; getting an SAE trained and labelled.
        The thesis itself is about the half people skip.
      </p>

      <h3>The problem I&apos;m trying to solve</h3>
      <p>
        Most published SAE features are labelled by inspection:
        a researcher looks at the top-20 activating contexts,
        writes down what they have in common, and calls it the
        feature&apos;s name. That label is then used to make
        claims about how the model works &mdash; &ldquo;the
        French-language feature&rdquo;, &ldquo;the deception
        feature&rdquo; &mdash; without anyone checking whether
        the atom causally mediates the behavior in the way the
        name implies. The result is a literature of
        plausible-sounding interpretability that&apos;s hard
        to falsify. Mechanistic interpretability gets called a
        science of just-so stories, fairly, when this happens.
      </p>

      <h3>The proposal, in three phases</h3>
      <ol>
        <li>
          <strong>Phase 1 &mdash; Automated labelling pipeline.</strong>{" "}
          Build an end-to-end system that, given any trained SAE
          on a target model (Gemma-2 2B or Mistral 7B for the
          scale work, GPT-2 small for development), produces
          human-readable labels for every latent. Extends Bills
          et al. 2023 from raw neurons to SAE atoms and adds
          confidence scoring and label-consistency metrics.
          That&apos;s the section 9c work above, productionized.
        </li>
        <li>
          <strong>Phase 2 &mdash; Causal validation framework.</strong>{" "}
          For each labelled atom, automatically generate the
          counterfactual prompt pairs the label implies, run
          activation patching and steering interventions, and
          produce a <em>faithfulness score</em> &mdash; a
          quantitative measure of how well the label predicts
          causal behavior. This is the section 10 work, but
          fully automated and benchmarked across thousands of
          features.
        </li>
        <li>
          <strong>Phase 3 &mdash; Benchmark and evaluation.</strong>{" "}
          The hard one. There&apos;s no ground-truth dataset of
          &ldquo;SAE features with known causal roles&rdquo; in
          the field right now. I&apos;m constructing one by
          mining circuit-level work (Indirect Object
          Identification, the &ldquo;greater-than&rdquo; circuit,
          induction heads, the Python-code circuit work) for
          features that are already pinned down causally, then
          using them as a held-out test for the automated
          pipeline. Headline metrics: label accuracy against
          ground truth, faithfulness-score calibration, and
          scalability across model sizes.
        </li>
      </ol>

      <h3>Why this, and why now</h3>
      <p>
        Mechanistic interpretability was named one of MIT
        Technology Review&apos;s 10 Breakthrough Technologies for
        2026. The ICML 2026 Mech Interp workshop received
        2.6× more submissions than the prior year. The field
        is at an inflection point: SAE training has been
        commodified, dictionaries are published openly (Gemma
        Scope, Neuronpedia), and the bottleneck for actually
        using them in safety and capability research has
        shifted from &ldquo;can we find features&rdquo; to
        &ldquo;can we trust the features we&apos;ve found.&rdquo;
        That&apos;s a methodological gap, not a compute one,
        and it&apos;s the gap I want to close.
      </p>

      <h3>What I bring</h3>
      <ul>
        <li>
          <strong>Production ML systems.</strong> I&apos;ve
          shipped LLM inference, RAG pipelines, and agentic
          infrastructure at scale &mdash; the engineering of
          running thousands of automated experiments against
          frontier-model APIs is not where this project will get
          stuck.
        </li>
        <li>
          <strong>Hardware and architecture.</strong> I built an
          FPGA-based transformer implementation under Prof. Brett
          H. Meyer at McGill. I have a hands-on understanding of
          what attention and feed-forward layers compute at the
          hardware level, which matters when you&apos;re
          reasoning about what an activation means before it
          enters the next op.
        </li>
        <li>
          <strong>Quantitative rigor.</strong> Quant research at
          CDPQ, with a lot of time spent on factor decomposition
          and attribution modelling. The shape of those problems
          &mdash; given a set of factors, how much of the
          variance does each one causally explain &mdash; is
          remarkably close to what a faithfulness score is doing
          for SAE features.
        </li>
        <li>
          <strong>Toolchain.</strong> JAX, PyTorch,
          TransformerLens, nnsight, HuggingFace. The whole
          stack used in modern mech interp work.
        </li>
      </ul>

      <h3>The deliverables I&apos;m targeting</h3>
      <ul>
        <li>
          An open-source automated pipeline for SAE feature
          labelling and causal validation, integrated with
          TransformerLens, nnsight, and Neuronpedia so other
          researchers can use it on their own SAEs without
          reimplementing.
        </li>
        <li>
          A benchmark dataset for interpretability faithfulness,
          with the &ldquo;known-causal-role&rdquo; features I
          mentioned above as the test set.
        </li>
        <li>
          Empirical findings on how well current SAE features
          actually support the causal claims commonly made of
          them &mdash; and where they fail.
        </li>
        <li>
          One or two workshop or conference papers targeting
          the NeurIPS 2026 Mech Interp Workshop or ICLR 2027.
        </li>
      </ul>

      <h3>How this chapter feeds into that</h3>
      <p>
        Everything in sections 1&ndash;8 is the substrate: you
        need to be able to train an SAE before any of the
        validation work is meaningful. Sections 9&ndash;10 are
        the parts I&apos;m turning into automated, benchmarked
        tools. Section 12 is the failure-mode list I keep adding
        to. If you&apos;re reading this and you&apos;re working
        on something adjacent &mdash; a benchmark, a faithfulness
        metric, an SAE variant, a labelling pipeline &mdash;
        please get in touch. The faster the community agrees on
        what a trustworthy SAE feature looks like, the faster
        the rest of mech interp gets to stand on something
        solid.
      </p>

      <Callout variant="mechinterp">
        <p>
          A minimum-viable validated SAE feature, the way I&apos;m
          defining it in this work:
        </p>
        <ol>
          <li>
            A label produced by an auto-labeller with high
            inter-sample consistency (say, &ge; 0.8 cosine
            similarity between label embeddings across 5
            independent samples).
          </li>
          <li>
            Activation-patching recovery <M>{tex`\geq 0.5`}</M>{" "}
            on a clean/corrupted pair the labeller predicted
            would isolate the feature.
          </li>
          <li>
            Steering effect along the label-predicted output
            dimension that is significant against a
            random-direction-steering baseline.
          </li>
          <li>
            All three documented and reproducible by re-running
            <code>05_validate_causally.py</code> on the
            saved SAE checkpoint + benchmark.
          </li>
        </ol>
        <p>
          That&apos;s a much harder bar than &ldquo;the top-20
          contexts look like the label,&rdquo; and it&apos;s the
          bar I&apos;d like to see the field converge on.
        </p>
      </Callout>

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a)</strong> You train two SAEs on the
              same activation cache: one with{" "}
              <M>{tex`\lambda = 10^{-4}`}</M> (average{" "}
              <M>{tex`\|f\|_0 \approx 200`}</M>) and one with{" "}
              <M>{tex`\lambda = 10^{-2}`}</M> (average{" "}
              <M>{tex`\|f\|_0 \approx 8`}</M>). The
              high-sparsity model has slightly lower
              reconstruction quality but its CE-recovered metric
              on the host model is <em>higher</em>. Give a
              hypothesis for why, and design a single
              experiment that would test it.
            </p>
            <p>
              <strong>(b)</strong> Define an &ldquo;atom-level
              path patch&rdquo;: an experiment that measures
              how much of the effect of atom{" "}
              <M>{tex`i`}</M> at the SAE&apos;s site flows
              specifically through a downstream component{" "}
              <M>{tex`C`}</M> (an attention head or MLP), as
              opposed to flowing around it. Be specific about
              the cached activations, the patched activations,
              and the recovery measurement.
            </p>
            <p>
              <strong>(c)</strong> Suppose your auto-labeller
              labels atom 4823 as &ldquo;medical-context
              feature&rdquo; with confidence 5/5, but your
              causal-validation pipeline assigns it
              faithfulness 0.15 (essentially noise). Walk
              through the diagnostic procedure you&apos;d run
              to figure out whether the failure is in the
              label, in the validation tests, or in the atom
              itself. What are at least three distinct things
              that could be going wrong, and how would you
              distinguish them?
            </p>
          </>
        }
        hint={
          <>
            For (a): think about what the SAE is forced to
            commit to when sparsity is tight, and how
            &ldquo;reconstruction quality&rdquo; can be a poor
            proxy for &ldquo;information the host model uses.&rdquo;
            For (b): you want to intervene at the SAE site on a
            corrupted run, but only let the patched signal
            propagate via the residual stream into{" "}
            <M>{tex`C`}</M>&apos;s input &mdash; corrupting
            everything else. For (c): rule out (i) the label,
            (ii) the counterfactual prompt pair, and (iii) the
            atom&apos;s actual role one at a time, each with a
            distinct intervention.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong> The low-<M>{tex`\lambda`}</M>{" "}
              SAE wins on L2 reconstruction by spending capacity
              on low-norm, high-frequency components of the
              activation that the host model doesn&apos;t use.
              The high-<M>{tex`\lambda`}</M> SAE is forced to
              throw those components away and use its tight
              feature budget on directions that actually
              participate in the next layer&apos;s computation
              &mdash; which is what CE-recovered measures. The
              experiment: project both SAEs&apos; reconstruction
              residuals (<M>{tex`x - \hat{x}`}</M>) onto the
              right-singular vectors of the next layer&apos;s
              input matrix. The low-<M>{tex`\lambda`}</M>{" "}
              SAE&apos;s residual should sit mostly in
              high-singular-value directions (the model uses
              them, the SAE missed them); the
              high-<M>{tex`\lambda`}</M> SAE&apos;s residual
              should sit in low-singular-value directions (the
              model ignores them anyway).
            </p>
            <p>
              <strong>(b)</strong> Cache the clean and
              corrupted activations everywhere. On a fresh
              corrupted run: at the SAE site, encode, replace
              atom <M>{tex`i`}</M>&apos;s activation with its
              clean value, decode. Continue forward, but at
              every component between the SAE site and{" "}
              <M>{tex`C`}</M>, overwrite the activation with
              its <em>corrupted</em> cached value &mdash;
              effectively forcing the patched signal to travel
              only along the residual stream until it reaches{" "}
              <M>{tex`C`}</M>&apos;s input. Let{" "}
              <M>{tex`C`}</M> compute on the partly-patched
              residual, then continue normally. Measure the
              recovery fraction on the downstream behavior.
              Compare to plain atom-patching: the ratio
              <M>{tex`R_{\mathrm{via\,}C} / R_{\mathrm{total}}`}</M>{" "}
              is the share of atom <M>{tex`i`}</M>&apos;s
              effect that flows through component{" "}
              <M>{tex`C`}</M>.
            </p>
            <p>
              <strong>(c)</strong> Three distinguishable
              failure modes:
            </p>
            <ul>
              <li>
                <em>The label is wrong.</em> Re-sample the
                top-activating contexts across the corpus
                (don&apos;t just trust the cached top-20) and
                manually inspect 50. If the manual reading
                produces a different label, the issue is the
                labeller&apos;s prompt or the context window.
                Re-run with longer contexts, the token after
                the activating one included, or a different
                labelling model.
              </li>
              <li>
                <em>The counterfactual pair is wrong.</em> The
                pipeline generated a clean/corrupted pair that
                doesn&apos;t actually isolate the labelled
                concept &mdash; e.g. both prompts equally
                imply &ldquo;medical context&rdquo;, so the
                patch tests nothing. Diagnostic: hand-write
                three new prompt pairs that you&apos;re sure
                differ only in medical-vs-not framing, re-run
                the patch. If recovery jumps, the auto-generated
                counterfactuals are the issue.
              </li>
              <li>
                <em>The atom isn&apos;t the medical feature.</em>{" "}
                It might be a correlated detector &mdash;
                e.g. fires on Latin-derived medical vocabulary
                but the model&apos;s &ldquo;medical&rdquo;
                computation actually happens in a different
                atom or a non-SAE direction. Diagnostic:
                steering. Force atom 4823 to fire at high
                magnitude on diverse, non-medical prompts and
                sample continuations. If medical content does
                appear, the atom is sufficient but the patching
                counterfactual missed the right contrast. If
                nothing medical appears under aggressive
                steering, the label is genuinely wrong about
                the atom&apos;s causal role and you should
                downgrade the label, not the validation
                pipeline.
              </li>
            </ul>
            <p>
              The point of running all three is that a single
              null result is uninformative. A faithfulness
              pipeline that doesn&apos;t distinguish
              &ldquo;label is wrong&rdquo; from &ldquo;test is
              wrong&rdquo; from &ldquo;atom is wrong&rdquo;
              gives the same number in three very different
              worlds, and is the whole reason this work is
              needed.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
