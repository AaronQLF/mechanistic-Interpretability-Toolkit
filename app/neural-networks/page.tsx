import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata = { title: "Neural Networks" };

export default function NeuralNetsPage() {
  return (
    <ComingSoon
      title="Neural Networks"
      blurb="Linear layers, nonlinearities, embeddings, and the forward pass from first principles. Built up so that every weight in a transformer has a meaning by the time you meet it."
      topics={[
        "Linear layers as matrix multiplications you've already met",
        "Nonlinearities (ReLU, GELU) and what they buy you",
        "Embeddings and one-hot vectors",
        "Layer normalization, residual connections",
        "MLPs, the workhorse block",
      ]}
    />
  );
}
