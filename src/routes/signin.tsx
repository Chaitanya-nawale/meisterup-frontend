import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Github, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../lib/auth";
import { authClient } from "../auth";

export const Route = createFileRoute("/signin")({
  validateSearch: (search: Record<string, unknown>): { mode?: string } =>
    search.mode ? { mode: String(search.mode) } : {},
  head: () => ({
    meta: [
      { title: "Sign In — MeisterUp" },
      {
        name: "description",
        content: "Sign in to MeisterUp — your AI-native adaptive learning platform for engineers.",
      },
      { property: "og:title", content: "Sign In — MeisterUp" },
      {
        property: "og:description",
        content: "Sign in to MeisterUp — your AI-native adaptive learning platform for engineers.",
      },
    ],
  }),
  component: SignInPage,
});

/* ─────────────────────────────────── helpers ─────────────────────────────── */

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

/* ─────────────────────────────── background ──────────────────────────────── */

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

/* ─────────────────────────────────── nav ─────────────────────────────────── */

function Nav({
  isSignUp,
  setIsSignUp,
  setAuthError,
  setSignUpSuccess,
  setErrors,
}: {
  isSignUp: boolean;
  setIsSignUp: (v: boolean) => void;
  setAuthError: (err: string | null) => void;
  setSignUpSuccess: (v: boolean) => void;
  setErrors: (v: { email?: string; password?: string }) => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-[var(--nav-border)]">
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

        <p className="text-[14px] text-muted-foreground font-medium">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError(null);
              setSignUpSuccess(false);
              setErrors({});
            }}
            className="font-medium text-foreground hover:text-foreground/80 transition-colors bg-transparent border-none cursor-pointer underline"
          >
            {isSignUp ? "Sign in" : "Start free"}
          </button>
        </p>
      </div>
    </header>
  );
}

/* ──────────────────────────────── form field ─────────────────────────────── */

function Field({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  children,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 text-left">
      <label htmlFor={id} className="block text-[13px] font-medium text-foreground/80">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={id}
          className={cn(
            "w-full rounded-xl border bg-card/50 px-4 py-2.5 text-[14px] text-foreground placeholder:text-muted-foreground/50",
            "outline-none transition-all duration-200",
            "focus:bg-card focus:border-border focus:ring-2 focus:ring-primary/20",
            error
              ? "border-destructive/50 focus:ring-destructive/20 focus:border-destructive"
              : "border-border/40",
          )}
        />
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            key="err"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[12px] text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────── divider ─────────────────────────────────── */

function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px flex-1 bg-border/40" />
      <span className="text-[12px] text-muted-foreground">or continue with</span>
      <div className="h-px flex-1 bg-border/40" />
    </div>
  );
}

/* ──────────────────────────────── main page ─────────────────────────────── */

function SignInPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const search = Route.useSearch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(search.mode === "signup");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  useEffect(() => {
    setIsSignUp(search.mode === "signup");
  }, [search.mode]);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (!authLoading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, authLoading, navigate]);

  function validate() {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";
    return next;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setAuthError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0], // Better Auth requires a name
        });
        if (error) throw error;
        // Neon Auth signs in automatically after sign-up unless email verification is required
        if (data && !error) {
          setSignUpSuccess(true);
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: unknown) {
      console.error("Auth error:", err);
      const error = err as { message?: string };
      setAuthError(error.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "github" | "google") {
    setAuthError(null);
    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: window.location.origin + "/dashboard",
      });
      if (error) throw error;
    } catch (err: unknown) {
      console.error(`${provider} oauth error:`, err);
      const error = err as { message?: string };
      setAuthError(error.message || `Could not sign in with ${provider}.`);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background font-sans">
      {/* Background */}
      <GridBg />

      <Nav
        isSignUp={isSignUp}
        setIsSignUp={setIsSignUp}
        setAuthError={setAuthError}
        setSignUpSuccess={setSignUpSuccess}
        setErrors={setErrors}
      />

      <main className="relative flex min-h-screen items-center justify-center px-4 pt-14">
        <AnimatePresence mode="wait">
          {signUpSuccess ? (
            /* ── sign up check email state ── */
            <motion.div
              key="signup-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-5 text-center max-w-[400px]"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Confirm your email
                </h1>
                <p className="mt-1.5 text-[14px] text-muted-foreground leading-relaxed">
                  We've sent a verification link to{" "}
                  <span className="text-foreground font-medium">{email}</span>. Please check your
                  inbox (and spam folder) to activate your account.
                </p>
              </div>
              <button
                onClick={() => {
                  setSignUpSuccess(false);
                  setIsSignUp(false);
                  setEmail("");
                  setPassword("");
                }}
                className="mt-2 text-[13px] font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
              >
                Back to sign in
              </button>
            </motion.div>
          ) : user ? (
            /* ── success state ── */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-5 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  You're in.
                </h1>
                <p className="mt-1.5 text-[14px] text-muted-foreground">
                  Welcome back — redirecting to your dashboard…
                </p>
              </div>
              <div className="h-0.5 w-32 overflow-hidden rounded-full bg-border">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.4, ease: "linear" }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
            </motion.div>
          ) : (
            /* ── sign-in/sign-up card ── */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[400px]"
            >
              {/* eyebrow */}
              <div className="mb-7 flex flex-col items-center gap-4 text-center">
                <Eyebrow>
                  <Sparkles className="h-3 w-3" />
                  <span>{isSignUp ? "Get started" : "Welcome back"}</span>
                </Eyebrow>
                <h1 className="font-sans text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                  {isSignUp ? "Create your account" : "Sign in to MeisterUp"}
                </h1>
                <p className="text-[14.5px] text-muted-foreground">
                  {isSignUp
                    ? "Join our adaptive learning journey today."
                    : "Continue your adaptive learning journey."}
                </p>
              </div>

              {/* glass card */}
              <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card/40 p-7 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                {/* subtle inner glow */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
                />

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  {authError && (
                    <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-[13px] text-destructive">
                      {authError}
                    </div>
                  )}

                  <Field
                    id="email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(v) => {
                      setEmail(v);
                      if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
                    }}
                    error={errors.email}
                  />

                  <Field
                    id="password"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(v) => {
                      setPassword(v);
                      if (errors.password) setErrors((e) => ({ ...e, password: undefined }));
                    }}
                    error={errors.password}
                  >
                    <button
                      type="button"
                      id="toggle-password"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground/80 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </Field>

                  {!isSignUp && (
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="remember"
                        className="flex cursor-pointer items-center gap-2 text-[13px] text-muted-foreground"
                      >
                        <input
                          id="remember"
                          type="checkbox"
                          className="h-3.5 w-3.5 cursor-pointer accent-primary"
                        />
                        Remember me
                      </label>
                      <a
                        href="#forgot"
                        className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>
                  )}

                  <motion.button
                    id="signin-submit"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.015 }}
                    whileTap={{ scale: loading ? 1 : 0.985 }}
                    className={cn(
                      "group mt-2 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5",
                      "text-[14px] font-semibold text-primary-foreground transition-all duration-200",
                      loading
                        ? "bg-primary/70 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 cursor-pointer",
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isSignUp ? "Creating account…" : "Signing in…"}
                      </>
                    ) : (
                      <>
                        {isSignUp ? "Sign up" : "Sign in"}
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </motion.button>
                </form>

                <div className="mt-5">
                  <Divider />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {/* GitHub OAuth */}
                  <button
                    id="signin-github"
                    type="button"
                    onClick={() => handleOAuth("github")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-card/40 px-4 py-2.5 text-[13px] font-medium text-foreground/80 transition-all hover:bg-card/60 hover:text-foreground cursor-pointer"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </button>
                  {/* Google OAuth */}
                  <button
                    id="signin-google"
                    type="button"
                    onClick={() => handleOAuth("google")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border/40 bg-card/40 px-4 py-2.5 text-[13px] font-medium text-foreground/80 transition-all hover:bg-card/60 hover:text-foreground cursor-pointer"
                  >
                    {/* Inline Google "G" mark */}
                    <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M21.35 11.1H12v3.63h5.35C16.7 16.6 14.58 18 12 18a6 6 0 1 1 0-12c1.53 0 2.92.57 3.97 1.5l2.57-2.57A9.94 9.94 0 0 0 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.52 0 9.71-4.06 9.71-10 0-.65-.07-1.29-.18-1.9H21.35Z" />
                    </svg>
                    Google
                  </button>
                </div>
              </div>

              {/* Footer note */}
              <p className="mt-5 text-center text-[12px] text-muted-foreground/60">
                By signing in, you agree to our{" "}
                <a
                  href="#terms"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="#privacy"
                  className="underline hover:text-muted-foreground transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
