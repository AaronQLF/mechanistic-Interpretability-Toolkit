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
      chapterSlug="compilation-odr"
      chapters={cppChapters}
      eyebrow="C++ for Quant Developers · 01"
      title="How C++ builds: from text to a program"
      lede="In Python you just run the file. C++ has a build pipeline you can see and control. Once you understand it, the scary linker errors stop being scary."
    >
      <h2>The one big difference from Python</h2>
      <p>
        When you type <code>python script.py</code>, Python reads your file and
        runs it immediately. There is no separate &ldquo;build&rdquo; step you
        ever think about. C++ is different: before your program can run, a
        toolchain turns your text into machine code <em>ahead of time</em>. That
        is why C++ is fast, and also why you meet errors Python never showed you.
      </p>

      <Callout variant="intuition" title="Coming from Python">
        <p>
          Python = <strong>interpret and run, line by line, at runtime</strong>.
          C++ = <strong>compile everything to machine code first, then run</strong>.
          The compiler is a strict friend who reads all your code before it will
          let you press play.
        </p>
      </Callout>

      <h2>The pipeline, in four steps</h2>
      <p>
        Every C++ program goes through the same assembly line. You usually run it
        with one command, but it is really four stages:
      </p>
      <ol>
        <li>
          <strong>Preprocessor</strong> — handles lines starting with{" "}
          <code>#</code> (like <code>#include</code>). It is basically
          find-and-replace on text.
        </li>
        <li>
          <strong>Compiler</strong> — turns each <code>.cpp</code> file into an{" "}
          <em>object file</em> (<code>.o</code>) of machine code. It checks
          syntax and types here.
        </li>
        <li>
          <strong>Linker</strong> — stitches all the object files (and libraries)
          together into one executable, matching every function call to its body.
        </li>
        <li>
          <strong>Run</strong> — the operating system loads the executable.
        </li>
      </ol>

      <CodeBlock
        language="bash"
        title="What one build command actually does"
        code={`# The short version everyone types:
g++ -std=c++20 main.cpp utils.cpp -o app

# The same thing, broken into the real stages:
g++ -std=c++20 -c main.cpp   -o main.o   # compile  -> object file
g++ -std=c++20 -c utils.cpp  -o utils.o  # compile  -> object file
g++ main.o utils.o -o app                # link     -> executable
./app                                    # run`}
      />

      <h2><code>#include</code> is copy-paste, not <code>import</code></h2>
      <p>
        This trips up every Python developer. In Python, <code>import math</code>{" "}
        loads a module object and gives you a name to reach it. In C++,{" "}
        <code>#include &lt;vector&gt;</code> literally pastes the entire contents
        of that header file into your file before compiling. No namespaces are
        created, nothing is &ldquo;loaded&rdquo; — it is raw text substitution.
      </p>

      <CodeBlock
        language="python"
        title="Python: import binds a module object"
        code={`import math          # 'math' is now a name pointing at a module
print(math.sqrt(2))  # reach into it with a dot`}
      />

      <CodeBlock
        language="cpp"
        title="C++: #include pastes a file in"
        code={`#include <cmath>     // the text of <cmath> is pasted here
#include <iostream>

int main() {
    std::cout << std::sqrt(2.0) << std::endl;
}`}
      />

      <h2>Declaration vs definition</h2>
      <p>
        Python does not really separate these — you write a function once and
        that is that. C++ splits the idea in two:
      </p>
      <ul>
        <li>
          A <strong>declaration</strong> says &ldquo;this thing exists and has
          this type&rdquo; (a promise).
        </li>
        <li>
          A <strong>definition</strong> provides the actual body or storage (the
          payoff).
        </li>
      </ul>
      <p>
        Headers (<code>.h</code> / <code>.hpp</code>) usually hold declarations;
        the matching <code>.cpp</code> holds definitions. The header is the
        &ldquo;table of contents&rdquo; other files read so they know what exists.
      </p>

      <CodeBlock
        language="cpp"
        title="add.hpp — the declaration (the promise)"
        code={`#pragma once          // include this file at most once per .cpp

// Declaration: "a function add exists, takes two ints, returns int."
int add(int a, int b);`}
      />

      <CodeBlock
        language="cpp"
        title="add.cpp — the definition (the body)"
        code={`#include "add.hpp"

int add(int a, int b) {   // Definition: the real code.
    return a + b;
}`}
      />

      <h2>The One Definition Rule (ODR)</h2>
      <p>
        Here is the rule that explains a whole category of errors: across your
        entire program, every function or variable may be <strong>declared</strong>{" "}
        as many times as you like, but <strong>defined exactly once</strong>.
        Define <code>add</code> in two different <code>.cpp</code> files and the
        linker finds two bodies for one name and refuses to choose.
      </p>

      <CodeBlock
        language="bash"
        title="A classic ODR error, decoded"
        code={`/usr/bin/ld: utils.o: multiple definition of \`add(int, int)';
main.o: first defined here

# Translation: two object files each contain a body for add().
# The linker will not pick a winner. You must define it in ONE place.`}
      />

      <Callout variant="pitfall" title="Why putting a function body in a header bites you">
        <p>
          If you write the full body of a normal function in a header and{" "}
          <code>#include</code> that header from three <code>.cpp</code> files,
          you just created three definitions — an ODR violation. Fixes: put the
          body in a single <code>.cpp</code>, or mark it <code>inline</code> (see
          below), or make it a template.
        </p>
      </Callout>

      <h2>Header guards and <code>#pragma once</code></h2>
      <p>
        Because <code>#include</code> is copy-paste, the same header can get
        pasted into one file twice (A includes B and C, and both B and C include
        D). That would duplicate everything inside D. The fix is a guard so the
        body is pasted at most once per translation unit:
      </p>

      <CodeBlock
        language="cpp"
        title="Two ways to guard a header"
        code={`// Modern, simple, supported everywhere in practice:
#pragma once

// ---- or the portable classic: ----
#ifndef MY_PROJECT_ADD_HPP
#define MY_PROJECT_ADD_HPP
int add(int a, int b);
#endif`}
      />

      <h2><code>inline</code>: not really about speed</h2>
      <p>
        Newcomers think <code>inline</code> means &ldquo;paste this function in
        for speed.&rdquo; Today it mostly means something else:{" "}
        <strong>this definition is allowed to appear in multiple translation
        units, and they promise to be identical.</strong> That is exactly the
        ODR exemption you need to safely put a function body in a header.
      </p>

      <Callout variant="interview">
        <p>
          A very common screen question: &ldquo;You put a function in a header
          and got a multiple-definition linker error. Why, and how do you fix
          it?&rdquo; Answer: each <code>#include</code> created a separate
          definition, violating the ODR; fix by marking it <code>inline</code>{" "}
          (or moving the body to one <code>.cpp</code>). Bonus points for
          mentioning that templates and class member functions defined in-class
          are implicitly fine.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            You get <code>multiple definition of `f()`</code> at link time. What
            is the most likely cause?
          </>
        }
        choices={[
          {
            id: "a",
            label: "You forgot to #include the header that declares f().",
            explain:
              "A missing declaration gives an 'undeclared identifier' compile error, not a link-time multiple-definition error.",
          },
          {
            id: "b",
            label:
              "f()'s full body lives in a header included by several .cpp files (and is not inline).",
            correct: true,
            explain:
              "Each include pasted a definition, so several object files define f(). That violates the ODR. Mark it inline or move it to one .cpp.",
          },
          {
            id: "c",
            label: "You compiled with the wrong -std flag.",
            explain:
              "The standard version changes language features, not whether you have two definitions of the same symbol.",
          },
        ]}
      />

      <Challenge
        title="Chapter challenge"
        prompt={
          <>
            <p>
              <strong>Build a 3-file mini project and break it on purpose.</strong>
            </p>
            <ol>
              <li>
                Write <code>mathx.hpp</code> declaring{" "}
                <code>int square(int);</code>, <code>mathx.cpp</code> defining
                it, and <code>main.cpp</code> using it. Compile and run.
              </li>
              <li>
                Now move the full body of <code>square</code> into{" "}
                <code>mathx.hpp</code> and <code>#include</code> it from both{" "}
                <code>main.cpp</code> and a new <code>extra.cpp</code>. Predict
                the exact error before you build.
              </li>
              <li>
                Fix it two different ways: (a) <code>inline</code>, and (b)
                moving the body back to one <code>.cpp</code>. Explain in one
                sentence why each fix satisfies the ODR.
              </li>
            </ol>
          </>
        }
        hint={
          <>
            Build with the explicit stages (<code>-c</code> to stop at object
            files) so you can see whether the error comes from the compiler or
            the linker. Multiple-definition is always a <em>linker</em> error.
          </>
        }
        solution={
          <>
            <p>
              <strong>Step 2</strong> produces a linker error like{" "}
              <code>multiple definition of `square(int)&apos;</code> because each
              translation unit that included the header now carries its own body.
            </p>
            <p>
              <strong>Fix (a):</strong> <code>inline int square(int x)</code>{" "}
              tells the linker &ldquo;identical copies are expected; merge
              them&rdquo; — the ODR explicitly allows one inline definition per
              TU as long as they match.
            </p>
            <p>
              <strong>Fix (b):</strong> keeping only a declaration in the header
              and one definition in <code>mathx.cpp</code> means exactly one body
              exists program-wide, which is the plain ODR case.
            </p>
            <p>
              The deeper lesson: the compiler works on <em>one</em> translation
              unit at a time and never sees the others, so &ldquo;defined
              once&rdquo; is something only the linker can check.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
