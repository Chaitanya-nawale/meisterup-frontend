import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — MeisterUp" },
      {
        name: "description",
        content: "Terms of Service for MeisterUp — your AI-native adaptive learning platform.",
      },
    ],
  }),
  component: TermsPage,
});

function cn(...c: (string | false | undefined | null)[]) {
  return c.filter(Boolean).join(" ");
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

function TermsContent() {
  return (
    <section className="relative overflow-hidden pt-36 pb-24">
      <div className="relative mx-auto max-w-3xl px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>
        <h1 className="font-sans text-4xl font-semibold tracking-[-0.035em] text-foreground sm:text-5xl mb-6">
          Terms of Service
        </h1>
        <div className="prose max-w-none text-muted-foreground">
          <p className="mb-4 text-sm text-muted-foreground/70">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="mb-4">
            By accessing or using MeisterUp, you agree to be bound by these Terms of Service. If you
            disagree with any part of the terms, you may not access the service.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            2. Description of Service
          </h2>
          <p className="mb-4">
            MeisterUp provides an AI-native adaptive learning platform for engineers. We reserve the
            right to modify or discontinue, temporarily or permanently, the service with or without
            notice.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the service and
            for any activities or actions under your password. You must notify us immediately upon
            becoming aware of any breach of security or unauthorized use of your account.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            4. Intellectual Property
          </h2>
          <p className="mb-4">
            The service and its original content, features, and functionality are and will remain
            the exclusive property of MeisterUp and its licensors. The service is protected by
            copyright, trademark, and other laws of both the United States and foreign countries.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend access to our service immediately, without prior notice or
            liability, for any reason whatsoever, including without limitation if you breach the
            Terms.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Changes</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any
            time. By continuing to access or use our service after those revisions become effective,
            you agree to be bound by the revised terms.
          </p>
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
          <Link to="/terms" className="text-foreground font-medium transition-colors">
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

function TermsPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <TermsContent />
      <Footer />
    </div>
  );
}
