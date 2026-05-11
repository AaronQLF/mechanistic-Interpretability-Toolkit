import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata = { title: "Probability" };

export default function ProbabilityPage() {
  return (
    <ComingSoon
      title="Probability"
      blurb="Distributions, expectation, entropy, and KL divergence — the toolbox for talking about what a model 'believes' and how that belief shifts."
      topics={[
        "Random variables and distributions",
        "Expectation, variance, and the law of large numbers",
        "Entropy, cross-entropy, and KL divergence — what 'logits' actually are",
        "Sampling vs. greedy decoding",
        "How loss functions encode probabilistic assumptions",
      ]}
    />
  );
}
