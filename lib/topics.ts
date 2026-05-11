export type Status = "available" | "soon";

export type Chapter = {
  slug: string;
  title: string;
  blurb: string;
};

export type Module = {
  slug: string;
  title: string;
  status: Status;
  blurb: string;
  chapters?: Chapter[];
};

export const linearAlgebraChapters: Chapter[] = [
  {
    slug: "vectors",
    title: "Vectors",
    blurb:
      "Three ways to think about a vector: arrow, list, and point — and why the arrow view will save you later.",
  },
  {
    slug: "vector-operations",
    title: "Vector operations",
    blurb:
      "Adding, scaling, and measuring length. Where these live in a forward pass.",
  },
  {
    slug: "linear-combinations-span-basis",
    title: "Linear combinations, span & basis",
    blurb:
      "Which directions you can reach by mixing vectors — and why a basis is just a coordinate system.",
  },
  {
    slug: "matrices-as-transformations",
    title: "Matrices as transformations",
    blurb:
      "A matrix is a function on space. Drag its entries and watch the world bend.",
  },
  {
    slug: "matrix-multiplication",
    title: "Matrix multiplication",
    blurb:
      "Composition of transformations — and the reason it isn't commutative.",
  },
  {
    slug: "determinants-rank",
    title: "Determinants & rank",
    blurb:
      "How much a transformation stretches space, and how much information it crushes.",
  },
  {
    slug: "inverse-and-systems",
    title: "Inverse & solving systems",
    blurb:
      "Undoing a transformation, and what it means when you can't.",
  },
  {
    slug: "dot-product-and-projections",
    title: "Dot product & projections",
    blurb:
      "Similarity, angle, and shadows — the operation neural networks lean on most.",
  },
  {
    slug: "change-of-basis",
    title: "Change of basis",
    blurb:
      "Same vector, different coordinates. The lens through which features become readable.",
  },
  {
    slug: "eigen",
    title: "Eigenvalues & eigenvectors",
    blurb:
      "The directions a transformation leaves alone — and why they reveal structure.",
  },
  {
    slug: "svd",
    title: "Singular Value Decomposition",
    blurb:
      "Every linear map = rotate, stretch, rotate. The Swiss Army knife of mech interp.",
  },
  {
    slug: "mech-interp-bridge",
    title: "Capstone: the mech-interp bridge",
    blurb:
      "Residual streams, logit lens, superposition, and low-rank circuits — all in the language you just learned.",
  },
];

export const modules: Module[] = [
  {
    slug: "linear-algebra",
    title: "Linear Algebra",
    status: "available",
    blurb:
      "Vectors, matrices, eigenstuff, and SVD — the language every transformer is written in.",
    chapters: linearAlgebraChapters,
  },
  {
    slug: "probability",
    title: "Probability",
    status: "soon",
    blurb:
      "Distributions, expectation, KL divergence, and what 'logits' really mean.",
  },
  {
    slug: "calculus",
    title: "Calculus",
    status: "soon",
    blurb:
      "Gradients, the chain rule, and how a network learns.",
  },
  {
    slug: "neural-networks",
    title: "Neural Networks",
    status: "soon",
    blurb:
      "Linear layers, nonlinearities, and the forward pass from first principles.",
  },
  {
    slug: "transformers",
    title: "Transformers",
    status: "soon",
    blurb:
      "Attention, residual streams, and the architecture that ate NLP.",
  },
  {
    slug: "circuits",
    title: "Mech-interp Circuits",
    status: "soon",
    blurb:
      "Induction heads, sparse autoencoders, and the search for human-readable computation.",
  },
];

export function getModule(slug: string): Module | undefined {
  return modules.find((m) => m.slug === slug);
}

export function getChapter(
  moduleSlug: string,
  chapterSlug: string
): Chapter | undefined {
  return getModule(moduleSlug)?.chapters?.find((c) => c.slug === chapterSlug);
}

export function getAdjacentChapters(
  moduleSlug: string,
  chapterSlug: string
): { prev?: Chapter; next?: Chapter } {
  const chapters = getModule(moduleSlug)?.chapters ?? [];
  const idx = chapters.findIndex((c) => c.slug === chapterSlug);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? chapters[idx - 1] : undefined,
    next: idx < chapters.length - 1 ? chapters[idx + 1] : undefined,
  };
}
