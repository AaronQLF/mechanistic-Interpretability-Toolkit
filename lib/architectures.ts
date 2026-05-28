// The Architecture Map.
//
// A categorized inventory of AI/ML architectures from classical statistics
// through modern frontier models. Each entry is intentionally short:
// - blurb: one-liner stating what the architecture is
// - whyUse: why pick this *vs* the closest alternatives (the comparative
//   judgement is the point)
// - alts: names of the closest sibling architectures (used to render
//   click-to-jump links in the widget)
//
// Years are first-publication dates; for long-running families they are
// the year of the named milestone (e.g. ResNet = 2015, the original He
// et al. paper, not later variants).

export type Architecture = {
  name: string;
  year: number;
  blurb: string;
  whyUse: string;
  alts?: string[];
};

export type ArchCategory = {
  slug: string;
  title: string;
  blurb: string;
  archs: Architecture[];
};

export const ARCH_CATEGORIES: ArchCategory[] = [
  {
    slug: "classical-stats",
    title: "Classical statistical & kernel models",
    blurb:
      "The pre-deep-learning toolkit: linear, kernelized, and probabilistic models that still anchor most tabular benchmarks and provide the formal language deep learning later inherited.",
    archs: [
      {
        name: "Linear Regression",
        year: 1805,
        blurb: "Fit y = w·x + b by minimizing squared error.",
        whyUse:
          "When you want a model whose coefficients are themselves the answer (interpretable weights, p-values, confidence intervals). The strict baseline every other regressor must beat.",
        alts: ["Ridge Regression", "LASSO", "Elastic Net", "GLM"],
      },
      {
        name: "Logistic Regression",
        year: 1958,
        blurb: "Linear model with sigmoid output for binary / multiclass classification.",
        whyUse:
          "When you want calibrated probabilities and interpretable per-feature log-odds. Often beats fancier classifiers on tabular data with few features and is the canonical baseline.",
        alts: ["Linear Discriminant Analysis", "SVM", "Naive Bayes", "GAM"],
      },
      {
        name: "Ridge Regression",
        year: 1970,
        blurb: "Linear regression with L2 penalty on coefficients.",
        whyUse:
          "When features are correlated or dimensionality is large relative to samples. Stabilizes coefficients without zeroing them out — pick over LASSO when you want all features to keep some weight.",
        alts: ["Linear Regression", "LASSO", "Elastic Net", "Kernel Ridge Regression"],
      },
      {
        name: "LASSO",
        year: 1996,
        blurb: "Linear regression with L1 penalty, drives coefficients to zero.",
        whyUse:
          "When you want feature selection baked into the fit. Pick over Ridge when you suspect most features are irrelevant; pick over Elastic Net when correlation between features is mild.",
        alts: ["Ridge Regression", "Elastic Net", "Linear Regression"],
      },
      {
        name: "Elastic Net",
        year: 2005,
        blurb: "Linear regression with combined L1 + L2 penalties.",
        whyUse:
          "When features are correlated and you still want sparsity. LASSO alone arbitrarily picks one feature out of a correlated group; Elastic Net keeps the group together.",
        alts: ["LASSO", "Ridge Regression"],
      },
      {
        name: "Generalized Linear Model (GLM)",
        year: 1972,
        blurb: "Linear predictor + link function for non-Gaussian responses.",
        whyUse:
          "When the response is count / binary / heavy-tailed and a Gaussian likelihood is wrong. Same interpretability as linear regression, with a likelihood that fits the data type.",
        alts: ["Linear Regression", "Logistic Regression", "GAM"],
      },
      {
        name: "Generalized Additive Model (GAM)",
        year: 1986,
        blurb: "Sum of smooth univariate functions of features.",
        whyUse:
          "When you want non-linear effects per-feature but additive between features (so it stays interpretable). Sweet spot between linear models and black boxes; EBM is the modern gradient-boosted version.",
        alts: ["GLM", "Explainable Boosting Machine", "Splines"],
      },
      {
        name: "Linear Discriminant Analysis (LDA)",
        year: 1936,
        blurb: "Project to maximize between-class / within-class variance ratio.",
        whyUse:
          "Cheap closed-form classifier when class-conditional distributions are roughly Gaussian with shared covariance. Often beats logistic regression on small samples.",
        alts: ["Logistic Regression", "QDA", "PCA"],
      },
      {
        name: "Quadratic Discriminant Analysis (QDA)",
        year: 1948,
        blurb: "LDA with per-class covariance matrices, giving quadratic boundaries.",
        whyUse:
          "When LDA's shared-covariance assumption is too restrictive but you still want a generative classifier. Costs more samples per class to estimate the per-class covariance.",
        alts: ["LDA", "Logistic Regression", "Gaussian Naive Bayes"],
      },
      {
        name: "Naive Bayes",
        year: 1960,
        blurb: "Bayes' rule with conditional-independence assumption between features.",
        whyUse:
          "Trains in one pass and works astonishingly well for text classification despite the obviously-wrong independence assumption. The right baseline for high-dimensional sparse features.",
        alts: ["Logistic Regression", "LDA"],
      },
      {
        name: "k-Nearest Neighbors",
        year: 1967,
        blurb: "Predict from the k closest training points.",
        whyUse:
          "When the decision boundary is complex but smooth, you have lots of data, and you don't need a parametric model. No training time; expensive prediction time.",
        alts: ["Kernel methods", "Decision Trees", "GP Regression"],
      },
      {
        name: "Perceptron",
        year: 1958,
        blurb: "Rosenblatt's linear threshold unit, trained by mistake-driven updates.",
        whyUse:
          "Of historical and pedagogical interest — the spark of neural networks. Functionally subsumed by logistic regression and SVM, but the online update rule is still used in some streaming settings.",
        alts: ["Logistic Regression", "SVM", "MLP"],
      },
      {
        name: "Support Vector Machine (SVM)",
        year: 1995,
        blurb: "Maximum-margin linear classifier, kernelized for non-linear boundaries.",
        whyUse:
          "Best-in-class on small-to-medium datasets with non-linear boundaries before deep learning took over. Kernel choice is the model: RBF for general use, linear for high-dim sparse.",
        alts: ["Logistic Regression", "Random Forest", "Gaussian Process Regression"],
      },
      {
        name: "Support Vector Regression",
        year: 1996,
        blurb: "SVM applied to regression with epsilon-insensitive loss.",
        whyUse:
          "When you want SVM-style robustness for regression and only care about errors above a threshold. Mostly displaced by gradient-boosted trees on tabular data.",
        alts: ["SVM", "Kernel Ridge Regression", "Gaussian Process Regression"],
      },
      {
        name: "Kernel Ridge Regression",
        year: 1970,
        blurb: "Ridge regression in a feature space induced by a kernel.",
        whyUse:
          "Closed-form solution and same regularization story as Ridge, but with arbitrary non-linear features. Pick over GP regression when you don't need the uncertainty estimates.",
        alts: ["Ridge Regression", "Gaussian Process Regression", "SVM"],
      },
      {
        name: "Gaussian Process Regression",
        year: 1996,
        blurb: "Bayesian non-parametric regression using a kernel as the prior.",
        whyUse:
          "When you need calibrated uncertainty estimates alongside predictions, and you have a few thousand or fewer points. Costs O(N³) to fit; many approximations exist for scaling.",
        alts: ["Kernel Ridge Regression", "Bayesian Linear Regression", "SVM"],
      },
      {
        name: "Bayesian Linear Regression",
        year: 1960,
        blurb: "Linear regression with priors on weights, posterior on predictions.",
        whyUse:
          "When you want uncertainty over predictions but the kernel-feature flexibility of GPs is overkill. Closed-form posteriors with conjugate Gaussian priors.",
        alts: ["Ridge Regression", "Gaussian Process Regression"],
      },
    ],
  },

  {
    slug: "trees-ensembles",
    title: "Decision trees & ensembles",
    blurb:
      "Recursive partitioning of feature space; the family that still wins most Kaggle competitions on tabular data despite a decade of deep-learning hype.",
    archs: [
      {
        name: "CART",
        year: 1984,
        blurb: "Breiman's binary recursive partitioning algorithm.",
        whyUse:
          "The canonical decision-tree algorithm for both classification and regression. Almost never used alone today — every modern ensemble uses CART-like trees as base learners.",
        alts: ["ID3", "C4.5", "Random Forest"],
      },
      {
        name: "ID3 / C4.5",
        year: 1986,
        blurb: "Quinlan's information-gain decision tree (and pruned successor C4.5).",
        whyUse:
          "Of historical importance. C4.5 added pruning and continuous features. Use Random Forest or Gradient Boosting in practice.",
        alts: ["CART", "Random Forest"],
      },
      {
        name: "Random Forest",
        year: 2001,
        blurb: "Bagging ensemble of decorrelated decision trees with feature subsampling.",
        whyUse:
          "Strong out-of-the-box default for tabular classification or regression. Less hyperparameter-sensitive than boosting; typically loses by ~1% to a tuned XGBoost / LightGBM.",
        alts: ["XGBoost", "LightGBM", "Extra Trees", "Gradient Boosting"],
      },
      {
        name: "Bagging",
        year: 1996,
        blurb: "Train models on bootstrap samples, average predictions.",
        whyUse:
          "The principle behind Random Forest. Use raw bagging when your base learner has high variance and you can't easily decorrelate it (e.g. neural-network ensembling).",
        alts: ["Random Forest", "AdaBoost"],
      },
      {
        name: "Extra Trees (Extremely Randomized Trees)",
        year: 2006,
        blurb: "Random Forest with random thresholds in addition to random features.",
        whyUse:
          "Cheaper than Random Forest, slightly higher bias and lower variance. A reasonable default when you want trees but don't have time to tune.",
        alts: ["Random Forest"],
      },
      {
        name: "AdaBoost",
        year: 1995,
        blurb: "Sequentially fit weak learners, reweighting misclassified examples.",
        whyUse:
          "The historically-important boosting algorithm. Use Gradient Boosting / XGBoost in practice — same idea, more general loss functions, much better engineering.",
        alts: ["Gradient Boosting", "XGBoost"],
      },
      {
        name: "Gradient Boosting",
        year: 1999,
        blurb: "Sequentially fit each tree to the residuals of the current ensemble.",
        whyUse:
          "Friedman's framing that subsumes AdaBoost. The basis of every tabular-data SOTA since: XGBoost, LightGBM, CatBoost are all Gradient Boosting with engineering.",
        alts: ["XGBoost", "LightGBM", "CatBoost", "AdaBoost"],
      },
      {
        name: "XGBoost",
        year: 2014,
        blurb: "Regularized gradient boosting with second-order optimization.",
        whyUse:
          "The default heavyweight tabular model. Pick over LightGBM when accuracy matters most; pick over CatBoost when you have few categoricals.",
        alts: ["LightGBM", "CatBoost", "Gradient Boosting", "Random Forest"],
      },
      {
        name: "LightGBM",
        year: 2017,
        blurb: "Histogram-binned, leaf-wise gradient boosting from Microsoft.",
        whyUse:
          "Pick over XGBoost when training time matters and you have many features. Leaf-wise growth is more aggressive (and more prone to overfit on small data).",
        alts: ["XGBoost", "CatBoost", "Gradient Boosting"],
      },
      {
        name: "CatBoost",
        year: 2017,
        blurb: "Yandex gradient boosting with native categorical-feature handling.",
        whyUse:
          "Pick over XGBoost / LightGBM when your data is mostly categoricals and you don't want to hand-encode. Slower but the categorical handling is principled (target encoding without leakage).",
        alts: ["XGBoost", "LightGBM"],
      },
      {
        name: "Isolation Forest",
        year: 2008,
        blurb: "Anomaly detection by random partitioning depth.",
        whyUse:
          "Strong baseline for unsupervised anomaly detection in tabular data. Pick over one-class SVM when you have lots of features and care about scaling.",
        alts: ["One-Class SVM", "Local Outlier Factor"],
      },
      {
        name: "Explainable Boosting Machine (EBM)",
        year: 2019,
        blurb: "Gradient-boosted GAM with at most pairwise interactions.",
        whyUse:
          "When you want gradient-boosted-tree accuracy with a fully interpretable model (each feature's effect is a function you can plot). Pick over a black-box ensemble in regulated settings.",
        alts: ["GAM", "XGBoost"],
      },
    ],
  },

  {
    slug: "clustering-dim-reduction",
    title: "Clustering & dimensionality reduction",
    blurb:
      "Unsupervised structure-finding: partitioning points into groups, projecting them to lower dimensions, or both.",
    archs: [
      {
        name: "k-means",
        year: 1957,
        blurb: "Iteratively assign points to nearest centroid, recompute centroids.",
        whyUse:
          "The default clustering baseline. Fast and works when clusters are roughly spherical and equal-sized; pick over GMM when you don't need soft assignments.",
        alts: ["Gaussian Mixture Model", "k-medoids", "DBSCAN"],
      },
      {
        name: "k-medoids",
        year: 1987,
        blurb: "Like k-means but cluster centers are actual data points.",
        whyUse:
          "Robust to outliers and works with arbitrary distance metrics (where 'mean' isn't defined). Pick over k-means for non-Euclidean data.",
        alts: ["k-means", "Hierarchical clustering"],
      },
      {
        name: "Hierarchical clustering",
        year: 1963,
        blurb: "Agglomerative or divisive merging into a dendrogram.",
        whyUse:
          "When you don't want to commit to a number of clusters in advance and the dendrogram itself is informative. Pick over k-means for small datasets where structure is nested.",
        alts: ["k-means", "DBSCAN"],
      },
      {
        name: "DBSCAN",
        year: 1996,
        blurb: "Density-based clustering: connect points within ε of each other.",
        whyUse:
          "When clusters have arbitrary shape and you want noise points labeled as outliers. Pick over k-means whenever the spherical-cluster assumption fails.",
        alts: ["HDBSCAN", "Mean Shift", "OPTICS"],
      },
      {
        name: "HDBSCAN",
        year: 2013,
        blurb: "Hierarchical version of DBSCAN with cluster stability scores.",
        whyUse:
          "Pick over DBSCAN whenever clusters have varying densities. Less hyperparameter-sensitive — auto-selects the equivalent of ε per-cluster.",
        alts: ["DBSCAN", "OPTICS"],
      },
      {
        name: "Gaussian Mixture Model (GMM) / EM",
        year: 1977,
        blurb: "Mixture of Gaussians fit by Expectation-Maximization.",
        whyUse:
          "Pick over k-means when you want soft assignments, ellipsoidal cluster shapes, or a likelihood you can compare across models.",
        alts: ["k-means", "Variational Inference"],
      },
      {
        name: "Spectral Clustering",
        year: 2002,
        blurb: "Cluster eigenvectors of the data's affinity / Laplacian matrix.",
        whyUse:
          "When clusters are non-convex but you can define a sensible affinity function. Pick over DBSCAN for graph-like data with weighted edges.",
        alts: ["k-means", "DBSCAN"],
      },
      {
        name: "Mean Shift",
        year: 1995,
        blurb: "Cluster by climbing density gradients to local modes.",
        whyUse:
          "Non-parametric, no need to pick k, robust to outliers. Slower than k-means and bandwidth-sensitive; mostly used for image segmentation.",
        alts: ["DBSCAN", "k-means"],
      },
      {
        name: "PCA",
        year: 1901,
        blurb: "Project data onto its top eigenvectors of covariance.",
        whyUse:
          "The first thing to try for linear dimensionality reduction. Closed-form, interpretable axes, preserves global structure. Pick over t-SNE / UMAP for downstream modeling, not for visualization.",
        alts: ["Kernel PCA", "ICA", "UMAP"],
      },
      {
        name: "Kernel PCA",
        year: 1998,
        blurb: "PCA in a kernel-induced feature space.",
        whyUse:
          "When linear PCA misses non-linear structure but you don't want a non-parametric embedding (t-SNE / UMAP) because you need a function you can apply to new points.",
        alts: ["PCA", "t-SNE", "UMAP"],
      },
      {
        name: "ICA",
        year: 1994,
        blurb: "Decompose mixed signals into statistically independent sources.",
        whyUse:
          "When the right factorization is into independent (not just uncorrelated) components — classic example: separating mixed audio sources. Pick over PCA when independence is the goal.",
        alts: ["PCA", "NMF"],
      },
      {
        name: "NMF",
        year: 1999,
        blurb: "Factorize non-negative matrix into non-negative factors.",
        whyUse:
          "When the natural representation is non-negative and parts-based (topics over words, faces as parts). Pick over PCA when interpretability of factors matters more than orthogonality.",
        alts: ["PCA", "ICA", "LDA (topic model)"],
      },
      {
        name: "LDA (Latent Dirichlet Allocation)",
        year: 2003,
        blurb: "Bayesian topic model: documents are mixtures of topics, topics are distributions over words.",
        whyUse:
          "The classical topic-modeling baseline. Pick over BERTopic / embedding-based methods when you want a fully probabilistic model with interpretable topic-word matrices.",
        alts: ["NMF", "BERTopic"],
      },
      {
        name: "t-SNE",
        year: 2008,
        blurb: "Visualize high-dim data in 2D by preserving local neighborhood structure.",
        whyUse:
          "The default 2D-visualization tool for embeddings. Pick over UMAP when you specifically care about local structure; UMAP is usually faster and preserves global structure better.",
        alts: ["UMAP", "PCA"],
      },
      {
        name: "UMAP",
        year: 2018,
        blurb: "Uniform Manifold Approximation and Projection — graph-based non-linear embedding.",
        whyUse:
          "Faster than t-SNE, preserves more global structure, scales to millions of points. The current default for embedding visualization. Has hyperparameters that meaningfully change the picture.",
        alts: ["t-SNE", "PCA"],
      },
      {
        name: "Isomap",
        year: 2000,
        blurb: "MDS on geodesic distances along a k-NN graph.",
        whyUse:
          "Of historical importance — one of the first manifold-learning methods. Largely displaced by t-SNE and UMAP in practice.",
        alts: ["LLE", "t-SNE", "UMAP"],
      },
      {
        name: "LLE",
        year: 2000,
        blurb: "Locally Linear Embedding — preserve local linear reconstruction weights.",
        whyUse:
          "Same era as Isomap, similar fate. Useful primarily as a stepping stone toward modern manifold methods.",
        alts: ["Isomap", "t-SNE"],
      },
    ],
  },

  {
    slug: "probabilistic-graphical",
    title: "Probabilistic graphical models",
    blurb:
      "Distributions encoded as graphs. The mathematical foundation of much of pre-deep-learning ML and still the cleanest way to express structured uncertainty.",
    archs: [
      {
        name: "Bayesian Networks",
        year: 1985,
        blurb: "Directed acyclic graph encoding a factorization of a joint distribution.",
        whyUse:
          "When variables have natural causal / conditional structure and you want to do inference (compute posteriors) cleanly. Underpins much of medical-decision-support and causal-inference work.",
        alts: ["Markov Random Fields", "HMM"],
      },
      {
        name: "Markov Random Fields",
        year: 1980,
        blurb: "Undirected graph encoding conditional independences.",
        whyUse:
          "When the dependence structure is symmetric (image pixels, social networks) and a directed factorization isn't natural. Pick over Bayesian Networks for non-causal structure.",
        alts: ["Bayesian Networks", "CRF"],
      },
      {
        name: "Hidden Markov Model (HMM)",
        year: 1966,
        blurb: "Sequence of hidden states with observed emissions, Markov over states.",
        whyUse:
          "The classical sequence model. Pick over RNN/LSTM when interpretability of latent states matters and the data is short. Speech recognition's bedrock until ~2014.",
        alts: ["CRF", "Linear Chain CRF", "LSTM"],
      },
      {
        name: "Conditional Random Field (CRF)",
        year: 2001,
        blurb: "Discriminative undirected model over labeled sequences.",
        whyUse:
          "When you want HMM-like structure but discriminative (model p(y|x), not p(x,y)). Was the standard for sequence labeling (NER, POS) before BiLSTM-CRF and then transformers.",
        alts: ["HMM", "BiLSTM-CRF"],
      },
      {
        name: "Variational Inference",
        year: 1999,
        blurb: "Approximate posteriors by optimizing within a tractable family.",
        whyUse:
          "When exact inference is intractable and MCMC is too slow. The conceptual backbone of VAEs. Pick over MCMC when you need fast, deterministic posteriors.",
        alts: ["MCMC", "Expectation-Maximization"],
      },
    ],
  },

  {
    slug: "feedforward-autoencoders",
    title: "MLPs, RBMs, autoencoders",
    blurb:
      "The earliest deep architectures. MLPs are the universal approximators; autoencoders are the unsupervised cousins that learn compressed representations.",
    archs: [
      {
        name: "Multi-layer Perceptron (MLP)",
        year: 1986,
        blurb: "Stacked fully-connected layers with non-linear activations.",
        whyUse:
          "Universal function approximator. The default for tabular regression / classification when you commit to neural networks; otherwise gradient-boosted trees beat it.",
        alts: ["Linear Regression", "XGBoost", "ResNet"],
      },
      {
        name: "Restricted Boltzmann Machine (RBM)",
        year: 1986,
        blurb: "Bipartite undirected energy-based model with binary units.",
        whyUse:
          "Of historical importance — the unit Hinton stacked into Deep Belief Networks to bootstrap deep learning. Almost never used today; superseded by autoencoders and modern deep nets.",
        alts: ["Deep Belief Network", "Autoencoder"],
      },
      {
        name: "Deep Belief Network (DBN)",
        year: 2006,
        blurb: "Stack of RBMs trained greedily layer-by-layer.",
        whyUse:
          "Hinton's 2006 result that deep nets could be pretrained one layer at a time — the spark of the deep-learning era. Now of historical interest only; ReLU + careful init made greedy pretraining unnecessary.",
        alts: ["Autoencoder", "MLP"],
      },
      {
        name: "Autoencoder",
        year: 1986,
        blurb: "Encoder + decoder trained to reconstruct the input.",
        whyUse:
          "When you want unsupervised representation learning and don't need a probabilistic model. Pick over PCA when non-linear features matter; pick over VAE when you don't care about a generative prior.",
        alts: ["Variational Autoencoder", "PCA", "Sparse Autoencoder"],
      },
      {
        name: "Denoising Autoencoder",
        year: 2008,
        blurb: "Autoencoder trained to reconstruct clean inputs from corrupted versions.",
        whyUse:
          "Forces the encoder to learn robust features rather than the identity. Pick over vanilla autoencoders for representation learning; the conceptual ancestor of BERT's masked LM and diffusion.",
        alts: ["Autoencoder", "BERT", "DDPM"],
      },
      {
        name: "Sparse Autoencoder",
        year: 2007,
        blurb: "Autoencoder with a sparsity penalty on the hidden representation.",
        whyUse:
          "When you want each input encoded by a few active units rather than dense activations. The architecture behind modern mech-interp dictionary learning (see the Circuits module).",
        alts: ["Autoencoder", "VAE", "Top-K SAE"],
      },
      {
        name: "Contractive Autoencoder",
        year: 2011,
        blurb: "Autoencoder with a Frobenius-norm penalty on the encoder Jacobian.",
        whyUse:
          "Forces the encoder to be locally invariant — neighboring inputs map to nearby codes. Of theoretical interest, rarely used in practice today.",
        alts: ["Denoising Autoencoder", "Sparse Autoencoder"],
      },
      {
        name: "Variational Autoencoder (VAE)",
        year: 2013,
        blurb: "Autoencoder with a probabilistic latent prior, trained by ELBO.",
        whyUse:
          "When you want a generative model that's easy to train and you can tolerate blurry samples. Pick over GANs for stable training and an explicit latent posterior; pick over diffusion when speed matters more than sample quality.",
        alts: ["β-VAE", "VQ-VAE", "GAN", "DDPM"],
      },
      {
        name: "β-VAE",
        year: 2017,
        blurb: "VAE with a β coefficient on the KL term to encourage disentanglement.",
        whyUse:
          "When you want disentangled latents (one factor of variation per dimension). Trades reconstruction quality for disentanglement; effective on simple datasets, debatable on real-world ones.",
        alts: ["VAE", "InfoGAN"],
      },
      {
        name: "VQ-VAE",
        year: 2017,
        blurb: "VAE with a discrete codebook latent space (vector quantization).",
        whyUse:
          "When you want a discrete latent code that can be modeled by an autoregressive prior. The basis of modern image / audio tokenizers (DALL-E, AudioLM, VAR).",
        alts: ["VAE", "VQ-VAE-2", "Tokenizer"],
      },
      {
        name: "VQ-VAE-2",
        year: 2019,
        blurb: "Hierarchical VQ-VAE with multi-scale codebooks.",
        whyUse:
          "Pick over VQ-VAE when you need high-resolution images. The hierarchy lets coarse codes specify global content and fine codes specify texture.",
        alts: ["VQ-VAE", "Latent Diffusion"],
      },
      {
        name: "NVAE / Hierarchical VAE",
        year: 2020,
        blurb: "Deep hierarchical VAE with skip connections and clever priors.",
        whyUse:
          "Pick over plain VAE when you want sharp images and don't want to switch to diffusion. Sets of latents at multiple scales, like a generative U-Net.",
        alts: ["VAE", "VQ-VAE-2", "Latent Diffusion"],
      },
    ],
  },

  {
    slug: "cnns",
    title: "Convolutional networks (image classification)",
    blurb:
      "Translation-equivariant feature extractors that ruled computer vision from 2012 to 2020 and still dominate when compute is tight or images are small.",
    archs: [
      {
        name: "LeNet-5",
        year: 1998,
        blurb: "LeCun's 7-layer CNN for handwritten digit recognition.",
        whyUse:
          "The architecture that proved CNNs could win on a real task (MNIST). Still a useful pedagogical baseline; never used in production today.",
        alts: ["AlexNet", "MLP"],
      },
      {
        name: "AlexNet",
        year: 2012,
        blurb: "Deep CNN with ReLU, dropout, and GPU training; won ImageNet 2012.",
        whyUse:
          "Of canonical historical importance — the result that started the deep-learning era. Functionally subsumed by every later CNN; cite it, don't deploy it.",
        alts: ["VGG", "ResNet", "ZFNet"],
      },
      {
        name: "ZFNet",
        year: 2013,
        blurb: "AlexNet with smaller first-layer filters and visualizations.",
        whyUse:
          "Marginal architectural improvement over AlexNet; mostly remembered for the deconvolution-based feature visualizations.",
        alts: ["AlexNet"],
      },
      {
        name: "VGG-16 / VGG-19",
        year: 2014,
        blurb: "Deep CNN with uniform 3x3 conv stacks.",
        whyUse:
          "Pick when you want a simple, easy-to-understand baseline with clean feature hierarchies. Heavy on parameters compared to ResNet; still used as a feature extractor for perceptual losses.",
        alts: ["ResNet", "GoogLeNet", "EfficientNet"],
      },
      {
        name: "GoogLeNet / Inception v1",
        year: 2014,
        blurb: "CNN with multi-scale Inception modules and 1x1 bottleneck convs.",
        whyUse:
          "Of historical importance — introduced 1x1 convs as a parameter-efficient design pattern. Pick Inception v3 / EfficientNet over the original today.",
        alts: ["Inception v3", "ResNet", "EfficientNet"],
      },
      {
        name: "Inception v3",
        year: 2015,
        blurb: "Inception with factorized convolutions and auxiliary classifiers.",
        whyUse:
          "Strong accuracy/compute tradeoff for its era. Pick over ResNet-50 when factorized convolutions matter (older mobile hardware); pick EfficientNet today.",
        alts: ["ResNet", "EfficientNet"],
      },
      {
        name: "ResNet",
        year: 2015,
        blurb: "CNN with skip connections that enable training of 100+ layer networks.",
        whyUse:
          "The default deep CNN backbone for a decade. Skip connections are the architectural primitive that made everything since possible (transformers included). Use ResNet-50 as a default.",
        alts: ["ResNeXt", "DenseNet", "ConvNeXt", "EfficientNet"],
      },
      {
        name: "ResNeXt",
        year: 2016,
        blurb: "ResNet with grouped convolutions ('cardinality').",
        whyUse:
          "Same accuracy as a wider ResNet at lower compute. Pick over ResNet when cardinality groupings give you the architectural lever you want.",
        alts: ["ResNet", "DenseNet"],
      },
      {
        name: "DenseNet",
        year: 2016,
        blurb: "CNN where every layer is connected to every later layer.",
        whyUse:
          "More parameter-efficient than ResNet at the same accuracy. Memory-hungry to train. Pick when parameter count matters more than activation memory.",
        alts: ["ResNet", "EfficientNet"],
      },
      {
        name: "SENet",
        year: 2017,
        blurb: "ResNet with Squeeze-and-Excitation channel attention.",
        whyUse:
          "Drop-in module that improves any CNN by ~1-2% accuracy for negligible cost. The first 'attention in CNNs' to gain wide adoption.",
        alts: ["ResNet", "ConvNeXt"],
      },
      {
        name: "MobileNet",
        year: 2017,
        blurb: "Depthwise-separable convolutions for mobile inference.",
        whyUse:
          "When you have to run on a phone or edge device. v2 added inverted residuals, v3 used NAS — pick the latest variant for your latency target.",
        alts: ["EfficientNet", "ShuffleNet", "GhostNet"],
      },
      {
        name: "ShuffleNet",
        year: 2017,
        blurb: "Mobile CNN with grouped convs and channel shuffling.",
        whyUse:
          "Roughly comparable to MobileNet on accuracy/latency; pick whichever has better support in your inference framework.",
        alts: ["MobileNet", "EfficientNet"],
      },
      {
        name: "EfficientNet",
        year: 2019,
        blurb: "CNN family with NAS-discovered uniform compound scaling.",
        whyUse:
          "Pareto frontier for CNN accuracy vs FLOPs in 2019-2021. Pick over ResNet when FLOPs / parameters matter; pick ConvNeXt or ViT when you have more compute.",
        alts: ["ResNet", "EfficientNet v2", "ConvNeXt"],
      },
      {
        name: "EfficientNet v2",
        year: 2021,
        blurb: "EfficientNet with progressive learning and faster training.",
        whyUse:
          "Pick over EfficientNet v1 always. Same Pareto frontier, much faster to train.",
        alts: ["EfficientNet", "ConvNeXt"],
      },
      {
        name: "RegNet",
        year: 2020,
        blurb: "CNN family designed by population-style architecture search.",
        whyUse:
          "Cleaner design space than EfficientNet, with explicit width/depth scaling rules. Used by some FAIR / Meta vision papers as a backbone.",
        alts: ["EfficientNet", "ConvNeXt"],
      },
      {
        name: "ConvNeXt",
        year: 2022,
        blurb: "Modernized CNN design with transformer-inspired tweaks.",
        whyUse:
          "The argument that CNNs aren't obsolete: a carefully-modernized ResNet that matches Swin Transformer accuracy. Pick over ViT when you don't have transformer-scale data.",
        alts: ["Swin Transformer", "ViT", "ResNet"],
      },
      {
        name: "NFNet",
        year: 2021,
        blurb: "CNN without batch normalization, trained with adaptive gradient clipping.",
        whyUse:
          "Pick when you specifically want to avoid batchnorm (small batches, distributed training). Of more theoretical than practical interest today.",
        alts: ["ResNet", "EfficientNet"],
      },
      {
        name: "HRNet",
        year: 2019,
        blurb: "CNN that maintains high-resolution feature maps throughout.",
        whyUse:
          "Pick for tasks that need precise spatial localization (pose estimation, segmentation) where downsample-then-upsample architectures lose detail.",
        alts: ["U-Net", "DeepLab v3+"],
      },
    ],
  },

  {
    slug: "detection-segmentation",
    title: "Object detection & segmentation",
    blurb:
      "From sliding-window classifiers to end-to-end transformers. Each generation traded engineering complexity for accuracy and ease of training.",
    archs: [
      {
        name: "R-CNN",
        year: 2014,
        blurb: "Region proposals + CNN classifier per region.",
        whyUse:
          "First demonstration that CNNs win at detection. Slow (one CNN forward pass per proposal); use Faster R-CNN or later in practice.",
        alts: ["Fast R-CNN", "Faster R-CNN", "YOLO"],
      },
      {
        name: "Fast R-CNN",
        year: 2015,
        blurb: "R-CNN with shared CNN features and ROI pooling.",
        whyUse:
          "Same idea as R-CNN, ~10x faster by computing CNN features once. Still slow because region proposals are computed externally.",
        alts: ["Faster R-CNN", "Mask R-CNN"],
      },
      {
        name: "Faster R-CNN",
        year: 2015,
        blurb: "Fast R-CNN with a Region Proposal Network sharing CNN features.",
        whyUse:
          "The two-stage detection workhorse for years. Pick when accuracy matters more than latency; YOLO / SSD beat it on speed.",
        alts: ["Mask R-CNN", "YOLO", "DETR"],
      },
      {
        name: "Mask R-CNN",
        year: 2017,
        blurb: "Faster R-CNN with an instance segmentation mask head.",
        whyUse:
          "Default for instance segmentation. Pick over Faster R-CNN when you need pixel-level masks; pick over Mask2Former when transformer-based methods overshoot your needs.",
        alts: ["Faster R-CNN", "Mask2Former", "SOLO"],
      },
      {
        name: "SSD",
        year: 2015,
        blurb: "Single-shot multi-scale detector.",
        whyUse:
          "First real-time detector that was competitive on accuracy. Mostly displaced by YOLO variants today.",
        alts: ["YOLO", "RetinaNet", "FCOS"],
      },
      {
        name: "YOLO v1-v3",
        year: 2015,
        blurb: "Single-shot detector with grid-based predictions.",
        whyUse:
          "The 'simple and fast' detector family. Pick when you need real-time inference and can tolerate the accuracy gap to two-stage detectors.",
        alts: ["SSD", "RetinaNet", "YOLO v5/v8"],
      },
      {
        name: "YOLO v5 / v8 / v11",
        year: 2024,
        blurb: "Modern Ultralytics YOLO with improved backbones and training tricks.",
        whyUse:
          "The de-facto industrial detector. Pick over Faster R-CNN whenever speed matters and pretrained checkpoints are usable.",
        alts: ["DETR", "RT-DETR", "Faster R-CNN"],
      },
      {
        name: "RetinaNet",
        year: 2017,
        blurb: "Single-shot detector with focal loss for class imbalance.",
        whyUse:
          "Pick when one-stage simplicity matters and the focal-loss formulation suits your imbalance. Largely displaced by anchor-free / DETR-family detectors.",
        alts: ["FCOS", "YOLO", "DETR"],
      },
      {
        name: "FCOS",
        year: 2019,
        blurb: "Anchor-free single-shot detector.",
        whyUse:
          "When you want to avoid anchor-box hyperparameters. Conceptually cleaner than RetinaNet; same general regime.",
        alts: ["RetinaNet", "DETR"],
      },
      {
        name: "DETR",
        year: 2020,
        blurb: "End-to-end transformer detector with set prediction.",
        whyUse:
          "First detector with no hand-crafted post-processing (no NMS, no anchors). Slower to train than CNN detectors; pick over Faster R-CNN for cleaner pipelines.",
        alts: ["Deformable DETR", "RT-DETR", "Faster R-CNN"],
      },
      {
        name: "Deformable DETR",
        year: 2020,
        blurb: "DETR with sparse deformable attention for faster convergence.",
        whyUse:
          "Pick over original DETR always — same idea, much faster training, slightly better small-object detection.",
        alts: ["DETR", "RT-DETR"],
      },
      {
        name: "U-Net",
        year: 2015,
        blurb: "Encoder-decoder CNN with skip connections; the segmentation default.",
        whyUse:
          "The single most influential segmentation architecture. Pick for medical imaging, satellite imagery, anything where you need dense per-pixel output and have moderate data.",
        alts: ["SegNet", "DeepLab v3+", "Mask2Former"],
      },
      {
        name: "SegNet",
        year: 2015,
        blurb: "Encoder-decoder with pooling-index unpooling for segmentation.",
        whyUse:
          "Memory-efficient alternative to U-Net for road / scene segmentation. Mostly displaced by DeepLab and Mask2Former.",
        alts: ["U-Net", "DeepLab v3+"],
      },
      {
        name: "DeepLab v3+",
        year: 2018,
        blurb: "Atrous spatial pyramid pooling + encoder-decoder for segmentation.",
        whyUse:
          "Pick for high-resolution semantic segmentation when U-Net underfits. ASPP captures multi-scale context cleanly.",
        alts: ["U-Net", "HRNet", "Mask2Former"],
      },
      {
        name: "Mask2Former",
        year: 2022,
        blurb: "Transformer-based universal segmentation (semantic / instance / panoptic).",
        whyUse:
          "Modern unified segmentation. One model, three tasks. Pick over Mask R-CNN when you can afford the training cost and want a single backbone.",
        alts: ["Mask R-CNN", "Segment Anything"],
      },
      {
        name: "Segment Anything (SAM)",
        year: 2023,
        blurb: "Prompt-conditioned segmentation foundation model.",
        whyUse:
          "When you want zero-shot segmentation from a point/box/text prompt. Pick over per-task models when you need flexibility, not when you need maximum accuracy on a fixed task.",
        alts: ["SAM 2", "Mask2Former"],
      },
    ],
  },

  {
    slug: "rnns-memory",
    title: "Recurrent networks & external memory",
    blurb:
      "Sequence models defined by their hidden state. Mostly displaced by transformers, but state-space models are a recurrent renaissance.",
    archs: [
      {
        name: "Vanilla RNN",
        year: 1986,
        blurb: "Recurrent network with a single hidden state vector.",
        whyUse:
          "Pedagogical baseline only. Vanishing-gradient problems make it untrainable for sequences longer than ~10 steps.",
        alts: ["LSTM", "GRU"],
      },
      {
        name: "LSTM",
        year: 1997,
        blurb: "RNN with input/forget/output gates and a memory cell.",
        whyUse:
          "The canonical RNN. Solves vanishing gradients via the additive cell state. Pick over GRU when you have data and want maximum capacity per parameter count; pick over transformers when you have very long sequences and limited memory.",
        alts: ["GRU", "Transformer", "Mamba"],
      },
      {
        name: "GRU",
        year: 2014,
        blurb: "Simpler LSTM with merged gates.",
        whyUse:
          "Pick over LSTM when training time matters and the dataset is moderate size. Roughly equivalent accuracy on most tasks; slightly fewer parameters.",
        alts: ["LSTM", "QRNN"],
      },
      {
        name: "Bidirectional RNN",
        year: 1997,
        blurb: "Two RNNs, one forward, one backward, concatenated.",
        whyUse:
          "Standard for sequence labeling when you have the full input at inference time (NER, POS tagging). Doesn't work for autoregressive generation.",
        alts: ["BiLSTM-CRF", "BERT"],
      },
      {
        name: "Seq2Seq",
        year: 2014,
        blurb: "Encoder-decoder RNN architecture for translation.",
        whyUse:
          "Of historical importance — the architecture transformers replaced. Cite, don't deploy.",
        alts: ["Transformer", "T5", "BART"],
      },
      {
        name: "Seq2Seq with Attention",
        year: 2014,
        blurb: "Bahdanau / Luong attention over encoder states.",
        whyUse:
          "The conceptual stepping stone from RNN translation to transformers. Functionally subsumed by 'Attention is all you need'.",
        alts: ["Transformer"],
      },
      {
        name: "Pointer Networks",
        year: 2015,
        blurb: "Seq2Seq that predicts indices into the input rather than vocabulary tokens.",
        whyUse:
          "When the output is a permutation or selection of input elements (TSP, summarization extractives). The conceptual ancestor of copy mechanisms.",
        alts: ["Seq2Seq", "Transformer with copy"],
      },
      {
        name: "Echo State Network",
        year: 2001,
        blurb: "RNN with random untrained recurrent weights, only readout is trained.",
        whyUse:
          "Cheap, surprisingly effective for low-dimensional time-series. Pick over LSTM when you specifically want a fixed reservoir and small data.",
        alts: ["LSTM", "Liquid State Machine"],
      },
      {
        name: "Memory Networks",
        year: 2014,
        blurb: "External memory bank addressed by similarity.",
        whyUse:
          "Of historical importance — early external-memory architecture for QA. Conceptually subsumed by attention and retrieval-augmented transformers.",
        alts: ["Neural Turing Machine", "RAG"],
      },
      {
        name: "Neural Turing Machine (NTM)",
        year: 2014,
        blurb: "RNN coupled to a differentiable read/write memory.",
        whyUse:
          "Important architectural idea but training is fragile. Influenced attention as a memory-addressing primitive; rarely used as-is today.",
        alts: ["Differentiable Neural Computer", "Memory Networks", "Transformer"],
      },
      {
        name: "Differentiable Neural Computer (DNC)",
        year: 2016,
        blurb: "NTM with improved memory addressing and dynamic memory allocation.",
        whyUse:
          "DeepMind's refinement of NTM. Demonstrated graph-traversal-style algorithms but never became a workhorse architecture.",
        alts: ["Neural Turing Machine", "Transformer"],
      },
      {
        name: "QRNN",
        year: 2016,
        blurb: "Quasi-recurrent network: convolutions for parallelism, lightweight recurrence for state.",
        whyUse:
          "Of historical interest — early attempt at parallelizable recurrence. Conceptually sibling to state-space models that came later.",
        alts: ["LSTM", "S4", "Mamba"],
      },
    ],
  },

  {
    slug: "transformers-foundational",
    title: "Foundational transformers",
    blurb:
      "The architecture that ate NLP, then everything else. Encoder-only, decoder-only, and encoder-decoder variants laid down between 2017 and 2020.",
    archs: [
      {
        name: "Transformer",
        year: 2017,
        blurb: "Self-attention encoder-decoder; 'Attention is all you need'.",
        whyUse:
          "The architectural primitive of the modern era. Use the original encoder-decoder for seq2seq tasks where you have parallel data; otherwise pick a decoder-only or encoder-only descendant.",
        alts: ["BERT", "GPT-2", "T5"],
      },
      {
        name: "BERT",
        year: 2018,
        blurb: "Encoder-only transformer pretrained with masked language modeling.",
        whyUse:
          "The default for classification / sequence labeling / sentence embeddings. Pick over GPT when you have the full input and want bidirectional context.",
        alts: ["RoBERTa", "DeBERTa", "ELECTRA", "DistilBERT"],
      },
      {
        name: "RoBERTa",
        year: 2019,
        blurb: "BERT with better hyperparameters, more data, no NSP objective.",
        whyUse:
          "Pick over BERT in basically any setting — same architecture, much better pretraining recipe.",
        alts: ["BERT", "DeBERTa"],
      },
      {
        name: "DistilBERT",
        year: 2019,
        blurb: "BERT distilled to 40% size with 97% of the performance.",
        whyUse:
          "When you need a small, fast BERT for production. Lower-bound baseline for any compression strategy.",
        alts: ["BERT", "TinyBERT", "ALBERT"],
      },
      {
        name: "ALBERT",
        year: 2019,
        blurb: "BERT with parameter sharing across layers and factorized embeddings.",
        whyUse:
          "Smaller parameter count than BERT, similar accuracy. Pick when memory is the constraint, not latency.",
        alts: ["BERT", "DistilBERT"],
      },
      {
        name: "DeBERTa",
        year: 2020,
        blurb: "BERT with disentangled attention over content and position.",
        whyUse:
          "Strong upgrade over RoBERTa for classification benchmarks. The default if you want a non-LLM encoder-only model in 2024+.",
        alts: ["RoBERTa", "BERT"],
      },
      {
        name: "ELECTRA",
        year: 2020,
        blurb: "BERT replaced-token-detection objective; train all tokens, not just masked.",
        whyUse:
          "More sample-efficient than BERT pretraining at the same compute. Pick when you're pretraining your own encoder.",
        alts: ["BERT", "RoBERTa"],
      },
      {
        name: "GPT-1",
        year: 2018,
        blurb: "Decoder-only transformer pretrained as autoregressive language model.",
        whyUse:
          "The first 'pretrain then fine-tune' decoder-only LM. Cite, don't deploy.",
        alts: ["GPT-2", "GPT-3", "BERT"],
      },
      {
        name: "GPT-2",
        year: 2019,
        blurb: "Scaled GPT-1 (1.5B parameters) with strong zero-shot abilities.",
        whyUse:
          "First demonstration that scale alone makes LMs broadly useful. Still the canonical small-LM benchmark for mech-interp work; openly released, well-studied.",
        alts: ["GPT-3", "Pythia", "TinyLlama"],
      },
      {
        name: "GPT-3",
        year: 2020,
        blurb: "175B-parameter GPT, demonstrating in-context learning at scale.",
        whyUse:
          "Of canonical historical importance — the result that defined the modern LLM era. Functionally subsumed by GPT-4 and open competitors.",
        alts: ["GPT-4", "PaLM", "LLaMA"],
      },
      {
        name: "T5",
        year: 2019,
        blurb: "Encoder-decoder transformer trained as text-to-text.",
        whyUse:
          "Pick over BERT for generative-formulated classification (translate, summarize, classify-via-generate). The default encoder-decoder when seq2seq is the natural framing.",
        alts: ["BART", "mT5", "Flan-T5"],
      },
      {
        name: "Flan-T5",
        year: 2022,
        blurb: "T5 fine-tuned on a large mixture of instruction-following tasks.",
        whyUse:
          "When you want T5 architecture but with strong out-of-the-box instruction following.",
        alts: ["T5", "Instruction-tuned LLaMA"],
      },
      {
        name: "BART",
        year: 2019,
        blurb: "Encoder-decoder pretrained with denoising autoencoding.",
        whyUse:
          "Pick over T5 for summarization and other denoising-style generation tasks. Roughly equivalent for translation.",
        alts: ["T5", "PEGASUS"],
      },
      {
        name: "PEGASUS",
        year: 2020,
        blurb: "Encoder-decoder pretrained with gap-sentence prediction.",
        whyUse:
          "SOTA-class summarization at the time. Pick over BART when summarization specifically is the target.",
        alts: ["BART", "T5"],
      },
      {
        name: "XLNet",
        year: 2019,
        blurb: "Permutation-based bidirectional language model.",
        whyUse:
          "Briefly SOTA on classification before RoBERTa. Mostly historical interest now.",
        alts: ["BERT", "RoBERTa"],
      },
      {
        name: "Transformer-XL",
        year: 2019,
        blurb: "Transformer with segment-level recurrence and relative positions.",
        whyUse:
          "Conceptual ancestor of long-context transformers. Largely subsumed by Longformer / state-space models.",
        alts: ["Longformer", "BigBird", "Mamba"],
      },
    ],
  },

  {
    slug: "efficient-transformers",
    title: "Efficient & long-context transformers",
    blurb:
      "Variants designed to break the O(N²) attention barrier with sparse, low-rank, or kernelized attention.",
    archs: [
      {
        name: "Reformer",
        year: 2020,
        blurb: "LSH attention + reversible layers for long sequences.",
        whyUse:
          "Of historical interest as a long-context attempt; LSH attention is finicky. Mostly displaced by Longformer / FlashAttention.",
        alts: ["Longformer", "BigBird", "FlashAttention"],
      },
      {
        name: "Longformer",
        year: 2020,
        blurb: "Sparse attention combining local windows with a few global tokens.",
        whyUse:
          "When sequences are 4-32k tokens and quadratic attention is the bottleneck. Pick over BigBird for code simplicity; pick over Mamba when you need the existing transformer ecosystem.",
        alts: ["BigBird", "Sliding Window Attention", "Mamba"],
      },
      {
        name: "BigBird",
        year: 2020,
        blurb: "Sparse attention with random + window + global tokens.",
        whyUse:
          "Theoretically expressive sparse pattern (proven Turing-complete with enough tokens). Use Longformer in practice; BigBird's complexity rarely pays off.",
        alts: ["Longformer", "Reformer"],
      },
      {
        name: "Linformer",
        year: 2020,
        blurb: "Low-rank approximation of attention via projection of keys/values.",
        whyUse:
          "Linear attention via projection — pick when you want O(N) attention with simple math. Gives up the guarantee of attending to every token.",
        alts: ["Performer", "Linear Transformer"],
      },
      {
        name: "Performer",
        year: 2020,
        blurb: "Attention via random-feature kernel approximation (FAVOR+).",
        whyUse:
          "Theoretically principled linear attention via kernels. Pick when you specifically want unbiased softmax approximation; Linformer is simpler.",
        alts: ["Linformer", "Linear Transformer"],
      },
      {
        name: "Linear Transformer",
        year: 2020,
        blurb: "Replace softmax with feature-map similarity for O(N) attention.",
        whyUse:
          "Cleanest formulation of linear attention. The conceptual precursor to RetNet and other recurrent-attention hybrids.",
        alts: ["Performer", "RetNet"],
      },
      {
        name: "FlashAttention",
        year: 2022,
        blurb: "IO-aware exact attention computation via tiling.",
        whyUse:
          "Use always — same exact attention math, much less HBM bandwidth. Not a different architecture, but a kernel that makes vanilla attention competitive at long context.",
        alts: ["FlashAttention-2", "FlashAttention-3"],
      },
      {
        name: "FlashAttention-2 / 3",
        year: 2024,
        blurb: "Updated FlashAttention with better parallelism and async memory.",
        whyUse:
          "Latest generation of fused attention kernel. The current default for any transformer training / inference on NVIDIA hardware.",
        alts: ["FlashAttention"],
      },
      {
        name: "Sliding Window Attention",
        year: 2023,
        blurb: "Local-only attention with rolling cache (Mistral, Gemma 2).",
        whyUse:
          "Used in Mistral-class LLMs for unbounded context with bounded memory. Pick when you're training your own LLM and want simple long-context support.",
        alts: ["Longformer", "Sparse Transformer", "Mamba"],
      },
      {
        name: "Sparse Transformer",
        year: 2019,
        blurb: "OpenAI's strided + fixed sparse attention pattern.",
        whyUse:
          "Cited as the conceptual ancestor of all sparse-attention work. Used in early Image GPT and DALL-E.",
        alts: ["Longformer", "BigBird"],
      },
      {
        name: "Routing Transformer",
        year: 2021,
        blurb: "Attention routed via online k-means clustering of tokens.",
        whyUse:
          "Of theoretical interest. The clustering overhead rarely beats simpler sparse patterns in practice.",
        alts: ["Longformer", "Reformer"],
      },
      {
        name: "Synthesizer",
        year: 2020,
        blurb: "Replace QK^T with learned or random attention matrices.",
        whyUse:
          "Showed that content-based attention isn't strictly necessary. Mostly a curiosity; standard attention beats it in most settings.",
        alts: ["Transformer"],
      },
    ],
  },

  {
    slug: "modern-llms",
    title: "Modern LLMs",
    blurb:
      "Decoder-only transformers at the frontier scale, plus their open-source descendants. Architectural differences are now small; recipe and scale dominate.",
    archs: [
      {
        name: "PaLM",
        year: 2022,
        blurb: "Google's 540B-parameter decoder-only LLM with parallel attention/FFN.",
        whyUse:
          "Of historical importance — first credibly-scaled non-OpenAI LLM. Subsumed by PaLM 2 / Gemini.",
        alts: ["PaLM 2", "GPT-4", "Gemini"],
      },
      {
        name: "PaLM 2",
        year: 2023,
        blurb: "Smaller, smarter PaLM with multilingual + reasoning focus.",
        whyUse:
          "Powered Bard / parts of Google products in 2023. Now superseded by Gemini.",
        alts: ["Gemini", "GPT-4"],
      },
      {
        name: "Chinchilla",
        year: 2022,
        blurb: "DeepMind compute-optimal LLM (70B) with the 'Chinchilla scaling laws'.",
        whyUse:
          "Defined the modern scaling-law regime — train smaller models on more tokens. Influences every later open-weight LLM's data budget.",
        alts: ["Gopher", "LLaMA"],
      },
      {
        name: "LLaMA",
        year: 2023,
        blurb: "Meta's open-weight 7B-65B decoder-only LLM.",
        whyUse:
          "The release that opened the open-LLM ecosystem. Cite, don't deploy — pick LLaMA 3 in practice.",
        alts: ["LLaMA 2", "LLaMA 3", "Mistral 7B"],
      },
      {
        name: "LLaMA 2",
        year: 2023,
        blurb: "LLaMA with longer context (4k), commercial licensing, RLHF chat variant.",
        whyUse:
          "Strong open-weight default before LLaMA 3. Pick LLaMA 3 or Mistral / Mixtral today.",
        alts: ["LLaMA 3", "Mistral 7B", "Falcon"],
      },
      {
        name: "LLaMA 3",
        year: 2024,
        blurb: "Meta's 8B / 70B / 405B LLM with stronger pretraining recipe.",
        whyUse:
          "The current open-weight workhorse. Pick the 8B for local inference, 70B for serious tasks, 405B for SOTA-class evals when you can afford the compute.",
        alts: ["Mistral 7B", "Qwen", "Gemma 2"],
      },
      {
        name: "Mistral 7B",
        year: 2023,
        blurb: "7B decoder-only with sliding window attention and grouped-query attention.",
        whyUse:
          "Strong 7B baseline that often beats LLaMA 2 13B. Pick when you want efficient long-context inference at small scale.",
        alts: ["LLaMA 3 8B", "Gemma 2 9B"],
      },
      {
        name: "Mixtral 8x7B",
        year: 2023,
        blurb: "Mistral 7B scaled with sparse mixture-of-experts.",
        whyUse:
          "Pick when you want big-model quality at small-model inference cost. The first widely-adopted open MoE LLM.",
        alts: ["Mixtral 8x22B", "Switch Transformer", "GPT-4"],
      },
      {
        name: "Mixtral 8x22B",
        year: 2024,
        blurb: "Larger Mixtral with more experts and longer context.",
        whyUse:
          "Open MoE flagship for 2024. Pick when you need MoE-quality outputs and have multi-GPU inference.",
        alts: ["Mixtral 8x7B", "DeepSeek-V3"],
      },
      {
        name: "Gemma",
        year: 2024,
        blurb: "Google open-weight LLM derived from Gemini's training recipe.",
        whyUse:
          "When you want a Google-flavored open LLM and don't need the full Gemini API. Pick Gemma 2 unless you specifically need 1.x.",
        alts: ["Gemma 2", "LLaMA 3"],
      },
      {
        name: "Gemma 2",
        year: 2024,
        blurb: "Improved Gemma with sliding-window attention and better recipe.",
        whyUse:
          "Strong 2B / 9B / 27B open-weight family. The companion model to Gemma Scope SAEs (see Circuits chapter on hands-on).",
        alts: ["LLaMA 3", "Mistral 7B"],
      },
      {
        name: "Qwen",
        year: 2023,
        blurb: "Alibaba's open multilingual LLM family.",
        whyUse:
          "Strong on Chinese / English bilingual tasks; competitive on standard benchmarks. Pick over LLaMA when multilingual coverage matters.",
        alts: ["LLaMA 3", "DeepSeek"],
      },
      {
        name: "Falcon",
        year: 2023,
        blurb: "TII (UAE) open-weight LLM with 7B / 40B / 180B variants.",
        whyUse:
          "Was the strongest open LLM briefly in 2023. Mostly displaced by LLaMA 2/3 and Mistral.",
        alts: ["LLaMA 2", "LLaMA 3"],
      },
      {
        name: "Phi",
        year: 2023,
        blurb: "Microsoft's small 'textbook quality' LLM family.",
        whyUse:
          "Pick over LLaMA-family at <3B scale when reasoning matters more than world knowledge — Phi is trained on heavily curated synthetic data.",
        alts: ["LLaMA 3 1B", "Gemma 2B"],
      },
      {
        name: "DeepSeek",
        year: 2024,
        blurb: "Open-weight LLM family from DeepSeek; v2/v3 use MoE.",
        whyUse:
          "Strong open-weight competitor to GPT-4-class APIs. DeepSeek-V3 is the open MoE flagship as of 2024-2025.",
        alts: ["Mixtral", "LLaMA 3 405B", "Qwen"],
      },
      {
        name: "Command-R",
        year: 2024,
        blurb: "Cohere's enterprise-RAG-optimized open-weight LLM.",
        whyUse:
          "Pick when retrieval-augmented generation is the primary workload — Command-R is specifically tuned for citation accuracy and long-context grounding.",
        alts: ["LLaMA 3", "Mixtral"],
      },
      {
        name: "GPT-4",
        year: 2023,
        blurb: "OpenAI's flagship LLM (architecture not public, widely reported MoE).",
        whyUse:
          "The closed-API quality benchmark for two years. Pick when capability matters more than openness; pick Claude when constitutional-AI-style reasoning matters; pick LLaMA 3 405B when openness matters.",
        alts: ["GPT-4o", "Claude", "Gemini Ultra"],
      },
      {
        name: "GPT-4o",
        year: 2024,
        blurb: "OpenAI native multimodal (text/vision/audio) flagship.",
        whyUse:
          "Pick over GPT-4 when audio/vision are core to the application. Same text capability, tighter multimodal integration.",
        alts: ["GPT-4", "Gemini 1.5"],
      },
      {
        name: "Claude",
        year: 2023,
        blurb: "Anthropic's LLM family trained with constitutional AI.",
        whyUse:
          "Pick when long-context (200k+), document analysis, or principled refusals matter. Claude 3.5 Sonnet is the production sweet spot in 2024-2025.",
        alts: ["GPT-4", "Gemini 1.5"],
      },
      {
        name: "Gemini",
        year: 2023,
        blurb: "Google DeepMind's multimodal LLM family (Nano / Pro / Ultra).",
        whyUse:
          "Pick when you want native multimodal-from-pretraining and very-long-context (1-10M tokens in Gemini 1.5). Strong on retrieval over long inputs.",
        alts: ["GPT-4o", "Claude"],
      },
    ],
  },

  {
    slug: "post-transformer",
    title: "State-space & post-transformer architectures",
    blurb:
      "Linear-time alternatives to attention. Modernized RNNs, structured state-space models, and hybrids that promise transformer quality at recurrent compute.",
    archs: [
      {
        name: "S4",
        year: 2021,
        blurb: "Structured state-space model with HiPPO-initialized SSM kernel.",
        whyUse:
          "First state-space model to beat transformers on long-range benchmarks. Conceptually deep but engineering-heavy. Use Mamba in practice.",
        alts: ["S5", "Mamba", "Hyena"],
      },
      {
        name: "S5",
        year: 2022,
        blurb: "Simplified S4 with parallel scan and a single SSM per layer.",
        whyUse:
          "Cleaner formulation of S4 with similar performance. Conceptually closer to what later models built on.",
        alts: ["S4", "Mamba"],
      },
      {
        name: "Mamba",
        year: 2023,
        blurb: "Selective state-space model with input-dependent dynamics.",
        whyUse:
          "Linear-time alternative to transformers with comparable LM quality below ~3B parameters. Pick when you have very long sequences (10k-1M tokens) and want recurrent inference.",
        alts: ["Mamba-2", "Transformer", "Hyena"],
      },
      {
        name: "Mamba-2",
        year: 2024,
        blurb: "Mamba reformulated as a structured matrix variant of attention.",
        whyUse:
          "Pick over Mamba for parallel training efficiency. The bridge that makes Mamba interoperable with attention engineering tooling.",
        alts: ["Mamba", "Transformer"],
      },
      {
        name: "RWKV",
        year: 2023,
        blurb: "Linear attention recast as a recurrent network — 'RNN with transformer power'.",
        whyUse:
          "Pick when you want a transformer-quality LM that's natively recurrent at inference. Trains in parallel, runs sequentially. Independent open-source ecosystem.",
        alts: ["Mamba", "RetNet"],
      },
      {
        name: "RetNet",
        year: 2023,
        blurb: "Retentive Network — Microsoft's parallel-trainable, recurrent-inference architecture.",
        whyUse:
          "Closest cousin of RWKV from a major lab. Choose between RetNet, RWKV, and Mamba based on which open-source ecosystem you want to live in.",
        alts: ["RWKV", "Mamba"],
      },
      {
        name: "Hyena",
        year: 2023,
        blurb: "Long-convolution-based attention replacement.",
        whyUse:
          "Conceptually distinct from SSMs and linear attention; uses learned implicit long convolutions. Striped Hyena combines Hyena and attention layers.",
        alts: ["Mamba", "Striped Hyena"],
      },
      {
        name: "Striped Hyena",
        year: 2023,
        blurb: "Alternating Hyena and attention layers.",
        whyUse:
          "When you want hybrid architectures — attention for short-range, Hyena for long. Together AI's open release.",
        alts: ["Hyena", "Jamba"],
      },
      {
        name: "Jamba",
        year: 2024,
        blurb: "Hybrid Mamba + Transformer + MoE from AI21.",
        whyUse:
          "Pick when you want long-context Mamba advantages plus attention's short-range strength. The hybrid bet, productionized.",
        alts: ["Mamba", "Mixtral"],
      },
      {
        name: "xLSTM",
        year: 2024,
        blurb: "Modern LSTM with exponential gating and matrix memory.",
        whyUse:
          "A 2024 attempt to revive LSTMs with modern training tricks. Of architectural interest; ecosystem is small.",
        alts: ["Mamba", "LSTM"],
      },
      {
        name: "Griffin",
        year: 2024,
        blurb: "DeepMind hybrid: gated linear recurrence + local attention.",
        whyUse:
          "Pick when you want a DeepMind-validated transformer-replacement architecture with strong long-context behavior.",
        alts: ["Mamba", "Jamba"],
      },
    ],
  },

  {
    slug: "gans",
    title: "Generative Adversarial Networks",
    blurb:
      "Generator vs discriminator minimax. The dominant generative paradigm 2014-2020 before diffusion took over for images.",
    archs: [
      {
        name: "GAN",
        year: 2014,
        blurb: "Goodfellow's original generator vs discriminator framework.",
        whyUse:
          "Of historical importance. Notoriously unstable to train. Pick a modern descendant (StyleGAN, BigGAN) in practice.",
        alts: ["DCGAN", "WGAN", "VAE", "DDPM"],
      },
      {
        name: "Conditional GAN",
        year: 2014,
        blurb: "GAN conditioned on a class label or other side information.",
        whyUse:
          "When you want class-conditional sampling. Most modern GANs are conditional in some way.",
        alts: ["GAN", "Pix2Pix"],
      },
      {
        name: "DCGAN",
        year: 2015,
        blurb: "GAN with deep convolutional generator/discriminator and architectural rules.",
        whyUse:
          "First GAN that reliably produced photo-quality images. The training-stability template every later GAN inherited.",
        alts: ["WGAN", "Progressive GAN", "StyleGAN"],
      },
      {
        name: "WGAN",
        year: 2017,
        blurb: "GAN trained with Wasserstein distance instead of Jensen-Shannon.",
        whyUse:
          "Solves mode collapse and training instability of vanilla GAN. Pick over GAN; pick WGAN-GP over WGAN.",
        alts: ["WGAN-GP", "GAN"],
      },
      {
        name: "WGAN-GP",
        year: 2017,
        blurb: "WGAN with gradient penalty replacing weight clipping.",
        whyUse:
          "The standard 'just use this' GAN training recipe for years. Strictly better than WGAN with weight clipping.",
        alts: ["WGAN", "Spectral Normalization GAN"],
      },
      {
        name: "Progressive GAN",
        year: 2017,
        blurb: "GAN that grows resolution layer-by-layer during training.",
        whyUse:
          "First GAN to produce high-resolution (1024x1024) photoreal faces. Architectural ancestor of StyleGAN.",
        alts: ["StyleGAN", "BigGAN"],
      },
      {
        name: "StyleGAN",
        year: 2018,
        blurb: "GAN with style-based generator and AdaIN-modulated layers.",
        whyUse:
          "The face-generation gold standard. Pick StyleGAN3 in practice; v1 is mainly cited.",
        alts: ["StyleGAN2", "StyleGAN3"],
      },
      {
        name: "StyleGAN2",
        year: 2019,
        blurb: "StyleGAN with weight demodulation and improved path-length regularization.",
        whyUse:
          "Cleaner samples than v1, fewer artifacts. Industry default for face / style generation 2020-2023.",
        alts: ["StyleGAN", "StyleGAN3"],
      },
      {
        name: "StyleGAN3",
        year: 2021,
        blurb: "StyleGAN2 with translation/rotation equivariant generator.",
        whyUse:
          "Pick over StyleGAN2 when you need texture sticking — features move with the face instead of with the canvas. The current StyleGAN-family default.",
        alts: ["StyleGAN2"],
      },
      {
        name: "Pix2Pix",
        year: 2016,
        blurb: "Conditional GAN for paired image-to-image translation.",
        whyUse:
          "When you have aligned input/output image pairs. CycleGAN is the unpaired equivalent.",
        alts: ["CycleGAN"],
      },
      {
        name: "CycleGAN",
        year: 2017,
        blurb: "Image-to-image translation without paired data, via cycle consistency.",
        whyUse:
          "Style transfer between unpaired domains (horses ↔ zebras, summer ↔ winter). The unpaired-translation default.",
        alts: ["Pix2Pix"],
      },
      {
        name: "BigGAN",
        year: 2018,
        blurb: "Large-batch class-conditional GAN with truncation trick.",
        whyUse:
          "First GAN to produce diverse high-fidelity ImageNet samples at scale. Showed batch size matters more than architecture.",
        alts: ["StyleGAN", "Latent Diffusion"],
      },
      {
        name: "InfoGAN",
        year: 2016,
        blurb: "GAN that maximizes mutual information between latent and observation.",
        whyUse:
          "When you want disentangled latents in a GAN. Conceptual sibling to β-VAE.",
        alts: ["β-VAE", "GAN"],
      },
    ],
  },

  {
    slug: "flows",
    title: "Normalizing flows & continuous-time models",
    blurb:
      "Generative models defined by invertible transformations. Exact likelihoods, deterministic inversion — the third pillar of generative modeling alongside VAEs and GANs.",
    archs: [
      {
        name: "NICE",
        year: 2014,
        blurb: "Additive coupling layers with unit Jacobian.",
        whyUse:
          "Foundational normalizing flow. Conceptually subsumed by Real NVP.",
        alts: ["Real NVP", "Glow"],
      },
      {
        name: "Real NVP",
        year: 2016,
        blurb: "Affine coupling layers for tractable invertible transformations.",
        whyUse:
          "The default normalizing flow building block. Pick over Glow when you want simplicity; pick over MAF when bidirectional sampling matters.",
        alts: ["Glow", "MAF", "NICE"],
      },
      {
        name: "Glow",
        year: 2018,
        blurb: "Real NVP with invertible 1x1 convolutions.",
        whyUse:
          "Cleaner channel mixing than Real NVP, slightly better samples. Pick over Real NVP when training a flow on images.",
        alts: ["Real NVP", "FFJORD"],
      },
      {
        name: "MAF (Masked Autoregressive Flow)",
        year: 2017,
        blurb: "Autoregressive flow with masked feedforward Jacobian.",
        whyUse:
          "Pick when fast density evaluation matters more than fast sampling — MAF is fast at evaluating, slow at sampling.",
        alts: ["IAF", "Real NVP"],
      },
      {
        name: "IAF (Inverse Autoregressive Flow)",
        year: 2016,
        blurb: "Autoregressive flow with reversed direction — fast to sample.",
        whyUse:
          "Pick over MAF when used as a VAE posterior — sampling is fast, density evaluation is slow but not needed there.",
        alts: ["MAF", "Real NVP"],
      },
      {
        name: "Neural ODE",
        year: 2018,
        blurb: "Treat residual networks as continuous ODE solvers.",
        whyUse:
          "When you want a model whose depth is adaptive (ODE solver chooses tolerance). Conceptually beautiful, computationally expensive.",
        alts: ["FFJORD", "ResNet", "Flow Matching"],
      },
      {
        name: "FFJORD",
        year: 2018,
        blurb: "Continuous-time normalizing flow via Neural ODE.",
        whyUse:
          "Density estimation with no architectural constraints (no need for triangular Jacobians). Slow; use for density modeling research.",
        alts: ["Neural ODE", "Real NVP"],
      },
      {
        name: "Continuous Normalizing Flow",
        year: 2018,
        blurb: "Flows defined by ODE rather than discrete coupling.",
        whyUse:
          "Conceptual frame that links flows to diffusion via Flow Matching. Of theoretical interest.",
        alts: ["FFJORD", "Flow Matching"],
      },
    ],
  },
];
