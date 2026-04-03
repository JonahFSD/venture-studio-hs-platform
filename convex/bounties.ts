import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * List all bounties, optionally filtered by status.
 */
export const list = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let bounties;
    if (args.status) {
      bounties = await ctx.db
        .query("bounties")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    } else {
      bounties = await ctx.db.query("bounties").collect();
    }

    // Attach submission counts
    const withCounts = await Promise.all(
      bounties.map(async (bounty) => {
        const submissions = await ctx.db
          .query("bountySubmissions")
          .withIndex("by_bountyId", (q) => q.eq("bountyId", bounty._id))
          .collect();
        return {
          ...bounty,
          submissionsCount: submissions.length,
        };
      })
    );

    return withCounts;
  },
});

/**
 * Get a bounty by ID with its submissions.
 */
export const getById = query({
  args: { bountyId: v.id("bounties") },
  handler: async (ctx, args) => {
    const bounty = await ctx.db.get(args.bountyId);
    if (!bounty) return null;

    const submissions = await ctx.db
      .query("bountySubmissions")
      .withIndex("by_bountyId", (q) => q.eq("bountyId", args.bountyId))
      .collect();

    // Attach user info to each submission
    const submissionsWithUsers = await Promise.all(
      submissions.map(async (sub) => {
        const user = await ctx.db.get(sub.userId);
        return {
          ...sub,
          user: user
            ? { _id: user._id, fullName: user.fullName, schoolName: user.schoolName }
            : null,
        };
      })
    );

    return {
      ...bounty,
      submissions: submissionsWithUsers,
      submissionsCount: submissions.length,
    };
  },
});
