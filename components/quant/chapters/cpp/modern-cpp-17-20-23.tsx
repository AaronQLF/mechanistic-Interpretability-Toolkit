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
      chapterSlug="modern-cpp-17-20-23"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 13"
      title="A tour of modern C++ (17 / 20 / 23)"
      lede="The C++ you may have feared is the C++ of the 1990s. Modern C++ added features that close much of the ergonomics gap with Python — type inference, tuple unpacking, optional values, real string formatting, and a print function that finally just works."
    >
      <h2>Modern C++ feels a lot more like Python</h2>
      <p>
        Each line below is a feature that removes boilerplate you might have
        dreaded. Most have a direct Python analogue.
      </p>

      <h3><code>auto</code> and range-based <code>for</code></h3>
      <CodeBlock
        language="cpp"
        title="Iterate like Python"
        code={`std::vector<std::string> names = {"a", "b", "c"};

for (const auto& n : names) {   // ~ for n in names
    // use n
}`}
      />

      <h3>Structured bindings ≈ tuple unpacking</h3>
      <CodeBlock
        language="cpp"
        title="a, b = pair  ->  auto [a, b] = pair"
        code={`std::map<std::string, int> m = {{"x", 1}, {"y", 2}};

for (const auto& [key, value] : m) {   // unpack each entry
    // key, value
}

auto [q, r] = std::div(17, 5);   // q = 3, r = 2`}
      />

      <h3><code>std::optional</code> ≈ &ldquo;maybe a value&rdquo; (None)</h3>
      <CodeBlock
        language="cpp"
        title="Return 'no value' without sentinels"
        code={`#include <optional>

std::optional<double> parsePrice(const std::string& s) {
    if (s.empty()) return std::nullopt;   // like returning None
    return std::stod(s);
}

if (auto p = parsePrice(input)) {   // truthy check, like 'if x is not None'
    use(*p);                        // *p unwraps the value
}`}
      />

      <h3><code>std::variant</code> ≈ a type-safe Union</h3>
      <CodeBlock
        language="cpp"
        title="One of several types, checked"
        code={`#include <variant>

std::variant<int, std::string> v = 42;   // holds an int OR a string
v = "now a string";
// Access safely with std::visit or std::get_if — never a wrong-type read.`}
      />

      <h3>C++20 <code>std::format</code> and C++23 <code>std::print</code></h3>
      <p>
        Finally, string formatting like Python&apos;s f-strings, and a{" "}
        <code>print</code> that does not need <code>std::cout</code> ceremony.
      </p>
      <CodeBlock
        language="cpp"
        title="Formatting that reads like Python"
        code={`#include <format>   // C++20
#include <print>    // C++23

std::string s = std::format("{} = {:.2f}", "pi", 3.14159);  // "pi = 3.14"

std::println("loaded {} rows in {} ms", rows, ms);          // C++23, just print`}
      />

      <h3>Non-owning views: <code>string_view</code> and <code>span</code></h3>
      <p>
        These are cheap &ldquo;windows&rdquo; onto data someone else owns — a{" "}
        <code>std::string_view</code> over a string, a <code>std::span</code>{" "}
        over a contiguous array — with no copy. Perfect for read-only parameters.
      </p>
      <CodeBlock
        language="cpp"
        title="Borrow a view instead of copying"
        code={`#include <string_view>
#include <span>

// Accepts std::string, const char*, etc. — without copying:
void log(std::string_view msg);

// A view over any contiguous block of doubles:
double sum(std::span<const double> xs) {
    double t = 0; for (double x : xs) t += x; return t;
}`}
      />

      <h3>C++23 <code>std::expected</code>: errors without exceptions</h3>
      <CodeBlock
        language="cpp"
        title="Return either a value or an error"
        code={`#include <expected>

std::expected<double, std::string> safeDiv(double a, double b) {
    if (b == 0) return std::unexpected("divide by zero");
    return a / b;
}`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Structured bindings = tuple unpacking. <code>std::optional</code> ={" "}
          <code>Optional</code>/<code>None</code>. <code>std::variant</code> ={" "}
          a typed <code>Union</code>. <code>std::format</code> = f-strings.{" "}
          <code>std::print</code> = <code>print()</code>. The mental models
          transfer almost one-to-one — modern C++ just keeps the speed and static
          checking.
        </p>
      </Callout>

      <Callout variant="pitfall" title="Views do not own — beware dangling">
        <p>
          <code>string_view</code> and <code>span</code> point at memory they do
          not own. Return one that refers to a local, or build one from a
          temporary string, and you get a dangling view — UB. Use them for{" "}
          <em>parameters</em> and short-lived borrows, not for storing.
        </p>
      </Callout>

      <h3>One more for templates: <code>if constexpr</code></h3>
      <CodeBlock
        language="cpp"
        title="Compile-time branching inside templates"
        code={`template <typename T>
auto describe(T x) {
    if constexpr (std::is_integral_v<T>)
        return "integer";       // only this branch is compiled for ints
    else
        return "other";
}`}
      />

      <Callout variant="interview">
        <p>
          Good signals: reaching for <code>std::optional</code> instead of magic
          sentinel values, knowing <code>string_view</code>/<code>span</code> are
          non-owning, using structured bindings, and citing{" "}
          <code>std::format</code>/<code>std::print</code> and{" "}
          <code>std::expected</code>. Interviewers use these to gauge whether you
          write 2026 C++ or 1998 C++.
        </p>
      </Callout>

      <Quiz
        question="Which is the idiomatic modern way to express 'this function might not return a value'?"
        choices={[
          {
            id: "a",
            label: "Return a special sentinel like -1 and document it.",
            explain:
              "Sentinels are error-prone and easy to misuse — the caller can forget the convention.",
          },
          {
            id: "b",
            label: "Return std::optional<T> (std::nullopt when there is no value).",
            correct: true,
            explain:
              "optional makes 'no value' part of the type, so the caller must consciously handle it — like Python's Optional/None, but enforced.",
          },
          {
            id: "c",
            label: "Throw an exception for the common 'not found' case.",
            explain:
              "Exceptions are for exceptional conditions, not routine 'no result.' optional fits a normal absent value better.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Modernize a crusty function.</strong> Start from this
              old-style signature and rewrite it with modern features:
            </p>
            <CodeBlock
              language="cpp"
              title="Before: C-style and fragile"
              code={`// Returns price, or -1.0 on failure. Takes a copied std::string.
double lookupPrice(std::string symbol);`}
            />
            <ol>
              <li>
                Change the parameter to <code>std::string_view</code> (no copy).
              </li>
              <li>
                Return <code>std::optional&lt;double&gt;</code> instead of the{" "}
                <code>-1.0</code> sentinel.
              </li>
              <li>
                At the call site, use an <code>if</code> with an initializer and a
                structured binding where natural, and print results with{" "}
                <code>std::format</code>/<code>std::print</code>.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            Make sure the <code>string_view</code> parameter never outlives the
            string it views. The optional return forces every caller to handle
            the &ldquo;not found&rdquo; case explicitly — that is the upgrade over
            a sentinel.
          </>
        }
        solution={
          <>
            <CodeBlock
              language="cpp"
              title="After: modern and safe"
              code={`#include <optional>
#include <string_view>
#include <print>

std::optional<double> lookupPrice(std::string_view symbol);

if (auto price = lookupPrice("AAPL")) {
    std::println("AAPL = {:.2f}", *price);
} else {
    std::println("no price for AAPL");
}`}
            />
            <p>
              You removed a copy (<code>string_view</code>), made absence
              type-safe (<code>optional</code>), and got readable output (
              <code>println</code>/<code>format</code>). Same performance ceiling
              as old C++, far fewer foot-guns — which is the whole pitch of
              modern C++.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
