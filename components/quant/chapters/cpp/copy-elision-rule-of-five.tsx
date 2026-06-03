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
      chapterSlug="copy-elision-rule-of-five"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 05"
      title="Copy elision & the rule of zero / three / five"
      lede="Two practical questions answered: 'Is returning a big object slow?' (no, thanks to copy elision) and 'Which of those weird special functions do I have to write?' (ideally none)."
    >
      <h2>Copy elision: the free return</h2>
      <p>
        You might fear that <code>return bigVector;</code> copies the whole
        thing. It does not. The compiler is allowed — and since C++17{" "}
        <em>required</em>, in common cases — to construct the result directly in
        the caller&apos;s slot, skipping the copy and even the move entirely.
        This is <strong>copy elision</strong> (the named-local version is called
        NRVO).
      </p>

      <CodeBlock
        language="cpp"
        title="No copy happens here"
        code={`std::string buildName() {
    std::string s = "alpha";
    s += "-beta";
    return s;        // constructed directly in the caller — no copy, no move
}

std::string name = buildName();   // 'name' is built in place`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          In Python, returning an object just returns a reference — always cheap.
          In C++ you also get to <em>return by value</em> cheaply, because the
          compiler elides the copy. So you can write clean, value-returning
          functions without paying for them. Do not hand-optimize with{" "}
          <code>std::move</code> on returns — it disables elision.
        </p>
      </Callout>

      <h2>The six special member functions</h2>
      <p>
        Every class can have up to six compiler-managed operations. You usually
        never write them; the compiler generates sensible defaults:
      </p>
      <ul>
        <li><strong>Default constructor</strong> — make an empty one.</li>
        <li><strong>Destructor</strong> — clean up.</li>
        <li><strong>Copy constructor</strong> — build from an existing one.</li>
        <li><strong>Copy assignment</strong> — overwrite from an existing one.</li>
        <li><strong>Move constructor</strong> — build by stealing from a temporary.</li>
        <li><strong>Move assignment</strong> — overwrite by stealing from a temporary.</li>
      </ul>

      <h2>Rule of Zero: write none of them</h2>
      <p>
        The modern, beginner-friendly default: <strong>do not write any of the
        six.</strong> If each member of your class already manages itself (a{" "}
        <code>std::string</code>, a <code>std::vector</code>, a{" "}
        <code>std::unique_ptr</code>), the compiler-generated copies, moves, and
        destructor all do the right thing automatically.
      </p>

      <CodeBlock
        language="cpp"
        title="Rule of Zero in action"
        code={`#include <string>
#include <vector>

struct Trade {
    std::string symbol;          // manages its own memory
    std::vector<double> prices;  // manages its own memory
    int quantity = 0;
};
// Copy, move, and destruction all work correctly.
// You wrote ZERO special functions. This is the goal.`}
      />

      <Callout variant="desk">
        <p>
          In real codebases the overwhelming majority of classes follow the Rule
          of Zero. Reach for raw <code>new</code>/<code>delete</code> only inside
          carefully reviewed building blocks — and even then, prefer wrapping
          them in a smart pointer.
        </p>
      </Callout>

      <h2>Rule of Three and Rule of Five: when you <em>do</em> own a raw resource</h2>
      <p>
        If your class manages a raw resource directly (a raw pointer from{" "}
        <code>new</code>, a file descriptor, an OS handle), the default
        shallow-copy is dangerous: two objects would think they own the same
        pointer and both try to free it (a double-free crash). So:
      </p>
      <ul>
        <li>
          <strong>Rule of Three</strong> (pre-move era): if you write a
          destructor, copy constructor, or copy assignment, you almost certainly
          need all three.
        </li>
        <li>
          <strong>Rule of Five</strong> (modern): add the move constructor and
          move assignment, so moving is cheap too.
        </li>
      </ul>

      <CodeBlock
        language="cpp"
        title="Why the default copy is wrong for a raw pointer"
        code={`struct Bad {
    int* data_;
    Bad(std::size_t n) : data_(new int[n]) {}
    ~Bad() { delete[] data_; }     // we wrote a destructor...
    // ...but NOT a copy constructor. The default one copies the pointer.
};

Bad a(10);
Bad b = a;     // b.data_ == a.data_  (same pointer!)
// When both destructors run -> delete[] the same memory twice -> crash.`}
      />

      <Callout variant="pitfall" title="The trap the Rule of Three warns about">
        <p>
          Writing a destructor that frees something, but forgetting the copy
          operations, is the most common memory bug in hand-written resource
          classes. The Rule of Three is a checklist to stop exactly this. The
          easier escape hatch: do not hold a raw pointer at all — hold a{" "}
          <code>std::unique_ptr</code> and fall back to the Rule of Zero.
        </p>
      </Callout>

      <h2>If you must write them, here is the Rule of Five skeleton</h2>
      <CodeBlock
        language="cpp"
        title="The full set (rarely needed by hand)"
        code={`class Buffer {
    int* data_;
    std::size_t size_;
public:
    explicit Buffer(std::size_t n) : data_(new int[n]), size_(n) {}

    ~Buffer() { delete[] data_; }                              // 1

    Buffer(const Buffer& o) : data_(new int[o.size_]), size_(o.size_) {
        std::copy(o.data_, o.data_ + size_, data_);            // 2 deep copy
    }
    Buffer& operator=(const Buffer& o) {                       // 3
        if (this != &o) { Buffer tmp(o); swap(tmp); }
        return *this;
    }
    Buffer(Buffer&& o) noexcept                                // 4 steal
        : data_(o.data_), size_(o.size_) { o.data_ = nullptr; o.size_ = 0; }
    Buffer& operator=(Buffer&& o) noexcept {                   // 5
        if (this != &o) { delete[] data_; data_ = o.data_; size_ = o.size_;
                          o.data_ = nullptr; o.size_ = 0; }
        return *this;
    }
    void swap(Buffer& o) noexcept {
        std::swap(data_, o.data_); std::swap(size_, o.size_);
    }
};`}
      />

      <Callout variant="interview">
        <p>
          Expect: &ldquo;Explain the rule of three/five/zero.&rdquo; Lead with
          Rule of Zero (prefer members that manage themselves), then explain that
          owning a raw resource forces you to define copy/move/destroy together,
          and why the default shallow copy causes a double-free.
        </p>
      </Callout>

      <Quiz
        question="Your class has a std::vector member and nothing else unusual. How many special member functions should you write?"
        choices={[
          {
            id: "a",
            label: "All five, to be safe.",
            explain:
              "Writing them by hand here is busywork and a chance to introduce bugs — the defaults are already correct.",
          },
          {
            id: "b",
            label: "Zero — the compiler-generated ones are correct (Rule of Zero).",
            correct: true,
            explain:
              "std::vector manages its own memory, so the generated copy, move, and destructor all do the right thing.",
          },
          {
            id: "c",
            label: "Just the destructor.",
            explain:
              "There is no raw resource to release, so you do not need a destructor at all.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Crash it, then fix it two ways.</strong>
            </p>
            <ol>
              <li>
                Write the buggy <code>Bad</code> class above (destructor frees a
                raw <code>new[]</code>, no copy ctor). Copy one instance into
                another and run under a sanitizer (<code>-fsanitize=address</code>
                ). Observe the double-free.
              </li>
              <li>
                Fix it with the <strong>Rule of Five</strong> (write all five
                correctly).
              </li>
              <li>
                Fix it again with the <strong>Rule of Zero</strong>: replace the
                raw pointer with <code>std::unique_ptr&lt;int[]&gt;</code> or{" "}
                <code>std::vector&lt;int&gt;</code> and delete all five.
              </li>
            </ol>
            <p>Which fix is shorter, and which would you ship?</p>
          </>
        }
        hint={
          <>
            Compile with <code>-fsanitize=address -g</code> to get a precise
            double-free report. The Rule of Zero version should be only a few
            lines — that is the point.
          </>
        }
        solution={
          <>
            <p>
              The sanitizer pinpoints the second <code>delete[]</code> on an
              already-freed block. The Rule of Five version is correct but long
              and easy to get subtly wrong (self-assignment, <code>noexcept</code>
              , exception safety). The Rule of Zero version — hold a{" "}
              <code>vector</code> or <code>unique_ptr</code> and write nothing —
              is shorter, safer, and the one you ship.
            </p>
            <p>
              Moral: hand-written resource management is a last resort. Let
              standard owning types do it and inherit correctness for free.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
