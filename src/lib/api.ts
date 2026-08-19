/* ============================================================
   src/lib/api.ts
   Central typed query layer using TanStack Start server functions and Neon SQL.
   ============================================================ */

import { createServerFn } from "@tanstack/react-start";
import { sql } from "./db";
import type {
  Card,
  ContinueLearningItem,
  DashboardStats,
  LeaderboardEntry,
  Profile,
  Session,
  SessionResult,
  SessionType,
  Skill,
  UserDailyGoals,
  UserNotificationPrefs,
  UserSkillProgress,
  UserStreak,
  UserBadge,
  UserSkillEnrollment,
  Concept,
} from "./types";

/* ────────────────────────────────────────────────────────────── */
/*  SKILLS                                                         */
/* ────────────────────────────────────────────────────────────── */

export const _fetchPublishedSkills = createServerFn({ method: "GET" }).handler(async () => {
  return (await sql`
      SELECT * FROM skills 
      WHERE is_published = true 
      ORDER BY learner_count DESC
    `) as Skill[];
});
export async function fetchPublishedSkills(): Promise<Skill[]> {
  return await _fetchPublishedSkills();
}

export const _fetchSkillBySlug = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const res = await sql`
      SELECT * FROM skills 
      WHERE slug = ${slug} AND is_published = true 
      LIMIT 1
    `;
    return (res[0] as Skill) || null;
  });
export async function fetchSkillBySlug(slug: string): Promise<Skill | null> {
  return await _fetchSkillBySlug({ data: slug });
}

export const _fetchUserSkillProgress = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    return (await sql`
      SELECT * FROM user_skill_progress 
      WHERE user_id = ${userId} 
      ORDER BY last_practiced DESC
    `) as UserSkillProgress[];
  });
export async function fetchUserSkillProgress(userId: string): Promise<UserSkillProgress[]> {
  return await _fetchUserSkillProgress({ data: userId });
}

export const _upsertUserSkillProgress = createServerFn({ method: "POST" })
  .validator((d: { userId: string; skillId: string }) => d)
  .handler(async ({ data: { userId, skillId } }) => {
    await sql`
      INSERT INTO user_skill_progress (user_id, skill_id, status, last_practiced, updated_at)
      VALUES (${userId}, ${skillId}, 'active', NOW(), NOW())
      ON CONFLICT (user_id, skill_id) 
      DO UPDATE SET status = 'active', last_practiced = NOW(), updated_at = NOW()
    `;
  });
export async function upsertUserSkillProgress(userId: string, skillId: string): Promise<void> {
  await _upsertUserSkillProgress({ data: { userId, skillId } });
}

/* ────────────────────────────────────────────────────────────── */
/*  CONCEPTS                                                        */
/* ────────────────────────────────────────────────────────────── */

export const _fetchConceptsBySkill = createServerFn({ method: "GET" })
  .validator((skillId: string) => skillId)
  .handler(async ({ data: skillId }) => {
    return (await sql`
      SELECT * FROM concepts 
      WHERE skill_id = ${skillId} AND is_published = true 
      ORDER BY sort_order ASC
    `) as Concept[];
  });
export async function fetchConceptsBySkill(skillId: string): Promise<Concept[]> {
  return await _fetchConceptsBySkill({ data: skillId });
}

/* ────────────────────────────────────────────────────────────── */
/*  CARDS                                                          */
/* ────────────────────────────────────────────────────────────── */

export const _fetchCardsBySkillId = createServerFn({ method: "GET" })
  .validator((skillId: string) => skillId)
  .handler(async ({ data: skillId }) => {
    const res = await sql`
      SELECT 
        cards.*, 
        json_build_object('name', concepts.name, 'slug', concepts.slug, 'topic_group', concepts.topic_group) as concept
      FROM cards
      JOIN concepts ON cards.concept_id = concepts.id
      WHERE concepts.skill_id = ${skillId} 
        AND concepts.is_published = true 
        AND cards.is_published = true
      ORDER BY cards.difficulty ASC
    `;
    return res as Card[];
  });
export async function fetchCardsBySkillId(skillId: string): Promise<Card[]> {
  return await _fetchCardsBySkillId({ data: skillId });
}

/* ────────────────────────────────────────────────────────────── */
/*  SESSIONS                                                        */
/* ────────────────────────────────────────────────────────────── */

export const _createSession = createServerFn({ method: "POST" })
  .validator((d: { userId: string; skillId: string; sessionType: SessionType }) => d)
  .handler(async ({ data: { userId, skillId, sessionType } }) => {
    const res = await sql`
      INSERT INTO sessions (user_id, skill_id, session_type, started_at)
      VALUES (${userId}, ${skillId}, ${sessionType}, NOW())
      RETURNING *
    `;
    return res[0] as Session;
  });
export async function createSession(
  userId: string,
  skillId: string,
  sessionType: SessionType = "practice",
): Promise<Session> {
  return await _createSession({ data: { userId, skillId, sessionType } });
}

export const _recordCardResult = createServerFn({ method: "POST" })
  .validator(
    (d: {
      sessionId: string;
      userId: string;
      cardId: string;
      conceptId: string;
      isCorrect: boolean;
      answerIndex?: number;
      swipeDirection?: "left" | "right";
      userReasoning?: string;
      timeSpentMs?: number;
      xpEarned: number;
    }) => d,
  )
  .handler(async ({ data }) => {
    await sql`
      INSERT INTO session_results (
        session_id, user_id, card_id, concept_id, is_correct, 
        answer_index, swipe_direction, user_reasoning, time_spent_ms, xp_earned, answered_at
      )
      VALUES (
        ${data.sessionId}, ${data.userId}, ${data.cardId}, ${data.conceptId}, ${data.isCorrect},
        ${data.answerIndex ?? null}, ${data.swipeDirection ?? null}, ${data.userReasoning ?? null}, 
        ${data.timeSpentMs ?? null}, ${data.xpEarned}, NOW()
      )
    `;
  });
export async function recordCardResult(result: {
  sessionId: string;
  userId: string;
  cardId: string;
  conceptId: string;
  isCorrect: boolean;
  answerIndex?: number;
  swipeDirection?: "left" | "right";
  userReasoning?: string;
  timeSpentMs?: number;
  xpEarned: number;
}): Promise<void> {
  await _recordCardResult({ data: result });
}

export const _completeSession = createServerFn({ method: "POST" })
  .validator(
    (d: {
      sessionId: string;
      stats: {
        cardsSeen: number;
        cardsCorrect: number;
        xpEarned: number;
        conceptsPracticed: number;
        durationSeconds: number;
      };
    }) => d,
  )
  .handler(async ({ data: { sessionId, stats } }) => {
    await sql`
      UPDATE sessions SET
        completed_at = NOW(),
        cards_seen = ${stats.cardsSeen},
        cards_correct = ${stats.cardsCorrect},
        xp_earned = ${stats.xpEarned},
        concepts_practiced = ${stats.conceptsPracticed},
        duration_seconds = ${stats.durationSeconds}
      WHERE id = ${sessionId}
    `;
  });
export async function completeSession(
  sessionId: string,
  stats: {
    cardsSeen: number;
    cardsCorrect: number;
    xpEarned: number;
    conceptsPracticed: number;
    durationSeconds: number;
  },
): Promise<void> {
  await _completeSession({ data: { sessionId, stats } });
}

/* ────────────────────────────────────────────────────────────── */
/*  XP                                                             */
/* ────────────────────────────────────────────────────────────── */

export const _addXPEntry = createServerFn({ method: "POST" })
  .validator(
    (d: {
      userId: string;
      amount: number;
      reason: string;
      sessionId?: string;
      cardId?: string;
      skillId?: string;
    }) => d,
  )
  .handler(async ({ data: entry }) => {
    await sql`
      INSERT INTO xp_ledger (user_id, amount, reason, session_id, card_id, skill_id, created_at)
      VALUES (${entry.userId}, ${entry.amount}, ${entry.reason}, ${entry.sessionId ?? null}, ${entry.cardId ?? null}, ${entry.skillId ?? null}, NOW())
    `;
  });
export async function addXPEntry(entry: {
  userId: string;
  amount: number;
  reason: string;
  sessionId?: string;
  cardId?: string;
  skillId?: string;
}): Promise<void> {
  await _addXPEntry({ data: entry });
}

export const _fetchTotalXP = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const res =
      await sql`SELECT COALESCE(SUM(amount), 0) as total FROM xp_ledger WHERE user_id = ${userId}`;
    return Number(res[0]?.total || 0);
  });
export async function fetchTotalXP(userId: string): Promise<number> {
  return await _fetchTotalXP({ data: userId });
}

export const _fetchWeeklyXP = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const res = await sql`
      SELECT COALESCE(SUM(amount), 0) as total 
      FROM xp_ledger 
      WHERE user_id = ${userId} 
      AND created_at >= date_trunc('week', current_date)
    `;
    return Number(res[0]?.total || 0);
  });
export async function fetchWeeklyXP(userId: string): Promise<number> {
  return await _fetchWeeklyXP({ data: userId });
}

/* ────────────────────────────────────────────────────────────── */
/*  USER PROFILE                                                   */
/* ────────────────────────────────────────────────────────────── */

export const _fetchUserProfile = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const res = await sql`SELECT * FROM profiles WHERE id = ${userId} LIMIT 1`;
    return (res[0] as Profile) || null;
  });
export async function fetchUserProfile(userId: string): Promise<Profile | null> {
  return await _fetchUserProfile({ data: userId });
}

export const _updateUserProfile = createServerFn({ method: "POST" })
  .validator((d: { userId: string; updates: Record<string, unknown> }) => d)
  .handler(async ({ data: { userId, updates } }) => {
    const setClauses = [];
    const values = [];
    let i = 1;
    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${i}`);
      values.push(value);
      i++;
    }
    if (setClauses.length === 0) return;
    setClauses.push(`updated_at = NOW()`);

    await (sql as unknown as { query: (q: string, params: unknown[]) => Promise<unknown> }).query(
      `UPDATE profiles SET ${setClauses.join(", ")} WHERE id = $${i}`,
      values.concat(userId),
    );
  });
export async function updateUserProfile(
  userId: string,
  updates: Record<string, unknown>,
): Promise<void> {
  await _updateUserProfile({ data: { userId, updates } });
}

export const _fetchNotificationPrefs = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const res = await sql`SELECT * FROM user_notification_prefs WHERE user_id = ${userId} LIMIT 1`;
    return (res[0] as UserNotificationPrefs) || null;
  });
export async function fetchNotificationPrefs(
  userId: string,
): Promise<UserNotificationPrefs | null> {
  return await _fetchNotificationPrefs({ data: userId });
}

export const _upsertNotificationPrefs = createServerFn({ method: "POST" })
  .validator((d: { userId: string; prefs: Partial<UserNotificationPrefs> }) => d)
  .handler(async ({ data: { userId, prefs } }) => {
    await sql`
      INSERT INTO user_notification_prefs (
        user_id, 
        daily_reminder, daily_reminder_time, weekly_summary_email, 
        streak_warning, new_skill_alerts, updated_at
      ) VALUES (
        ${userId}, 
        ${prefs.daily_reminder ?? true}, ${prefs.daily_reminder_time ?? "09:00"}, ${prefs.weekly_summary_email ?? true},
        ${prefs.streak_warning ?? true}, ${prefs.new_skill_alerts ?? false},
        NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        daily_reminder = EXCLUDED.daily_reminder,
        daily_reminder_time = EXCLUDED.daily_reminder_time,
        weekly_summary_email = EXCLUDED.weekly_summary_email,
        streak_warning = EXCLUDED.streak_warning,
        new_skill_alerts = EXCLUDED.new_skill_alerts,
        updated_at = NOW()
    `;
  });
export async function upsertNotificationPrefs(
  userId: string,
  prefs: Partial<UserNotificationPrefs>,
): Promise<void> {
  await _upsertNotificationPrefs({ data: { userId, prefs } });
}

/* ────────────────────────────────────────────────────────────── */
/*  STREAK                                                         */
/* ────────────────────────────────────────────────────────────── */

export const _fetchUserStreak = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const res = await sql`SELECT * FROM user_streaks WHERE user_id = ${userId} LIMIT 1`;
    return (res[0] as UserStreak) || null;
  });
export async function fetchUserStreak(userId: string): Promise<UserStreak | null> {
  return await _fetchUserStreak({ data: userId });
}

export const _updateStreakAfterSession = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    await sql`
      INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_practice_date, streak_freezes_available)
      VALUES (${userId}, 1, 1, CURRENT_DATE, 0)
      ON CONFLICT (user_id) DO UPDATE SET
        current_streak = CASE 
          WHEN user_streaks.last_practice_date = CURRENT_DATE THEN user_streaks.current_streak
          WHEN user_streaks.last_practice_date = CURRENT_DATE - 1 THEN user_streaks.current_streak + 1
          WHEN user_streaks.streak_freezes_available > 0 AND user_streaks.last_practice_date = CURRENT_DATE - 2 THEN user_streaks.current_streak + 1
          ELSE 1 
        END,
        longest_streak = GREATEST(
          user_streaks.longest_streak,
          CASE 
            WHEN user_streaks.last_practice_date = CURRENT_DATE THEN user_streaks.current_streak
            WHEN user_streaks.last_practice_date = CURRENT_DATE - 1 THEN user_streaks.current_streak + 1
            WHEN user_streaks.streak_freezes_available > 0 AND user_streaks.last_practice_date = CURRENT_DATE - 2 THEN user_streaks.current_streak + 1
            ELSE 1 
          END
        ),
        streak_freezes_available = CASE
          WHEN user_streaks.last_practice_date != CURRENT_DATE AND user_streaks.last_practice_date = CURRENT_DATE - 2 AND user_streaks.streak_freezes_available > 0 
          THEN user_streaks.streak_freezes_available - 1
          ELSE user_streaks.streak_freezes_available
        END,
        last_freeze_used_at = CASE
          WHEN user_streaks.last_practice_date != CURRENT_DATE AND user_streaks.last_practice_date = CURRENT_DATE - 2 AND user_streaks.streak_freezes_available > 0 
          THEN NOW()
          ELSE user_streaks.last_freeze_used_at
        END,
        last_practice_date = CURRENT_DATE,
        updated_at = NOW()
    `;
  });
export async function updateStreakAfterSession(userId: string): Promise<void> {
  await _updateStreakAfterSession({ data: userId });
}

export const _seedInitialStreak = createServerFn({ method: "POST" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    await sql`
      INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_practice_date, streak_freezes_available)
      VALUES (${userId}, 0, 0, NULL, 0)
      ON CONFLICT (user_id) DO NOTHING
    `;
  });
export async function seedInitialStreak(userId: string): Promise<void> {
  await _seedInitialStreak({ data: userId });
}

/* ────────────────────────────────────────────────────────────── */
/*  BADGES                                                         */
/* ────────────────────────────────────────────────────────────── */

export const _fetchUserBadges = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const res = await sql`
      SELECT ub.*, row_to_json(b.*) as badge 
      FROM user_badges ub 
      JOIN badges b ON ub.badge_id = b.id 
      WHERE ub.user_id = ${userId} 
      ORDER BY ub.earned_at DESC
    `;
    return res as UserBadge[];
  });
export async function fetchUserBadges(userId: string): Promise<UserBadge[]> {
  return await _fetchUserBadges({ data: userId });
}

/* ────────────────────────────────────────────────────────────── */
/*  DAILY GOALS                                                    */
/* ────────────────────────────────────────────────────────────── */

export const _fetchUserDailyGoals = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const res = await sql`SELECT * FROM user_daily_goals WHERE user_id = ${userId} LIMIT 1`;
    return (res[0] as UserDailyGoals) || null;
  });
export async function fetchUserDailyGoals(userId: string): Promise<UserDailyGoals | null> {
  return await _fetchUserDailyGoals({ data: userId });
}

/* ────────────────────────────────────────────────────────────── */
/*  LEADERBOARD                                                    */
/* ────────────────────────────────────────────────────────────── */

export const _fetchLeaderboard = createServerFn({ method: "GET" })
  .validator((limit: number) => limit)
  .handler(async ({ data: limit }) => {
    const res = await sql`SELECT * FROM weekly_leaderboard LIMIT ${limit}`;
    return res as LeaderboardEntry[];
  });
export async function fetchLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  return await _fetchLeaderboard({ data: limit });
}

/* ────────────────────────────────────────────────────────────── */
/*  DASHBOARD                                                      */
/* ────────────────────────────────────────────────────────────── */

export const _fetchDashboardStats = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    const [streakRes, totalXpRes, weeklyXpRes, progRes] = await Promise.all([
      sql`SELECT * FROM user_streaks WHERE user_id = ${userId} LIMIT 1`,
      sql`SELECT COALESCE(SUM(amount), 0) as total FROM xp_ledger WHERE user_id = ${userId}`,
      sql`SELECT COALESCE(SUM(amount), 0) as total FROM xp_ledger WHERE user_id = ${userId} AND created_at >= date_trunc('week', current_date)`,
      sql`SELECT * FROM user_skill_progress WHERE user_id = ${userId}`,
    ]);

    const streak = streakRes[0] as UserStreak | undefined;
    const totalXP = Number(totalXpRes[0]?.total || 0);
    const weeklyXP = Number(weeklyXpRes[0]?.total || 0);
    const skillProgress = progRes as UserSkillProgress[];

    const activeProg = skillProgress.filter((p) => p.status === "active");
    const avgMastery =
      activeProg.length > 0
        ? activeProg.reduce((sum, p) => sum + (p.mastery_pct || 0), 0) / activeProg.length
        : 0;

    const totalConceptsMastered = skillProgress.reduce(
      (sum, p) => sum + (p.concepts_mastered || 0),
      0,
    );

    return {
      streak: streak?.current_streak ?? 0,
      streakFreezes: streak?.streak_freezes_available ?? 0,
      totalXP,
      weeklyXP,
      masteryPct: Math.round(avgMastery),
      masteryDelta: 0,
      conceptsMastered: totalConceptsMastered,
      totalConcepts: 68,
    } as DashboardStats;
  });
export async function fetchDashboardStats(userId: string): Promise<DashboardStats> {
  return await _fetchDashboardStats({ data: userId });
}

export const _fetchContinueLearning = createServerFn({ method: "GET" })
  .validator((d: { userId: string; limit: number }) => d)
  .handler(async ({ data: { userId, limit } }) => {
    const res = await sql`
      SELECT p.*, row_to_json(s.*) as skill
      FROM user_skill_progress p
      JOIN skills s ON p.skill_id = s.id
      WHERE p.user_id = ${userId} AND p.status = 'active'
      ORDER BY p.last_practiced DESC
      LIMIT ${limit}
    `;

    const items: ContinueLearningItem[] = res.map((r) => {
      const row = r as unknown as UserSkillProgress & { skill: Skill };
      return {
        skill_id: row.skill.id,
        skill_name: row.skill.name,
        skill_slug: row.skill.slug,
        concept_name: "Continue Practice",
        concept_slug: "continue",
        progress: row.mastery_pct ?? 0,
        reason: "Continue learning",
        estimatedMinutes: 5 + Math.floor(Math.random() * 8),
        color_from: row.skill.color_from ?? "from-indigo-400/20",
        color_to: row.skill.color_to ?? "to-indigo-600/5",
      };
    });

    return items;
  });
export async function fetchContinueLearning(
  userId: string,
  limit = 3,
): Promise<ContinueLearningItem[]> {
  return await _fetchContinueLearning({ data: { userId, limit } });
}

/* ────────────────────────────────────────────────────────────── */
/*  CONCEPT MASTERY                                                */
/* ────────────────────────────────────────────────────────────── */

export const _upsertConceptMastery = createServerFn({ method: "POST" })
  .validator((d: { userId: string; conceptId: string; isCorrect: boolean }) => d)
  .handler(async ({ data: { userId, conceptId, isCorrect } }) => {
    await sql`
      INSERT INTO user_concept_mastery (user_id, concept_id, times_seen, times_correct, mastery_probability, state, last_seen_at)
      VALUES (
        ${userId}, ${conceptId}, 1, ${isCorrect ? 1 : 0}, 
        ${isCorrect ? 0.08 : 0}, 
        'learning', NOW()
      )
      ON CONFLICT (user_id, concept_id) DO UPDATE SET
        times_seen = user_concept_mastery.times_seen + 1,
        times_correct = user_concept_mastery.times_correct + ${isCorrect ? 1 : 0},
        mastery_probability = LEAST(1, GREATEST(0, user_concept_mastery.mastery_probability + ${isCorrect ? 0.08 : -0.05})),
        state = CASE WHEN (user_concept_mastery.mastery_probability + ${isCorrect ? 0.08 : -0.05}) >= 0.8 THEN 'mastered' ELSE 'learning' END,
        last_seen_at = NOW(),
        updated_at = NOW()
    `;
  });
export async function upsertConceptMastery(
  userId: string,
  conceptId: string,
  isCorrect: boolean,
): Promise<void> {
  await _upsertConceptMastery({ data: { userId, conceptId, isCorrect } });
}

export const _updateSkillMasteryFromConcepts = createServerFn({ method: "POST" })
  .validator((d: { userId: string; skillId: string }) => d)
  .handler(async ({ data: { userId, skillId } }) => {
    await sql`
      WITH stats AS (
        SELECT 
          COUNT(c.id) as total_concepts,
          COUNT(ucm.id) as mastered_concepts
        FROM concepts c
        LEFT JOIN user_concept_mastery ucm ON c.id = ucm.concept_id AND ucm.user_id = ${userId} AND ucm.state = 'mastered'
        WHERE c.skill_id = ${skillId} AND c.is_published = true
      )
      INSERT INTO user_skill_progress (user_id, skill_id, mastery_pct, concepts_mastered, last_practiced, updated_at)
      SELECT 
        ${userId}, 
        ${skillId}, 
        CASE WHEN total_concepts > 0 THEN (mastered_concepts::float / total_concepts) * 100 ELSE 0 END,
        mastered_concepts,
        NOW(),
        NOW()
      FROM stats
      ON CONFLICT (user_id, skill_id) DO UPDATE SET
        mastery_pct = EXCLUDED.mastery_pct,
        concepts_mastered = EXCLUDED.concepts_mastered,
        updated_at = NOW()
    `;
  });
export async function updateSkillMasteryFromConcepts(
  userId: string,
  skillId: string,
): Promise<void> {
  await _updateSkillMasteryFromConcepts({ data: { userId, skillId } });
}

/* ────────────────────────────────────────────────────────────── */
/*  SKILL ENROLLMENTS                                              */
/* ────────────────────────────────────────────────────────────── */

export const _fetchUserEnrollments = createServerFn({ method: "GET" })
  .validator((userId: string) => userId)
  .handler(async ({ data: userId }) => {
    try {
      const res =
        await sql`SELECT * FROM user_skill_enrollments WHERE user_id = ${userId} ORDER BY enrolled_at DESC`;
      return res as UserSkillEnrollment[];
    } catch (e: unknown) {
      console.warn(
        "user_skill_enrollments table not found:",
        e instanceof Error ? e.message : String(e),
      );
      return [];
    }
  });
export async function fetchUserEnrollments(userId: string): Promise<UserSkillEnrollment[]> {
  return await _fetchUserEnrollments({ data: userId });
}

export const _enrollInSkill = createServerFn({ method: "POST" })
  .validator((d: { userId: string; skillId: string }) => d)
  .handler(async ({ data: { userId, skillId } }) => {
    try {
      await sql`
        INSERT INTO user_skill_enrollments (user_id, skill_id, enrolled_at)
        VALUES (${userId}, ${skillId}, NOW())
        ON CONFLICT DO NOTHING
      `;
    } catch (e: unknown) {
      console.warn("Could not enroll in skill:", e instanceof Error ? e.message : String(e));
    }
  });
export async function enrollInSkill(userId: string, skillId: string): Promise<void> {
  await _enrollInSkill({ data: { userId, skillId } });
}
