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
- **Curriculum map** on the landing page with stub pages for the upcoming Probability, Calculus, Neural Networks, Transformers, and Mech-interp Circuits modules.
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
  linear-algebra/             # LA module + 12 chapter pages
  probability/, calculus/, ...# stubs
components/
  ui/                         # header, footer, sidebar, theme toggle, curriculum map
  content/                    # ChapterShell, Section, Callout, Quiz, Exercise, Figure
  math/                       # <M> / <Block> KaTeX wrappers
  viz/                        # interactive SVG widgets (one per concept)
lib/
  linalg.ts                   # vec/mat math (pure, no deps)
  geometry.ts                 # world↔screen transforms
  topics.ts                   # curriculum metadata
```

## Adding a new chapter

1. Add a `Chapter` entry to `lib/topics.ts` under the appropriate module.
2. Create `app/<module>/<slug>/page.tsx` and wrap your content in `<ChapterShell>`.
3. Build any custom widget under `components/viz/` using the shared `<Stage>` / `<Grid>` / `<Axes>` / `<Arrow>` / `<DragPoint>` primitives.
