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
      chapterSlug="sfinae-concepts"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 08"
      title="Constraining templates with concepts"
      lede="A plain template accepts any type and then explodes deep inside if the type is wrong. Concepts (C++20) let you say up front exactly what a type must support — clearer code, and error messages a human can read."
    >
      <h2>The problem with wide-open templates</h2>
      <p>
        From the last chapter, <code>maximum&lt;T&gt;</code> accepts any{" "}
        <code>T</code>. Pass a type with no <code>&gt;</code> operator and the
        failure happens deep inside the body, producing a scary multi-line error.
        We want to declare the requirement <em>at the door</em>: &ldquo;this only
        works for types you can compare.&rdquo;
      </p>

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Think of Python&apos;s <code>typing.Protocol</code> (or checking{" "}
          <code>hasattr(x, &quot;__lt__&quot;)</code>): a way to say &ldquo;I
          accept anything shaped like this.&rdquo; A C++ <strong>concept</strong>{" "}
          is that idea, enforced at compile time — a named, checkable
          requirement on a type.
        </p>
      </Callout>

      <h2>Concepts: name your requirements</h2>
      <p>
        A concept is a compile-time predicate on types. The standard library
        ships many (<code>std::integral</code>, <code>std::floating_point</code>,
        ...), and you can write your own. Then you constrain a template with it.
      </p>

      <CodeBlock
        language="cpp"
        title="Using a standard concept"
        code={`#include <concepts>

// Only accept whole-number types:
template <std::integral T>
T half(T x) { return x / 2; }

half(10);     // ok, int
half(3.5);    // ERROR up front: double is not std::integral
              // message: "constraints not satisfied" — short and clear`}
      />

      <CodeBlock
        language="cpp"
        title="Defining your own concept"
        code={`#include <concepts>

// "Addable" = you can write a + b and get something back.
template <typename T>
concept Addable = requires(T a, T b) {
    { a + b } -> std::convertible_to<T>;
};

template <Addable T>
T sum3(T a, T b, T c) { return a + b + c; }`}
      />

      <p>
        The <code>requires(...)</code> block is a list of expressions that must
        compile. If they do, the type satisfies the concept. It reads almost like
        documentation.
      </p>

      <h2>Three equivalent ways to write a constraint</h2>
      <CodeBlock
        language="cpp"
        title="Pick whichever is clearest"
        code={`// 1) Concept as the type parameter:
template <std::integral T> void f(T x);

// 2) requires clause after the template head:
template <typename T> requires std::integral<T> void g(T x);

// 3) Abbreviated function template (shortest):
void h(std::integral auto x);`}
      />

      <h2>SFINAE: the old, painful way (recognize it, do not write it)</h2>
      <p>
        Before C++20, people constrained templates with a trick named{" "}
        <strong>SFINAE</strong> — &ldquo;Substitution Failure Is Not An
        Error.&rdquo; The idea: if substituting a type makes an overload
        ill-formed, the compiler quietly drops that overload instead of erroring.
        It was usually spelled with <code>std::enable_if</code> and it is
        notoriously hard to read.
      </p>

      <CodeBlock
        language="cpp"
        title="Legacy SFINAE — you will see this in old code"
        code={`#include <type_traits>

// "Enable this overload only if T is integral." Hard to read, easy to misuse.
template <typename T,
          typename = std::enable_if_t<std::is_integral_v<T>>>
T half(T x) { return x / 2; }`}
      />

      <Callout variant="desk">
        <p>
          You do not need to <em>write</em> SFINAE anymore, but you must be able
          to <em>read</em> it — large existing codebases are full of{" "}
          <code>enable_if</code>. New code should use concepts: same effect, far
          clearer intent, and dramatically better error messages.
        </p>
      </Callout>

      <Callout variant="interview">
        <p>
          Likely questions: &ldquo;What are concepts and why are they better than
          SFINAE?&rdquo; (named, readable constraints; errors say which
          requirement failed; easier overload selection). Being able to write a
          small custom concept with a <code>requires</code> block is a strong
          signal you know modern C++.
        </p>
      </Callout>

      <Quiz
        question="What is the main practical benefit of constraining a template with a concept instead of leaving it unconstrained?"
        choices={[
          {
            id: "a",
            label: "The generated code runs faster.",
            explain:
              "Constraints are compile-time checks; they do not change the runtime code that gets generated.",
          },
          {
            id: "b",
            label:
              "Misuse is rejected at the call site with a clear message, instead of failing deep inside the body.",
            correct: true,
            explain:
              "Concepts move the error to the boundary and state which requirement was not met — clarity, not speed.",
          },
          {
            id: "c",
            label: "It lets the template accept more types.",
            explain:
              "Constraints restrict the accepted types; they do not broaden them.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Write a <code>Numeric</code> concept and a mean function.</strong>
            </p>
            <ol>
              <li>
                Define <code>concept Numeric</code> requiring that{" "}
                <code>a + b</code> and <code>a / 2</code> compile for the type.
              </li>
              <li>
                Write <code>template &lt;Numeric T&gt; double mean(const
                std::vector&lt;T&gt;&amp; xs)</code>.
              </li>
              <li>
                Call it with <code>std::vector&lt;int&gt;</code> (ok) and a{" "}
                <code>std::vector&lt;std::string&gt;</code> (should be rejected
                with a clear &ldquo;constraints not satisfied&rdquo;). Compare
                that message to the wall of text you would get from an
                unconstrained version.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            Use a <code>requires</code> block: <code>{`requires(T a) { a + a; a / 2; }`}</code>
            . Then write the unconstrained version too and trigger the string
            error both ways — the contrast is the whole lesson.
          </>
        }
        solution={
          <>
            <CodeBlock
              language="cpp"
              title="Numeric + mean"
              code={`#include <vector>
template <typename T>
concept Numeric = requires(T a, T b) {
    a + b;
    a / 2;
};

template <Numeric T>
double mean(const std::vector<T>& xs) {
    T total{};
    for (const auto& x : xs) total = total + x;
    return static_cast<double>(total) / xs.size();
}`}
            />
            <p>
              With the concept, <code>mean</code> of strings fails right at the
              call with &ldquo;constraints not satisfied: <code>Numeric</code> is
              not satisfied.&rdquo; Without it, you would get a confusing error
              from inside the loop about <code>operator/</code> on{" "}
              <code>std::string</code>. Same rejection, vastly better
              diagnostics — that is why concepts exist.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
