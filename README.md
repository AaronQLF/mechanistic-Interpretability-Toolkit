# Mech Interp Toolkit

An interactive textbook for the math behind mechanistic interpretability — starting with linear algebra. Built with Next.js, TailwindCSS, KaTeX and a small library of hand-rolled SVG widgets.

## What's shipped

- **Linear Algebra** module (11 chapters + capstone), every chapter pairs prose with a draggable, scrubbable widget:
  - Vectors → drag the arrowhead, see components live
  - Vector operations → parallelogram addition, scalar slider
  - Linear combinations / span / basis → two draggable vectors with shaded span
  - Matrices as transformations → 2×2 entries warp the grid live
  - Matrix multiplication → compose two transforms in either order
  - Determinants & rank → unit-square area, sign for orientation
  - Inverse & solving systems → two-line solver
  - Dot product & projections → angle, cosine, shadow
  - Change of basis → same vector, dual coordinate readouts
  - Eigenvalues & eigenvectors → drag a 2×2, highlighted eigenlines
  - SVD → step through rotate / stretch / rotate, low-rank slider
  - Capstone → residual stream, logit lens, OV/QK circuits, superposition toy
- **Probability** module (9 chapters + capstone), same shape as LA:
  - Sample spaces & events → two-dice grid, click outcomes to define events
  - Random variables & distributions → draggable categorical PMF
  - Joint, marginal & conditional → 4×4 heatmap with hover-to-slice conditionals
  - Bayes' rule → prior × likelihood → posterior, with the rare-disease classic
  - Expectation, variance & LLN → live E/Var, running sample-mean trace with √n band
  - Softmax → drag logits, sweep temperature
  - Entropy → distribution + entropy meter in bits, perplexity readout
  - Cross-entropy & KL divergence → two side-by-side distributions, live H(P,Q) and both KLs
  - Sampling: greedy / temperature / top-k / top-p → see what each strategy keeps
  - Capstone → toy logit lens with ablation and KL(clean ‖ ablated)
- **Calculus** module (8 chapters + capstone), same shape:
  - Limits & continuity → slide h → 0 across removable holes, sinc, and jumps
  - The derivative → drag x₀, watch the tangent follow on x², x³, sin, σ, ReLU
  - The chain rule → three-panel composition with live g ′(x), h ′(y), and their product
  - Partial derivatives & the gradient → 2D heatmap with gradient arrows, draggable probe
  - Directional derivatives → drag the direction, see ∇F · u swing between ±‖∇F‖
  - The Jacobian → smooth 2D map applied to a square; local linearisation vs true image
  - Gradient descent → animated trajectory on bowl, ellipse, saddle, and Rosenbrock banana
  - Backpropagation → small computation graph with forward values and backward gradients on every edge
  - Capstone → integrated gradients with path samples and completeness check
- **Neural Networks** module (6 chapters + capstone), same shape:
  - The neuron → weights, bias, activation, decision boundary on the BackpropToy
  - Linear layers → row vs column view, MatrixTransform2D for the geometry
  - Nonlinearities → ReLU / GELU / sigmoid / tanh on shared axes, with toggles
  - Embeddings & one-hot → click a token to see the row lookup happen
  - The MLP → 4 → 6 → 4 block with editable input, ReLU mask visible in real time
  - LayerNorm & residual connections → live mean/std with γ, β knobs
  - Capstone → linear-representation hypothesis, superposition, MLPs as KV memory
- Every chapter ends with a **hard challenge**: a multi-part open-ended problem with hint and toggleable solution, written in the voice of graduate exercises rather than warm-up questions.
- **Curriculum map** on the landing page with stub pages for the upcoming Transformers and Mech-interp Circuits modules.
- Light + dark mode, persistent chapter progress dots (localStorage), responsive layout.

## Tech

- Next.js 14 (App Router) + TypeScript
- TailwindCSS with a small token layer (CSS variables) for theming
- KaTeX (via `react-katex`) for math typesetting
- Framer Motion for chapter and step transitions
- Pure SVG (no canvas, no WebGL) for every interactive figure — small, accessible, hackable
- `lib/linalg.ts` ships its own 2×2 inverse / eigendecomposition / SVD (no numerical-LA dependency)

## Running locally

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

## Quant Developer Roadmap (shadow track)

A second curriculum lives at **`/quant`**: interview-oriented modules for quantitative developers (C++, DSA, concurrency, low-latency systems, OS/networking, probability, statistics, brainteasers, stochastic calculus, finance, trading-system design, Python, SQL, and mock interviews). It uses the same layout primitives as the mech-interp chapters, a scoped emerald accent (`.theme-quant`), and is only linked from the site footer — not from the main header.

- **Curriculum data:** [`lib/quant.ts`](lib/quant.ts)
- **Chapter pages:** generated under `components/quant/chapters/` from [`scripts/gen-quant-chapters.ts`](scripts/gen-quant-chapters.ts) (registry: `components/quant/chapters/registry.ts`). After editing the generator, run `npm run gen:quant`.
- **Widgets:** [`components/viz/quant/`](components/viz/quant/)

## Building for production

```bash
npm run build
npm start
```

The site is fully static — deploy to Vercel, Cloudflare Pages, Netlify, or any static host.

## Project layout

```
app/                          # routes
  page.tsx                    # landing
  quant/                      # shadow quant roadmap (/quant, /quant/[module], …)
  linear-algebra/             # LA module + 12 chapter pages
  probability/                # Probability module + 10 chapter pages
  calculus/                   # Calculus module + 9 chapter pages
  neural-networks/            # NN module + 7 chapter pages
  transformers/, circuits/    # stubs
components/
  ui/                         # header, footer, sidebar, theme toggle, curriculum map
  content/                    # ChapterShell, Section, Callout, Quiz, Exercise, Figure
  math/                       # <M> / <Block> KaTeX wrappers
  viz/                        # interactive SVG widgets (one per concept)
lib/
  quant.ts                    # quant roadmap curriculum + static route list
  linalg.ts                   # vec/mat math (pure, no deps)
  prob.ts                     # softmax / entropy / KL / sampling helpers
  calc.ts                     # numeric derivatives + named function library
  geometry.ts                 # world↔screen transforms
  topics.ts                   # mech-interp curriculum metadata
```

## Adding a new chapter

1. Add a `Chapter` entry to `lib/topics.ts` under the appropriate module.
2. Create `app/<module>/<slug>/page.tsx` and wrap your content in `<ChapterShell>`.
3. Build any custom widget under `components/viz/` using the shared `<Stage>` / `<Grid>` / `<Axes>` / `<Arrow>` / `<DragPoint>` primitives.
