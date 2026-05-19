import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { EntropyMeter } from "@/components/viz/EntropyMeter";

export const metadata = {
  title: "Entropy",
};

export default function EntropyPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="entropy"
      eyebrow="Chapter 07"
      title="Entropy"
      lede="Entropy is the average surprise of a distribution, measured in bits. It is the single most important summary number a probabilist quotes, and the quantity a language model is trying to minimize."
    >
      <h2>Surprise, then average it</h2>
      <p>
        The <strong>surprise</strong> (or self-information) of an
        outcome with probability <M>p</M> is{" "}
        <M>{tex`-\log_2 p`}</M> bits. Likely things are not surprising;
        unlikely things are. The base-2 choice is what makes the unit
        &ldquo;bits&rdquo; — base <M>e</M> is &ldquo;nats,&rdquo; base
        10 is &ldquo;hartleys,&rdquo; nobody&apos;s used the latter
        since the 1940s.
      </p>
      <p>
        <strong>Entropy</strong> is just the expectation of surprise:
      </p>
      <Block>{tex`H(p) = \mathbb{E}_{x \sim p}\bigl[-\log_2 p(x)\bigr] = -\sum_{x} p(x) \log_2 p(x).`}</Block>

      <h2>Two limits worth memorizing</h2>
      <ul>
        <li>
          <strong>Deterministic distribution.</strong> One bar is 1,
          the rest are 0. Surprise is 0 every time. Entropy is 0.
        </li>
        <li>
          <strong>Uniform on K outcomes.</strong> Every outcome has
          probability <M>1/K</M> and surprise <M>{tex`\log_2 K`}</M>{" "}
          bits. Entropy is <M>{tex`\log_2 K`}</M> bits — the maximum
          possible for <M>K</M> outcomes.
        </li>
      </ul>
      <p>
        Every other distribution sits somewhere in between. Slide the
        sharpness control below from peaky to uniform and watch the
        meter fill.
      </p>

      <Figure caption="Top: a distribution over 8 outcomes. Middle: H(p) in bits, displayed as a fraction of the maximum log₂ 8 = 3 bits. Bottom-right panel: perplexity = 2ᴴ, the 'effective number of equally likely outcomes.'">
        <EntropyMeter />
      </Figure>

      <h2>Perplexity: entropy with friendlier units</h2>
      <p>
        Take 2 to the power of the entropy and you get{" "}
        <strong>perplexity</strong>:
      </p>
      <Block>{tex`\mathrm{PPL}(p) = 2^{H(p)}.`}</Block>
      <p>
        It&apos;s the size of the equivalent <em>uniform</em>{" "}
        distribution. A model with perplexity 8 is &ldquo;as
        uncertain&rdquo; as if it had to guess uniformly among 8
        choices. A perplexity-1 model has no uncertainty; a
        perplexity-50,000 model on GPT-2&apos;s vocabulary is{" "}
        <em>perfectly clueless</em>.
      </p>

      <Callout variant="intuition">
        Entropy is the average number of yes/no questions you&apos;d
        need to identify the outcome of a single draw, if your questions
        were chosen optimally. A fair coin needs 1 question on average;
        a fair die needs <M>{tex`\log_2 6 \approx 2.58`}</M> questions.
        That&apos;s it. That&apos;s entropy.
      </Callout>

      <Callout variant="mechinterp">
        <p>
          When you see a language-model report &ldquo;cross-entropy 2.4
          nats/token&rdquo; or &ldquo;perplexity 11.0,&rdquo; those
          numbers are entropies in disguise:
        </p>
        <Block>{tex`\text{loss} \approx \mathbb{E}_{x_t \sim \text{data}}\bigl[-\log p_\theta(x_t \mid x_{<t})\bigr].`}</Block>
        <p>
          We&apos;ll formalize that loss as <em>cross-entropy</em> in
          the next chapter. The entropy of the model&apos;s output
          distribution is also tracked as a calibration signal —
          extremely peaky outputs that are wrong (low entropy, high
          loss) are a different failure mode from flat-and-confused
          outputs (high entropy, high loss).
        </p>
      </Callout>

      <Quiz
        question={
          <>
            What is the entropy of a fair 4-sided die roll, in bits?
          </>
        }
        choices={[
          {
            id: "a",
            label: "1 bit",
            explain:
              "That's the entropy of a fair coin — two outcomes.",
          },
          {
            id: "b",
            label: "2 bits",
            correct: true,
            explain:
              "Uniform over 4 outcomes gives H = log₂ 4 = 2 bits.",
          },
          {
            id: "c",
            label: "4 bits",
            explain:
              "Entropy in bits is logarithmic in the number of outcomes — log₂, not the count.",
          },
        ]}
      />

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a) Maximum entropy.</strong> Show that among
              all distributions on{" "}
              <M>{tex`K`}</M> outcomes, the uniform one achieves the
              maximum entropy{" "}
              <M>{tex`\log K`}</M>. Two paths: a Lagrange-multiplier
              proof using the constraint{" "}
              <M>{tex`\sum p_{i} = 1`}</M>, or a one-line proof using
              Jensen&apos;s inequality applied to the convex function{" "}
              <M>{tex`-\log`}</M>. Do the Jensen version.
            </p>
            <p>
              <strong>(b) Concavity of entropy.</strong> Show that{" "}
              <M>{tex`H(\mathbf{p})`}</M> is a concave function of
              the PMF{" "}
              <M>{tex`\mathbf{p}`}</M>: for any{" "}
              <M>{tex`\lambda \in [0, 1]`}</M> and PMFs{" "}
              <M>{tex`\mathbf{p}, \mathbf{q}`}</M>,
              <Block>{tex`H(\lambda \mathbf{p} + (1-\lambda) \mathbf{q}) \geq \lambda H(\mathbf{p}) + (1 - \lambda) H(\mathbf{q}).`}</Block>
              Interpret operationally: mixing two distributions
              cannot reduce uncertainty.
            </p>
            <p>
              <strong>(c) Per-token entropy in a transformer.</strong>{" "}
              The next-token distribution at position <M>t</M> has
              entropy{" "}
              <M>{tex`H_{t} = H(p_{\theta}(\cdot \mid x_{<t}))`}</M>.
              Show that the average per-token cross-entropy of the
              model on a corpus is bounded below by the average{" "}
              <M>{tex`H_{t}`}</M>: a model that perfectly fits the
              data cannot have loss smaller than the data&apos;s own
              entropy. (This is the &ldquo;irreducible loss&rdquo;
              floor in scaling laws.) When does equality hold?
            </p>
          </>
        }
        hint={
          <>
            For (a):{" "}
            <M>{tex`H(\mathbf{p}) = \mathbb{E}_{\mathbf{p}}[-\log p(X)]`}</M>{" "}
            and Jensen on{" "}
            <M>{tex`-\log`}</M> with random variable{" "}
            <M>{tex`1/p(X)`}</M>. For (b): write <M>H</M> as a sum
            of terms{" "}
            <M>{tex`-p_i \log p_i`}</M>, each of which is
            concave in <M>{tex`p_i`}</M>. For (c):
            <M>{tex`H(P, Q) = H(P) + \mathrm{KL}(P \| Q) \ge H(P)`}</M>.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`H(\mathbf{p}) = \sum_{i} p_{i} \log(1/p_{i}) = \mathbb{E}_{i \sim \mathbf{p}}[\log(1/p_{i})]`}</M>.
              Apply Jensen to the concave function{" "}
              <M>{tex`\log`}</M>: <M>{tex`\mathbb{E}[\log Y] \le \log \mathbb{E}[Y]`}</M>.
              With <M>{tex`Y = 1/p_{i}`}</M>:{" "}
              <M>{tex`\mathbb{E}[Y] = \sum_{i} p_{i}/p_{i} = K`}</M>.
              So <M>{tex`H(\mathbf{p}) \le \log K`}</M>, with
              equality iff <M>Y</M> is constant, i.e.{" "}
              <M>{tex`p_{i} = 1/K`}</M> for all <M>i</M> — uniform.
            </p>
            <p>
              <strong>(b)</strong> The function{" "}
              <M>{tex`f(p) = -p \log p`}</M> is concave on{" "}
              <M>{tex`[0, 1]`}</M> (its second derivative is{" "}
              <M>{tex`-1/p < 0`}</M>). The entropy{" "}
              <M>{tex`H(\mathbf{p}) = \sum_{i} f(p_{i})`}</M> is a
              sum of concave functions of the linear coordinates{" "}
              <M>{tex`p_{i}`}</M>, hence concave. Concretely:
              <Block>{tex`H(\lambda \mathbf{p} + (1-\lambda) \mathbf{q}) = \sum_{i} f(\lambda p_{i} + (1-\lambda) q_{i}) \ge \lambda \sum_{i} f(p_{i}) + (1-\lambda) \sum_{i} f(q_{i}) = \lambda H(\mathbf{p}) + (1-\lambda) H(\mathbf{q}).`}</Block>
              Operational reading: mixing two distributions
              (the operational meaning of a coin-flipped sample
              from one or the other) increases uncertainty about the
              outcome at least as much as the
              probability-weighted average of the original
              uncertainties — you have added the &ldquo;which
              source?&rdquo; question on top.
            </p>
            <p>
              <strong>(c)</strong> The model&apos;s per-token loss
              is the cross-entropy{" "}
              <M>{tex`H(P_{t}, Q_{\theta, t})`}</M>, where{" "}
              <M>{tex`P_{t}`}</M> is the true distribution over the
              next token given context and{" "}
              <M>{tex`Q_{\theta, t}`}</M> is the model&apos;s. By the
              decomposition
              <Block>{tex`H(P, Q) = H(P) + \mathrm{KL}(P \,\|\, Q),`}</Block>
              and KL ≥ 0, we have{" "}
              <M>{tex`H(P_{t}, Q_{\theta, t}) \ge H(P_{t})`}</M>.
              Averaging over <M>t</M> and over the data:
              <Block>{tex`\mathcal{L}(\theta) = \mathbb{E}_{t}[H(P_{t}, Q_{\theta, t})] \ge \mathbb{E}_{t}[H(P_{t})] = H_{\text{data}}.`}</Block>
              So the loss has a hard floor equal to the corpus&apos;s
              own entropy <M>{tex`H_{\text{data}}`}</M>: even a
              perfect model cannot do better, because the data
              itself is genuinely random. Equality holds when{" "}
              <M>{tex`Q_{\theta, t} = P_{t}`}</M> for every context
              — the optimal model. This irreducible floor is what
              scaling laws estimate when they fit{" "}
              <M>{tex`\mathcal{L}(N, D) = \mathcal{L}_{\infty} + A/N^{\alpha} + B/D^{\beta}`}</M>{" "}
              and report the constant{" "}
              <M>{tex`\mathcal{L}_{\infty}`}</M>: it is an estimate
              of <M>{tex`H_{\text{data}}`}</M> on the training
              distribution.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
