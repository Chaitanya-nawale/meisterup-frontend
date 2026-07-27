import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Flame,
  GitBranch,
  Play,
  RotateCcw,
  Sparkles,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")(  {
  head: () => ({
    meta: [
      { title: "MeisterUp — Adaptive Learning Platform for Engineers" },
      {
        name: "description",
        content:
          "An AI-native adaptive learning platform that models what you already know, finds your gaps, and teaches the right concept next, for any technical skill.",
      },
      { property: "og:title", content: "MeisterUp — Adaptive Learning Platform for Engineers" },
      {
        property: "og:description",
        content:
          "An AI-native adaptive learning platform that models what you already know, finds your gaps, and teaches the right concept next, for any technical skill.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

/* ────────────────────────────────────────────────────────────── */
/*  PRIMITIVES                                                    */
/* ────────────────────────────────────────────────────────────── */

function cn(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white/60 backdrop-blur">
      {children}
    </div>
  );
}

function GridBg() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.35]"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "56px 56px",
        maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)",
      }}
    />
  );
}

function GlowOrb({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full blur-[120px] opacity-40", className)}
    />
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  NAV                                                           */
/* ────────────────────────────────────────────────────────────── */

function Nav() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "backdrop-blur-xl bg-black/60 border-b border-white/[0.06]" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <a href="#top" className="group flex items-center gap-2">
          <img src="/favicon.ico" alt="MeisterUp Logo" className="h-6 w-6 object-contain" />
          <span className="text-[15px] font-semibold tracking-tight text-white">MeisterUp</span>
          <span className="ml-1 rounded-full border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-widest text-white/50">
            Beta
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {[
            ["How it works", "#how"],
            ["Try it", "#demo"],
            ["Skills", "#skills"],
            ["Pricing", "/pricing"],
            ["FAQ", "/faq"],
          ].map(([label, href]) => (
            <Link
              key={label}
              to={href}
              className="text-[13px] font-medium text-white/60 transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-white/90"
            >
              Go to Dashboard
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <a
                href="#demo"
                className="hidden text-[13px] font-medium text-white/70 hover:text-white sm:block"
              >
                Start free
              </a>
              <Link
                to="/signin"
                className="group inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-black transition-all hover:bg-white/90"
              >
                Sign in
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  HERO                                                          */
/* ────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-24">
      <GridBg />
      <GlowOrb className="left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 bg-indigo-500" />
      <GlowOrb className="right-0 top-40 h-[380px] w-[380px] bg-fuchsia-500/40" />
      <GlowOrb className="left-0 top-60 h-[380px] w-[380px] bg-cyan-500/40" />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <Eyebrow>
            <Sparkles className="h-3 w-3" />
            <span>Level Up Your Skills</span>
          </Eyebrow>

          <h1 className="mt-6 font-sans text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-white sm:text-6xl md:text-7xl">
            The learning platform that
            <br />
            <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
              knows what you don't.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
            Answer a few questions. We find the gaps in what you already know, then teach only
            those — one concept at a time, for any technical skill.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold text-black transition hover:bg-white/90"
            >
              Take the 60-second assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-[14px] font-medium text-white/90 backdrop-blur transition hover:bg-white/[0.06]"
            >
              <Play className="h-3.5 w-3.5" />
              See how it works
            </a>
          </div>

          <p className="mt-6 text-[12px] text-white/40">
            Free tier · Instant skill gap analysis · Personalized learning path
          </p>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}

/* Hero visual — simplified: just the animated knowledge graph */

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-16 max-w-3xl"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)]">
        <div className="relative h-[380px] overflow-hidden">
          <KnowledgeGraph />
        </div>

        {/* Subtle bottom label */}
        <div className="flex items-center justify-center border-t border-white/[0.06] bg-black/30 px-4 py-2.5 text-[11px] text-white/50">
          <span className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px] shadow-emerald-400" />
            Your personal knowledge graph — adapting in real-time
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* Animated knowledge graph SVG */
function KnowledgeGraph() {
  const nodes = [
    { id: "vars", label: "Vars", x: 90, y: 90, state: "mastered" },
    { id: "types", label: "Types", x: 200, y: 60, state: "mastered" },
    { id: "func", label: "Functions", x: 310, y: 100, state: "mastered" },
    { id: "iter", label: "Iterables", x: 160, y: 180, state: "mastered" },
    { id: "compr", label: "Comprehensions", x: 300, y: 220, state: "active" },
    { id: "gen", label: "Generators", x: 440, y: 170, state: "next" },
    { id: "dec", label: "Decorators", x: 470, y: 300, state: "next" },
    { id: "async", label: "Async", x: 320, y: 340, state: "locked" },
    { id: "ctx", label: "Contexts", x: 170, y: 320, state: "locked" },
  ];
  const edges: [string, string][] = [
    ["vars", "types"],
    ["types", "func"],
    ["vars", "iter"],
    ["iter", "compr"],
    ["func", "compr"],
    ["func", "gen"],
    ["compr", "gen"],
    ["gen", "dec"],
    ["compr", "async"],
    ["gen", "async"],
    ["iter", "ctx"],
    ["dec", "async"],
  ];
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const colorFor = (s: string) =>
    s === "mastered"
      ? "#34d399"
      : s === "active"
        ? "#a78bfa"
        : s === "next"
          ? "#22d3ee"
          : "#3f3f46";

  return (
    <svg viewBox="0 0 560 420" className="h-full w-full">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => {
        const A = byId[a];
        const B = byId[b];
        const active = A.state === "mastered" && (B.state === "mastered" || B.state === "active");
        return (
          <motion.line
            key={i}
            x1={A.x}
            y1={A.y}
            x2={B.x}
            y2={B.y}
            stroke={active ? "#a78bfa" : "#ffffff"}
            strokeOpacity={active ? 0.5 : 0.08}
            strokeWidth={active ? 1.2 : 1}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.6 }}
          />
        );
      })}
      {nodes.map((n, i) => (
        <motion.g
          key={n.id}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.06, type: "spring", stiffness: 120 }}
        >
          {n.state === "active" && (
            <>
              <circle cx={n.x} cy={n.y} r="42" fill="url(#halo)" />
              <motion.circle
                cx={n.x}
                cy={n.y}
                r="18"
                fill="none"
                stroke="#a78bfa"
                strokeOpacity="0.6"
                animate={{ r: [18, 30, 18], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              />
            </>
          )}
          <circle cx={n.x} cy={n.y} r="8" fill={colorFor(n.state)} stroke="black" strokeWidth="2" />
          <text
            x={n.x}
            y={n.y + 22}
            textAnchor="middle"
            fill={n.state === "locked" ? "#52525b" : "#e4e4e7"}
            fontSize="10"
            fontFamily="Inter, sans-serif"
            fontWeight="500"
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  HOW IT WORKS                                                  */
/* ────────────────────────────────────────────────────────────── */

function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Pick a skill",
      body: "Rust, React, system design, SQL, prompt engineering — anything technical.",
    },
    {
      n: "02",
      title: "Show what you know",
      body: "A short, adaptive check figures out your real level in about a minute.",
    },
    {
      n: "03",
      title: "Learn only the gaps",
      body: "You get one concept at a time — never what you already understand.",
    },
  ];
  return (
    <section id="how" className="relative border-b border-white/[0.06] py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 font-sans text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Three steps.
            <span className="text-white/40"> That's the whole idea.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="relative rounded-2xl border border-white/10 bg-white/[0.02] p-6"
            >
              <div className="font-mono text-[11px] tracking-[0.2em] text-white/35">{s.n}</div>
              <div className="mt-3 text-[16px] font-semibold text-white">{s.title}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-white/55">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-white/40">
          Most people finish their first lesson in under five minutes.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  INTERACTIVE SWIPE DEMO                                        */
/* ────────────────────────────────────────────────────────────── */

const SWIPE_CARDS = [
  {
    title: "Auth middleware — PR #4821",
    lang: "typescript",
    code: `export function requireAuth(req, res, next) {
  const token = req.headers.authorization
  if (!token) return res.status(401).end()
  const user = jwt.decode(token) // decode, not verify
  req.user = user
  next()
}`,
    bad: true,
    concept: "JWT verification",
    why: "jwt.decode() does not check the signature. Any forged token with valid JSON is accepted. Use jwt.verify() with the shared secret.",
  },
  {
    title: "React memoization — PR #911",
    lang: "typescript",
    code: `const Row = memo(function Row({ item, onSelect }) {
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>
})

// parent:
<Row item={item} onSelect={id => setSelected(id)} />`,
    bad: true,
    concept: "Stable callbacks",
    why: "memo() bails out because onSelect is a new function every parent render. Wrap it in useCallback or hoist it above the render.",
  },
  {
    title: "Postgres index — migration 0043",
    lang: "sql",
    code: `CREATE INDEX CONCURRENTLY idx_orders_user_created
  ON orders (user_id, created_at DESC)
  WHERE status IN ('paid', 'refunded');`,
    bad: false,
    concept: "Partial composite index",
    why: "Correct. Composite + partial index targets the hot query path without indexing dead rows. CONCURRENTLY avoids table locks.",
  },
];

function SwipeDemo() {
  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState<null | {
    correct: boolean;
    card: (typeof SWIPE_CARDS)[number];
  }>(null);
  const [streak, setStreak] = useState(0);
  const [xp, setXp] = useState(120);
  const [prevStreak, setPrevStreak] = useState(0);
  const [prevXp, setPrevXp] = useState(120);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-14, 14]);
  const opacity = useTransform(x, [-200, -60, 0, 60, 200], [0.3, 1, 1, 1, 0.3]);
  const approveOpacity = useTransform(x, [20, 120], [0, 1]);
  const rejectOpacity = useTransform(x, [-120, -20], [1, 0]);

  const card = SWIPE_CARDS[i % SWIPE_CARDS.length];

  function resolve(dir: "left" | "right") {
    const userSaysBad = dir === "left";
    const correct = userSaysBad === card.bad;
    setPrevStreak(streak);
    setPrevXp(xp);
    setFeedback({ correct, card });
    if (correct) {
      setStreak((s) => s + 1);
      setXp((v) => v + 25);
    } else {
      setStreak(0);
    }
  }
  function nextCard() {
    setFeedback(null);
    setI((n) => n + 1);
    x.set(0);
  }
  function undo() {
    if (!feedback) return;
    setStreak(prevStreak);
    setXp(prevXp);
    setFeedback(null);
    x.set(0);
  }

  return (
    <section id="demo" className="relative border-b border-white/[0.06] py-28">
      <GlowOrb className="right-1/4 top-1/3 h-[380px] w-[380px] bg-fuchsia-500/20" />
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Try one activity</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">
            Approve. Reject.
            <br />
            <span className="text-white/40">Build engineering judgment.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/60">
            A live sample of one activity type — swipe-based code review, drawn from anonymized
            production PRs. Reasoning matters more than the swipe: after each card, MeisterUp asks{" "}
            <em>why</em>.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            <StatCard icon={Flame} label="Streak" value={streak} />
            <StatCard icon={Zap} label="XP" value={xp} />
            <StatCard icon={TrendingUp} label="Mastery" value="B+" />
          </div>

          <div className="mt-8 flex items-center gap-4 text-[12px] text-white/50">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">
                ←
              </kbd>
              Reject
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px]">
                →
              </kbd>
              Approve
            </span>
          </div>
        </div>

        <div className="relative mx-auto h-[520px] w-full max-w-md">
          <AnimatePresence>
            {!feedback && (
              <motion.div
                key={i}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -100) resolve("left");
                  else if (info.offset.x > 100) resolve("right");
                }}
                style={{ x, rotate, opacity }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <ReviewCard
                  card={card}
                  approveOpacity={approveOpacity}
                  rejectOpacity={rejectOpacity}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6"
              >
                <div
                  className={cn(
                    "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    feedback.correct
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-rose-400/10 text-rose-300",
                  )}
                >
                  {feedback.correct ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  {feedback.correct ? "Correct call" : "Not quite"}
                </div>
                <div className="mt-4 text-[15px] font-semibold text-white">
                  {feedback.card.concept}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                  {feedback.card.why}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-white/[0.06] pt-4">
                  <button
                    onClick={undo}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
                    title="Undo last swipe"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Undo swipe
                  </button>
                  <button
                    onClick={nextCard}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-[12px] font-semibold text-black hover:bg-white/90 cursor-pointer"
                  >
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!feedback && (
            <div className="pointer-events-none absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2 text-[11px] text-white/40">
              <span>Drag or use ← →</span>
            </div>
          )}
        </div>
      </div>
      <KeyboardBridge onResolve={resolve} active={!feedback} />
    </section>
  );
}

function KeyboardBridge({
  onResolve,
  active,
}: {
  onResolve: (d: "left" | "right") => void;
  active: boolean;
}) {
  useEffect(() => {
    if (!active) return;
    const on = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") onResolve("left");
      if (e.key === "ArrowRight") onResolve("right");
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [onResolve, active]);
  return null;
}

function ReviewCard({
  card,
  approveOpacity,
  rejectOpacity,
}: {
  card: (typeof SWIPE_CARDS)[number];
  approveOpacity: import("framer-motion").MotionValue<number>;
  rejectOpacity: import("framer-motion").MotionValue<number>;
}) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0e12] to-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.02] px-4 py-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-white/50" />
          <span className="text-[12px] font-medium text-white/80">{card.title}</span>
        </div>
        <span className="rounded border border-white/10 px-1.5 py-0.5 font-mono text-[10px] uppercase text-white/50">
          {card.lang}
        </span>
      </div>
      <pre className="flex-1 overflow-auto p-5 font-mono text-[12px] leading-[1.7] text-white/85">
        <code>{highlight(card.code)}</code>
      </pre>
      <div className="border-t border-white/[0.06] bg-black/40 px-4 py-3 text-[11px] text-white/40">
        Concept · <span className="text-white/70">{card.concept}</span>
      </div>

      <motion.div
        style={{ opacity: approveOpacity }}
        className="pointer-events-none absolute right-4 top-4 rounded-lg border-2 border-emerald-400 px-3 py-1 text-[13px] font-bold uppercase tracking-wider text-emerald-400"
      >
        Approve
      </motion.div>
      <motion.div
        style={{ opacity: rejectOpacity }}
        className="pointer-events-none absolute left-4 top-4 rounded-lg border-2 border-rose-400 px-3 py-1 text-[13px] font-bold uppercase tracking-wider text-rose-400"
      >
        Reject
      </motion.div>
    </div>
  );
}

/* Minimal syntax highlighter — keywords / strings / comments */
function highlight(code: string) {
  const KW =
    /\b(const|let|var|function|return|if|else|for|while|export|import|from|new|class|extends|await|async|try|catch|throw|CREATE|INDEX|ON|WHERE|IN|CONCURRENTLY|DESC)\b/g;
  const STR = /(["'`])(?:\\.|(?!\1).)*\1/g;
  const CMT = /(\/\/[^\n]*|--[^\n]*)/g;
  const NUM = /\b\d+\b/g;
  type Part = { t: string; c?: string };
  const parts: Part[] = [{ t: code }];
  const apply = (re: RegExp, cls: string) => {
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.c) continue;
      const out: Part[] = [];
      let last = 0;
      p.t.replace(re, (m, ..._a) => {
        const idx = _a[_a.length - 2] as number;
        if (idx > last) out.push({ t: p.t.slice(last, idx) });
        out.push({ t: m, c: cls });
        last = idx + m.length;
        return m;
      });
      if (last < p.t.length) out.push({ t: p.t.slice(last) });
      parts.splice(i, 1, ...out);
      i += out.length - 1;
    }
  };
  apply(CMT, "text-white/30 italic");
  apply(STR, "text-emerald-300");
  apply(KW, "text-fuchsia-300");
  apply(NUM, "text-cyan-300");
  return parts.map((p, i) =>
    p.c ? (
      <span key={i} className={p.c}>
        {p.t}
      </span>
    ) : (
      <span key={i}>{p.t}</span>
    ),
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: import("react").ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-white/40">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 font-mono text-[18px] font-semibold text-white">{value}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  SKILL STRIP                                                   */
/* ────────────────────────────────────────────────────────────── */

const SKILL_TAGS = [
  { name: "Python", learners: "48k", tone: "from-yellow-300/20 to-yellow-500/5" },
  { name: "TypeScript", learners: "61k", tone: "from-blue-400/20 to-blue-600/5" },
  { name: "Rust", learners: "12k", tone: "from-orange-400/20 to-orange-600/5" },
  { name: "React", learners: "54k", tone: "from-sky-400/20 to-sky-600/5" },
  { name: "System Design", learners: "29k", tone: "from-fuchsia-400/20 to-fuchsia-600/5" },
  { name: "SQL", learners: "37k", tone: "from-indigo-400/20 to-indigo-600/5" },
  { name: "Go", learners: "19k", tone: "from-cyan-300/20 to-cyan-500/5" },
  { name: "Machine Learning", learners: "27k", tone: "from-emerald-400/20 to-emerald-600/5" },
];

function SkillStrip() {
  return (
    <section id="skills" className="relative border-b border-white/[0.06] py-20">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>Skill library</Eyebrow>
          <h2 className="mt-5 font-sans text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Built for any technical skill.
          </h2>
          <p className="mt-3 text-[15px] text-white/50">
            New skills added every week — and growing.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {SKILL_TAGS.map((s, i) => (
            <motion.a
              key={s.name}
              href="#demo"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="group relative overflow-hidden rounded-full border border-white/10 bg-white/[0.02] px-5 py-2.5 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                  s.tone,
                )}
              />
              <div className="relative flex items-center gap-2.5">
                <span className="text-[14px] font-medium text-white">{s.name}</span>
                <span className="text-[11px] text-white/40">{s.learners}</span>
                <ArrowUpRight className="h-3 w-3 text-white/20 transition-all group-hover:text-white/60 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.a>
          ))}
        </div>

        <p className="mt-8 text-center text-[12px] text-white/35">
          …and 200+ more across languages, frameworks, systems, and concepts.
        </p>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  TESTIMONIALS                                                  */
/* ────────────────────────────────────────────────────────────── */

const QUOTES = [
  {
    q: "I came in with 8 years of backend. MeisterUp skipped the boring parts and had me writing idiomatic Rust in a week. No course has ever done that.",
    a: "Marielle O.",
    r: "Staff Engineer, Fintech",
  },
  {
    q: "The knowledge graph is the thing. I finally understand what I don't know — and the platform actually teaches me that, not what a curriculum author guessed.",
    a: "Devansh K.",
    r: "SRE, Series C SaaS",
  },
  {
    q: "It's the first learning tool that respects my time. Every session feels calibrated. Nothing wasted.",
    a: "Priya S.",
    r: "ML Engineer",
  },
];

function Testimonials() {
  return (
    <section className="relative border-b border-white/[0.06] py-28">
      <GlowOrb className="left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/15" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="mt-5 font-sans text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
            Loved by engineers
            <span className="text-white/40"> worldwide.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.a}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 transition hover:border-white/20"
            >
              {/* Decorative quote mark */}
              <div
                aria-hidden
                className="pointer-events-none absolute -left-1 -top-3 select-none font-serif text-[96px] leading-none text-white/[0.04]"
              >
                &ldquo;
              </div>

              {/* Star rating */}
              <div className="mb-5 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <svg
                    key={j}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 text-amber-400"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="relative text-[15px] leading-relaxed text-white/80">
                &ldquo;{q.q}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400/30 to-fuchsia-400/30 ring-1 ring-white/10 text-[13px] font-semibold text-white">
                  {q.a
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-[14px] font-medium text-white">{q.a}</div>
                  <div className="text-[12px] text-white/50">{q.r}</div>
                </div>
              </figcaption>

              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/[0.06] opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  CTA + FOOTER                                                  */
/* ────────────────────────────────────────────────────────────── */

function CTA() {
  return (
    <section className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden border-t border-white/[0.06] py-28 sm:min-h-[90vh]">
      <GlowOrb className="left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 bg-indigo-500/40" />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-sans text-4xl font-semibold tracking-[-0.03em] text-white sm:text-6xl">
          Learn like the platform
          <br />
          <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
            was built for you.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[16px] text-white/60">
          Because it is. Take the 60-second assessment and see your first personalized curriculum in
          under a minute.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signin"
            search={{ mode: "signup" }}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[14px] font-semibold text-black hover:bg-white/90"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#skills"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-[14px] font-medium text-white backdrop-blur hover:bg-white/[0.06]"
          >
            Browse skills
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black py-8 text-[13px] text-white/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.ico" alt="MeisterUp Logo" className="h-5 w-5 object-contain" />
            <span className="font-semibold tracking-tight text-white">MeisterUp</span>
          </Link>
          <span className="text-white/20">•</span>
          <span className="text-[12px] text-white/40">© {new Date().getFullYear()} MeisterUp, Inc.</span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[12px]">
          <a href="#" className="transition-colors hover:text-white">
            Privacy
          </a>
          <a href="#" className="transition-colors hover:text-white">
            Terms
          </a>
          <div className="flex items-center gap-1.5 pl-2 text-white/40">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px] shadow-emerald-400" />
            <span>Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────── */
/*  PAGE                                                          */
/* ────────────────────────────────────────────────────────────── */

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-black text-white antialiased">
      <Nav />
      <Hero />
      <HowItWorks />
      <SwipeDemo />
      <SkillStrip />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
