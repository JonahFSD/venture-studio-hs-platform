"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { InfoCallout } from "@/components/ui/info-callout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Video,
  Code,
  Globe,
  FileText,
  Calendar,
  Eye,
  Star,
  Brain,
  Lightbulb,
  Target,
  Users,
  Presentation,
  Heart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

/** Convert "2026-03" to "March 2026" */
function formatMonthYear(my: string): string {
  const [year, month] = my.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString("default", { month: "long", year: "numeric" });
}

const statusVariant = (status: string) => {
  switch (status) {
    case "scored":
      return "success";
    case "submitted":
      return "warning";
    case "draft":
      return "default";
    default:
      return "default";
  }
};

export default function SubmissionDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const submission = useQuery(api.submissions.getById, {
    submissionId: id as Id<"submissions">,
  });
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  // Loading state
  if (submission === undefined) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm text-text-secondary">Loading submission...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (submission === null) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Link
          href="/submissions"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Submissions
        </Link>
        <Card>
          <p className="text-sm text-text-secondary">Submission not found.</p>
        </Card>
      </div>
    );
  }

  // Build rubric categories from AI score's categoryScores array
  const categoryIcons: Record<string, typeof Lightbulb> = {
    "Innovation & Originality": Lightbulb,
    "Market Understanding": Target,
    "Feasibility & Execution": Star,
    "Presentation Quality": Presentation,
    "Faith Alignment": Heart,
  };

  const rubricCategories = submission.aiScore?.categoryScores
    ? submission.aiScore.categoryScores.map((cat) => ({
        name: cat.category,
        score: cat.score,
        max: cat.maxScore,
        icon: categoryIcons[cat.category] ?? Lightbulb,
        feedback: cat.feedback,
      }))
    : [];

  const overallScore = submission.aiScore?.overallScore ?? 0;
  const maxScore = 100;

  // Build team members list: lead user + collaborators
  const teamMembers: { id: string; name: string; role: string }[] = [];
  if (submission.user) {
    teamMembers.push({
      id: submission.user._id,
      name: submission.user.fullName,
      role: "Lead",
    });
  }
  for (const collab of submission.collaborators) {
    teamMembers.push({
      id: collab.userId,
      name: collab.user?.fullName ?? "Unknown",
      role: collab.role ?? "Collaborator",
    });
  }

  // Build supporting links
  const supportingLinks = [
    submission.githubUrl
      ? { icon: Code, label: "GitHub Repo", url: submission.githubUrl }
      : null,
    submission.websiteUrl
      ? { icon: Globe, label: "Live Demo", url: submission.websiteUrl }
      : null,
    submission.slideDeckUrl
      ? { icon: FileText, label: "Slide Deck", url: submission.slideDeckUrl }
      : null,
  ].filter(Boolean) as { icon: typeof Code; label: string; url: string }[];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Back */}
      <Link
        href="/submissions"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Submissions
      </Link>

      {/* Header */}
      <PlatformPageHeader
        icon={Video}
        title={
          <span className="flex items-center gap-3 flex-wrap">
            <span>{submission.title}</span>
            <Badge variant={statusVariant(submission.status)}>
              {submission.status.charAt(0).toUpperCase() +
                submission.status.slice(1)}
            </Badge>
          </span>
        }
        description={
          <div className="flex items-center gap-4 text-sm text-text-secondary flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatMonthYear(submission.monthYear)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {submission.voteCount} vote{submission.voteCount !== 1 ? "s" : ""}
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          {submission.videoUrl ? (
            <Card padding="none" className="overflow-hidden">
              <div className="aspect-video bg-surface-elevated flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <a
                  href={submission.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-brand-500/20 backdrop-blur-sm group-hover:bg-brand-500/30 transition-colors"
                >
                  <Video className="h-10 w-10 text-brand-500" />
                </a>
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm font-medium text-white">Pitch Video</p>
                </div>
              </div>
            </Card>
          ) : (
            <Card padding="none" className="overflow-hidden">
              <div className="aspect-video bg-surface-elevated flex items-center justify-center">
                <div className="p-4 rounded-2xl bg-surface-overlay">
                  <Video className="h-10 w-10 text-text-muted" />
                </div>
              </div>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardTitle>Description</CardTitle>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">
              {submission.description}
            </p>
          </Card>

          {/* AI Scoring Results */}
          {submission.aiScore && rubricCategories.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-brand-500/10">
                    <Brain className="h-5 w-5 text-brand-500" />
                  </div>
                  <div>
                    <CardTitle>AI Scoring Results</CardTitle>
                    <p className="text-xs text-text-muted mt-0.5">
                      Rubric v2.1
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-brand-500">
                    {overallScore}
                  </p>
                  <p className="text-xs text-text-muted">/ {maxScore}</p>
                </div>
              </div>

              <div className="space-y-3">
                {rubricCategories.map((cat, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-border-default overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedCategory(expandedCategory === i ? null : i)
                      }
                      className="w-full p-4 flex items-center gap-4 hover:bg-surface-card-hover transition-colors"
                    >
                      <div className="p-1.5 rounded-lg bg-brand-500/10">
                        <cat.icon className="h-4 w-4 text-brand-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-text-primary">
                          {cat.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Progress
                          value={cat.score}
                          max={cat.max}
                          size="sm"
                          className="w-20"
                        />
                        <span className="text-sm font-mono font-bold text-text-primary w-12 text-right">
                          {cat.score}/{cat.max}
                        </span>
                        {expandedCategory === i ? (
                          <ChevronUp className="h-4 w-4 text-text-tertiary" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-text-tertiary" />
                        )}
                      </div>
                    </button>
                    {expandedCategory === i && (
                      <div className="px-4 pb-4 pt-0">
                        <div className="p-3 rounded-lg bg-surface-elevated text-sm text-text-secondary leading-relaxed">
                          {cat.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Qualitative Summary */}
              {submission.aiScore.qualitativeFeedback && (
                <InfoCallout padding="sm" className="mt-6">
                  <h4 className="text-sm font-semibold text-brand-500 mb-2">
                    Overall Assessment
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {submission.aiScore.qualitativeFeedback}
                  </p>
                </InfoCallout>
              )}
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supporting Links */}
          {supportingLinks.length > 0 && (
            <Card>
              <CardTitle>Supporting Materials</CardTitle>
              <div className="mt-4 space-y-2">
                {supportingLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-border-default hover:bg-surface-card-hover hover:border-brand-500/30 transition-all group"
                  >
                    <link.icon className="h-4 w-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
                    <span className="text-sm text-text-primary">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Team */}
          {teamMembers.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-4 w-4 text-brand-500" />
                <h3 className="text-sm font-semibold text-text-primary">
                  Team ({teamMembers.length} member
                  {teamMembers.length !== 1 ? "s" : ""})
                </h3>
              </div>
              <div className="space-y-2">
                {teamMembers.map((member, i) => (
                  <Link
                    key={i}
                    href={`/members/${member.id}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-elevated hover:bg-surface-overlay transition-colors"
                  >
                    <Avatar name={member.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-primary hover:text-brand-500 transition-colors">
                        {member.name}
                      </p>
                      <Badge
                        variant={member.role === "Lead" ? "brand" : "default"}
                        className="mt-0.5"
                      >
                        {member.role}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
