import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../lib/auth";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — MeisterUp" },
      {
        name: "description",
        content: "Privacy Policy for MeisterUp — your AI-native adaptive learning platform.",
      },
    ],
  }),
  component: PrivacyPage,
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

function PrivacyContent() {
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
          Privacy Policy
        </h1>
        <div className="prose max-w-none text-muted-foreground">
          <p className="mb-4 text-sm text-muted-foreground/70">
            Last Updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create or modify
            your account, participate in any interactive features of the services, or communicate
            with us.
          </p>
          <p className="mb-4">
            This information may include: Name, email address, password, learning progress data, and
            any other information you choose to provide.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            2. How We Use Information
          </h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, such
            as to:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Create and manage your account</li>
              <li>Provide personalized learning content and recommendations</li>
              <li>
                Monitor and analyze trends, usage, and activities in connection with our services
              </li>
              <li>Communicate with you about products, services, offers, and events</li>
            </ul>
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Data Security</h2>
          <p className="mb-4">
            We take reasonable measures to help protect information about you from loss, theft,
            misuse and unauthorized access, disclosure, alteration and destruction. We use
            industry-standard encryption for data at rest and in transit.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">
            4. Sharing of Information
          </h2>
          <p className="mb-4">
            We do not sell your personal information. We may share information as described in this
            policy, such as with vendors, consultants, and other service providers who need access
            to such information to carry out work on our behalf.
          </p>

          <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at
            privacy@meisterup.com.
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
          <Link to="/privacy" className="text-foreground font-medium transition-colors">
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

function PrivacyPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased">
      <Nav />
      <PrivacyContent />
      <Footer />
    </div>
  );
}
