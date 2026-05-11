import type { ReactNode } from "react";

export function Section({
  id,
  title,
  eyebrow,
  children,
}: {
  id?: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      {eyebrow && (
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          {eyebrow}
        </p>
      )}
      <h2 className="!mt-2 font-sans text-2xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}
