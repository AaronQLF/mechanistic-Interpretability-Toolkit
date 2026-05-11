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

export const probabilityChapters: Chapter[] = [
  {
    slug: "sample-spaces",
    title: "Sample spaces & events",
    blurb:
      "Outcomes, events, and the three rules every probability obeys — the bedrock the rest sits on.",
  },
  {
    slug: "distributions",
    title: "Random variables & distributions",
    blurb:
      "A distribution is just a list of probabilities. Drag the bars and see what changes.",
  },
  {
    slug: "joint-marginal-conditional",
    title: "Joint, marginal & conditional",
    blurb:
      "Two variables, one table. Marginals sum the rows; conditionals slice them.",
  },
  {
    slug: "bayes",
    title: "Bayes' rule",
    blurb:
      "Prior × likelihood ∝ posterior — how a belief should shift when evidence arrives.",
  },
  {
    slug: "expectation-variance",
    title: "Expectation, variance & the law of large numbers",
    blurb:
      "The mean of a random variable, its spread, and why averages of samples concentrate.",
  },
  {
    slug: "softmax",
    title: "From scores to probabilities: softmax",
    blurb:
      "How a vector of real numbers becomes a distribution — and what temperature actually does.",
  },
  {
    slug: "entropy",
    title: "Entropy",
    blurb:
      "How surprising a distribution is, measured in bits. The thing a language model is trying to minimize.",
  },
  {
    slug: "cross-entropy-kl",
    title: "Cross-entropy & KL divergence",
    blurb:
      "Comparing two distributions: the loss every classifier minimizes, and the asymmetric distance behind it.",
  },
  {
    slug: "sampling",
    title: "Sampling: greedy, temperature, top-k, top-p",
    blurb:
      "Four ways to turn a next-token distribution into a token. Each one is a knob.",
  },
  {
    slug: "mech-interp-bridge",
    title: "Capstone: probability in mech interp",
    blurb:
      "Logit lens, attention as a distribution, KL of ablations, and what calibration buys you.",
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
    status: "available",
    blurb:
      "Distributions, expectation, KL divergence, and what 'logits' really mean.",
    chapters: probabilityChapters,
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
