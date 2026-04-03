import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get all past prize pool rounds for the Hall of Fame.
 */
export const getPastRounds = query({
  args: {},
  handler: async (ctx) => {
    const pools = await ctx.db
      .query("prizePools")
      .order("desc")
      .collect();

    // Attach winner user info
    const withWinners = await Promise.all(
      pools.map(async (pool) => {
        const first = pool.firstPlaceUserId
          ? await ctx.db.get(pool.firstPlaceUserId)
          : null;
        const second = pool.secondPlaceUserId
          ? await ctx.db.get(pool.secondPlaceUserId)
          : null;
        const third = pool.thirdPlaceUserId
          ? await ctx.db.get(pool.thirdPlaceUserId)
          : null;

        return {
          ...pool,
          firstPlaceUser: first
            ? { _id: first._id, fullName: first.fullName, schoolName: first.schoolName }
            : null,
          secondPlaceUser: second
            ? { _id: second._id, fullName: second.fullName, schoolName: second.schoolName }
            : null,
          thirdPlaceUser: third
            ? { _id: third._id, fullName: third.fullName, schoolName: third.schoolName }
            : null,
        };
      })
    );

    return withWinners;
  },
});

/**
 * Get a single prize pool by month.
 */
export const getByMonth = query({
  args: { monthYear: v.string() },
  handler: async (ctx, args) => {
    const pool = await ctx.db
      .query("prizePools")
      .withIndex("by_monthYear", (q) => q.eq("monthYear", args.monthYear))
      .first();

    if (!pool) return null;

    // Attach winner info
    const first = pool.firstPlaceUserId
      ? await ctx.db.get(pool.firstPlaceUserId)
      : null;
    const second = pool.secondPlaceUserId
      ? await ctx.db.get(pool.secondPlaceUserId)
      : null;
    const third = pool.thirdPlaceUserId
      ? await ctx.db.get(pool.thirdPlaceUserId)
      : null;

    return {
      ...pool,
      firstPlaceUser: first
        ? { _id: first._id, fullName: first.fullName }
        : null,
      secondPlaceUser: second
        ? { _id: second._id, fullName: second.fullName }
        : null,
      thirdPlaceUser: third
        ? { _id: third._id, fullName: third.fullName }
        : null,
    };
  },
});
