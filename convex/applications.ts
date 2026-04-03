import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./helpers";

/**
 * Submit a new application. No auth required (public form).
 */
export const submitApplication = mutation({
  args: {
    userEmail: v.string(),
    fullName: v.string(),
    age: v.number(),
    school: v.string(),
    graduationYear: v.number(),
    faithStatement: v.string(),
    entrepreneurshipInterest: v.string(),
    aiInterest: v.string(),
    videoIntroUrl: v.optional(v.string()),
    parentName: v.string(),
    parentEmail: v.string(),
    parentPhone: v.string(),
    referralCode: v.optional(v.string()),
    // Profile fields
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    bio: v.optional(v.string()),
    skills: v.optional(v.array(v.string())),
    tools: v.optional(v.array(v.string())),
    lookingForCofounders: v.optional(v.boolean()),
    portfolioLinks: v.optional(v.array(v.object({
      label: v.string(),
      url: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    // Check if a user account already exists with this email
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .first();
    if (existingUser) {
      throw new Error("An account with this email already exists. Please sign in instead.");
    }

    // Check if this email already has a pending or approved application
    const existingApp = await ctx.db
      .query("applications")
      .withIndex("by_email", (q) => q.eq("userEmail", args.userEmail))
      .first();
    if (existingApp && (existingApp.status === "pending" || existingApp.status === "approved")) {
      throw new Error(
        existingApp.status === "pending"
          ? "An application for this email is already pending review."
          : "An application for this email has already been approved. Please sign in."
      );
    }

    return await ctx.db.insert("applications", {
      ...args,
      status: "pending",
    });
  },
});

/**
 * List pending applications (admin only).
 */
export const listPending = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("applications")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .order("desc")
      .collect();
  },
});

/**
 * List all applications by status (admin only).
 */
export const listByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("applications")
      .withIndex("by_status", (q) => q.eq("status", args.status as any))
      .order("desc")
      .collect();
  },
});

/**
 * Review an application — approve, reject, or request more info (admin only).
 */
export const reviewApplication = mutation({
  args: {
    applicationId: v.id("applications"),
    decision: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("more_info")
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const admin = await requireAdmin(ctx);

    const application = await ctx.db.get(args.applicationId);
    if (!application) throw new Error("Application not found");

    await ctx.db.patch(args.applicationId, {
      status: args.decision,
      reviewerId: admin._id,
      reviewerNotes: args.notes,
      reviewedAt: Date.now(),
    });

    // If approved, create a user account (if one doesn't exist)
    if (args.decision === "approved") {
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", application.userEmail))
        .first();

      if (!existingUser) {
        await ctx.db.insert("users", {
          email: application.userEmail,
          fullName: application.fullName,
          schoolName: application.school,
          graduationYear: application.graduationYear,
          age: application.age,
          role: "member",
          skills: application.skills ?? [],
          tools: application.tools,
          lookingForCofounders: application.lookingForCofounders ?? false,
          points: 0,
          totalEarnings: 0,
          networkCount: 0,
          bio: application.bio,
          city: application.city,
          state: application.state,
          phone: application.phone,
        });
      }

      // Award referrer 500 points if this application used a referral code
      if (application.referralCode) {
        const referrer = await ctx.db
          .query("users")
          .withIndex("by_referralCode", (q) =>
            q.eq("referralCode", application.referralCode)
          )
          .first();
        if (referrer) {
          await ctx.db.patch(referrer._id, {
            points: (referrer.points ?? 0) + 500,
          });
        }
      }
    }

    // Log the action
    await ctx.db.insert("auditLog", {
      adminUserId: admin._id,
      action: `application.${args.decision}`,
      targetType: "application",
      targetId: args.applicationId,
      metadata: {
        applicantEmail: application.userEmail,
        notes: args.notes,
      },
    });
  },
});
