import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Figure } from "@/components/content/Figure";
import { Quiz } from "@/components/content/Quiz";
import { Block, M } from "@/components/math/Math";
import { tex } from "@/lib/tex";
import { KLExplorer } from "@/components/viz/KLExplorer";

export const metadata = {
  title: "Cross-entropy & KL divergence",
};

export default function CrossEntropyKLPage() {
  return (
    <ChapterShell
      moduleSlug="probability"
      chapterSlug="cross-entropy-kl"
      eyebrow="Chapter 08"
      title="Cross-entropy & KL divergence"
      lede="Entropy measures the surprise of one distribution. Cross-entropy and KL measure the surprise of using one distribution to encode another — exactly the situation a classifier is in when it tries to predict the truth."
    >
      <h2>Cross-entropy</h2>
      <p>
        Suppose nature samples from <M>P</M>, but you only know <M>Q</M>.
        Your <em>average surprise</em> per draw is the{" "}
        <strong>cross-entropy</strong>:
      </p>
      <Block>{tex`H(P, Q) = \mathbb{E}_{x \sim P}\bigl[-\log_2 Q(x)\bigr] = -\sum_{x} P(x) \log_2 Q(x).`}</Block>
      <p>
        Notice the asymmetry: outcomes are drawn from <M>P</M>, but the
        log is of <M>Q</M>. When <M>Q = P</M>, the cross-entropy
        collapses to the entropy of <M>P</M>.
      </p>

      <h2>KL divergence</h2>
      <p>
        The <strong>Kullback–Leibler divergence</strong> from <M>Q</M>{" "}
        to <M>P</M> is the cross-entropy minus the entropy:
      </p>
      <Block>{tex`\mathrm{KL}(P \,\|\, Q) = H(P, Q) - H(P) = \sum_{x} P(x) \log_2 \frac{P(x)}{Q(x)}.`}</Block>
      <p>
        Read it as &ldquo;extra bits of surprise from using <M>Q</M>{" "}
        instead of <M>P</M>.&rdquo; A few properties to internalize:
      </p>
      <ul>
        <li>
          <strong>Non-negative.</strong>{" "}
          <M>{tex`\mathrm{KL}(P \,\|\, Q) \geq 0`}</M>, with equality
          iff <M>P = Q</M>. (Gibbs&apos; inequality.)
        </li>
        <li>
          <strong>Asymmetric.</strong>{" "}
          <M>{tex`\mathrm{KL}(P \,\|\, Q) \neq \mathrm{KL}(Q \,\|\, P)`}</M>{" "}
          in general. It is <em>not</em> a distance.
        </li>
        <li>
          <strong>Infinity-sensitive.</strong> If{" "}
          <M>{tex`P(x) > 0`}</M> but <M>{tex`Q(x) = 0`}</M>, the
          divergence is infinite — the model
          says &ldquo;impossible&rdquo; about something that happens.
          This is why language models add small epsilons everywhere.
        </li>
      </ul>

      <h2>The classifier loss, finally</h2>
      <p>
        A classifier sees a true label as a one-hot <M>P</M> — all mass
        on the correct class — and predicts a distribution <M>Q</M>.
        Cross-entropy collapses to a single log:
      </p>
      <Block>{tex`H(P, Q) = -\log_2 Q(x_{\text{true}}).`}</Block>
      <p>
        That&apos;s the <strong>negative log-likelihood</strong> of the
        correct class. Minimizing it pushes the model&apos;s probability
        of the right answer up. In nats (base <M>e</M>), this is the
        scalar your training loop prints every step.
      </p>

      <Figure caption="Two distributions over the same six outcomes. P is the truth (left, blue), Q is the model (right, purple). The panel below tracks H(P), H(P,Q), and the two KLs in real time as you drag the bars.">
        <KLExplorer />
      </Figure>

      <Callout variant="intuition">
        <p>
          KL is the <em>cost of being wrong about which distribution
          governs reality</em>. The two limits are worth feeling:
        </p>
        <ul>
          <li>
            If <M>Q</M> matches <M>P</M> exactly, KL = 0 — your model
            is optimal.
          </li>
          <li>
            If <M>Q</M> puts almost no mass where <M>P</M> puts a lot,
            KL explodes — your model is catastrophically wrong on the
            common cases.
          </li>
        </ul>
        <p>
          KL is asymmetric because being wrong on rare events is
          cheaper than being wrong on common ones.
        </p>
      </Callout>

      <Callout variant="mechinterp">
        <p>
          The training loss of a language model is{" "}
          <em>average per-token cross-entropy</em> against a one-hot
          ground truth. Every loss number you see in a paper is a
          cross-entropy in nats, and every perplexity number is{" "}
          <M>{tex`e^{\text{loss}}`}</M>.
        </p>
        <p>
          When mech interp papers report the effect of an intervention,
          a common metric is the <strong>KL between the original and
          ablated next-token distributions</strong>:
        </p>
        <Block>{tex`\mathrm{KL}\bigl(p_{\text{clean}} \,\|\, p_{\text{ablated}}\bigr).`}</Block>
        <p>
          A small KL means the component you removed wasn&apos;t doing
          much on that input; a large KL means it was crucial.
        </p>
      </Callout>

      <Quiz
        question={
          <>
            For the same <M>P</M> and <M>Q</M>, which is generally
            larger:
            <M>{tex`\;\mathrm{KL}(P \,\|\, Q)`}</M> or{" "}
            <M>{tex`\mathrm{KL}(Q \,\|\, P)`}</M>?
          </>
        }
        choices={[
          {
            id: "a",
            label: "They are always equal.",
            explain:
              "KL is asymmetric in general — the two directions can differ a lot.",
          },
          {
            id: "b",
            label: "KL(P ‖ Q) is always larger.",
            explain:
              "Neither direction is always larger; it depends on where the mass is.",
          },
          {
            id: "c",
            label: "It depends on the distributions.",
            correct: true,
            explain:
              "Exactly — try the 'model-overconfident' and 'model-flat' presets and you'll see them swap.",
          },
        ]}
      />
    </ChapterShell>
  );
}
