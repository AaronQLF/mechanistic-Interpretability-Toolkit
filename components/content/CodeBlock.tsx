"use client";

import { Highlight, themes } from "prism-react-renderer";
import { useCallback, useState } from "react";

type Lang = "cpp" | "python" | "sql" | "bash";

const LANG_MAP: Record<Lang, string> = {
  cpp: "cpp",
  python: "python",
  sql: "sql",
  bash: "bash",
};

export function CodeBlock({
  code,
  language = "cpp",
  title,
}: {
  code: string;
  language?: Lang;
  title?: string;
}) {
  const [copied, setCopied] = useState(false);
  const grammar = LANG_MAP[language] ?? "cpp";

  const copy = useCallback(() => {
    void navigator.clipboard.writeText(code.trimEnd());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-line bg-[rgb(24_24_27)] font-mono text-[13px] leading-relaxed text-zinc-100 shadow-sm dark:border-zinc-700 dark:bg-zinc-950">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-700/80 bg-zinc-900/80 px-3 py-2 text-[11px] font-sans font-medium uppercase tracking-wide text-zinc-400">
        <span>{title ?? language}</span>
        <button
          type="button"
          onClick={copy}
          className="rounded border border-zinc-600 px-2 py-0.5 text-[10px] normal-case text-zinc-300 transition hover:border-zinc-400 hover:text-white"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Highlight
        theme={themes.nightOwl}
        code={code.trimEnd()}
        language={grammar}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} thin-scroll m-0 max-h-[min(70vh,520px)] overflow-auto p-4`}
            style={{ ...style, background: "transparent" }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="mr-4 inline-block w-8 select-none text-right text-zinc-600">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
