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
      chapterSlug="smart-pointers-ownership"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 06"
      title="Smart pointers: who owns this?"
      lede="Python's garbage collector decides when memory is freed. In C++ you decide — but smart pointers let you express that decision in the type system so cleanup happens automatically and correctly."
    >
      <h2>The question Python never asks you</h2>
      <p>
        In Python you allocate freely and the garbage collector reclaims memory
        later. In C++, every heap allocation needs an <strong>owner</strong>: the
        code responsible for freeing it. Get ownership wrong and you leak memory,
        free it twice, or use it after freeing. Smart pointers make ownership{" "}
        <em>explicit and automatic</em>.
      </p>

      <CodeBlock
        language="cpp"
        title="The old, manual, dangerous way"
        code={`Widget* w = new Widget();   // who frees this? when?
use(w);
delete w;                   // easy to forget, or do twice, or skip on throw`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Fun fact: CPython manages memory with <strong>reference
          counting</strong>. That is almost exactly what{" "}
          <code>std::shared_ptr</code> does. So you already know one smart
          pointer — C++ just makes you choose it on purpose, and offers a cheaper
          single-owner option too.
        </p>
      </Callout>

      <h2><code>unique_ptr</code>: exactly one owner</h2>
      <p>
        <code>std::unique_ptr&lt;T&gt;</code> owns a heap object alone. It cannot
        be copied (that would create a second owner), but it can be{" "}
        <em>moved</em> (transfer ownership). When it goes out of scope, it
        deletes the object — RAII again. It has zero runtime overhead versus a
        raw pointer. This should be your default.
      </p>

      <CodeBlock
        language="cpp"
        title="make_unique: sole ownership, auto cleanup"
        code={`#include <memory>

auto w = std::make_unique<Widget>();   // w owns a Widget
use(*w);                               // dereference like a normal pointer
// no delete needed — freed automatically when w goes out of scope

auto w2 = std::move(w);   // ownership transferred; w is now empty (nullptr)`}
      />

      <h2><code>shared_ptr</code>: shared ownership by counting</h2>
      <p>
        <code>std::shared_ptr&lt;T&gt;</code> lets several owners share one
        object. It keeps a reference count; when the last <code>shared_ptr</code>{" "}
        goes away, the object is freed. Convenient, but not free: the count is
        atomic (thread-safe), which costs a little on every copy. Use it only
        when ownership is <em>genuinely</em> shared.
      </p>

      <CodeBlock
        language="cpp"
        title="shared_ptr: many owners, freed at the last one"
        code={`auto a = std::make_shared<Widget>();   // count = 1
auto b = a;                            // count = 2 (b shares ownership)
// ... when both a and b are gone, count hits 0 and the Widget is freed`}
      />

      <h2><code>weak_ptr</code>: look without owning</h2>
      <p>
        A <code>std::weak_ptr&lt;T&gt;</code> observes a{" "}
        <code>shared_ptr</code>&apos;s object without keeping it alive. Its main
        job is breaking <strong>reference cycles</strong> — two objects that hold
        <code>shared_ptr</code>s to each other would keep each other&apos;s count
        above zero forever, leaking. (This is the same problem Python solves with{" "}
        <code>weakref</code>.)
      </p>

      <CodeBlock
        language="cpp"
        title="weak_ptr breaks a cycle"
        code={`struct Node {
    std::shared_ptr<Node> next;     // owns the next node
    std::weak_ptr<Node>   prev;     // observes the previous — does NOT own
};
// Using shared_ptr both ways would create a cycle that never frees.`}
      />

      <h2>Raw pointers are fine — for <em>borrowing</em></h2>
      <p>
        After all this, raw pointers still have a place: as <strong>non-owning
        observers</strong>. If a function just needs to look at an object it does
        not own, take a <code>T*</code> or <code>const T&amp;</code>. The rule of
        thumb: <strong>owning = smart pointer; borrowing = raw pointer or
        reference.</strong>
      </p>

      <CodeBlock
        language="cpp"
        title="Pass ownership vs pass a view"
        code={`// Takes ownership (caller gives it up):
void consume(std::unique_ptr<Widget> w);

// Just borrows for the call (caller keeps ownership):
void inspect(const Widget& w);
void inspect(const Widget* w);   // if it might be null`}
      />

      <Callout variant="interview">
        <p>
          Hot questions: &ldquo;<code>unique_ptr</code> vs{" "}
          <code>shared_ptr</code> — which is the default and why?&rdquo;
          (unique_ptr; shared adds an atomic refcount cost). &ldquo;What is{" "}
          <code>weak_ptr</code> for?&rdquo; (breaking cycles / safe observation).
          &ldquo;Why <code>make_unique</code>/<code>make_shared</code> over a raw{" "}
          <code>new</code>?&rdquo; (exception safety and, for shared, one
          allocation instead of two).
        </p>
      </Callout>

      <Callout variant="pitfall" title="Two gotchas">
        <p>
          <strong>(1)</strong> Never build two smart pointers from the same raw
          pointer — they will both try to free it. Always go through{" "}
          <code>make_unique</code>/<code>make_shared</code>.
        </p>
        <p>
          <strong>(2)</strong> <code>shared_ptr</code> cycles leak silently. If
          two objects point at each other, make one direction a{" "}
          <code>weak_ptr</code>.
        </p>
      </Callout>

      <Quiz
        question="You allocate an object that will have a single, clear owner for its whole life. Which type?"
        choices={[
          {
            id: "a",
            label: "std::shared_ptr",
            explain:
              "shared_ptr adds atomic reference-counting overhead you do not need when ownership is not actually shared.",
          },
          {
            id: "b",
            label: "std::unique_ptr",
            correct: true,
            explain:
              "Single owner, zero overhead vs a raw pointer, automatic cleanup. This is the right default.",
          },
          {
            id: "c",
            label: "A raw owning pointer with manual delete.",
            explain:
              "That reintroduces every bug smart pointers were created to remove (leaks, double-free, leaks on exceptions).",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Model a tree, then leak it, then fix it.</strong>
            </p>
            <ol>
              <li>
                Build a tree where each node holds{" "}
                <code>std::shared_ptr</code> children and a{" "}
                <code>shared_ptr</code> back-pointer to its parent. Add a noisy
                destructor.
              </li>
              <li>
                Build a small tree, drop your references, and observe that the
                destructors <em>never run</em> — you have a reference cycle leak.
              </li>
              <li>
                Change the parent back-pointer to <code>std::weak_ptr</code> and
                confirm the destructors now fire. Explain the count arithmetic.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            With <code>shared_ptr</code> both ways, parent and child each keep
            the other&apos;s count at 1, so neither reaches 0. A{" "}
            <code>weak_ptr</code> parent link does not increment the count, so
            dropping the external handle lets the count fall to 0.
          </>
        }
        solution={
          <>
            <p>
              In the cyclic version, after you drop your external{" "}
              <code>shared_ptr</code>, the parent still holds the child (count 1)
              and the child still holds the parent (count 1). Neither hits zero,
              so no destructor runs — a textbook leak you can see with the silent
              destructors.
            </p>
            <p>
              Switching the parent link to <code>weak_ptr</code> means the
              child&apos;s ownership of the parent no longer counts. Dropping the
              root handle takes the parent to 0, which releases the child, which
              takes it to 0 — both destructors fire. That is precisely why{" "}
              <code>weak_ptr</code> exists.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
