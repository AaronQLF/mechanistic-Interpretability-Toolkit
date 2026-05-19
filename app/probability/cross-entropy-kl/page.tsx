import { ChapterShell } from "@/components/content/ChapterShell";
import { Callout } from "@/components/content/Callout";
import { Challenge } from "@/components/content/Challenge";
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

      <Challenge
        prompt={
          <>
            <p>
              <strong>(a) Gibbs&apos; inequality.</strong> Show that
              for any two PMFs <M>P</M>, <M>Q</M> on the same
              support,
              <Block>{tex`\mathrm{KL}(P \,\|\, Q) = \sum_{x} P(x) \log \frac{P(x)}{Q(x)} \ge 0,`}</Block>
              with equality iff{" "}
              <M>{tex`P = Q`}</M>. (Hint: apply Jensen&apos;s
              inequality to <M>{tex`-\log`}</M> with random variable{" "}
              <M>{tex`Q(X)/P(X)`}</M>.)
            </p>
            <p>
              <strong>(b) The two KL directions.</strong> When
              <M>P</M> is the &ldquo;true&rdquo; distribution and{" "}
              <M>Q</M> is a model, two losses suggest themselves:
              <ul>
                <li>
                  <strong>Forward KL</strong>{" "}
                  <M>{tex`\mathrm{KL}(P \,\|\, Q)`}</M> — used for
                  maximum likelihood / standard cross-entropy.
                </li>
                <li>
                  <strong>Reverse KL</strong>{" "}
                  <M>{tex`\mathrm{KL}(Q \,\|\, P)`}</M> — used in
                  variational inference and policy distillation.
                </li>
              </ul>
              Show that forward KL is{" "}
              <strong>mean-seeking</strong> (it heavily penalizes{" "}
              <M>Q</M> for being small where <M>P</M> is large),
              while reverse KL is{" "}
              <strong>mode-seeking</strong> (it heavily penalizes{" "}
              <M>Q</M> for being large where <M>P</M> is small). Use
              this to predict which direction encourages a Gaussian
              fit to a bimodal target to spread mass across both
              modes vs.&nbsp;collapse onto one.
            </p>
            <p>
              <strong>(c) KL of an ablation.</strong> Two language
              models — call them <M>{tex`P_{\text{clean}}`}</M> and{" "}
              <M>{tex`P_{\text{ablated}}`}</M> — output PMFs over a
              vocabulary <M>V</M>. The standard ablation metric is{" "}
              <M>{tex`\mathrm{KL}(P_{\text{clean}} \,\|\, P_{\text{ablated}})`}</M>.
              Why is this preferred over the reverse direction in
              practice? Identify a failure mode in which the metric
              jumps to <M>{tex`+\infty`}</M> and explain how the
              standard mitigation (a small{" "}
              <M>{tex`\varepsilon`}</M> floor on{" "}
              <M>{tex`P_{\text{ablated}}`}</M>) is itself a
              statement about the model&apos;s vocabulary
              well-formedness.
            </p>
          </>
        }
        hint={
          <>
            For (a): Jensen on <M>{tex`-\log`}</M> gives{" "}
            <M>{tex`\mathbb{E}[-\log Y] \ge -\log \mathbb{E}[Y]`}</M>.
            Take{" "}
            <M>{tex`Y = Q(X)/P(X)`}</M> with{" "}
            <M>{tex`X \sim P`}</M>; then{" "}
            <M>{tex`\mathbb{E}[Y] = \sum P(x) \cdot Q(x)/P(x) = 1`}</M>.
            For (b): write each KL as a sum and look at the regions
            where one density is small.
          </>
        }
        solution={
          <>
            <p>
              <strong>(a)</strong>{" "}
              <M>{tex`\mathrm{KL}(P \,\|\, Q) = \mathbb{E}_{X \sim P}[\log P(X) - \log Q(X)] = -\mathbb{E}_{X \sim P}[\log(Q(X)/P(X))]`}</M>.
              Apply Jensen with the convex function{" "}
              <M>{tex`-\log`}</M>:
              <Block>{tex`-\mathbb{E}\!\left[\log\frac{Q(X)}{P(X)}\right] \ge -\log \mathbb{E}\!\left[\frac{Q(X)}{P(X)}\right] = -\log \sum_{x} P(x) \cdot \frac{Q(x)}{P(x)} = -\log 1 = 0.`}</Block>
              Equality in Jensen for strictly convex{" "}
              <M>{tex`-\log`}</M> requires{" "}
              <M>{tex`Q(X)/P(X)`}</M> to be a constant{" "}
              <em>P-almost surely</em>; combined with both summing
              to 1, this forces{" "}
              <M>{tex`P = Q`}</M>.
            </p>
            <p>
              <strong>(b)</strong> Forward KL{" "}
              <M>{tex`\sum_{x} P(x) \log(P(x)/Q(x))`}</M> heavily
              weights regions where{" "}
              <M>{tex`P(x)`}</M> is large; if{" "}
              <M>{tex`P(x) > 0`}</M> but{" "}
              <M>{tex`Q(x) \approx 0`}</M> the term is large
              positive — <em>mean-seeking</em>: <M>Q</M> must cover
              wherever <M>P</M> puts mass. Reverse KL{" "}
              <M>{tex`\sum_{x} Q(x) \log(Q(x)/P(x))`}</M> weights
              regions where{" "}
              <M>{tex`Q(x)`}</M> is large; if{" "}
              <M>{tex`Q(x) > 0`}</M> but{" "}
              <M>{tex`P(x) \approx 0`}</M> the term is large
              positive — <em>mode-seeking</em>: <M>Q</M> must avoid
              putting mass where <M>P</M> doesn&apos;t. For a
              bimodal target: minimizing forward KL with a unimodal{" "}
              <M>Q</M> spreads <M>Q</M> to cover both peaks (the
              classical Gaussian-fit-to-bimodal &ldquo;mean&rdquo;
              picture); minimizing reverse KL collapses <M>Q</M>{" "}
              onto one peak, the classical &ldquo;mode collapse&rdquo;
              of variational families. Both behaviours are
              consequences of which direction punishes which kind of
              error.
            </p>
            <p>
              <strong>(c)</strong> The clean distribution is what
              we&apos;re measuring — we want to know how much the
              ablated model differs <em>where the original puts mass</em>.
              Forward KL (with <M>{tex`P_{\text{clean}}`}</M> first)
              accomplishes this: tokens the original cared about
              must still receive non-trivial probability after
              ablation, or the metric blows up. Reverse KL would
              instead ask &ldquo;does the ablated model invent
              tokens the original wouldn&apos;t consider?&rdquo;
              which is a less useful question for diagnosing
              behaviour preservation.
            </p>
            <p>
              The <M>{tex`+\infty`}</M> failure mode: if some token{" "}
              <M>x</M> has{" "}
              <M>{tex`P_{\text{clean}}(x) > 0`}</M> but{" "}
              <M>{tex`P_{\text{ablated}}(x) = 0`}</M>, the term{" "}
              <M>{tex`P_{\text{clean}}(x) \log(P_{\text{clean}}(x)/0)`}</M>{" "}
              is infinite. In real models this never happens
              numerically (softmax produces{" "}
              <M>{tex`> 0`}</M> on every token), but it can happen
              <em>after</em> top-k or top-p filtering. The standard
              fix — adding a small{" "}
              <M>{tex`\varepsilon`}</M> to{" "}
              <M>{tex`P_{\text{ablated}}`}</M> — quietly says
              &ldquo;the model is allowed to assign at least{" "}
              <M>{tex`\varepsilon`}</M> probability to any token,
              and we will treat probabilities below that as
              measurement noise.&rdquo; The choice of{" "}
              <M>{tex`\varepsilon`}</M> is therefore a judgment
              about how seriously to take long-tail token claims;
              setting it too small inflates the KL by a few large
              outliers, setting it too large smears all
              distinctions.
            </p>
          </>
        }
      />
    </ChapterShell>
  );
}
