import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Quant Dev Roadmap",
    template: "%s — Quant Dev Roadmap",
  },
  description:
    "A comprehensive, interview-oriented roadmap for quantitative developers — C++, systems, probability, stochastic calculus, pricing, and trading infrastructure. Companion track to the Mech Interp Toolkit.",
  openGraph: {
    title: "Quant Developer Roadmap",
    description:
      "Interview prep for quant devs: C++, DSA, concurrency, low-latency systems, probability, finance, and trading system design.",
    type: "website",
  },
};

export default function QuantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="theme-quant">{children}</div>;
}
