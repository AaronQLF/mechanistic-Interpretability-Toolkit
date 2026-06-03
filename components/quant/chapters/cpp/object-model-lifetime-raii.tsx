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
      chapterSlug="object-model-lifetime-raii"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 03"
      title="Object lifetime & RAII"
      lede="Python has a garbage collector that cleans up 'eventually.' C++ destroys objects at exact, predictable moments — and that predictability is the foundation of the most important idiom in the language: RAII."
    >
      <h2>No garbage collector — and that is good news</h2>
      <p>
        In Python you create objects and forget them; the garbage collector
        frees memory at some unpredictable later time. In C++ there is no GC.
        Instead, every object has a precise <strong>lifetime</strong>, and when
        it ends the object&apos;s <strong>destructor</strong> runs immediately.
        &ldquo;Immediately&rdquo; is the magic word.
      </p>

      <CodeBlock
        language="cpp"
        title="A stack object dies at the closing brace"
        code={`#include <iostream>

struct Noisy {
    Noisy()  { std::cout << "born\\n"; }   // constructor
    ~Noisy() { std::cout << "died\\n"; }   // destructor
};

int main() {
    std::cout << "before\\n";
    {
        Noisy n;                  // prints "born"
        std::cout << "inside\\n";
    }                             // prints "died" right HERE, at the brace
    std::cout << "after\\n";
}
// Output: before / born / inside / died / after`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Python&apos;s <code>__del__</code> runs &ldquo;sometime, maybe.&rdquo;
          C++&apos;s destructor runs <strong>deterministically</strong>: exactly
          when the object goes out of scope (or you delete it). You can rely on
          the timing, so you can use it to manage real resources.
        </p>
      </Callout>

      <h2>Where objects live: three storage durations</h2>
      <ul>
        <li>
          <strong>Automatic</strong> (&ldquo;on the stack&rdquo;): local
          variables. Created when declared, destroyed at the end of their{" "}
          <code>{`{ }`}</code> block. This is the common, fast, safe case.
        </li>
        <li>
          <strong>Dynamic</strong> (&ldquo;on the heap&rdquo;): created with{" "}
          <code>new</code>, lives until you <code>delete</code> it. Manual and
          error-prone — which is why we wrap it (see smart pointers).
        </li>
        <li>
          <strong>Static</strong>: lives for the whole program (globals,{" "}
          <code>static</code> locals).
        </li>
      </ul>

      <h2>RAII: tie a resource to an object&apos;s lifetime</h2>
      <p>
        RAII stands for <em>Resource Acquisition Is Initialization</em>. It is an
        ugly name for a beautiful idea: <strong>acquire a resource in a
        constructor, release it in the destructor.</strong> Then you can never
        forget to release it — the destructor runs automatically, even if an
        exception is thrown.
      </p>
      <p>
        You already know the Python version: the <code>with</code> statement.
      </p>

      <CodeBlock
        language="python"
        title="Python: 'with' guarantees the file closes"
        code={`with open("data.csv") as f:   # acquire
    process(f)
# file is closed here, even if process() raised`}
      />

      <CodeBlock
        language="cpp"
        title="C++: the object's scope IS the 'with' block"
        code={`#include <fstream>

void load() {
    std::ifstream f("data.csv");  // constructor opens the file
    process(f);
}                                 // destructor closes it — automatically,
                                  // even if process() throws`}
      />

      <Callout variant="intuition" title="The one-liner">
        <p>
          Python&apos;s <code>with</code> = explicit, per-use. C++&apos;s RAII =
          built into every object&apos;s lifetime. You do not need a special
          keyword; <em>scope itself</em> is the resource boundary.
        </p>
      </Callout>

      <h2>RAII is everywhere in the standard library</h2>
      <p>
        You have been using RAII without naming it. <code>std::vector</code>{" "}
        frees its memory in its destructor. <code>std::lock_guard</code> unlocks
        a mutex in its destructor. <code>std::unique_ptr</code> deletes its
        pointee. The pattern is the same every time.
      </p>

      <CodeBlock
        language="cpp"
        title="lock_guard: a lock that cannot leak"
        code={`#include <mutex>
std::mutex m;

void update() {
    std::lock_guard<std::mutex> guard(m);  // locks here
    // ... critical section ...
}                                          // unlocks here, guaranteed`}
      />

      <Callout variant="pitfall" title="Do not return a reference to a local">
        <p>
          Because locals die at the closing brace, returning a reference or
          pointer to one gives you a dangling handle to a destroyed object —
          undefined behavior. This is a favorite interview trap.
        </p>
        <CodeBlock
          language="cpp"
          title="Dangling: classic mistake"
          code={`const std::string& greeting() {
    std::string s = "hi";
    return s;            // BUG: s is destroyed when the function returns
}                        // the caller holds a reference to garbage`}
        />
      </Callout>

      <Callout variant="interview">
        <p>
          &ldquo;What is RAII and why does it matter?&rdquo; is asked in almost
          every C++ screen. Strong answer: tie resource ownership to object
          lifetime so cleanup is automatic and exception-safe; cite{" "}
          <code>unique_ptr</code>, <code>lock_guard</code>, and{" "}
          <code>vector</code> as examples; contrast with manual{" "}
          <code>new</code>/<code>delete</code> or try/finally.
        </p>
      </Callout>

      <Quiz
        question="Why is RAII more reliable than remembering to call close() at the end of a function?"
        choices={[
          {
            id: "a",
            label: "It is faster at runtime.",
            explain:
              "RAII is about correctness, not speed. The destructor call is essentially free.",
          },
          {
            id: "b",
            label:
              "The destructor runs automatically on every exit path, including exceptions and early returns.",
            correct: true,
            explain:
              "A manual close() is skipped if an exception is thrown or you return early. The destructor cannot be skipped — that is the whole point.",
          },
          {
            id: "c",
            label: "It moves the object to the heap.",
            explain:
              "RAII works best with stack objects; it has nothing to do with moving to the heap.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Write your own RAII timer.</strong> Build a small{" "}
              <code>ScopedTimer</code> class that records the current time in its
              constructor and, in its destructor, prints how long the enclosing
              scope took.
            </p>
            <p>
              Then use it to time two nested scopes, and make sure it still
              prints correctly when the inner scope throws an exception that the
              outer scope catches.
            </p>
          </>
        }
        hint={
          <>
            Use <code>std::chrono::steady_clock::now()</code> in the constructor,
            store it, and subtract in the destructor. The destructor must not
            throw. Confirm the &ldquo;throws but still prints&rdquo; behavior — it
            is the entire reason RAII exists.
          </>
        }
        solution={
          <>
            <CodeBlock
              language="cpp"
              title="ScopedTimer"
              code={`#include <chrono>
#include <iostream>

class ScopedTimer {
    using Clock = std::chrono::steady_clock;
    Clock::time_point start_ = Clock::now();
    const char* name_;
public:
    explicit ScopedTimer(const char* name) : name_(name) {}
    ~ScopedTimer() {
        auto us = std::chrono::duration_cast<std::chrono::microseconds>(
            Clock::now() - start_).count();
        std::cout << name_ << ": " << us << " us\\n";
    }
};`}
            />
            <p>
              When the inner scope throws, stack unwinding destroys{" "}
              <code>ScopedTimer</code> on the way out, so it still prints. That
              guarantee — cleanup during unwinding — is what makes RAII the
              backbone of exception-safe C++.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
