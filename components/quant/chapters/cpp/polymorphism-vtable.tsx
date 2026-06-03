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
      chapterSlug="polymorphism-vtable"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 11"
      title="Polymorphism & the cost of virtual"
      lede="In Python every method call is dynamically dispatched. In C++ you choose: pay nothing for a normal call, or opt into runtime dispatch with 'virtual' — and then you should understand exactly what it costs."
    >
      <h2>Python dispatches everything; C++ lets you choose</h2>
      <p>
        When you call <code>obj.method()</code> in Python, the interpreter looks
        up <code>method</code> on the actual object at runtime — so overriding
        just works. C++ defaults to the opposite: a normal member call is
        resolved at <em>compile time</em> based on the static type, which is fast
        but not overridable through a base pointer. To get Python-style runtime
        dispatch, you mark the function <code>virtual</code>.
      </p>

      <CodeBlock
        language="cpp"
        title="virtual enables runtime polymorphism"
        code={`struct Shape {
    virtual double area() const = 0;   // pure virtual = abstract "interface"
    virtual ~Shape() = default;        // see below: why this is essential
};

struct Circle : Shape {
    double r;
    explicit Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }  // 'override'
};

struct Square : Shape {
    double s;
    explicit Square(double s) : s(s) {}
    double area() const override { return s * s; }
};`}
      />

      <CodeBlock
        language="cpp"
        title="One loop, many concrete types"
        code={`#include <memory>
#include <vector>

std::vector<std::unique_ptr<Shape>> shapes;
shapes.push_back(std::make_unique<Circle>(1.0));
shapes.push_back(std::make_unique<Square>(2.0));

double total = 0;
for (const auto& s : shapes)
    total += s->area();   // calls the RIGHT area() for each object`}
      />

      <Callout variant="intuition" title="Coming from Python">
        <p>
          A C++ abstract base with pure virtual functions (<code>= 0</code>) is
          basically a Python <code>abc.ABC</code> with{" "}
          <code>@abstractmethod</code>. The difference is you opt into the dynamic
          behavior with <code>virtual</code>; non-virtual calls are statically
          bound and free.
        </p>
      </Callout>

      <h2>How <code>virtual</code> works: the vtable</h2>
      <p>
        A class with virtual functions gets a hidden table of function pointers
        called the <strong>vtable</strong>, one per class. Each object of that
        class stores a hidden pointer (the <strong>vptr</strong>) to its
        class&apos;s vtable. A virtual call becomes: follow the vptr to the
        vtable, look up the slot, call through that function pointer.
      </p>

      <CodeBlock
        language="bash"
        title="What a virtual call costs"
        code={`Per object:  +1 hidden pointer (the vptr)
Per call:    1 extra indirection (load vptr -> load slot -> call)
             usually cannot be inlined (target unknown at compile time)
Versus a normal call: direct, inlinable, zero overhead.`}
      />

      <Callout variant="pitfall" title="The virtual destructor rule (memorize this)">
        <p>
          If you delete a derived object through a base pointer and the base
          destructor is <strong>not</strong> virtual, only the base part is
          destroyed — the derived destructor never runs, leaking its resources.
          Rule: <strong>any class meant to be used as a polymorphic base needs a
          virtual destructor.</strong>
        </p>
        <CodeBlock
          language="cpp"
          title="The leak this prevents"
          code={`Shape* s = new Circle(1.0);
delete s;   // safe ONLY because ~Shape() is virtual;
            // otherwise ~Circle() is skipped`}
        />
      </Callout>

      <Callout variant="pitfall" title="Object slicing">
        <p>
          Copy a <code>Circle</code> into a <code>Shape</code> <em>by value</em>{" "}
          and the derived part is &ldquo;sliced&rdquo; off — you keep only the
          base sub-object, and polymorphism is lost. Always handle polymorphic
          objects through pointers or references (ideally{" "}
          <code>unique_ptr&lt;Base&gt;</code>), never by base value.
        </p>
      </Callout>

      <h2>Do not reach for inheritance first</h2>
      <p>
        Coming from Python you might model everything with class hierarchies.
        Modern C++ leans on composition and templates, using <code>virtual</code>{" "}
        specifically when you need a <em>heterogeneous collection behind a common
        interface</em> with the concrete type chosen at runtime. If the type is
        known at compile time, a template is faster (no vtable) and just as
        flexible.
      </p>

      <Callout variant="interview">
        <p>
          Near-certain questions: &ldquo;What is a vtable / how do virtual calls
          work?&rdquo;, &ldquo;Why does a base class need a virtual
          destructor?&rdquo;, and &ldquo;What is object slicing?&rdquo; Bonus:
          &ldquo;virtual dispatch vs templates&rdquo; (runtime indirection vs
          compile-time, with the inlining and code-size trade-offs).
        </p>
      </Callout>

      <Quiz
        question="You delete a derived object through a Base* and its destructor is not virtual. What happens?"
        choices={[
          {
            id: "a",
            label: "Everything is destroyed correctly.",
            explain:
              "Only with a virtual destructor. Without it, the derived destructor is skipped.",
          },
          {
            id: "b",
            label:
              "Only the base part is destroyed; the derived destructor is skipped, leaking its resources (undefined behavior).",
            correct: true,
            explain:
              "This is exactly why polymorphic base classes must declare a virtual destructor.",
          },
          {
            id: "c",
            label: "A compile error.",
            explain:
              "It compiles fine — that is what makes the bug dangerous. It misbehaves only at runtime.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>See dispatch, slicing, and the vtable cost directly.</strong>
            </p>
            <ol>
              <li>
                Build the <code>Shape</code> hierarchy. Put mixed shapes in a{" "}
                <code>vector&lt;unique_ptr&lt;Shape&gt;&gt;</code> and sum their
                areas through the base interface.
              </li>
              <li>
                Remove <code>virtual</code> from <code>~Shape()</code>, delete a{" "}
                <code>Circle</code> through a <code>Shape*</code> under a
                sanitizer, and observe the skipped destructor. Restore it.
              </li>
              <li>
                Demonstrate slicing: assign a <code>Circle</code> to a{" "}
                <code>Shape</code> value and show <code>area()</code> no longer
                behaves polymorphically (or fails to compile because{" "}
                <code>Shape</code> is abstract — explain which and why).
              </li>
            </ol>
          </>
        }
        hint={
          <>
            Add a print in <code>~Circle()</code> so the skipped-destructor bug
            is visible. For slicing, make <code>Shape</code> concrete (give{" "}
            <code>area()</code> a body) so the by-value assignment compiles and
            you can watch the wrong <code>area()</code> get called.
          </>
        }
        solution={
          <>
            <p>
              With the virtual destructor present, deleting through{" "}
              <code>Shape*</code> runs <code>~Circle()</code> then{" "}
              <code>~Shape()</code>. Remove <code>virtual</code> and{" "}
              <code>~Circle()</code> never prints — the leak the rule prevents.
            </p>
            <p>
              Slicing: a <code>Shape</code> value holds only the base sub-object,
              so its <code>area()</code> uses the base implementation, not{" "}
              <code>Circle</code>&apos;s. The lesson: keep polymorphic objects
              behind pointers/references, give bases a virtual destructor, and
              reserve <code>virtual</code> for genuine runtime dispatch.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
