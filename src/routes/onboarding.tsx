import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../lib/auth";
import { ArrowRight, Loader2, Code2, Brain, Sparkles, Layers } from "lucide-react";
import { updateUserProfile, seedInitialStreak, enrollInSkill } from "../lib/api";
import { toast } from "sonner";
import type { UserRole, ExperienceBand } from "../lib/types";
import { usePublishedSkills } from "../hooks/useSkills";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Assessment — MeisterUp" }],
  }),
  component: OnboardingPage,
});

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
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

const ROLES: { label: string; value: UserRole }[] = [
  { label: "Frontend Engineer", value: "frontend" },
  { label: "Backend Engineer", value: "backend" },
  { label: "Fullstack Engineer", value: "fullstack" },
  { label: "DevOps / SRE", value: "devops" },
  { label: "Data / ML Engineer", value: "data" },
  { label: "Tech Lead / Manager", value: "tech_lead" },
];

const EXP_BANDS: { id: ExperienceBand; label: string; desc: string }[] = [
  { id: "0-2y", label: "0–2 years", desc: "Just starting out" },
  { id: "2-5y", label: "2–5 years", desc: "Building core expertise" },
  { id: "5-10y", label: "5–10 years", desc: "Architecting systems" },
  { id: "10y+", label: "10+ years", desc: "Seen it all" },
];

function OnboardingPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [step, setStep] = useState(0);
  const [role, setRole] = useState<UserRole | "">("");
  const [exp, setExp] = useState<ExperienceBand | "">("");
  const [skillId, setSkillId] = useState<string>("");
  const [generating, setGenerating] = useState(false);

  const { data: skills, isLoading: loadingSkills } = usePublishedSkills();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/signin" });
    }
  }, [user, loading, navigate]);

  const handleComplete = async () => {
    if (!user || !role || !exp || !skillId) return;
    setGenerating(true);
    try {
      // 1. Save profile with role and experience
      await updateUserProfile(user.id, {
        role: role as UserRole,
        experience_band: exp as ExperienceBand,
        onboarding_completed_at: new Date().toISOString(),
      });
      // 2. Seed initial streak row
      await seedInitialStreak(user.id);

      // 3. Enroll in the selected skill
      await enrollInSkill(user.id, skillId);

      await qc.invalidateQueries({ queryKey: ["profile", user.id] });
      await qc.invalidateQueries({ queryKey: ["skills", "progress", user.id] });
      await qc.invalidateQueries({ queryKey: ["enrollments", user.id] });

      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("Onboarding save failed:", err);
      toast.error("Failed to save your profile. Please try again.");
      setGenerating(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-background font-sans text-foreground selection:bg-primary/30">
      <GridBg />

      <header className="fixed inset-x-0 top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="mx-auto flex h-20 max-w-7xl items-center px-8">
          <div className="group flex items-center gap-2.5">
            <span
              className="font-serif text-3xl md:text-4xl lg:text-[40px] font-semibold tracking-[0.04em] leading-none"
              style={{ color: "hsl(0 65% 22%)" }}
            >
              Meister
              <span className="italic font-normal" style={{ color: "hsl(0 60% 38%)" }}>
                Up
              </span>
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center p-6">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  Let's calibrate your engine.
                </h1>
                <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">
                  MeisterUp builds a unique curriculum based on what you already know. We'll start
                  with a few questions to set a baseline.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Start calibration
                  <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  What's your primary role?
                </h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => setRole(r.value)}
                      className={cn(
                        "flex items-center justify-between rounded-xl border p-4 text-left transition",
                        role === r.value
                          ? "border-primary bg-primary/10"
                          : "border-border/30 bg-card/20 hover:bg-card/40 hover:border-border/50",
                      )}
                    >
                      <span className="text-[14px] font-medium text-foreground">{r.label}</span>
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full border",
                          role === r.value ? "border-primary" : "border-border/40",
                        )}
                      >
                        {role === r.value && (
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-10 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!role}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Years of experience?
                </h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {EXP_BANDS.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setExp(b.id)}
                      className={cn(
                        "flex flex-col rounded-xl border p-4 text-left transition",
                        exp === b.id
                          ? "border-primary bg-primary/10"
                          : "border-border/30 bg-card/20 hover:bg-card/40 hover:border-border/50",
                      )}
                    >
                      <span className="text-[15px] font-medium text-foreground">{b.label}</span>
                      <span className="mt-1 text-[13px] text-muted-foreground">{b.desc}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-10 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!exp}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  What do you want to master first?
                </h2>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {loadingSkills ? (
                    <div className="col-span-2 flex justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    skills?.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSkillId(s.id)}
                        className={cn(
                          "flex flex-col rounded-xl border p-4 text-left transition relative overflow-hidden",
                          skillId === s.id
                            ? "border-primary bg-primary/10"
                            : "border-border/30 bg-card/20 hover:bg-card/40 hover:border-border/50",
                        )}
                      >
                        <div
                          className={cn(
                            "absolute inset-0 bg-gradient-to-br opacity-10",
                            s.color_from,
                            s.color_to,
                          )}
                        />
                        <span className="relative text-[15px] font-medium text-foreground">
                          {s.name}
                        </span>
                        <span className="relative mt-1 text-[13px] text-muted-foreground line-clamp-1">
                          {s.description || `${s.total_concepts} concepts`}
                        </span>
                      </button>
                    ))
                  )}
                </div>
                <div className="mt-10 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="text-[14px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleComplete}
                    disabled={!skillId || generating}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-[14px] font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary cursor-pointer"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating curriculum...
                      </>
                    ) : (
                      "Generate curriculum"
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 h-1.5 bg-border/40 z-20">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 3) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
