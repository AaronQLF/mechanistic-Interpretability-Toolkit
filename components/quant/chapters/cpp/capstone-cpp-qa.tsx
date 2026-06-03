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
      chapterSlug="capstone-cpp-qa"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 14"
      title="Capstone: rapid-fire C++ Q&A"
      lede="Everything from this module, distilled into the exact questions a quant-dev screen asks — with crisp model answers you can deliver in under a minute each."
    >
      <h2>How to use this chapter</h2>
      <p>
        These are the questions that actually come up. Read the model answer,
        then close the page and say it out loud in your own words. If you can
        explain each one in 30–60 seconds, the C++ portion of a screen holds no
        surprises.
      </p>

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Most answers boil down to one theme: Python hides cost and ownership;
          C++ makes them explicit. Lead with that framing and the individual
          answers fall out naturally.
        </p>
      </Callout>

      <h2>Memory &amp; ownership</h2>
      <p>
        <strong>Q: Stack vs heap?</strong> Stack objects are automatic — created
        on declaration, destroyed at the closing brace, very fast. Heap objects
        (<code>new</code>) live until freed and must have an owner. Prefer the
        stack; reach for the heap only when lifetime must outlive a scope or size
        is dynamic.
      </p>
      <p>
        <strong>Q: What is RAII?</strong> Tie a resource to an object&apos;s
        lifetime: acquire in the constructor, release in the destructor. Cleanup
        then happens automatically on every exit path, including exceptions.
        Examples: <code>vector</code>, <code>lock_guard</code>,{" "}
        <code>unique_ptr</code>.
      </p>
      <p>
        <strong>Q: <code>unique_ptr</code> vs <code>shared_ptr</code>?</strong>{" "}
        <code>unique_ptr</code> is the single-owner default with zero overhead.{" "}
        <code>shared_ptr</code> adds an atomic reference count for genuine shared
        ownership — only pay for it when you truly share. <code>weak_ptr</code>{" "}
        breaks reference cycles.
      </p>
      <p>
        <strong>Q: Rule of zero/three/five?</strong> Prefer the <em>Rule of
        Zero</em>: hold self-managing members and write none of the special
        functions. If you own a raw resource you must define the destructor, copy,
        and move operations together (three pre-C++11, five with moves) or the
        default shallow copy double-frees.
      </p>

      <h2>Values, copies &amp; moves</h2>
      <p>
        <strong>Q: What does <code>std::move</code> do?</strong> Nothing at
        runtime — it is a cast to an rvalue reference that lets a move
        constructor/assignment be selected. The actual stealing happens in that
        move operation.
      </p>
      <p>
        <strong>Q: lvalue vs rvalue?</strong> An lvalue has a name and a stable
        address; an rvalue is a temporary you can safely move from. Moves bind to
        rvalues; that is how temporaries get optimized.
      </p>
      <p>
        <strong>Q: How do you pass a large read-only object?</strong> By{" "}
        <code>const</code> reference (<code>const T&amp;</code>): no copy, and the{" "}
        <code>const</code> documents and enforces no mutation.
      </p>
      <p>
        <strong>Q: Is returning a big object by value slow?</strong> No — copy
        elision (mandatory in common C++17 cases) constructs the result in place.
        Do not write <code>return std::move(local)</code>; it disables elision.
      </p>

      <h2>Polymorphism</h2>
      <p>
        <strong>Q: What is a vtable?</strong> A per-class table of function
        pointers; each polymorphic object stores a hidden <code>vptr</code> to
        it. A virtual call is an indirection through that table — costs a pointer
        per object and an indirect, usually non-inlinable call.
      </p>
      <p>
        <strong>Q: Why does a base class need a virtual destructor?</strong> So
        deleting a derived object through a base pointer runs the derived
        destructor too. Without it, only the base part is destroyed — a leak and
        undefined behavior.
      </p>
      <p>
        <strong>Q: virtual dispatch vs templates?</strong> Virtual is runtime
        polymorphism (indirection, flexible, heterogeneous collections).
        Templates are compile-time (no vtable, inlinable, faster) when the type
        is known at compile time. Prefer templates/composition; use{" "}
        <code>virtual</code> for runtime-chosen types behind an interface.
      </p>

      <h2>Containers</h2>
      <p>
        <strong>Q: <code>vector</code> vs <code>list</code>?</strong>{" "}
        <code>vector</code> almost always wins thanks to contiguous,
        cache-friendly memory — even when big-O suggests <code>list</code> for
        middle inserts. Use <code>list</code> only for frequent splicing with
        stable element addresses.
      </p>
      <p>
        <strong>Q: <code>map</code> vs <code>unordered_map</code>?</strong>{" "}
        <code>map</code> is a balanced tree: O(log n), keys sorted.{" "}
        <code>unordered_map</code> is a hash table: O(1) average, no order. Pick{" "}
        <code>map</code> only when you need ordered iteration or range queries.
      </p>
      <p>
        <strong>Q: What invalidates a <code>vector</code> iterator?</strong> Any
        growth past capacity (reallocation) invalidates all iterators, pointers,
        and references; <code>erase</code> invalidates from the erase point on.{" "}
        <code>reserve</code> up front or re-fetch after modifying.
      </p>

      <h2>Safety &amp; build</h2>
      <p>
        <strong>Q: What is undefined behavior?</strong> A program construct the
        standard places no requirements on (out-of-bounds, use-after-free, signed
        overflow, data race, uninitialized read). The optimizer assumes it never
        happens, so symptoms are nondeterministic. Find it with sanitizers (ASan,
        UBSan, TSan) and <code>-Wall -Wextra</code>.
      </p>
      <p>
        <strong>Q: Declaration vs definition, and the ODR?</strong> A declaration
        promises a thing exists; a definition provides its body/storage. The One
        Definition Rule: declared many times, defined exactly once program-wide.
        Multiple definitions (e.g. a non-<code>inline</code> function body in a
        header) cause linker errors.
      </p>
      <p>
        <strong>Q: Why do template definitions go in headers?</strong> The
        compiler needs the full body to instantiate a version per type; a body
        hidden in a <code>.cpp</code> cannot be instantiated elsewhere, giving
        &ldquo;undefined reference&rdquo; at link time.
      </p>

      <Callout variant="interview">
        <p>
          Delivery tips: answer the literal question in one sentence, then add a
          single &ldquo;and the reason is&rdquo; clause. Do not monologue. If you
          can attach a one-line code example or a cost (&ldquo;O(1) amortized,&rdquo;
          &ldquo;one extra indirection&rdquo;), you sound like someone who has
          shipped C++, not just read about it.
        </p>
      </Callout>

      <Quiz
        question="An interviewer asks 'what does std::move do?' and you have ten seconds. Best answer?"
        choices={[
          {
            id: "a",
            label: "It moves the object to a new memory location.",
            explain:
              "Wrong and a red flag — std::move does not relocate anything by itself.",
          },
          {
            id: "b",
            label:
              "Nothing at runtime — it casts to an rvalue reference so a move operation can be chosen; the steal happens there.",
            correct: true,
            explain:
              "Crisp and correct. This single answer signals real understanding of the move machinery.",
          },
          {
            id: "c",
            label: "It deep-copies the object efficiently.",
            explain:
              "Moves are the alternative to copying; std::move does not copy.",
          },
        ]}
      />

      <Challenge
        title="Capstone challenge: the 12-minute mock"
        prompt={
          <>
            <p>
              <strong>Simulate the real screen.</strong> Set a 12-minute timer.
              Without looking back, answer these twelve out loud, ~45 seconds
              each, as if to an interviewer:
            </p>
            <ol>
              <li>Stack vs heap, and which you prefer by default.</li>
              <li>Explain RAII with one concrete example.</li>
              <li><code>unique_ptr</code> vs <code>shared_ptr</code> vs <code>weak_ptr</code>.</li>
              <li>The Rule of Zero, and when you escalate to Five.</li>
              <li>What <code>std::move</code> actually does.</li>
              <li>Why pass big read-only objects by <code>const&amp;</code>.</li>
              <li>What a vtable is and what a virtual call costs.</li>
              <li>Why a polymorphic base needs a virtual destructor.</li>
              <li><code>vector</code> vs <code>list</code> — and why cache locality wins.</li>
              <li><code>map</code> vs <code>unordered_map</code>.</li>
              <li>Define undefined behavior; name three examples and how to catch them.</li>
              <li>The ODR, and why template definitions live in headers.</li>
            </ol>
            <p>
              Record yourself. Any answer over 60 seconds or that wanders is a
              flag to tighten.
            </p>
          </>
        }
        hint={
          <>
            For each, force the shape: <em>one-sentence definition</em> →{" "}
            <em>one reason</em> → <em>one example or cost</em>. If you cannot do a
            question cleanly, that chapter is your next re-read.
          </>
        }
        solution={
          <>
            <p>
              Model one-liners (expand each with a single reason): (1) prefer the
              stack; heap only for dynamic lifetime/size. (2) acquire in ctor,
              release in dtor — e.g. <code>lock_guard</code>. (3) sole owner /
              shared refcount / non-owning cycle-breaker. (4) write no special
              functions unless you own a raw resource, then write all five. (5) a
              cast to rvalue enabling a move. (6) avoid a copy while promising no
              mutation. (7) per-class pointer table; one indirection per call.
              (8) so the derived destructor runs through a base pointer. (9)
              contiguous memory streams through cache; lists miss per node. (10)
              ordered tree O(log n) vs hash O(1) average. (11) no-requirements
              constructs; out-of-bounds / use-after-free / signed overflow; catch
              with sanitizers. (12) defined exactly once; the compiler needs a
              template&apos;s body to instantiate it.
            </p>
            <p>
              When all twelve are smooth and short, you are done with this module
              — move on to DSA and concurrency with the same drill.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
