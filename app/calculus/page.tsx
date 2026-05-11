import { ComingSoon } from "@/components/content/ComingSoon";

export const metadata = { title: "Calculus" };

export default function CalculusPage() {
  return (
    <ComingSoon
      title="Calculus"
      blurb="Derivatives, gradients, and the chain rule — the math that lets a network learn, and the math that lets us inspect its sensitivities after training."
      topics={[
        "Single-variable derivatives, intuitively",
        "Gradients of scalar functions of many variables",
        "The chain rule and backpropagation",
        "Jacobians and Hessians",
        "Gradient-based attribution methods used in interpretability",
      ]}
    />
  );
}
