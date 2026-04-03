import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./helpers";

/**
 * Get aggregate stats for the admin dashboard.
 */
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const users = await ctx.db.query("users").collect();
    const submissions = await ctx.db.query("submissions").collect();
    const applications = await ctx.db.query("applications").collect();
    const prizePools = await ctx.db.query("prizePools").collect();
    const flags = await ctx.db.query("ventureStudioFlags").collect();

    const totalMembers = users.filter((u) => u.role === "member").length;
    const totalSubmissions = submissions.length;
    const pendingApplications = applications.filter(
      (a) => a.status === "pending"
    ).length;
    const totalRevenue = prizePools.reduce(
      (sum, p) => sum + p.totalCollected,
      0
    );
    const flaggedStudents = flags.length;

    // Current month's submissions
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const currentMonthSubmissions = submissions.filter(
      (s) => s.monthYear === currentMonth
    ).length;

    return {
      totalMembers,
      totalSubmissions,
      pendingApplications,
      totalRevenue,
      flaggedStudents,
      currentMonthSubmissions,
    };
  },
});

/**
 * Get audit log entries (admin only).
 */
export const getAuditLog = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const entries = await ctx.db
      .query("auditLog")
      .order("desc")
      .take(args.limit ?? 50);

    // Attach admin user info
    const withAdmins = await Promise.all(
      entries.map(async (entry) => {
        const admin = await ctx.db.get(entry.adminUserId);
        return {
          ...entry,
          adminName: admin?.fullName ?? "Unknown",
        };
      })
    );

    return withAdmins;
  },
});

/**
 * Get flagged students for the pipeline (admin only).
 */
export const getFlaggedStudents = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const flags = await ctx.db.query("ventureStudioFlags").collect();

    const withDetails = await Promise.all(
      flags.map(async (flag) => {
        const student = await ctx.db.get(flag.userId);
        const admin = await ctx.db.get(flag.flaggedByAdminId);

        // Get student's submission stats
        const submissions = await ctx.db
          .query("submissions")
          .withIndex("by_userId_monthYear", (q) =>
            q.eq("userId", flag.userId)
          )
          .collect();

        return {
          ...flag,
          student: student
            ? {
                _id: student._id,
                fullName: student.fullName,
                schoolName: student.schoolName,
                points: student.points ?? 0,
              }
            : null,
          adminName: admin?.fullName ?? "Unknown",
          submissionCount: submissions.length,
        };
      })
    );

    return withDetails;
  },
});
