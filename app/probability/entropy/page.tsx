import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
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
    </ChapterShell>
  );
}
