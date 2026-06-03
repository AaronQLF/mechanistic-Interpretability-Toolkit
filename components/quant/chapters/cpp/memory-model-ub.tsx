import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Quiz } from "@/components/content/Quiz";
import { CodeBlock } from "@/components/content/CodeBlock";
import { cppChapters } from "@/lib/quant";

export default function QuantChapter() {
  return (
    <ChapterShell
      moduleSlug={`quant/cpp`}
      chapterSlug="memory-model-ub"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 12"
      title="Undefined behavior & the memory model"
      lede="Python catches your mistakes with exceptions. C++ trades those safety nets for raw speed: many errors are 'undefined behavior,' where the compiler is allowed to do literally anything. Knowing the landmines — and the tools that find them — is what separates safe C++ from scary C++."
    >
      <h2>The trade C++ makes</h2>
      <p>
        Index past the end of a Python list and you get a clean{" "}
        <code>IndexError</code>. Do the same to a C++ <code>std::vector</code>{" "}
        with <code>[]</code> and you get <strong>undefined behavior (UB)</strong>:
        the standard imposes <em>no requirements</em> at all. It might crash, it
        might silently corrupt nearby memory, it might appear to work — and the
        optimizer is allowed to assume it never happens.
      </p>

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Python spends cycles checking bounds, types, and lifetimes so it can
          raise a tidy exception. C++ skips those checks for speed and trusts you
          not to break the rules. Break them and there is no exception — just UB.
          Speed in exchange for responsibility.
        </p>
      </Callout>

      <h2>The greatest hits of UB</h2>
      <CodeBlock
        language="cpp"
        title="Each line is undefined behavior"
        code={`std::vector<int> v = {1, 2, 3};
int a = v[5];                 // out-of-bounds read (no check with [])

int* p = new int(7);
delete p;
int b = *p;                   // use-after-free

int x;                        // uninitialized...
int c = x + 1;                // ...read of an indeterminate value

int big = 2'000'000'000;
int overflow = big + big;     // signed integer overflow is UB

int* n = nullptr;
int d = *n;                   // null dereference`}
      />

      <p>
        Notice the theme: these are exactly the bugs Python makes impossible or
        turns into exceptions. In C++ they are your job to avoid.
      </p>

      <h2>Why UB is sneakier than a crash</h2>
      <p>
        The dangerous part is not that UB <em>might</em> crash — it is that the
        compiler optimizes <em>assuming UB cannot occur</em>. So a program with
        UB can pass all your tests at <code>-O0</code>, then misbehave at{" "}
        <code>-O2</code>, or break after a compiler upgrade, or only fail in
        production. &ldquo;It works on my machine&rdquo; is the UB anthem.
      </p>

      <Callout variant="pitfall" title="Three that catch newcomers constantly">
        <p>
          <strong>(1)</strong> <code>vector::operator[]</code> does <em>not</em>{" "}
          bounds-check — use <code>.at()</code> when you want an exception.
        </p>
        <p>
          <strong>(2)</strong> Reading an uninitialized variable is UB; always
          initialize (<code>int x = 0;</code> or <code>int x{};</code>).
        </p>
        <p>
          <strong>(3)</strong> Signed integer overflow is UB (unsigned overflow
          merely wraps). Do not rely on signed wraparound.
        </p>
      </Callout>

      <h2>The data race: UB in the threading world</h2>
      <p>
        The C++ <strong>memory model</strong> says: if two threads access the
        same memory location, at least one writes, and there is no
        synchronization between them, that is a <strong>data race</strong> — and
        a data race is UB. Correct multithreaded C++ uses a <code>std::mutex</code>{" "}
        or <code>std::atomic</code> to order accesses (the concurrency module digs
        in; here just register that unsynchronized sharing is undefined, not
        merely &ldquo;racy but usually fine&rdquo;).
      </p>

      <h2>The tools that turn UB into a clear error</h2>
      <p>
        You are not meant to find this by eyeballing code. Lean on the toolchain:
      </p>
      <CodeBlock
        language="bash"
        title="Make the compiler and runtime hunt UB for you"
        code={`g++ -Wall -Wextra -Wpedantic        # turn on the warnings
g++ -fsanitize=address  ...          # ASan: out-of-bounds, use-after-free
g++ -fsanitize=undefined ...         # UBSan: overflow, bad casts, null deref
g++ -fsanitize=thread   ...          # TSan: data races
valgrind ./app                       # leaks + invalid memory access`}
      />

      <Callout variant="desk">
        <p>
          On serious teams, CI runs the test suite under AddressSanitizer and
          UndefinedBehaviorSanitizer. Treat a sanitizer report like a failing
          test, not a suggestion. The cheapest UB is the one a tool catches
          before review.
        </p>
      </Callout>

      <Callout variant="interview">
        <p>
          Expect: &ldquo;What is undefined behavior? Give examples.&rdquo; and
          &ldquo;How do you find it?&rdquo; A great answer names a few classics
          (out-of-bounds, use-after-free, signed overflow, data race), explains
          that the optimizer assumes UB never happens (so symptoms are
          nondeterministic), and cites sanitizers plus <code>.at()</code> and{" "}
          <code>-Wall -Wextra</code> as defenses.
        </p>
      </Callout>

      <Quiz
        question="A program passes all tests in a debug build but produces wrong results in an optimized (-O2) release build. What should you suspect first?"
        choices={[
          {
            id: "a",
            label: "A compiler bug.",
            explain:
              "Possible but rare. The optimizer exposing latent undefined behavior is far more common.",
          },
          {
            id: "b",
            label:
              "Undefined behavior the optimizer is now exploiting (e.g. uninitialized read, overflow, aliasing).",
            correct: true,
            explain:
              "Optimizations assume no UB. Code that 'happened to work' unoptimized can break once the optimizer relies on those assumptions. Run the sanitizers.",
          },
          {
            id: "c",
            label: "The -O2 flag is unsafe and should be avoided.",
            explain:
              "-O2 is standard for release builds. It does not create bugs; it reveals existing UB.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Catch four bugs with four tools.</strong> Write a tiny
              program that deliberately contains: an out-of-bounds vector read, a
              use-after-free, a signed overflow, and (optionally) a data race
              across two threads.
            </p>
            <ol>
              <li>
                Build it plain and note that it may <em>appear</em> to work.
              </li>
              <li>
                Rebuild under <code>-fsanitize=address</code> and{" "}
                <code>-fsanitize=undefined</code> (and <code>-fsanitize=thread</code>{" "}
                for the race) and capture each diagnostic.
              </li>
              <li>
                Fix each: use <code>.at()</code>, a <code>unique_ptr</code> or
                proper lifetime, a wider/unsigned type or overflow check, and a{" "}
                <code>mutex</code>. Re-run clean.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            Run ASan and UBSan together for the single-thread bugs; TSan must be
            a separate build (it is incompatible with ASan). Each report names
            the file and line — practice reading them, since this is exactly the
            debugging loop you will use on the job.
          </>
        }
        solution={
          <>
            <p>
              ASan pinpoints the out-of-bounds read and the use-after-free with
              the offending line and a shadow-memory trace. UBSan flags{" "}
              &ldquo;signed integer overflow&rdquo; precisely. TSan reports the
              racing accesses and the two stacks involved. After the fixes —{" "}
              <code>.at()</code> throws instead of UB, a smart pointer removes the
              dangling access, a checked/wider type avoids overflow, and a{" "}
              <code>mutex</code> orders the shared writes — all sanitizers go
              quiet.
            </p>
            <p>
              The durable habit: when something is mysterious in C++, reach for a
              sanitizer before a debugger. It converts &ldquo;anything can
              happen&rdquo; into &ldquo;here is the exact line.&rdquo;
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
