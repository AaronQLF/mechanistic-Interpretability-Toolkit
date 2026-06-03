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
      chapterSlug="move-semantics-forwarding"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 04"
      title="Move semantics (stealing instead of copying)"
      lede="Copying a million-element vector is slow. If the source is a temporary about to be thrown away, why copy when you can just steal its insides? That is a move — and std::move is not what its name suggests."
    >
      <h2>The problem moves solve</h2>
      <p>
        Recall from the copies chapter: assigning a big object copies all of it.
        But sometimes the thing on the right-hand side is a <em>temporary</em>{" "}
        that is about to disappear anyway. Copying it is pure waste — we could
        just take its internal buffer and leave the empty husk behind. That
        &ldquo;take the guts&rdquo; operation is a <strong>move</strong>.
      </p>

      <CodeBlock
        language="cpp"
        title="Copy vs move, conceptually"
        code={`std::vector<int> a = makeHugeVector();   // a owns a big buffer

// COPY: allocate a new buffer, duplicate every element. O(n).
std::vector<int> b = a;

// MOVE: just take a's buffer pointer + size; leave a empty. O(1).
std::vector<int> c = std::move(a);
// 'a' is now valid but empty. 'c' owns the buffer.`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Python never deep-copies on assignment, so it has no concept of
          &ldquo;move&rdquo; — names just point at objects. In C++, where{" "}
          variables own their data, a move is the cheap alternative to a deep
          copy: transfer ownership of the internals instead of duplicating them.
        </p>
      </Callout>

      <h2><code>std::move</code> does not move anything</h2>
      <p>
        The most important sentence in this chapter: <code>std::move(x)</code> is
        just a <strong>cast</strong>. It does not touch <code>x</code>. It labels{" "}
        <code>x</code> as &ldquo;you are allowed to steal from me&rdquo; (an
        rvalue), so that the next operation can choose the move version instead
        of the copy version. The actual stealing happens in the move constructor
        or move assignment that receives it.
      </p>

      <CodeBlock
        language="cpp"
        title="What a move constructor actually does"
        code={`class Buffer {
    int* data_;
    std::size_t size_;
public:
    // Move constructor: steal the pointer, null out the source.
    Buffer(Buffer&& other) noexcept
        : data_(other.data_), size_(other.size_) {
        other.data_ = nullptr;   // leave 'other' empty but valid
        other.size_ = 0;
    }
};`}
      />

      <p>
        The <code>&amp;&amp;</code> means &ldquo;rvalue reference&rdquo; — a
        reference that only binds to temporaries (and to things you marked with{" "}
        <code>std::move</code>). That is how the compiler picks the move overload
        over the copy one.
      </p>

      <h2>Moved-from objects are empty, not broken</h2>
      <p>
        After you move from an object, it is in a <em>valid but unspecified</em>{" "}
        state. You may assign to it or let it be destroyed; you should not rely
        on its old value. For standard types it is usually left empty.
      </p>

      <Callout variant="pitfall" title="Two classic move mistakes">
        <p>
          <strong>(1)</strong> Using a variable&apos;s value after{" "}
          <code>std::move</code>-ing it — it is probably empty now.
        </p>
        <p>
          <strong>(2)</strong> Writing <code>return std::move(local);</code> from
          a function. It is unnecessary (the compiler already moves or elides
          the return) and it actually <em>disables</em> the faster copy elision.
          Just write <code>return local;</code>.
        </p>
      </Callout>

      <h2>Returns are moved for free</h2>
      <p>
        Good news for the Python brain that fears &ldquo;returning a big object
        copies it&rdquo;: returning a local by value is essentially free in C++.
        The compiler moves it out (or elides the move entirely — next chapter).
      </p>

      <CodeBlock
        language="cpp"
        title="Return big things by value without fear"
        code={`std::vector<double> simulate(int n) {
    std::vector<double> path(n);
    // ... fill path ...
    return path;        // moved/elided out — no expensive copy
}`}
      />

      <h2>A first look at perfect forwarding</h2>
      <p>
        Sometimes you write a generic wrapper that should pass its arguments to
        another function <em>unchanged</em> — if it got a temporary, forward a
        temporary (so it can be moved); if it got a named variable, forward that.
        Preserving that distinction is called <strong>perfect forwarding</strong>,
        and it uses <code>std::forward</code> with a templated{" "}
        <code>T&amp;&amp;</code> parameter (a &ldquo;forwarding reference&rdquo;).
      </p>

      <CodeBlock
        language="cpp"
        title="Forward arguments through a wrapper"
        code={`#include <utility>
#include <vector>

template <typename T>
void addTo(std::vector<T>& v, T&& value) {      // T&& = forwarding reference
    v.push_back(std::forward<T>(value));        // keep lvalue/rvalue-ness
}
// If 'value' was a temporary, it gets moved into the vector.
// If it was a named lvalue, it gets copied. Exactly what you want.`}
      />

      <Callout variant="interview">
        <p>
          The trap question: &ldquo;What does <code>std::move</code> do?&rdquo;
          The wrong answer is &ldquo;it moves the object.&rdquo; The right answer:
          &ldquo;Nothing at runtime — it is a cast to an rvalue reference that
          enables a move overload to be selected.&rdquo; Knowing this one fact
          marks you as someone who actually understands the feature.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            What is the effect of <code>std::move(x)</code> by itself?
          </>
        }
        choices={[
          {
            id: "a",
            label: "It immediately empties x.",
            explain:
              "By itself it does nothing to x. Emptying only happens if a move constructor/assignment then steals from it.",
          },
          {
            id: "b",
            label:
              "It casts x to an rvalue reference so a move operation can be chosen; x is untouched until something moves from it.",
            correct: true,
            explain:
              "Exactly. std::move is a compile-time cast. The work happens in the move constructor/assignment that receives the rvalue.",
          },
          {
            id: "c",
            label: "It copies x to a new location.",
            explain:
              "Copying is the thing moves avoid. std::move does not copy.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Build a move-aware <code>Buffer</code> and watch it work.</strong>
            </p>
            <ol>
              <li>
                Write a class owning a heap array (<code>int* data_</code> +{" "}
                <code>size_</code>). Add a constructor, destructor, copy
                constructor (deep copy), and move constructor (steal + null).
                Print a tag in each so you can see which runs.
              </li>
              <li>
                Construct one <code>Buffer</code> from another by copy, and a
                third with <code>std::move</code>. Confirm which message prints.
              </li>
              <li>
                Put <code>Buffer</code> objects in a <code>std::vector</code> and
                call <code>push_back(std::move(b))</code>. Explain why{" "}
                <code>noexcept</code> on your move constructor matters here.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            <code>std::vector</code> will only use your move constructor while
            growing if it is marked <code>noexcept</code>; otherwise it copies to
            preserve its strong exception guarantee. Add and remove{" "}
            <code>noexcept</code> and watch the tags change.
          </>
        }
        solution={
          <>
            <p>
              You should see the copy tag for the copy construction and the move
              tag for the <code>std::move</code> case. In the vector experiment,
              with <code>noexcept</code> you get moves on reallocation; without
              it, <code>std::vector</code> falls back to copies because it cannot
              risk a throwing move mid-resize.
            </p>
            <p>
              Takeaway: <strong>always mark move constructors and move
              assignment <code>noexcept</code></strong> when they truly cannot
              throw — the standard library rewards you with moves instead of
              copies.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
