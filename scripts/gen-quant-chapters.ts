/**
 * Generates components/quant/chapters/<module>/<slug>.tsx and registry.ts
 * Run: npx tsx scripts/gen-quant-chapters.ts
 *
 * Chapters whose `module` is listed in HAND_AUTHORED_MODULES (or whose
 * `module/slug` key is in HAND_AUTHORED_CHAPTERS) are NOT overwritten — they
 * are hand-written. They are still wired into registry.ts so navigation works.
 */
import fs from "node:fs";
import path from "node:path";
import { quantModules } from "../lib/quant";

const ROOT = path.join(process.cwd(), "components", "quant", "chapters");

/** Whole modules that are hand-authored and must never be overwritten. */
const HAND_AUTHORED_MODULES = new Set<string>(["cpp"]);

/** Individual `module/slug` chapters that are hand-authored. */
const HAND_AUTHORED_CHAPTERS = new Set<string>([]);

function isHandAuthored(moduleSlug: string, chapterSlug: string): boolean {
  return (
    HAND_AUTHORED_MODULES.has(moduleSlug) ||
    HAND_AUTHORED_CHAPTERS.has(`${moduleSlug}/${chapterSlug}`)
  );
}

const CHAPTER_IMPORT: Record<string, string> = {
  cpp: "cppChapters",
  dsa: "dsaChapters",
  concurrency: "concurrencyChapters",
  systems: "systemsChapters",
  "os-networking": "osNetworkingChapters",
  probability: "quantProbabilityChapters",
  statistics: "statisticsChapters",
  brainteasers: "brainteasersChapters",
  stochastic: "stochasticChapters",
  finance: "financeChapters",
  systemdesign: "systemdesignChapters",
  python: "pythonChapters",
  sql: "sqlChapters",
  interview: "interviewChapters",
};

const WIDGET: Record<string, Partial<Record<string, string>>> = {
  dsa: {
    "complexity-amortized": "BigOExplorer",
    "sorting-searching": "SortingVisualizer",
  },
  systems: { "latency-hierarchy": "LatencyNumbersChart" },
  systemdesign: {
    "limit-order-book": "OrderBookSimulator",
    "matching-engine": "OrderBookSimulator",
  },
  finance: {
    "binomial-model": "BinomialLattice",
    "black-scholes-derivation": "BlackScholesGreeksExplorer",
    "greeks-delta-hedging": "BlackScholesGreeksExplorer",
  },
  stochastic: {
    "monte-carlo-variance": "MonteCarloGBM",
    "random-walks-brownian": "RandomWalkBrownian",
  },
  probability: { "markov-chains-basics": "MarkovChainExplorer" },
};

const WIDGET_IMPORT: Record<string, string> = {
  BigOExplorer: "@/components/viz/quant/BigOExplorer",
  LatencyNumbersChart: "@/components/viz/quant/LatencyNumbersChart",
  OrderBookSimulator: "@/components/viz/quant/OrderBookSimulator",
  BinomialLattice: "@/components/viz/quant/BinomialLattice",
  BlackScholesGreeksExplorer: "@/components/viz/quant/BlackScholesGreeksExplorer",
  MonteCarloGBM: "@/components/viz/quant/MonteCarloGBM",
  RandomWalkBrownian: "@/components/viz/quant/RandomWalkBrownian",
  MarkovChainExplorer: "@/components/viz/quant/MarkovChainExplorer",
  SortingVisualizer: "@/components/viz/quant/SortingVisualizer",
};

function widgetBlock(mod: string, slug: string): string {
  const w = WIDGET[mod]?.[slug];
  if (!w) return "";
  return `
      <Figure caption="Interactive — scrub parameters and watch the picture change.">
        <${w} />
      </Figure>`;
}

function widgetImports(mod: string, slug: string): string {
  const w = WIDGET[mod]?.[slug];
  if (!w) return "";
  const p = WIDGET_IMPORT[w];
  if (!p) return "";
  return `import { ${w} } from "${p}";\n`;
}

function jsxString(s: string): string {
  return JSON.stringify(s);
}

function fileForChapter(
  modSlug: string,
  ch: { slug: string; title: string; blurb: string },
  index: number,
  modTitle: string
): string {
  const arr = CHAPTER_IMPORT[modSlug];
  if (!arr) throw new Error(`No chapter import for ${modSlug}`);
  const eyebrow = `${modTitle} · ${String(index + 1).padStart(2, "0")}`;
  const wImports = widgetImports(modSlug, ch.slug);
  const wBody = widgetBlock(modSlug, ch.slug);
  const figImport =
    wBody.trim().length > 0
      ? `import { Figure } from "@/components/content/Figure";\n`
      : "";
  const ledeJs = jsxString(ch.blurb);
  const titleJs = jsxString(ch.title);
  const coreTail =
    " This chapter stays deliberately dense: skim once for the map, then work the challenge cold before you peek at the solution.";
  const coreP = jsxString(ch.blurb + coreTail);

  return `${wImports}${figImport}import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { CodeBlock } from "@/components/content/CodeBlock";
import { ${arr} } from "@/lib/quant";

export default function QuantChapter() {
  return (
    <ChapterShell
      moduleSlug={\`quant/${modSlug}\`}
      chapterSlug="${ch.slug}"
      chapters={${arr}}
      eyebrow={${jsxString(eyebrow)}}
      title={${titleJs}}
      lede={${ledeJs}}
    >
      <h2>What interviewers want here</h2>
      <p>
        You should be able to explain <strong>{${titleJs}}</strong> in plain language,
        then tighten the definition, then work a small numeric or code example in
        under five minutes — without sounding like you memorized a blog post.
      </p>

      <Callout variant="interview">
        Expect follow-ups that stress trade-offs: correctness vs performance,
        when assumptions break, and how you would test your answer.
      </Callout>

      <h2>Core ideas</h2>
      <p>{${coreP}}</p>

      <Callout variant="desk">
        On a real desk, this topic shows up when code, models, or incidents bump
        into the same abstractions — the interview is checking that transfer.
      </Callout>

      <h2>Mini pattern</h2>
      <CodeBlock
        language="cpp"
        title="Skeleton you can adapt"
        code={\`// ${ch.slug.replace(/-/g, " ")} — adapt types and invariants
#include <cstdint>
#include <vector>

struct Context {
  std::vector<std::int64_t> scratch;
  explicit Context(std::size_t n) : scratch(n) {}
};

bool step(Context& ctx) {
  (void)ctx;
  // TODO: implement one clear step of your algorithm
  return true;
}
\`}
      />${wBody}

      <Quiz
        question="Which habit most reduces silly mistakes in a timed interview?"
        choices={[
          { id: "a", label: "Skip examples and go straight to optimized code." },
          {
            id: "b",
            label: "State invariants and edge cases before coding.",
            correct: true,
            explain:
              "Interviewers grade your process. Naming invariants ties your code to a contract they can follow.",
          },
          { id: "c", label: "Memorize every STL method name perfectly." },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Problem {${titleJs}}</strong> Pick one concrete sub-problem
              from this chapter (a definition you would whiteboard, a small
              implementation, or a 3-minute verbal on a failure mode).
            </p>
            <p>
              Spend <strong>25 minutes</strong> under interview rules: no internet,
              state assumptions aloud, finish with tests or checks you would run on
              the desk.
            </p>
          </>
        }
        hint={
          <>
            If you freeze, reduce to the smallest n that still captures the bug or
            idea — often n = 2 or 3. Solve that instance, then generalize.
          </>
        }
        solution={
          <>
            <p>
              There is no single correct answer — the point is reproducible process.
              A strong solution names <em>inputs, outputs, invariants, complexity,</em>{" "}
              and <em>how you would validate</em> (unit tests, fuzz, microbench, or
              proof sketch).
            </p>
            <p>
              Revisit after two sleep cycles with a different sub-problem so you
              cannot pattern-match your old writeup.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
`;
}

function main() {
  fs.mkdirSync(ROOT, { recursive: true });
  const registryLines: string[] = [
    `/* eslint-disable import/max-dependencies -- generated */`,
    `import type { ComponentType } from "react";`,
    ``,
  ];
  const regEntries: string[] = [];

  for (const mod of quantModules) {
    const mdir = path.join(ROOT, mod.slug);
    fs.mkdirSync(mdir, { recursive: true });
    const chapters = mod.chapters ?? [];
    chapters.forEach((ch) => {
      const fp = path.join(mdir, `${ch.slug}.tsx`);
      const idx = chapters.findIndex((c) => c.slug === ch.slug);
      if (isHandAuthored(mod.slug, ch.slug)) {
        if (!fs.existsSync(fp)) {
          throw new Error(
            `Hand-authored chapter missing: ${mod.slug}/${ch.slug} (expected ${fp})`
          );
        }
        // Preserve the hand-written file; only wire it into the registry below.
      } else {
        fs.writeFileSync(fp, fileForChapter(mod.slug, ch, idx, mod.title));
      }
      const key = `${mod.slug}/${ch.slug}`;
      const varName =
        `Q_${mod.slug.replace(/-/g, "_")}_${ch.slug.replace(/-/g, "_")}`.replace(
          /[^a-zA-Z0-9_]/g,
          "_"
        );
      registryLines.push(`import ${varName} from "./${mod.slug}/${ch.slug}";`);
      regEntries.push(`  "${key}": ${varName},`);
    });
  }

  registryLines.push(
    ``,
    `const registry: Record<string, ComponentType> = {`,
    ...regEntries,
    `};`,
    ``,
    `export function getQuantChapterComponent(`,
    `  moduleSlug: string,`,
    `  chapterSlug: string`,
    `): ComponentType | undefined {`,
    `  return registry[\`\${moduleSlug}/\${chapterSlug}\`];`,
    `}`,
    ``
  );
  fs.writeFileSync(path.join(ROOT, "registry.ts"), registryLines.join("\n"));
  console.log("Generated quant chapters + registry.ts");
}

main();
