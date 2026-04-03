import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUser } from "./helpers";

/**
 * List the current user's submissions with AI scores.
 */
export const listMine = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthUser(ctx);
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_userId_monthYear", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Attach AI scores
    const withScores = await Promise.all(
      submissions.map(async (sub) => {
        const score = await ctx.db
          .query("aiScores")
          .withIndex("by_submissionId", (q) => q.eq("submissionId", sub._id))
          .first();
        return { ...sub, aiScore: score ?? undefined };
      })
    );

    return withScores;
  },
});

/**
 * Get a submission by ID with full details (user, AI score, collaborators).
 */
export const getById = query({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) return null;

    // Get the submitting user
    const user = await ctx.db.get(submission.userId);

    // Get AI score
    const aiScore = await ctx.db
      .query("aiScores")
      .withIndex("by_submissionId", (q) => q.eq("submissionId", args.submissionId))
      .first();

    // Get collaborators with user info
    const collaborators = await ctx.db
      .query("submissionCollaborators")
      .withIndex("by_submissionId", (q) => q.eq("submissionId", args.submissionId))
      .collect();

    const collaboratorsWithUsers = await Promise.all(
      collaborators.map(async (c) => {
        const collabUser = await ctx.db.get(c.userId);
        return { ...c, user: collabUser };
      })
    );

    // Get vote count
    const allVotes = await ctx.db.query("votes").collect();
    const voteCount = allVotes.filter(
      (v) => v.submissionId === args.submissionId
    ).length;

    return {
      ...submission,
      user: user ? { _id: user._id, fullName: user.fullName, email: user.email, schoolName: user.schoolName, avatarStorageId: user.avatarStorageId } : null,
      aiScore: aiScore ?? undefined,
      collaborators: collaboratorsWithUsers,
      voteCount,
    };
  },
});

/**
 * List all submitted/scored submissions for a given month.
 */
export const listByMonth = query({
  args: { monthYear: v.string() },
  handler: async (ctx, args) => {
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_monthYear_status", (q) => q.eq("monthYear", args.monthYear))
      .collect();

    // Filter to only submitted/scored, attach user + score
    const result = await Promise.all(
      submissions
        .filter((s) => s.status === "submitted" || s.status === "scored")
        .map(async (sub) => {
          const user = await ctx.db.get(sub.userId);
          const score = await ctx.db
            .query("aiScores")
            .withIndex("by_submissionId", (q) => q.eq("submissionId", sub._id))
            .first();
          return {
            ...sub,
            user: user ? { _id: user._id, fullName: user.fullName, schoolName: user.schoolName } : null,
            aiScore: score ?? undefined,
          };
        })
    );

    return result;
  },
});

/**
 * Create a new draft submission.
 */
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    videoUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    slideDeckUrl: v.optional(v.string()),
    additionalLinks: v.optional(v.any()),
    monthYear: v.string(),
    isTeamSubmission: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    return await ctx.db.insert("submissions", {
      userId: user._id,
      title: args.title,
      description: args.description,
      videoUrl: args.videoUrl,
      githubUrl: args.githubUrl,
      websiteUrl: args.websiteUrl,
      slideDeckUrl: args.slideDeckUrl,
      additionalLinks: args.additionalLinks,
      monthYear: args.monthYear,
      status: "draft",
      isTeamSubmission: args.isTeamSubmission ?? false,
    });
  },
});

/**
 * Update a draft submission.
 */
export const update = mutation({
  args: {
    submissionId: v.id("submissions"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    slideDeckUrl: v.optional(v.string()),
    additionalLinks: v.optional(v.any()),
    isTeamSubmission: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.userId !== user._id) {
      throw new Error("Submission not found");
    }
    if (submission.status !== "draft") {
      throw new Error("Can only edit draft submissions");
    }

    const { submissionId, ...updates } = args;
    const filtered: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) filtered[key] = value;
    }
    if (Object.keys(filtered).length > 0) {
      await ctx.db.patch(submissionId, filtered);
    }
  },
});

/**
 * Submit a draft submission (changes status to "submitted").
 */
export const submit = mutation({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const user = await getAuthUser(ctx);
    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.userId !== user._id) {
      throw new Error("Submission not found");
    }
    if (submission.status !== "draft") {
      throw new Error("Submission already submitted");
    }
    await ctx.db.patch(args.submissionId, { status: "submitted" });
  },
});
