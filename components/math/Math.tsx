"use client";

import katex from "katex";
import { useMemo } from "react";

type MProps = {
  children: string;
  display?: boolean;
  className?: string;
};

export function M({ children, display = false, className }: MProps) {
  const html = useMemo(
    () =>
      katex.renderToString(children, {
        throwOnError: false,
        displayMode: display,
        strict: "ignore",
        trust: false,
      }),
    [children, display]
  );

  if (display) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Block({ children, className }: { children: string; className?: string }) {
  return <M display className={className}>{children}</M>;
}
