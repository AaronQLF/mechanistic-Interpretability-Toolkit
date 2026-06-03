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
      chapterSlug="stl-containers-complexity"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 09"
      title="STL containers & their costs"
      lede="Your Python list and dict have direct C++ cousins. Knowing which cousin to pick — and the iterator-invalidation trap that has no Python equivalent — is bread-and-butter interview material."
    >
      <h2>Translate your Python toolbox</h2>
      <p>
        You already know the data structures; you just need the C++ names and a
        feel for their costs.
      </p>

      <CodeBlock
        language="bash"
        title="Python type  →  C++ container"
        code={`list            ->  std::vector<T>          (contiguous, the default)
dict            ->  std::unordered_map<K,V> (hash table, O(1) avg)
(sorted dict)   ->  std::map<K,V>           (balanced tree, O(log n), ordered)
set             ->  std::unordered_set<T>   (hash set)
(sorted set)    ->  std::set<T>             (tree set, ordered)
tuple           ->  std::tuple / std::pair
fixed array     ->  std::array<T, N>        (size known at compile time)
collections.deque -> std::deque<T>          (fast push/pop at both ends)`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          The big one: a Python <code>list</code> maps to{" "}
          <code>std::vector</code>, which is a <strong>contiguous array</strong>,
          not a linked list. And a Python <code>dict</code> is a hash table, so
          its closest match is <code>std::unordered_map</code> — plain{" "}
          <code>std::map</code> is a <em>sorted tree</em>, which is slower but
          keeps keys in order.
        </p>
      </Callout>

      <h2>The complexity cheat sheet</h2>
      <CodeBlock
        language="bash"
        title="Operation costs you should know cold"
        code={`std::vector        push_back   amortized O(1)   |  random index   O(1)
                   insert/erase middle      O(n)   |  find (unsorted) O(n)
std::deque         push front/back          O(1)   |  random index   O(1)
std::list          insert/erase (at iter)   O(1)   |  random index   O(n)
std::unordered_map insert / find / erase    O(1) average, O(n) worst
std::map           insert / find / erase    O(log n), keys stay sorted`}
      />

      <h2><code>std::vector</code> is almost always the right default</h2>
      <p>
        Beginners reach for <code>std::list</code> thinking &ldquo;insertion is
        O(1), so it must be faster.&rdquo; In practice <code>vector</code>{" "}
        usually wins anyway, because its elements sit next to each other in
        memory and the CPU loves predictable, contiguous access (you will see why
        in the cache chapter). A linked list scatters nodes across the heap and
        suffers a cache miss on nearly every hop.
      </p>

      <CodeBlock
        language="cpp"
        title="reserve() avoids repeated reallocations"
        code={`std::vector<double> prices;
prices.reserve(1'000'000);     // allocate once up front
for (int i = 0; i < 1'000'000; ++i)
    prices.push_back(compute(i));  // no growth reallocations now`}
      />

      <h2>Iterator invalidation: the trap with no Python twin</h2>
      <p>
        When a <code>vector</code> grows beyond its capacity, it allocates a new,
        bigger block and moves the elements — so any pointer, reference, or
        iterator into the old storage now dangles. Holding one across a{" "}
        <code>push_back</code> is a real, crashy bug. Python hides this; C++ does
        not.
      </p>

      <CodeBlock
        language="cpp"
        title="A dangling reference caused by growth"
        code={`std::vector<int> v = {1, 2, 3};
int& first = v[0];      // reference into the current buffer
v.push_back(4);         // may reallocate -> 'first' may now dangle
first = 99;             // undefined behavior if it reallocated`}
      />

      <Callout variant="pitfall" title="Know which operations invalidate what">
        <p>
          For <code>vector</code>: any growth past capacity invalidates{" "}
          <em>everything</em>; <code>erase</code> invalidates iterators at/after
          the point. For <code>unordered_map</code>: rehashing invalidates
          iterators but references to elements stay valid. The safe habit:
          re-fetch iterators after modifying a container, or reserve up front.
        </p>
      </Callout>

      <Callout variant="interview">
        <p>
          Frequent: &ldquo;<code>vector</code> vs <code>list</code> — which and
          why?&rdquo; (vector, for cache locality, unless you truly need O(1)
          splicing). &ldquo;<code>map</code> vs <code>unordered_map</code>?&rdquo;
          (ordered tree O(log n) vs hash O(1) average; pick map only if you need
          sorted iteration or ordered range queries). &ldquo;What invalidates a
          vector iterator?&rdquo;
        </p>
      </Callout>

      <Quiz
        question="You need a key→value lookup, do not care about key order, and want the fastest average lookups. Which container?"
        choices={[
          {
            id: "a",
            label: "std::map",
            explain:
              "map is a balanced tree: O(log n) and ordered. Fine, but unordered_map is faster on average when you do not need ordering.",
          },
          {
            id: "b",
            label: "std::unordered_map",
            correct: true,
            explain:
              "Hash table with O(1) average lookup, the natural match for a Python dict when key order is irrelevant.",
          },
          {
            id: "c",
            label: "std::vector of pairs",
            explain:
              "Lookup would be O(n) unless you keep it sorted and binary-search — more work for worse ergonomics here.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Measure the vector-vs-list myth yourself.</strong>
            </p>
            <ol>
              <li>
                Fill a <code>std::vector&lt;int&gt;</code> and a{" "}
                <code>std::list&lt;int&gt;</code> with 10 million values. Time a
                full traversal that sums them. Compile with{" "}
                <code>-O2</code>.
              </li>
              <li>
                Explain the gap using memory layout (contiguous vs scattered
                nodes), not big-O — both traversals are O(n).
              </li>
              <li>
                Reproduce an iterator-invalidation bug: take{" "}
                <code>int&amp; r = v[0];</code>, <code>push_back</code> past
                capacity, then read <code>r</code> under{" "}
                <code>-fsanitize=address</code>. Then fix it with{" "}
                <code>reserve</code>.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            The vector traversal will typically be several times faster despite
            identical big-O, because the prefetcher streams contiguous memory.
            The list pays a cache miss per node. Use{" "}
            <code>std::chrono::steady_clock</code> to time.
          </>
        }
        solution={
          <>
            <p>
              You should see the <code>vector</code> sum run noticeably faster.
              Both are O(n) instructions, but the <code>list</code> dereferences
              a pointer to a heap node each step, defeating the cache and
              prefetcher; the <code>vector</code> walks one contiguous block the
              hardware can stream. This is &ldquo;mechanical sympathy&rdquo; and
              the reason <code>vector</code> is the default.
            </p>
            <p>
              The sanitizer flags the read of <code>r</code> after reallocation;{" "}
              <code>reserve</code>ing enough capacity up front keeps the buffer
              put, so the reference stays valid.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
