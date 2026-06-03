import type { ReactNode } from "react";

type Variant =
  | "intuition"
  | "mechinterp"
  | "pitfall"
  | "note"
  | "interview"
  | "desk";

const styles: Record<
  Variant,
  { label: string; ring: string; bg: string; icon: ReactNode }
> = {
  intuition: {
    label: "Intuition",
    ring: "border-blue-500/30",
    bg: "bg-blue-500/[0.04] dark:bg-blue-400/[0.07]",
    icon: <Bulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />,
  },
  mechinterp: {
    label: "Where this shows up in mech interp",
    ring: "border-amber-500/30",
    bg: "bg-amber-500/[0.05] dark:bg-amber-400/[0.07]",
    icon: <Brain className="h-4 w-4 text-amber-600 dark:text-amber-400" />,
  },
  pitfall: {
    label: "Watch out",
    ring: "border-rose-500/30",
    bg: "bg-rose-500/[0.04] dark:bg-rose-400/[0.07]",
    icon: <Warn className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
  },
  note: {
    label: "Note",
    ring: "border-line",
    bg: "bg-paper-sunken",
    icon: <Dot className="h-4 w-4 text-ink-muted" />,
  },
  interview: {
    label: "In the interview",
    ring: "border-emerald-500/35",
    bg: "bg-emerald-500/[0.06] dark:bg-emerald-400/[0.08]",
    icon: <Mic className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />,
  },
  desk: {
    label: "On the desk",
    ring: "border-violet-500/30",
    bg: "bg-violet-500/[0.05] dark:bg-violet-400/[0.08]",
    icon: <Terminal className="h-4 w-4 text-violet-700 dark:text-violet-400" />,
  },
};

export function Callout({
  variant = "note",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) {
  const s = styles[variant];
  return (
    <aside
      className={`my-6 rounded-lg border ${s.ring} ${s.bg} p-4 font-sans text-sm text-ink`}
    >
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
        {s.icon}
        <span>{title ?? s.label}</span>
      </div>
      <div className="space-y-2 text-[0.95rem] leading-relaxed text-ink">
        {children}
      </div>
    </aside>
  );
}

function Bulb({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1.2 1.4 1.5 2.5h5c.3-1.1.8-1.8 1.5-2.5A6 6 0 0 0 12 3z" />
    </svg>
  );
}

function Brain({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15A2.5 2.5 0 0 1 9.5 22 2.5 2.5 0 0 1 7 19.5 2.5 2.5 0 0 1 4.5 17 2.5 2.5 0 0 1 3 14.5 2.5 2.5 0 0 1 4 9.5 2.5 2.5 0 0 1 5.5 5 2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 2.5 2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0 2.5-2.5 2.5 2.5 0 0 0 1.5-2.5 2.5 2.5 0 0 0-1-5 2.5 2.5 0 0 0-1.5-4.5 2.5 2.5 0 0 0-4-3z" />
    </svg>
  );
}

function Warn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function Dot({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Mic({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18v4" />
      <path d="M8 22h8" />
    </svg>
  );
}

function Terminal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m4 17 6-6-6-6" />
      <path d="M12 19h8" />
      <rect x="2" y="3" width="20" height="18" rx="2" />
    </svg>
  );
}
