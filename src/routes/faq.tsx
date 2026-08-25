import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — MeisterUp" },
      {
        name: "description",
        content:
          "Frequently asked questions about MeisterUp — the AI-native adaptive learning platform for engineers.",
      },
      { property: "og:title", content: "FAQ — MeisterUp" },
      {
        property: "og:description",
        content:
          "Frequently asked questions about MeisterUp — the AI-native adaptive learning platform for engineers.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: FAQPage,
});

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
        scrolled
          ? "backdrop-blur-xl bg-background/80 border-b border-[var(--nav-border)]"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">
        <Link to="/" className="group flex items-center gap-2.5">
          <span
            className="font-serif text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-[0.04em] leading-none"
            style={{ color: "hsl(0 65% 22%)" }}
          >
            Meister
            <span className="italic font-normal" style={{ color: "hsl(0 60% 38%)" }}>
              Up
            </span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
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
              </Link>
              <Link
                to="/signin"
                search={{ mode: "signup" }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 md:px-5 md:py-2.5 text-sm md:text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Sign Up
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const FAQS = [
  {
    q: "How is this different from an online course?",
    a: "Courses are linear and identical for every learner. MeisterUp generates a unique curriculum for every user, based on demonstrated knowledge — you skip what you know and drill what you don't.",
  },
  {
    q: "How does the platform know what I already know?",
    a: "A short adaptive assessment estimates your ability using a Bayesian mastery model. It also credits transferable knowledge — coming from Java, you inherit a lot of Python fundamentals for free.",
  },
  {
    q: "What kinds of skills can I learn?",
    a: "Any technical skill with a well-defined concept graph — programming languages, frameworks, systems, cloud platforms, ML, prompt engineering, security, product, and design. New skill trees ship weekly.",
  },
  {
    q: "Is it just multiple choice?",
    a: "No. MeisterUp uses ten interaction types — simulations, error-detection swipes, ordering, scenario decisions, explain-back — and grades reasoning, not just correctness.",
  },
  {
    q: "Can teams use this?",
    a: "Yes. Team plans include shared skill maps, manager review sessions, and SSO. Teams use MeisterUp for onboarding and continuous levelling.",
  },
  {
    q: "Do you store my learning data?",
    a: "Encrypted at rest, never sold. You own your data and can export or delete it any time. SOC 2 in progress.",
  },
  {
    q: "Can I learn one skill free forever?",
    a: "Yes. You can select any single skill track (such as Rust, System Design, or React Architecture) and access full adaptive learning features without ever paying.",
  },
  {
    q: "What happens if I want to switch my free skill?",
    a: "On the free plan, you can change your active skill track anytime, or upgrade to Pro for instant, unlimited access to all skills simultaneously.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes. You can cancel with a single click from your account settings at any time without penalty or hidden fees.",
  },
  {
    q: "How does team billing work?",
    a: "Team plans are billed per active seat. You can add or remove seats anytime, and your bill automatically adjusts.",
  },
];

function FAQContent() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="pt-36 pb-24">
      <div className="mx-auto max-w-3xl px-6">
        <div className="text-center">
          <Eyebrow>
            <HelpCircle className="h-3 w-3" />
            <span>FAQ</span>
          </Eyebrow>
          <h1 className="mt-6 font-sans text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl md:text-6xl">
            Questions, answered.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[16px] leading-relaxed text-muted-foreground">
            Everything you need to know about the platform, how our adaptive model works, and
            getting started.
          </p>
        </div>

        <div className="mt-14 divide-y divide-border/40 rounded-2xl border border-border/60 bg-card/40">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition hover:bg-accent/30"
                >
                  <span className="text-[15px] font-medium text-foreground">{f.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180 text-foreground",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-[14px] leading-relaxed text-muted-foreground">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground">Have more questions?</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Our team is here to help you get the most out of MeisterUp.
          </p>
          <div className="mt-6">
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Get started for free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
          <Link to="/faq" className="text-foreground font-medium transition-colors">
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

function FAQPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <FAQContent />
      <Footer />
    </div>
  );
}
