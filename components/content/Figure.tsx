import type { ReactNode } from "react";

export function Figure({
  caption,
  children,
  bleed = true,
}: {
  caption?: ReactNode;
  children: ReactNode;
  bleed?: boolean;
}) {
  return (
    <figure
      className={`my-8 ${bleed ? "figure-bleed" : ""} rounded-xl border border-line bg-paper-raised p-3 sm:p-4`}
    >
      <div className="overflow-hidden rounded-lg">{children}</div>
      {caption && (
        <figcaption className="mt-3 px-1 font-sans text-xs leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
