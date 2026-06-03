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
      chapterSlug="templates-basics"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 07"
      title="Templates: code that works for many types"
      lede="In Python one function quietly works for ints, floats, and anything with the right methods. C++ gets the same flexibility with templates — but the type-juggling happens at compile time, producing fast, specialized machine code."
    >
      <h2>The same idea you already use in Python</h2>
      <p>
        A Python function does not care about types until it runs — pass it
        anything that supports the operations inside. That is &ldquo;duck
        typing.&rdquo; C++ is statically typed, so to write one function that
        works for many types you write a <strong>template</strong>. The compiler
        then stamps out a real, type-specific version for each type you actually
        use.
      </p>

      <CodeBlock
        language="python"
        title="Python: works for anything with '>'"
        code={`def maximum(a, b):
    return a if a > b else b

maximum(3, 5)          # ints
maximum(2.7, 1.1)      # floats
maximum("ab", "az")    # strings — all fine, checked at runtime`}
      />

      <CodeBlock
        language="cpp"
        title="C++: a function template, resolved at compile time"
        code={`template <typename T>
T maximum(T a, T b) {
    return a > b ? a : b;
}

maximum(3, 5);     // compiler generates maximum<int>
maximum(2.7, 1.1); // compiler generates maximum<double>
maximum(std::string("ab"), std::string("az")); // maximum<std::string>`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Templates are <strong>duck typing at compile time</strong>. A template
          just requires that the operations you use (here, <code>&gt;</code>)
          exist for the type. The difference: Python checks when the line runs
          and stays generic; C++ checks while compiling and bakes out a separate,
          fully-typed, optimized function per type.
        </p>
      </Callout>

      <h2>Instantiation: one template, many real functions</h2>
      <p>
        A template is a <em>recipe</em>, not code by itself. Each distinct type
        you call it with triggers an <strong>instantiation</strong> — the
        compiler generates a concrete function for that type. Call{" "}
        <code>maximum</code> with <code>int</code> and <code>double</code> and
        you get two functions in your binary. (Rust folks call this
        monomorphization.)
      </p>

      <h2>Class templates</h2>
      <p>
        You have used these already: <code>std::vector&lt;int&gt;</code> and{" "}
        <code>std::vector&lt;double&gt;</code> are two instantiations of the{" "}
        <code>std::vector&lt;T&gt;</code> class template. Writing your own looks
        like this:
      </p>

      <CodeBlock
        language="cpp"
        title="A tiny class template"
        code={`template <typename T>
class Box {
    T value_;
public:
    explicit Box(T v) : value_(std::move(v)) {}
    const T& get() const { return value_; }
};

Box<int> a{42};
Box<std::string> b{"hi"};   // a different, separately generated class`}
      />

      <h2>Type deduction and <code>auto</code></h2>
      <p>
        You rarely write the type in <code>&lt;&gt;</code> for function templates
        — the compiler deduces it from the arguments. The same deduction machine
        powers <code>auto</code>, which asks the compiler &ldquo;figure out the
        type for me.&rdquo;
      </p>

      <CodeBlock
        language="cpp"
        title="Let the compiler name the types"
        code={`auto m = maximum(3, 5);          // T deduced as int; m is int
auto pi = 3.14159;               // pi is double
for (auto& trade : trades) { }   // type deduced from the container`}
      />

      <h2>Why template definitions live in headers</h2>
      <p>
        Here is the practical rule that confuses newcomers: to instantiate a
        template for some type, the compiler needs to see its <em>full
        body</em>, not just a declaration. So templates are normally defined
        entirely in headers. (Recall the ODR chapter — templates are exempt from
        the one-definition rule, so multiple translation units instantiating the
        same type is fine.)
      </p>

      <Callout variant="pitfall" title="Two things that will bite you">
        <p>
          <strong>(1) Linker errors from split templates.</strong> Put a template
          declaration in a header and its body in a <code>.cpp</code>, and other
          files cannot instantiate it — you get &ldquo;undefined reference&rdquo;
          at link time. Keep template bodies in headers.
        </p>
        <p>
          <strong>(2) Wall-of-text errors.</strong> If a type lacks an operation
          the template uses, the error can be dozens of lines. Read the{" "}
          <em>first</em> few lines and look for &ldquo;no match for
          operator&rdquo; — that is usually the real cause. (C++20 concepts, next
          chapter, make these messages humane.)
        </p>
      </Callout>

      <Callout variant="interview">
        <p>
          Common asks: &ldquo;How do templates differ from runtime polymorphism
          (virtual functions)?&rdquo; (templates resolve at compile time → no
          indirection, can inline, but code bloat and big errors; virtual is
          runtime dispatch). &ldquo;Why are template definitions in headers?&rdquo;
          (the compiler needs the body to instantiate per type).
        </p>
      </Callout>

      <Quiz
        question="You write a function template's body in a .cpp file and only its declaration in the header. What happens when another file calls it?"
        choices={[
          {
            id: "a",
            label: "It works fine.",
            explain:
              "Only if that .cpp explicitly instantiates the needed types — otherwise the other file cannot generate the code.",
          },
          {
            id: "b",
            label: "An 'undefined reference' linker error, because the body was not visible to instantiate.",
            correct: true,
            explain:
              "The compiler needs the full template body to stamp out a version for the caller's type. Keep template definitions in the header.",
          },
          {
            id: "c",
            label: "A runtime crash.",
            explain:
              "It never links, so it never runs. This is a build-time problem, not a runtime one.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Write a generic <code>clamp</code> and probe its limits.</strong>
            </p>
            <ol>
              <li>
                Implement <code>template &lt;typename T&gt; T clamp(T v, T lo, T
                hi)</code> returning <code>v</code> bounded to{" "}
                <code>[lo, hi]</code>. Test it with <code>int</code> and{" "}
                <code>double</code>.
              </li>
              <li>
                Call it with a type that has no <code>&lt;</code> operator (say a
                small struct) and read the error message. Identify the one line
                that names the missing operation.
              </li>
              <li>
                Make that struct work by giving it <code>operator&lt;</code>, and
                explain why no change to <code>clamp</code> itself was needed.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            The template only requires the operations it actually uses. Provide
            those operations on your type and the same template instantiates
            cleanly — that is compile-time duck typing in one sentence.
          </>
        }
        solution={
          <>
            <CodeBlock
              language="cpp"
              title="Generic clamp"
              code={`template <typename T>
T clamp(T v, T lo, T hi) {
    return v < lo ? lo : (hi < v ? hi : v);
}`}
            />
            <p>
              Calling it with a struct lacking <code>operator&lt;</code> fails to
              compile with something like &ldquo;no match for operator&lt;.&rdquo;
              Add <code>bool operator&lt;(const S&amp;) const</code> and it
              instantiates — <code>clamp</code> never mentioned your type, it only
              required <code>&lt;</code> to exist. That requirement is exactly
              what C++20 concepts let you state up front.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
