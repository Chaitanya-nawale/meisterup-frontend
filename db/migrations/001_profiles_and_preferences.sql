-- ============================================================
-- Migration 001: Profiles & Preferences
-- MeisterUp — Zero-Syntax Gym
-- 
-- Run this in Neon SQL Editor or via your migration tool
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. PROFILES
-- Extends the user table with app-specific profile data.
-- ────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id            text primary key references public."user"(id) on delete cascade,
  
  -- Display info
  display_name  text,
  avatar_url    text,
  bio           text,
  
  -- Role & experience (set during onboarding)
  role          text check (role in (
                  'frontend', 'backend', 'fullstack', 'devops', 'sre',
                  'data', 'ml', 'mobile', 'security', 'engineering_manager',
                  'tech_lead', 'other'
                )),
  experience_band text check (experience_band in (
                  '0-2y', '2-5y', '5-10y', '10y+'
                )),
  
  -- Onboarding state
  onboarding_completed_at  timestamptz,
  
  -- Privacy
  profile_public  boolean default false,
  leaderboard_opt_in boolean default true,
  
  -- Timestamps
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 2. USER NOTIFICATION PREFERENCES
-- ────────────────────────────────────────────────────────────

create table if not exists public.user_notification_prefs (
  user_id               text primary key references public.profiles(id) on delete cascade,
  
  daily_reminder        boolean default true,
  daily_reminder_time   time default '09:00',
  weekly_summary_email  boolean default true,
  streak_warning        boolean default true,   -- notify before streak breaks
  new_skill_alerts      boolean default false,
  
  created_at            timestamptz default now(),
  updated_at            timestamptz default now()
);

-- ────────────────────────────────────────────────────────────
-- 3. UPDATED_AT TRIGGER (reusable)
-- ────────────────────────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger notification_prefs_updated_at
  before update on public.user_notification_prefs
  for each row execute procedure public.set_updated_at();
