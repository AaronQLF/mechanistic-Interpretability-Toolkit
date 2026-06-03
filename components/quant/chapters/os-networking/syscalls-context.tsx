import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { CodeBlock } from "@/components/content/CodeBlock";
import { osNetworkingChapters } from "@/lib/quant";

export default function QuantChapter() {
  return (
    <ChapterShell
      moduleSlug={`quant/os-networking`}
      chapterSlug="syscalls-context"
      chapters={osNetworkingChapters}
      eyebrow={"OS & Networking · 03"}
      title={"Syscalls & context switches"}
      lede={"User vs kernel mode, cost of read/write, and batching I/O."}
    >
      <h2>What interviewers want here</h2>
      <p>
        You should be able to explain <strong>{"Syscalls & context switches"}</strong> in plain language,
        then tighten the definition, then work a small numeric or code example in
        under five minutes — without sounding like you memorized a blog post.
      </p>

      <Callout variant="interview">
        Expect follow-ups that stress trade-offs: correctness vs performance,
        when assumptions break, and how you would test your answer.
      </Callout>

      <h2>Core ideas</h2>
      <p>{"User vs kernel mode, cost of read/write, and batching I/O. This chapter stays deliberately dense: skim once for the map, then work the challenge cold before you peek at the solution."}</p>

      <Callout variant="desk">
        On a real desk, this topic shows up when code, models, or incidents bump
        into the same abstractions — the interview is checking that transfer.
      </Callout>

      <h2>Mini pattern</h2>
      <CodeBlock
        language="cpp"
        title="Skeleton you can adapt"
        code={`// syscalls context — adapt types and invariants
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
`}
      />

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
              <strong>Problem {"Syscalls & context switches"}</strong> Pick one concrete sub-problem
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
