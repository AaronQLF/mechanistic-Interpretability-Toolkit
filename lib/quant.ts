import type { Chapter, Module } from "@/lib/topics";

/** Compound path segment for Next routes: `/quant/<moduleSlug>/...` */
export const QUANT_ROUTE_PREFIX = "quant";

export function quantModulePath(moduleSlug: string): string {
  return `${QUANT_ROUTE_PREFIX}/${moduleSlug}`;
}

export const cppChapters: Chapter[] = [
  {
    slug: "compilation-odr",
    title: "Compilation model & the ODR",
    blurb:
      "Translation units, linkage, and the One Definition Rule — why duplicate symbols fail and how headers really work.",
  },
  {
    slug: "value-categories-const",
    title: "Value categories & const-correctness",
    blurb:
      "lvalues, prvalues, xvalues; const as a contract; when copies happen vs when they do not.",
  },
  {
    slug: "object-model-lifetime-raii",
    title: "Object model, lifetime & RAII",
    blurb:
      "Storage duration, construction order, and why RAII is the default idiom in modern C++.",
  },
  {
    slug: "move-semantics-forwarding",
    title: "Move semantics & perfect forwarding",
    blurb:
      "rvalue references, std::move vs std::forward, and why quant shops care about allocator-aware containers.",
  },
  {
    slug: "copy-elision-rule-of-five",
    title: "Copy elision & rule of zero / three / five",
    blurb:
      "NRVO, mandatory copy elision, and when you should write special members at all.",
  },
  {
    slug: "smart-pointers-ownership",
    title: "Smart pointers & ownership",
    blurb:
      "unique_ptr, shared_ptr, weak_ptr — express ownership in the type system.",
  },
  {
    slug: "templates-basics",
    title: "Templates from first principles",
    blurb:
      "Function and class templates, instantiation, and the cost model of generic code.",
  },
  {
    slug: "sfinae-concepts",
    title: "SFINAE, constraints & concepts",
    blurb:
      "Overload resolution tricks and C++20 concepts for clearer interfaces.",
  },
  {
    slug: "stl-containers-complexity",
    title: "STL containers & complexity",
    blurb:
      "vector, deque, list, map, unordered_map — iterator invalidation and big-O you must know cold.",
  },
  {
    slug: "algorithms-ranges",
    title: "Algorithms & ranges",
    blurb:
      "std::sort, heaps, binary_search, and the ranges library — write less, say more.",
  },
  {
    slug: "polymorphism-vtable",
    title: "Polymorphism & vtable cost",
    blurb:
      "Virtual dispatch, cache misses, and when templates beat inheritance on the hot path.",
  },
  {
    slug: "memory-model-ub",
    title: "Memory model & undefined behavior",
    blurb:
      "Data races, atomics, and why UB is not a pedantic detail in HFT code.",
  },
  {
    slug: "modern-cpp-17-20-23",
    title: "Modern C++ tour (17 / 20 / 23)",
    blurb:
      "Structured bindings, constexpr, modules, coroutines — what is production-ready today.",
  },
  {
    slug: "capstone-cpp-qa",
    title: "Capstone: rapid-fire C++ Q&A",
    blurb:
      "A dense problem set mixing language rules, STL, and performance traps — interview speed run.",
  },
];

export const dsaChapters: Chapter[] = [
  {
    slug: "complexity-amortized",
    title: "Complexity & amortized analysis",
    blurb:
      "Big-O, Ω, Θ; why vector::push_back is amortized O(1); accounting and potential methods.",
  },
  {
    slug: "two-pointers-sliding-window",
    title: "Two pointers & sliding window",
    blurb:
      "Linear scans on sorted arrays and fixed/variable-size windows — the bread and butter of coding rounds.",
  },
  {
    slug: "hashing",
    title: "Hashing",
    blurb:
      "Hash tables, collisions, rolling hash — when O(1) average is enough.",
  },
  {
    slug: "strings",
    title: "String algorithms",
    blurb:
      "KMP, Z-function, suffix structures — know the one you can derive under pressure.",
  },
  {
    slug: "linked-lists",
    title: "Linked lists",
    blurb:
      "Reversal, cycles, merge — pointer manipulation without leaking memory.",
  },
  {
    slug: "stacks-queues-monotonic",
    title: "Stacks, queues & monotonic structures",
    blurb:
      "Next greater element, histogram max rectangle — monotonic stack patterns.",
  },
  {
    slug: "trees-bsts",
    title: "Trees & binary search trees",
    blurb:
      "Traversals, height, balancing intuition — AVL/red-black at a high level.",
  },
  {
    slug: "tries",
    title: "Tries",
    blurb:
      "Prefix trees for autocomplete and bitwise tries for XOR max problems.",
  },
  {
    slug: "heaps",
    title: "Heaps & priority queues",
    blurb:
      "Median streaming, k-way merge, Dijkstra with a binary heap.",
  },
  {
    slug: "graphs-bfs-dfs",
    title: "Graphs: BFS & DFS",
    blurb:
      "Components, bipartite check, topological sort via DFS.",
  },
  {
    slug: "shortest-paths-union-find-topo",
    title: "Shortest paths, union-find & advanced graphs",
    blurb:
      "Dijkstra, Bellman-Ford, Floyd-Warshall; DSU with path compression.",
  },
  {
    slug: "sorting-searching",
    title: "Sorting & binary search",
    blurb:
      "Stability, lower_bound patterns, and binary search on answer.",
  },
  {
    slug: "recursion-backtracking",
    title: "Recursion & backtracking",
    blurb:
      "Generate subsets/permutations; pruning the search tree.",
  },
  {
    slug: "dynamic-programming",
    title: "Dynamic programming",
    blurb:
      "Top-down vs bottom-up, state design, knapsack and LCS families.",
  },
  {
    slug: "greedy-intervals",
    title: "Greedy & interval scheduling",
    blurb:
      "Exchange arguments and classic interval problems.",
  },
  {
    slug: "bit-manipulation",
    title: "Bit manipulation",
    blurb:
      "XOR tricks, subsets, popcount — micro-optimizations and puzzle patterns.",
  },
  {
    slug: "capstone-segment-fenwick",
    title: "Capstone: segment trees & Fenwick trees",
    blurb:
      "Range queries and point updates — build both from scratch on a whiteboard.",
  },
];

export const concurrencyChapters: Chapter[] = [
  {
    slug: "threads-races",
    title: "Threads & data races",
    blurb:
      "std::thread, shared state, and why races are undefined behavior in C++.",
  },
  {
    slug: "mutex-condvar",
    title: "Mutexes, locks & condition variables",
    blurb:
      "std::mutex, unique_lock, scoped_lock, wait predicates — never wake spuriously wrong.",
  },
  {
    slug: "memory-model-atomics",
    title: "The C++ memory model & atomics",
    blurb:
      "Happens-before, memory_order_seq_cst vs acquire/release, and fences.",
  },
  {
    slug: "cas-aba",
    title: "Compare-and-swap & the ABA problem",
    blurb:
      "Lock-free stacks, hazard pointers, and tagged pointers.",
  },
  {
    slug: "spsc-ring-buffer",
    title: "Build an SPSC ring buffer",
    blurb:
      "Single-producer single-consumer queue with cache-line padding — the HFT hello world.",
  },
  {
    slug: "false-sharing-cache",
    title: "False sharing & cache coherence",
    blurb:
      "Why two counters on one cache line destroy scaling; alignment and padding.",
  },
  {
    slug: "futures-async-pools",
    title: "Futures, async & thread pools",
    blurb:
      "Task queues, work stealing at a high level, and when to avoid std::async.",
  },
  {
    slug: "deadlock-lock-ordering",
    title: "Deadlock & lock ordering",
    blurb:
      "Global lock order, try_lock patterns, and timeouts.",
  },
  {
    slug: "capstone-concurrency-qa",
    title: "Capstone: concurrency Q&A",
    blurb:
      "Scenarios: producer-consumer, rate limiter, concurrent LRU sketch — verbal + code.",
  },
];

export const systemsChapters: Chapter[] = [
  {
    slug: "latency-hierarchy",
    title: "The latency hierarchy",
    blurb:
      "Numbers every quant dev memorizes: L1, RAM, SSD, network — orders of magnitude.",
  },
  {
    slug: "caches-memory",
    title: "Caches & memory hierarchy",
    blurb:
      "Lines, associativity, prefetching — why layout matters more than micro-ops.",
  },
  {
    slug: "branch-prediction",
    title: "Branch prediction",
    blurb:
      "Mispredict costs, branchless tricks, and when to sort to help the predictor.",
  },
  {
    slug: "pipelines-simd",
    title: "Pipelines, ILP & SIMD",
    blurb:
      "Superscalar execution, auto-vectorization, and explicit intrinsics trade-offs.",
  },
  {
    slug: "data-oriented-design",
    title: "Data-oriented design",
    blurb:
      "SoA vs AoS, hot/cold splitting, and ECS-style thinking for tick processing.",
  },
  {
    slug: "allocation-numa-hugepages",
    title: "Allocation, NUMA & huge pages",
    blurb:
      "Arena allocators, lock-free pools, numactl, and transparent huge pages caveats.",
  },
  {
    slug: "kernel-bypass-polling",
    title: "Kernel bypass & busy polling",
    blurb:
      "DPDK, onload, busy spin vs interrupt — when the kernel is too slow.",
  },
  {
    slug: "measuring-latency",
    title: "Measuring latency & jitter",
    blurb:
      "Histograms, percentiles, coordinated omission — how not to lie with benchmarks.",
  },
  {
    slug: "capstone-hot-path",
    title: "Capstone: optimize a hot path",
    blurb:
      "Take a naive order-book update loop and squeeze real microseconds out of it.",
  },
];

export const osNetworkingChapters: Chapter[] = [
  {
    slug: "processes-scheduling",
    title: "Processes, threads & scheduling",
    blurb:
      "PID, fork/exec model vs threads, CFS and priority — what the OS guarantees.",
  },
  {
    slug: "virtual-memory",
    title: "Virtual memory & paging",
    blurb:
      "Page tables, TLB, mmap — why random pointer chasing hurts.",
  },
  {
    slug: "syscalls-context",
    title: "Syscalls & context switches",
    blurb:
      "User vs kernel mode, cost of read/write, and batching I/O.",
  },
  {
    slug: "os-sync-primitives",
    title: "OS synchronization primitives",
    blurb:
      "Futexes, semaphores, eventfd — how pthreads map to the kernel.",
  },
  {
    slug: "io-epoll-iouring",
    title: "I/O multiplexing: epoll & io_uring",
    blurb:
      "Edge vs level triggered, ring buffers in the kernel — the path to millions of sockets.",
  },
  {
    slug: "tcp-udp",
    title: "TCP & UDP",
    blurb:
      "Handshake, congestion control, head-of-line blocking — when each is right for market data.",
  },
  {
    slug: "multicast-trading-feeds",
    title: "Multicast & trading feeds",
    blurb:
      "UDP multicast, sequence gaps, recovery channels — how exchanges push ticks.",
  },
  {
    slug: "sockets-programming",
    title: "Sockets programming",
    blurb:
      "bind/listen/accept, non-blocking sockets, SO_REUSEPORT — minimal echo server to production patterns.",
  },
  {
    slug: "capstone-os-net-qa",
    title: "Capstone: OS & networking Q&A",
    blurb:
      "Whiteboard scenarios: tail latency debugging, TCP vs UDP for a new feed, epoll design.",
  },
];

export const quantProbabilityChapters: Chapter[] = [
  {
    slug: "counting-combinatorics",
    title: "Counting & combinatorics",
    blurb:
      "Permutations, combinations, stars-and-bars — speed and no double counting.",
  },
  {
    slug: "axioms-conditional",
    title: "Axioms & conditional probability",
    blurb:
      "Kolmogorov axioms, independence, and the product rule — the grammar of all later chapters.",
  },
  {
    slug: "bayes-law",
    title: "Bayes' law & belief updating",
    blurb:
      "Posterior odds, base rate neglect, and the discrete Bayes interview pattern.",
  },
  {
    slug: "expectation-linearity",
    title: "Expectation & linearity",
    blurb:
      "E[XY] vs E[X]E[Y]; indicator variables and the linearity hammer.",
  },
  {
    slug: "variance-covariance",
    title: "Variance, covariance & correlation",
    blurb:
      "Var of sums, correlation pitfalls, and portfolio intuition.",
  },
  {
    slug: "discrete-distributions",
    title: "Discrete distributions",
    blurb:
      "Bernoulli, binomial, geometric, Poisson — which story matches which PMF.",
  },
  {
    slug: "continuous-distributions",
    title: "Continuous distributions",
    blurb:
      "Uniform, exponential, normal, lognormal — when returns are not Gaussian.",
  },
  {
    slug: "order-statistics",
    title: "Order statistics",
    blurb:
      "Max of exponentials, expected minimum — tournament and auction analogies.",
  },
  {
    slug: "markov-chains-basics",
    title: "Markov chains",
    blurb:
      "Transition matrices, stationary distributions, and hitting times.",
  },
  {
    slug: "martingales-optional-stopping",
    title: "Martingales & optional stopping",
    blurb:
      "Fair games, Wald's equation sketch, and when to stop betting.",
  },
  {
    slug: "capstone-gf-gamblers-ruin",
    title: "Capstone: generating functions & gambler's ruin",
    blurb:
      "Solve ruin probabilities and practice chain-style reasoning under time pressure.",
  },
];

export const statisticsChapters: Chapter[] = [
  {
    slug: "mle-moments",
    title: "MLE & method of moments",
    blurb:
      "Likelihood, log-likelihood, and when closed forms exist.",
  },
  {
    slug: "clt-confidence-intervals",
    title: "CLT & confidence intervals",
    blurb:
      "Normal approximations, z vs t, and interpreting intervals correctly.",
  },
  {
    slug: "hypothesis-testing",
    title: "Hypothesis testing",
    blurb:
      "p-values, power, multiple testing — what practitioners get wrong.",
  },
  {
    slug: "ols-from-scratch",
    title: "OLS from scratch",
    blurb:
      "Normal equations, geometric view, and regularized variants.",
  },
  {
    slug: "bias-variance-regularization",
    title: "Bias–variance & regularization",
    blurb:
      "Ridge, Lasso intuition, and cross-validation discipline.",
  },
  {
    slug: "covariance-pca",
    title: "Covariance matrices & PCA",
    blurb:
      "Eigenportfolio thinking without overfitting fantasy.",
  },
  {
    slug: "arma-stationarity",
    title: "AR / MA / ARMA & stationarity",
    blurb:
      "Unit roots, ACF/PACF — the time-series language of econometrics interviews.",
  },
  {
    slug: "ewma-garch",
    title: "EWMA & GARCH volatility",
    blurb:
      "RiskMetrics vs GARCH(1,1) — volatility clustering in practice.",
  },
  {
    slug: "capstone-stats-qa",
    title: "Capstone: statistics Q&A",
    blurb:
      "Mixed problems: regression diagnostics, MLE traps, and time-series quickies.",
  },
];

export const brainteasersChapters: Chapter[] = [
  {
    slug: "how-to-attack",
    title: "How to attack any brainteaser",
    blurb:
      "Clarify, brute force small n, look for symmetry, check edge cases — a repeatable script.",
  },
  {
    slug: "logic-puzzles",
    title: "Logic puzzles",
    blurb:
      "Knights and knaves, truth tables, and constraint propagation.",
  },
  {
    slug: "combinatorial-puzzles",
    title: "Combinatorial puzzles",
    blurb:
      "Invariants, coloring arguments, and double counting.",
  },
  {
    slug: "ev-puzzles",
    title: "Expected value puzzles",
    blurb:
      "Coupon collector, records, stopping rules — when to recurse on states.",
  },
  {
    slug: "paradoxes",
    title: "Probability paradoxes",
    blurb:
      "Monty Hall, Simpson's paradox, non-transitive dice — explain, don't memorize.",
  },
  {
    slug: "fermi-estimation",
    title: "Fermi estimation",
    blurb:
      "Sanity checks, geometric means, and communicating uncertainty.",
  },
  {
    slug: "market-making-betting",
    title: "Market-making & betting games",
    blurb:
      "Fair prices, inventory risk, Kelly sketch — the desk flavor of brainteasers.",
  },
  {
    slug: "game-theory",
    title: "Game theory basics",
    blurb:
      "Nash equilibrium, dominant strategies, backward induction on trees.",
  },
  {
    slug: "capstone-mental-math",
    title: "Capstone: mental math drills",
    blurb:
      "Compounding, fractions, and approximation under a stopwatch.",
  },
];

export const stochasticChapters: Chapter[] = [
  {
    slug: "random-walks-brownian",
    title: "Random walks & Brownian motion",
    blurb:
      "Scaling limits, quadratic variation preview, and simulation intuition.",
  },
  {
    slug: "properties-brownian",
    title: "Properties of Brownian motion",
    blurb:
      "Independent increments, nowhere differentiable, reflection principle sketch.",
  },
  {
    slug: "ito-integral-lemma",
    title: "Itô integral & Itô's lemma",
    blurb:
      "Why dt terms matter and the chain rule of stochastic calculus.",
  },
  {
    slug: "sdes-gbm",
    title: "SDEs & geometric Brownian motion",
    blurb:
      "Lognormal stock model, solution of GBM, and discretization Euler–Maruyama.",
  },
  {
    slug: "feynman-kac",
    title: "Feynman–Kac & PDE link",
    blurb:
      "From conditional expectations to Black–Scholes PDE — the bridge interviewers love.",
  },
  {
    slug: "finite-differences-pde",
    title: "Finite differences for PDEs",
    blurb:
      "Explicit scheme stability, CFL condition, boundary conditions.",
  },
  {
    slug: "monte-carlo-variance",
    title: "Monte Carlo & variance reduction",
    blurb:
      "Standard error, antithetic variates, control variates — convergence you can see.",
  },
  {
    slug: "rng-sampling",
    title: "RNG & sampling methods",
    blurb:
      "Uniform PRNGs, inverse CDF, Box–Muller, acceptance–rejection.",
  },
  {
    slug: "numerical-linear-algebra",
    title: "Numerical linear algebra",
    blurb:
      "LU, Cholesky, QR — conditioning and why not to invert matrices explicitly.",
  },
  {
    slug: "capstone-root-find-optimize",
    title: "Capstone: root-finding & optimization",
    blurb:
      "Newton, Brent, bisection; golden section vs gradient descent on toy surfaces.",
  },
];

export const financeChapters: Chapter[] = [
  {
    slug: "time-value-rates-bonds",
    title: "Time value, rates & bonds",
    blurb:
      "Discount factors, spot/forward rates, yield — the language of fixed income.",
  },
  {
    slug: "no-arbitrage-pricing",
    title: "No-arbitrage pricing",
    blurb:
      "Law of one price, replicating portfolios, and absent arbitrage in discrete models.",
  },
  {
    slug: "forwards-futures-carry",
    title: "Forwards, futures & carry",
    blurb:
      "Cost of carry, convenience yield, futures vs forward mark-to-market.",
  },
  {
    slug: "option-payoffs-put-call",
    title: "Option payoffs & put–call parity",
    blurb:
      "Calls, puts, spreads, and the parity relation you derive in two minutes.",
  },
  {
    slug: "binomial-model",
    title: "The binomial model",
    blurb:
      "One-step and multi-step trees, risk-neutral probabilities, early exercise preview.",
  },
  {
    slug: "risk-neutral-pricing",
    title: "Risk-neutral valuation",
    blurb:
      "Change of measure intuition — why drift disappears in the discounted price.",
  },
  {
    slug: "black-scholes-derivation",
    title: "Black–Scholes derivation sketch",
    blurb:
      "Replication argument, PDE, closed form — know all three layers.",
  },
  {
    slug: "greeks-delta-hedging",
    title: "The Greeks & delta hedging",
    blurb:
      "Delta, gamma, vega, theta — P&L attribution and gamma scalping intuition.",
  },
  {
    slug: "implied-realized-vol-smile",
    title: "Implied vs realized vol & the smile",
    blurb:
      "IV surface, skew, and why Black–Scholes is wrong but useful.",
  },
  {
    slug: "exotics-overview",
    title: "Exotics overview",
    blurb:
      "Barriers, Asians, lookbacks — pricing hooks and hedging headaches.",
  },
  {
    slug: "fixed-income-credit",
    title: "Fixed income & credit basics",
    blurb:
      "Duration, convexity, CDS intuition — enough not to embarrass yourself.",
  },
  {
    slug: "capstone-portfolio-capm",
    title: "Capstone: portfolios, CAPM & Sharpe",
    blurb:
      "Mean–variance frontier, beta, and interview questions on risk-adjusted returns.",
  },
];

export const systemdesignChapters: Chapter[] = [
  {
    slug: "design-framework",
    title: "A framework for system design interviews",
    blurb:
      "Requirements, capacity, API, data model, and drawing boxes with arrows that mean something.",
  },
  {
    slug: "limit-order-book",
    title: "Limit order book design",
    blurb:
      "Price levels, FIFO queues, and the data structures that survive scrutiny.",
  },
  {
    slug: "matching-engine",
    title: "Matching engine",
    blurb:
      "Order types, priority, auction vs continuous matching — correctness first.",
  },
  {
    slug: "market-data-feeds",
    title: "Market data feed handlers",
    blurb:
      "Incremental updates, snapshots, sequence numbers, and fan-out.",
  },
  {
    slug: "oms-gateway",
    title: "OMS & execution gateway",
    blurb:
      "Client connectivity, idempotency, and state machines for orders.",
  },
  {
    slug: "pre-trade-risk",
    title: "Pre-trade risk checks",
    blurb:
      "Limits, fat-finger checks, and kill switches — compliance as latency budget.",
  },
  {
    slug: "tick-databases",
    title: "Tick databases & storage",
    blurb:
      "Time-series DBs, columnar formats, and replay for backtests.",
  },
  {
    slug: "event-driven-messaging",
    title: "Event-driven messaging",
    blurb:
      "Pub/sub, Kafka vs Aeron, at-least-once vs exactly-once trade-offs.",
  },
  {
    slug: "backtesting-infra",
    title: "Backtesting infrastructure",
    blurb:
      "Look-ahead bias, survivorship, execution simulation — trust nothing.",
  },
  {
    slug: "distributed-basics",
    title: "Distributed systems essentials",
    blurb:
      "CAP as intuition, consensus at a glance, and why HFT is often deliberately not distributed.",
  },
  {
    slug: "capstone-full-trading-system",
    title: "Capstone: design a full trading system",
    blurb:
      "End-to-end: feed → signals → risk → orders → fills → P&L — one coherent narrative.",
  },
];

export const pythonChapters: Chapter[] = [
  {
    slug: "data-model-idioms",
    title: "Python data model & idioms",
    blurb:
      "Objects, references, mutability, dunder methods — write Python that scales to notebooks and prod.",
  },
  {
    slug: "numpy-broadcasting",
    title: "NumPy & broadcasting",
    blurb:
      "Vectorization, strides, and avoiding accidental Python loops.",
  },
  {
    slug: "pandas-market-data",
    title: "pandas for market data",
    blurb:
      "Time indexes, resampling, rolling windows, and merge_asof for as-of joins.",
  },
  {
    slug: "gil-profiling-numba",
    title: "GIL, profiling & Numba",
    blurb:
      "When threads lie, cProfile, and JIT for inner loops.",
  },
  {
    slug: "pybind11",
    title: "pybind11: Python meets C++",
    blurb:
      "Expose hot C++ to Python safely — the quant research stack pattern.",
  },
  {
    slug: "plotting-eda",
    title: "Plotting & exploratory analysis",
    blurb:
      "matplotlib/seaborn discipline — readable plots under time pressure.",
  },
  {
    slug: "capstone-backtest",
    title: "Capstone: build a minimal backtester",
    blurb:
      "Event loop, positions, and metrics — no look-ahead, no fantasy fills.",
  },
];

export const sqlChapters: Chapter[] = [
  {
    slug: "relational-basics",
    title: "Relational model & SQL basics",
    blurb:
      "Keys, constraints, normalization — the theory interviewers still reference.",
  },
  {
    slug: "joins-sets",
    title: "Joins & set operations",
    blurb:
      "INNER/LEFT/CROSS, UNION vs UNION ALL — know the Venn diagrams cold.",
  },
  {
    slug: "aggregation-groupby",
    title: "Aggregation & GROUP BY",
    blurb:
      "HAVING vs WHERE, grouping sets — OLAP patterns for ticks.",
  },
  {
    slug: "window-functions",
    title: "Window functions",
    blurb:
      "PARTITION BY, ROWS vs RANGE, running sums — the Swiss Army knife.",
  },
  {
    slug: "time-series-sql",
    title: "Time-series patterns in SQL",
    blurb:
      "As-of joins, gaps and islands, sessionization — interview classics.",
  },
  {
    slug: "query-plans-indexes",
    title: "Query plans & indexes",
    blurb:
      "EXPLAIN, B-tree vs hash, covering indexes — speak the optimizer's language.",
  },
  {
    slug: "capstone-sql-qa",
    title: "Capstone: SQL Q&A",
    blurb:
      "Multi-part queries under time pressure — window functions mandatory.",
  },
];

export const interviewChapters: Chapter[] = [
  {
    slug: "pipeline-overview",
    title: "The quant developer interview pipeline",
    blurb:
      "Phone screens, onsite loops, take-homes — what each stage optimizes for.",
  },
  {
    slug: "coding-structure",
    title: "Structuring a coding answer",
    blurb:
      "Clarify, complexity, implement, test — live at the whiteboard without panicking.",
  },
  {
    slug: "brainteaser-communication",
    title: "Thinking aloud through brainteasers",
    blurb:
      "Narrate assumptions, track algebra, recover from dead ends.",
  },
  {
    slug: "behavioral-why-firm",
    title: "Behavioral and why-this-firm questions",
    blurb:
      "STAR without sounding robotic; research the desk before you walk in.",
  },
  {
    slug: "offers-negotiation",
    title: "Offers & negotiation",
    blurb:
      "Comp, bonus structure, non-competes — high-level map without legal advice.",
  },
  {
    slug: "mock-coding-dsa",
    title: "Mock set: coding & DSA",
    blurb:
      "A timed set mixing arrays, graphs, and implementation detail.",
  },
  {
    slug: "mock-probability-brainteasers",
    title: "Mock set: probability & brainteasers",
    blurb:
      "Short problems with full solutions — speed and clarity.",
  },
  {
    slug: "mock-cpp-systems",
    title: "Mock set: C++ & systems",
    blurb:
      "Language, concurrency, and OS questions in one sitting.",
  },
  {
    slug: "mock-pricing-math",
    title: "Mock set: pricing & stochastic math",
    blurb:
      "Derive, discretize, implement — connect math to code.",
  },
];

export const quantModules: Module[] = [
  {
    slug: "cpp",
    title: "C++ for Quant Developers",
    status: "available",
    blurb:
      "The language of production trading systems — from RAII to the memory model.",
    chapters: cppChapters,
  },
  {
    slug: "dsa",
    title: "Data Structures & Algorithms",
    status: "available",
    blurb:
      "What every coding round tests — with the graph and DP depth quant shops expect.",
    chapters: dsaChapters,
  },
  {
    slug: "concurrency",
    title: "Concurrency & Lock-Free",
    status: "available",
    blurb:
      "Threads, atomics, and the ring buffer you will be asked to whiteboard.",
    chapters: concurrencyChapters,
  },
  {
    slug: "systems",
    title: "Low-Latency Systems",
    status: "available",
    blurb:
      "Caches, branches, SIMD, and measuring what you cannot see in a profiler screenshot.",
    chapters: systemsChapters,
  },
  {
    slug: "os-networking",
    title: "OS & Networking",
    status: "available",
    blurb:
      "From virtual memory to multicast — the substrate under every feed handler.",
    chapters: osNetworkingChapters,
  },
  {
    slug: "probability",
    title: "Probability for Interviews",
    status: "available",
    blurb:
      "Counting through martingales — the probability stack for desk interviews.",
    chapters: quantProbabilityChapters,
  },
  {
    slug: "statistics",
    title: "Statistics & Time Series",
    status: "available",
    blurb:
      "Estimation, regression, ARMA/GARCH — enough to talk vol and risk intelligently.",
    chapters: statisticsChapters,
  },
  {
    slug: "brainteasers",
    title: "Brainteasers & Games",
    status: "available",
    blurb:
      "Logic, EV, market-making games, and mental math under pressure.",
    chapters: brainteasersChapters,
  },
  {
    slug: "stochastic",
    title: "Stochastic Calculus & Numerics",
    status: "available",
    blurb:
      "Brownian motion to Monte Carlo — the math layer behind the models.",
    chapters: stochasticChapters,
  },
  {
    slug: "finance",
    title: "Quantitative Finance & Options",
    status: "available",
    blurb:
      "From forwards to Black–Scholes, Greeks, and portfolio risk — pricing as a craft.",
    chapters: financeChapters,
  },
  {
    slug: "systemdesign",
    title: "Trading System Design",
    status: "available",
    blurb:
      "LOB, matching, feeds, OMS — draw the system a prop shop actually runs.",
    chapters: systemdesignChapters,
  },
  {
    slug: "python",
    title: "Python & Tooling",
    status: "available",
    blurb:
      "NumPy, pandas, pybind11 — the research side of the same stack.",
    chapters: pythonChapters,
  },
  {
    slug: "sql",
    title: "SQL & Data Wrangling",
    status: "available",
    blurb:
      "Windows, time series, plans — SQL is not dead on the desk.",
    chapters: sqlChapters,
  },
  {
    slug: "interview",
    title: "Interview Strategy & Mocks",
    status: "available",
    blurb:
      "How to run the loop — plus four full mock sets with solutions.",
    chapters: interviewChapters,
  },
];

export function getQuantModule(slug: string): Module | undefined {
  return quantModules.find((m) => m.slug === slug);
}

export function getQuantChapter(
  moduleSlug: string,
  chapterSlug: string
): Chapter | undefined {
  return getQuantModule(moduleSlug)?.chapters?.find((c) => c.slug === chapterSlug);
}

export function getChaptersForQuantModule(moduleSlug: string): Chapter[] {
  return getQuantModule(moduleSlug)?.chapters ?? [];
}

/** Chapters for ChapterShell `chapters` prop — same reference as in quantModules. */
export function getQuantChaptersList(moduleSlug: string): Chapter[] {
  return getChaptersForQuantModule(moduleSlug);
}

/** Flat routes for `generateStaticParams` and tooling. */
export const quantAllChapterRoutes = quantModules.flatMap((m) =>
  (m.chapters ?? []).map((c) => ({ module: m.slug, chapter: c.slug }))
);

export function quantChapterCount(): number {
  return quantAllChapterRoutes.length;
}
