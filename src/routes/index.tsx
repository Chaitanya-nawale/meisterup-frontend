import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { annotate } from "rough-notation";
import { useAuth } from "../lib/auth";
import { AnimatePresence, motion, useMotionValue, useTransform } from "framer-motion";
import {
  MoveRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
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

export const Route = createFileRoute("/")({
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
    <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-card/40 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
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
          "linear-gradient(to right, rgba(191,160,128,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(191,160,128,0.06) 1px, transparent 1px)",
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
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const heroCta = document.getElementById("hero-cta");
    let observer: IntersectionObserver;

    if (heroCta) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
            setShowCTA(true);
          } else {
            setShowCTA(false);
          }
        },
        { threshold: 0 },
      );
      observer.observe(heroCta);
    } else {
      const fallbackCTA = () => setShowCTA(window.scrollY > window.innerHeight * 0.5);
      window.addEventListener("scroll", fallbackCTA, { passive: true });
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("scroll", fallbackCTA);
      };
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-[var(--nav-border)]"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <a href="#top" className="group flex items-center gap-2.5">
          <span
            className="font-serif text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-[0.04em] leading-none"
            style={{ color: "hsl(0 65% 22%)" }}
          >
            Meister
            <span className="italic font-normal" style={{ color: "hsl(0 60% 38%)" }}>
              Up
            </span>
          </span>
        </a>
        <nav className="hidden items-center gap-10 md:flex"></nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 md:gap-2 rounded-full bg-primary px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <>
              <Link
                to="/signin"
                search={{ mode: "signin" }}
                className="group inline-flex items-center rounded-full border border-foreground/30 bg-white px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-medium text-foreground transition-all hover:border-foreground/50 hover:bg-foreground/5 mr-2 sm:mr-4 shadow-sm"
              >
                Login
                <AnimatePresence>
                  {!showCTA && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, overflow: "hidden" }}
                      animate={{ opacity: 1, width: "auto", overflow: "visible" }}
                      exit={{ opacity: 0, width: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="flex items-center"
                    >
                      <MoveRight className="ml-1.5 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
              <AnimatePresence>
                {showCTA && (
                  <motion.div
                    initial={{ opacity: 0, width: 0, overflow: "hidden" }}
                    animate={{ opacity: 1, width: "auto", overflow: "visible" }}
                    exit={{ opacity: 0, width: 0, overflow: "hidden" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="whitespace-nowrap"
                  >
                    <Link
                      to="/signin"
                      search={{ mode: "signup" }}
                      className="group inline-flex items-center gap-2 md:gap-2 rounded-full bg-primary px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      Sign Up
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
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
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    let annotation: ReturnType<typeof annotate>;
    // Wait 1000ms for the Framer Motion entrance animation (duration: 1.5s) to finish
    // before calculating the bounding box, otherwise the line draws in the wrong place!
    const timer = setTimeout(() => {
      if (!textRef.current) return;
      annotation = annotate(textRef.current, {
        type: "underline",
        color: "hsl(0 71.8% 50%)",
        strokeWidth: 4,
        padding: [0, 0, 4, 0],
        iterations: 3,
        multiline: true,
        animationDuration: 800,
      });
      annotation.show();
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (annotation) annotation.remove();
    };
  }, []);

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden pt-20 pb-20"
    >
      <GridBg />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mt-10 font-sans text-5xl font-semibold leading-[1.15] tracking-[-0.035em] sm:text-6xl md:text-7xl">
            <span>The learning platform that teaches</span>
            <br />
            <span ref={textRef}>exactly what you need</span>
            <span> to know.</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-[18px] leading-relaxed text-muted-foreground">
            Master skills faster. We skip what you know and teach only the missing pieces.
          </p>

          <div id="hero-cta" className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <a
              href="#demo"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Try it out yourself
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/20 px-5 py-2.5 text-[14px] font-medium text-foreground/90 backdrop-blur transition hover:bg-card/40"
            >
              <Play className="h-3.5 w-3.5" />
              See how it works
            </a>
          </div>
        </motion.div>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 transition-opacity hover:opacity-100">
        <a
          href="#how"
          aria-label="Scroll down"
          className="text-muted-foreground flex flex-col items-center"
        >
          <ChevronDown className="h-6 w-6" />
        </a>
      </div>
    </section>
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
    <section
      id="how"
      className="relative flex min-h-[85dvh] flex-col justify-center border-b border-border/20 py-24"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>How it works</Eyebrow>
          <h2 className="mt-5 font-sans text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            Three steps.
            <span className="text-muted-foreground/70"> That's the whole idea.</span>
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
              className="relative rounded-2xl border border-border/30 bg-card/30 p-6"
            >
              <div className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground/60">
                {s.n}
              </div>
              <div className="mt-3 text-[16px] font-semibold text-foreground">{s.title}</div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-[13px] text-muted-foreground/70">
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
    <section
      id="demo"
      className="relative flex min-h-[85dvh] flex-col justify-center border-b border-border/20 py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow>Try one activity</Eyebrow>
          <h2 className="mt-5 font-sans text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl">
            Approve. Reject.
            <br />
            <span className="text-muted-foreground/70">Build engineering judgment.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-muted-foreground">
            A live sample of one activity type — swipe-based code review, drawn from anonymized
            production PRs. Reasoning matters more than the swipe: after each card, MeisterUp asks{" "}
            <em>why</em>.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            <StatCard icon={Flame} label="Streak" value={streak} />
            <StatCard icon={Zap} label="XP" value={xp} />
            <StatCard icon={TrendingUp} label="Mastery" value="B+" />
          </div>

          <div className="mt-8 flex items-center gap-4 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border/40 bg-card/40 px-1.5 py-0.5 font-mono text-[10px]">
                ←
              </kbd>
              Reject
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className="rounded border border-border/40 bg-card/40 px-1.5 py-0.5 font-mono text-[10px]">
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
                className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-b from-card/60 to-card/20 p-6"
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
                <div className="mt-4 text-[15px] font-semibold text-foreground">
                  {feedback.card.concept}
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {feedback.card.why}
                </p>
                <div className="mt-auto flex items-center justify-between border-t border-border/20 pt-4">
                  <button
                    onClick={undo}
                    className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-card/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all cursor-pointer"
                    title="Undo last swipe"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Undo swipe
                  </button>
                  <button
                    onClick={nextCard}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                  >
                    Next
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!feedback && (
            <div className="pointer-events-none absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2 text-[11px] text-muted-foreground/70">
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
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-b from-card to-background shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9)]">
      <div className="flex items-center justify-between border-b border-border/20 bg-card/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-[12px] font-medium text-foreground/80">{card.title}</span>
        </div>
        <span className="rounded border border-border/40 px-1.5 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
          {card.lang}
        </span>
      </div>
      <pre className="flex-1 overflow-auto p-5 font-mono text-[12px] leading-[1.7] text-foreground/85">
        <code>{highlight(card.code)}</code>
      </pre>
      <div className="border-t border-border/20 bg-background/50 px-4 py-3 text-[11px] text-muted-foreground/70">
        Concept · <span className="text-foreground/70">{card.concept}</span>
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
  apply(CMT, "text-muted-foreground/50 italic");
  apply(STR, "text-emerald-400");
  apply(KW, "text-primary/80");
  apply(NUM, "text-accent");
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
    <div className="rounded-lg border border-border/30 bg-card/40 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/70">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-1 font-mono text-[18px] font-semibold text-foreground">{value}</div>
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
    <section
      id="skills"
      className="relative flex min-h-[85dvh] flex-col justify-center border-b border-border/20 py-20"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>Skill library</Eyebrow>
          <h2 className="mt-5 font-sans text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            Built for any technical skill.
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
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
              className="group relative overflow-hidden rounded-full border border-border/30 bg-card/20 px-5 py-2.5 transition hover:border-border/50 hover:bg-card/40"
            >
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity group-hover:opacity-100",
                  s.tone,
                )}
              />
              <div className="relative flex items-center gap-2.5">
                <span className="text-[14px] font-medium text-foreground">{s.name}</span>
                <span className="text-[11px] text-muted-foreground/70">{s.learners}</span>
                <ArrowUpRight className="h-3 w-3 text-muted-foreground/40 transition-all group-hover:text-foreground/60 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </motion.a>
          ))}
        </div>

        <p className="mt-8 text-center text-[12px] text-muted-foreground/60">
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
    <section className="relative flex min-h-[85dvh] flex-col justify-center border-b border-border/20 py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <Eyebrow>Testimonials</Eyebrow>
          <h2 className="mt-5 font-sans text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
            <span className="inline-block -rotate-12 mr-1">❤️</span> Loved by engineers
            <span className="text-muted-foreground/70"> worldwide.</span>
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
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/30 bg-gradient-to-b from-card/60 to-card/20 p-8 transition hover:border-border/50"
            >
              {/* Decorative quote mark */}
              <div
                aria-hidden
                className="pointer-events-none absolute -left-1 -top-3 select-none font-serif text-[96px] leading-none text-primary/[0.08]"
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

              <blockquote className="relative flex-1 text-[15px] leading-relaxed text-foreground/80">
                &ldquo;{q.q}&rdquo;
              </blockquote>

              <figcaption className="mt-6 flex items-center gap-3 border-t border-border/20 pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-accent/30 ring-1 ring-border/30 text-[13px] font-semibold text-foreground">
                  {q.a
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <div className="text-[14px] font-medium text-foreground">{q.a}</div>
                  <div className="text-[12px] text-muted-foreground">{q.r}</div>
                </div>
              </figcaption>

              {/* Hover glow */}
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/[0.08] opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />
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
  const highlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!highlightRef.current) return;

    let annotation: ReturnType<typeof annotate>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && highlightRef.current) {
          annotation = annotate(highlightRef.current, {
            type: "highlight",
            color: "hsl(35 60% 85%)", // Soft warm highlight
            animationDuration: 1000,
            multiline: true,
          });
          setTimeout(() => annotation?.show(), 1500); // Wait 1 second so they read the top lines first
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(highlightRef.current);
    return () => {
      observer.disconnect();
      if (annotation) annotation.remove();
    };
  }, []);

  return (
    <section className="relative flex min-h-[85dvh] flex-col items-center justify-center overflow-hidden border-t border-border/20 py-28 sm:min-h-[90dvh]">
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-sans text-5xl font-semibold leading-[1.2] tracking-[-0.035em] text-foreground sm:text-6xl md:text-7xl">
          Learn like the platform
          <br />
          <span className="bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">
            was built for you.
          </span>
        </h2>
        <p className="mx-auto mt-10 text-[24px] font-medium tracking-tight text-foreground sm:text-[32px]">
          <span ref={highlightRef} className="px-2">
            Because it is.
          </span>
        </p>
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/signin"
            search={{ mode: "signup" }}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Start free
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/20 bg-background py-8 text-[13px] text-muted-foreground">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] text-muted-foreground/70">
            © {new Date().getFullYear()} MeisterUp, Inc.
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[12px]">
          <Link to="/pricing" className="transition-colors hover:text-foreground">
            Pricing
          </Link>
          <Link to="/faq" className="transition-colors hover:text-foreground">
            FAQ
          </Link>
          <Link to="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <div className="flex items-center gap-1.5 pl-2 text-muted-foreground/70">
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
  useEffect(() => {
    const handleHashClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#") && href !== "#") {
        const id = href.substring(1);
        const element = document.getElementById(id);
        if (element) {
          e.preventDefault();
          const targetPosition = element.getBoundingClientRect().top + window.scrollY;
          const startPosition = window.scrollY;

          import("framer-motion").then(({ animate }) => {
            animate(startPosition, targetPosition, {
              duration: 2,
              ease: [0.16, 1, 0.3, 1],
              onUpdate: (latest) => window.scrollTo(0, latest),
            });
          });
        }
      }
    };

    document.addEventListener("click", handleHashClick);
    return () => document.removeEventListener("click", handleHashClick);
  }, []);

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
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
