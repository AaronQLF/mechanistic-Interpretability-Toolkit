import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata = { title: "Mech-interp Circuits" };

export default function CircuitsPage() {
  return (
    <ComingSoon
      title="Mech-interp Circuits"
      blurb="Induction heads, indirect object identification, sparse autoencoders, and the practice of finding human-readable computation inside large models."
      topics={[
        "Induction heads and in-context learning",
        "Indirect object identification (IOI)",
        "Activation patching and causal interventions",
        "Sparse autoencoders and feature dictionaries",
        "Reading circuit diagrams the way an electrical engineer would",
      ]}
    />
  );
}
