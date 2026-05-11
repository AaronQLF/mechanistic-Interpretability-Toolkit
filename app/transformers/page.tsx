import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata = { title: "Transformers" };

export default function TransformersPage() {
  return (
    <ComingSoon
      title="Transformers"
      blurb="Self-attention, the residual stream, multi-head attention, and the architecture that became the substrate for nearly every frontier model."
      topics={[
        "Self-attention: queries, keys, values",
        "The residual stream as a shared communication bus",
        "Multi-head attention and why heads specialize",
        "Position embeddings (absolute, RoPE, ALiBi)",
        "From a single block to a full GPT",
      ]}
    />
  );
}
