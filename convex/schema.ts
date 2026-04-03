import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // ============================================
  // USERS — member profiles
  // ============================================
  users: defineTable({
    email: v.string(),
    fullName: v.string(),
    avatarStorageId: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    schoolName: v.optional(v.string()),
    graduationYear: v.optional(v.number()),
    age: v.optional(v.number()),
    phone: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    tools: v.optional(v.array(v.string())),
    role: v.union(
      v.literal("member"),
      v.literal("admin"),
      v.literal("superadmin")
    ),
    skills: v.array(v.string()),
    lookingForCofounders: v.boolean(),
    bqType: v.optional(
      v.union(
        v.literal("Anchor"),
        v.literal("Visionary"),
        v.literal("Operator"),
        v.literal("Catalyst"),
        v.literal("Strategist"),
        v.literal("Builder")
      )
    ),
    bqResultsUrl: v.optional(v.string()),
    referralCode: v.optional(v.string()),
    referredBy: v.optional(v.id("users")),
    // Points & computed stats (denormalized for leaderboard)
    points: v.optional(v.number()),
    totalEarnings: v.optional(v.number()),
    networkCount: v.optional(v.number()),
    // Auth link
    authSubject: v.optional(v.string()),
  })
    .index("by_email", ["email"])
    .index("by_authSubject", ["authSubject"])
    .index("by_role", ["role"])
    .index("by_referralCode", ["referralCode"])
    .index("by_points", ["points"]),

  // ============================================
  // APPLICATIONS — registration/admission
  // ============================================
  applications: defineTable({
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
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("more_info")
    ),
    reviewerId: v.optional(v.id("users")),
    referralCode: v.optional(v.string()),
    reviewerNotes: v.optional(v.string()),
    reviewedAt: v.optional(v.number()),
    // Profile fields (captured at application time)
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
  })
    .index("by_status", ["status"])
    .index("by_email", ["userEmail"]),

  // ============================================
  // MEMBERSHIPS — Stripe subscriptions
  // ============================================
  memberships: defineTable({
    userId: v.id("users"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    status: v.union(
      v.literal("active"),
      v.literal("past_due"),
      v.literal("cancelled"),
      v.literal("trialing")
    ),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_stripeCustomerId", ["stripeCustomerId"]),

  // ============================================
  // SUBMISSIONS — monthly venture pitches
  // ============================================
  submissions: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    videoUrl: v.optional(v.string()),
    videoThumbnailStorageId: v.optional(v.id("_storage")),
    githubUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    slideDeckUrl: v.optional(v.string()),
    additionalLinks: v.optional(v.any()),
    monthYear: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("submitted"),
      v.literal("scored")
    ),
    isTeamSubmission: v.boolean(),
  })
    .index("by_userId_monthYear", ["userId", "monthYear"])
    .index("by_monthYear_status", ["monthYear", "status"]),

  // ============================================
  // SUBMISSION COLLABORATORS — team members
  // ============================================
  submissionCollaborators: defineTable({
    submissionId: v.id("submissions"),
    userId: v.id("users"),
    invitedBy: v.id("users"),
    role: v.union(v.literal("lead"), v.literal("collaborator")),
    revenueSplitPct: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("declined")
    ),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_submissionId", ["submissionId"])
    .index("by_userId", ["userId"]),

  // ============================================
  // AI SCORES — AI-evaluated submission scores
  // ============================================
  aiScores: defineTable({
    submissionId: v.id("submissions"),
    rubricVersion: v.string(),
    overallScore: v.number(),
    categoryScores: v.array(
      v.object({
        category: v.string(),
        score: v.number(),
        maxScore: v.number(),
        feedback: v.string(),
      })
    ),
    qualitativeFeedback: v.string(),
    modelUsed: v.string(),
    scoredAt: v.number(),
  }).index("by_submissionId", ["submissionId"]),

  // ============================================
  // VOTING ROUNDS — monthly voting cycles
  // ============================================
  votingRounds: defineTable({
    monthYear: v.string(),
    opensAt: v.number(),
    closesAt: v.number(),
    minScoreThreshold: v.number(),
    status: v.union(
      v.literal("upcoming"),
      v.literal("open"),
      v.literal("closed"),
      v.literal("finalized")
    ),
  })
    .index("by_monthYear", ["monthYear"])
    .index("by_status", ["status"]),

  // ============================================
  // VOTES — member votes on submissions
  // ============================================
  votes: defineTable({
    votingRoundId: v.id("votingRounds"),
    voterUserId: v.id("users"),
    submissionId: v.id("submissions"),
  })
    .index("by_roundId_submissionId", ["votingRoundId", "submissionId"])
    .index("by_roundId_voterId", ["votingRoundId", "voterUserId"]),

  // ============================================
  // PRIZE POOLS — monthly prize distribution
  // ============================================
  prizePools: defineTable({
    monthYear: v.string(),
    totalCollected: v.number(),
    operationalFeePct: v.number(),
    netPrize: v.number(),
    firstPlacePct: v.number(),
    secondPlacePct: v.number(),
    thirdPlacePct: v.number(),
    firstPlaceUserId: v.optional(v.id("users")),
    secondPlaceUserId: v.optional(v.id("users")),
    thirdPlaceUserId: v.optional(v.id("users")),
    payoutStatus: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("failed")
    ),
    stripeTransferId: v.optional(v.string()),
    finalizedAt: v.optional(v.number()),
  }).index("by_monthYear", ["monthYear"]),

  // ============================================
  // MESSAGES — direct messaging
  // ============================================
  messages: defineTable({
    threadId: v.string(),
    senderUserId: v.id("users"),
    recipientUserId: v.id("users"),
    body: v.string(),
    readAt: v.optional(v.number()),
  })
    .index("by_threadId", ["threadId"])
    .index("by_recipientUserId", ["recipientUserId"]),

  // ============================================
  // VENTURE STUDIO FLAGS — admin flagging
  // ============================================
  ventureStudioFlags: defineTable({
    userId: v.id("users"),
    flaggedByAdminId: v.id("users"),
    notes: v.string(),
  }).index("by_userId", ["userId"]),

  // ============================================
  // NOTIFICATIONS — in-app notifications
  // ============================================
  notifications: defineTable({
    userId: v.id("users"),
    type: v.string(),
    title: v.string(),
    body: v.string(),
    read: v.boolean(),
    actionUrl: v.optional(v.string()),
  }).index("by_userId_read", ["userId", "read"]),

  // ============================================
  // AUDIT LOG — admin action tracking
  // ============================================
  auditLog: defineTable({
    adminUserId: v.id("users"),
    action: v.string(),
    targetType: v.string(),
    targetId: v.string(),
    metadata: v.optional(v.any()),
  }).index("by_adminUserId", ["adminUserId"]),

  // ============================================
  // BOUNTIES — external funding opportunities
  // ============================================
  bounties: defineTable({
    title: v.string(),
    description: v.string(),
    founderName: v.string(),
    founderCompany: v.string(),
    bountyAmount: v.number(),
    dueDate: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("reviewing"),
      v.literal("completed"),
      v.literal("cancelled")
    ),
    requirements: v.array(v.string()),
    winnerSubmissionId: v.optional(v.id("bountySubmissions")),
  }).index("by_status", ["status"]),

  // ============================================
  // BOUNTY SUBMISSIONS
  // ============================================
  bountySubmissions: defineTable({
    bountyId: v.id("bounties"),
    userId: v.id("users"),
    isTeam: v.boolean(),
    submissionUrl: v.string(),
    notes: v.optional(v.string()),
    isWinner: v.boolean(),
    submittedAt: v.number(),
  })
    .index("by_bountyId", ["bountyId"])
    .index("by_userId", ["userId"]),
});
