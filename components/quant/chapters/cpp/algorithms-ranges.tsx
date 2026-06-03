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
      chapterSlug="algorithms-ranges"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 10"
      title="Algorithms & ranges: say what, not how"
      lede="Your Python instincts — sorted(key=...), comprehensions, sum(), any() — all translate. C++ gives you a big library of named algorithms plus C++20 ranges, so you rarely hand-write a loop."
    >
      <h2>Prefer named algorithms over raw loops</h2>
      <p>
        In Python you would never hand-write a sort; you call <code>sorted()</code>.
        Same spirit in C++: the <code>&lt;algorithm&gt;</code> header has battle-tested,
        optimized building blocks. Using them is clearer, less buggy, and often
        faster than a loop you wrote at 2am.
      </p>

      <CodeBlock
        language="python"
        title="Python: expressive one-liners"
        code={`xs = [5, 2, 8, 1]
xs_sorted = sorted(xs)              # sort
total     = sum(xs)                 # reduce
evens     = [x for x in xs if x%2==0]   # filter
doubled   = [x*2 for x in xs]       # map
has_big   = any(x > 4 for x in xs)  # short-circuit search`}
      />

      <CodeBlock
        language="cpp"
        title="C++ equivalents (classic style)"
        code={`#include <algorithm>
#include <numeric>
#include <vector>

std::vector<int> xs = {5, 2, 8, 1};

std::sort(xs.begin(), xs.end());                          // sort in place
int total = std::accumulate(xs.begin(), xs.end(), 0);     // reduce
bool hasBig = std::any_of(xs.begin(), xs.end(),
                          [](int x){ return x > 4; });    // search`}
      />

      <h2>Iterators: the glue</h2>
      <p>
        Classic algorithms work on a <em>range</em> expressed as two iterators:{" "}
        <code>begin()</code> (first element) and <code>end()</code> (one past the
        last). You pass those, plus often a <strong>lambda</strong> — the C++
        version of Python&apos;s <code>lambda</code> or a <code>key=</code>{" "}
        function.
      </p>

      <CodeBlock
        language="cpp"
        title="Lambdas are your key= and predicate"
        code={`// Sort by absolute value (like sorted(xs, key=abs)):
std::sort(xs.begin(), xs.end(),
          [](int a, int b){ return std::abs(a) < std::abs(b); });

// Count how many are negative (like sum(1 for x in xs if x<0)):
int negs = std::count_if(xs.begin(), xs.end(),
                         [](int x){ return x < 0; });`}
      />

      <h2>C++20 ranges: pass the container directly</h2>
      <p>
        Writing <code>v.begin(), v.end()</code> everywhere is noisy. C++20{" "}
        <strong>ranges</strong> let you pass the whole container, and offer{" "}
        <em>views</em> — lazy, composable pipelines that feel exactly like
        Python&apos;s generator expressions.
      </p>

      <CodeBlock
        language="cpp"
        title="Ranges + views read like a comprehension"
        code={`#include <ranges>
#include <vector>

std::vector<int> xs = {5, 2, 8, 1, 9, 4};

std::ranges::sort(xs);               // no .begin()/.end()

// Lazy pipeline: even numbers, doubled.  Like (x*2 for x in xs if x%2==0)
auto pipeline = xs
    | std::views::filter([](int x){ return x % 2 == 0; })
    | std::views::transform([](int x){ return x * 2; });

for (int v : pipeline) { /* computed on demand, no temp vector */ }`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          <code>std::ranges::sort(v)</code> ≈ <code>v.sort()</code>; a comparator
          lambda ≈ <code>key=</code>. A <code>views::filter | views::transform</code>{" "}
          chain ≈ a generator expression: <strong>lazy</strong> and composable,
          producing values only as you consume them.
        </p>
      </Callout>

      <h2>Binary search needs sorted input</h2>
      <p>
        Two algorithms beginners misuse: <code>std::find</code> is a linear
        O(n) scan, while <code>std::lower_bound</code> / <code>std::binary_search</code>{" "}
        are O(log n) but <strong>require the range to already be sorted</strong>.
        Run them on unsorted data and you get silently wrong answers.
      </p>

      <CodeBlock
        language="cpp"
        title="lower_bound: O(log n), sorted only"
        code={`std::vector<int> v = {1, 3, 5, 7, 9};   // MUST be sorted
auto it = std::lower_bound(v.begin(), v.end(), 5);
// it points to the first element >= 5`}
      />

      <Callout variant="pitfall" title="The erase-remove idiom">
        <p>
          To actually delete elements matching a predicate, one call is not
          enough: <code>std::remove_if</code> shuffles the keepers to the front
          and returns a new logical end, but does not change the size. You then
          call <code>erase</code>. (C++20 adds the one-liner{" "}
          <code>std::erase_if(v, pred)</code>.)
        </p>
        <CodeBlock
          language="cpp"
          title="Remove all negatives"
          code={`v.erase(std::remove_if(v.begin(), v.end(),
                       [](int x){ return x < 0; }),
        v.end());
// or, C++20: std::erase_if(v, [](int x){ return x < 0; });`}
        />
      </Callout>

      <Callout variant="interview">
        <p>
          Expect: &ldquo;Sort these by a custom key&rdquo; (lambda comparator),
          &ldquo;Do a binary search in the STL&rdquo; (<code>lower_bound</code>,
          stress the sorted precondition), and &ldquo;Why prefer std algorithms
          to a loop?&rdquo; (clarity, correctness, optimization, intent).
        </p>
      </Callout>

      <Quiz
        question="std::lower_bound returns the wrong element on your data. Most likely cause?"
        choices={[
          {
            id: "a",
            label: "The container is a std::list.",
            explain:
              "Container type affects iterator category/performance, but the classic bug here is unsorted input.",
          },
          {
            id: "b",
            label: "The range was not sorted first.",
            correct: true,
            explain:
              "Binary-search algorithms assume a sorted range. On unsorted data they return meaningless results, with no error.",
          },
          {
            id: "c",
            label: "You forgot to call .begin().",
            explain:
              "That would not compile, rather than return a wrong-but-valid answer.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Rewrite a hand loop three times.</strong> Start with a raw
              loop that, given <code>std::vector&lt;double&gt; returns</code>,
              computes the average of the positive values.
            </p>
            <ol>
              <li>
                Version A: classic algorithms (<code>std::count_if</code> +{" "}
                <code>std::accumulate</code> with a lambda, or a single{" "}
                <code>accumulate</code>).
              </li>
              <li>
                Version B: a C++20 ranges <code>views::filter</code> pipeline.
              </li>
              <li>
                Compare readability and explain whether the views version
                allocates an intermediate vector (it should not).
              </li>
            </ol>
          </>
        }
        hint={
          <>
            For the ranges version, iterate the filtered view and accumulate as
            you go — views are lazy, so no temporary container is built. Watch the
            empty-input edge case (division by zero).
          </>
        }
        solution={
          <>
            <CodeBlock
              language="cpp"
              title="Ranges version"
              code={`#include <ranges>
double posMean(const std::vector<double>& r) {
    double sum = 0; int n = 0;
    for (double x : r | std::views::filter([](double v){ return v > 0; })) {
        sum += x; ++n;
    }
    return n ? sum / n : 0.0;
}`}
            />
            <p>
              The views pipeline reads like the Python comprehension and builds{" "}
              <em>no</em> intermediate vector — each value flows through the
              filter on demand. The classic version is equally correct but
              noisier with explicit iterators. Both beat a hand loop on clarity of
              intent, which is what reviewers (and interviewers) reward.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
