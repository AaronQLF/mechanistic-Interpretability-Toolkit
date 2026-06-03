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
      chapterSlug="value-categories-const"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 02"
      title="Variables, copies, and const"
      lede="The single biggest shift from Python: in C++ a variable is a box that holds a value, and plain assignment copies it. Get this right and half of C++ stops surprising you."
    >
      <h2>Names vs boxes</h2>
      <p>
        In Python, a variable is a <em>name tag</em> you stick on an object. Two
        names can tag the same object. In C++, a normal variable <em>is</em> the
        box: it owns its bytes, and copying it copies the contents.
      </p>

      <CodeBlock
        language="python"
        title="Python: two names, one list"
        code={`a = [1, 2, 3]
b = a          # b tags the SAME list
b.append(4)
print(a)       # [1, 2, 3, 4]  <- a changed too!`}
      />

      <CodeBlock
        language="cpp"
        title="C++: assignment makes a real copy"
        code={`#include <vector>
std::vector<int> a = {1, 2, 3};
std::vector<int> b = a;   // b is a full, independent COPY
b.push_back(4);
// a is still {1, 2, 3}.  b is {1, 2, 3, 4}.`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Python: <code>b = a</code> means &ldquo;b points where a points.&rdquo;
          C++: <code>b = a</code> means &ldquo;build b as a copy of a.&rdquo; If
          you want the Python-style aliasing, you must ask for it with a{" "}
          <em>reference</em> or a <em>pointer</em>.
        </p>
      </Callout>

      <h2>References: opt-in aliasing</h2>
      <p>
        A reference (<code>T&amp;</code>) is another name for an existing
        variable — the closest thing to Python&apos;s default behavior, but you
        write it explicitly. It must be bound when created and can never re-bind.
      </p>

      <CodeBlock
        language="cpp"
        title="A reference is an alias"
        code={`int score = 10;
int& alias = score;   // 'alias' is just another name for 'score'
alias = 99;
// score is now 99 — they are the same box.`}
      />

      <h2>Passing things to functions</h2>
      <p>
        This is where copies cost you. By default, arguments are{" "}
        <strong>copied</strong> into the function. For an <code>int</code> that
        is free; for a million-element vector it is a real, slow copy. You have
        three main choices:
      </p>

      <CodeBlock
        language="cpp"
        title="Three ways to pass a big object"
        code={`#include <string>

// 1) By value: makes a COPY. Fine for small types, wasteful for big ones.
void byValue(std::string s);

// 2) By const reference: NO copy, and you promise not to modify it.
//    This is the default you should reach for with big read-only inputs.
void byConstRef(const std::string& s);

// 3) By (non-const) reference: NO copy, and you CAN modify the caller's object.
void byRef(std::string& s);`}
      />

      <Callout variant="interview">
        <p>
          &ldquo;How do you pass a large object you only need to read?&rdquo; The
          expected answer is <strong>by const reference</strong> (
          <code>const T&amp;</code>): no copy, and the <code>const</code>{" "}
          documents and enforces that you will not mutate it.
        </p>
      </Callout>

      <h2><code>const</code> is a promise the compiler enforces</h2>
      <p>
        <code>const</code> means &ldquo;this will not be modified through this
        name.&rdquo; Python has nothing that truly enforces this. In C++ the
        compiler rejects code that breaks the promise, which catches bugs before
        they run.
      </p>

      <CodeBlock
        language="cpp"
        title="const at every level"
        code={`const int kMax = 100;       // value can never change
kMax = 5;                   // compile error

void print(const std::string& s) {
    s += "!";               // compile error: s is const here
}

struct Account {
    double balance() const; // this method promises not to change the object
};`}
      />

      <h2>lvalues and rvalues (the words behind &ldquo;value categories&rdquo;)</h2>
      <p>
        You will hear these terms constantly. Keep it simple:
      </p>
      <ul>
        <li>
          An <strong>lvalue</strong> has a name and a stable address — something
          you could take the address of or assign to (e.g. a variable{" "}
          <code>x</code>).
        </li>
        <li>
          An <strong>rvalue</strong> is a temporary with no lasting home — the
          result of <code>a + b</code>, or a literal like <code>42</code>, or a
          value a function returns.
        </li>
      </ul>
      <p>
        Why care? Because temporaries (rvalues) can be safely{" "}
        <em>moved from</em> instead of copied — the engine behind the move
        semantics chapter. For now just be able to point at each one.
      </p>

      <CodeBlock
        language="cpp"
        title="Spot the lvalue vs rvalue"
        code={`int x = 5;        // x is an lvalue; 5 is an rvalue (a literal)
int y = x + 1;    // y is an lvalue; (x + 1) is an rvalue (a temporary)
int& r = x;       // OK: bind a reference to an lvalue
int& bad = x + 1; // error: can't bind a plain reference to a temporary`}
      />

      <Callout variant="pitfall" title="The copy you did not mean to make">
        <p>
          Writing <code>for (auto item : bigVector)</code> copies every element.
          Use <code>for (const auto&amp; item : bigVector)</code> to read without
          copying, or <code>for (auto&amp; item : bigVector)</code> to modify in
          place. The missing <code>&amp;</code> is one of the most common
          performance bugs beginners ship.
        </p>
      </Callout>

      <Quiz
        question="You need to pass a 10-million-element vector into a function that only reads it. Best signature?"
        choices={[
          {
            id: "a",
            label: "void f(std::vector<int> v)",
            explain:
              "By value copies all 10 million elements on every call — slow and wasteful.",
          },
          {
            id: "b",
            label: "void f(const std::vector<int>& v)",
            correct: true,
            explain:
              "By const reference: zero copy, and const guarantees (and documents) that you will not modify the caller's data.",
          },
          {
            id: "c",
            label: "void f(std::vector<int>& v)",
            explain:
              "This avoids the copy but drops the const promise, so the compiler can no longer protect the caller's data from accidental writes.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Predict, then verify, every copy.</strong> Take this
              snippet and, for each line, state whether a copy happens and why:
            </p>
            <CodeBlock
              language="cpp"
              title="Count the copies"
              code={`std::vector<int> make();          // returns a vector

std::vector<int> a = make();      // (1)
std::vector<int> b = a;           // (2)
const std::vector<int>& c = a;    // (3)
auto d = c;                       // (4)
for (auto x : a) { /* ... */ }    // (5) per element
for (auto& y : a) { /* ... */ }   // (6) per element`}
            />
            <p>
              Then write a tiny struct with a noisy copy constructor (prints when
              copied) and run it to confirm your predictions.
            </p>
          </>
        }
        hint={
          <>
            A reference never copies; <code>auto</code> deduces a value type (so
            it copies) unless you write <code>auto&amp;</code>. Returning a local
            by value is special — the next chapter (copy elision) explains why it
            is usually free.
          </>
        }
        solution={
          <>
            <p>
              (1) Conceptually a copy/move out of <code>make()</code>, but copy
              elision almost always makes it free. (2) Real copy — independent{" "}
              <code>b</code>. (3) No copy — <code>c</code> is an alias. (4) Copy
              — <code>auto</code> strips the reference and gives a value. (5)
              Copy per element. (6) No copy per element (alias).
            </p>
            <p>
              The noisy copy constructor is the trick the pros use: when you are
              unsure whether something copies, make copying <em>observable</em>{" "}
              and let the program tell you.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
