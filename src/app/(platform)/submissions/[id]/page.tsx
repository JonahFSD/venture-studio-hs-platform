"use client";

import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  ThumbsUp,
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

const rubricCategories = [
  {
    name: "Innovation & Originality",
    score: 18,
    max: 20,
    icon: Lightbulb,
    feedback:
      "Strong original concept with clear differentiation from existing solutions. The gamification approach to sustainability is creative and well-suited for the teen demographic.",
  },
  {
    name: "Market Understanding",
    score: 16,
    max: 20,
    icon: Target,
    feedback:
      "Good understanding of the target market. Could benefit from more specific data on teen sustainability adoption rates and competitive analysis.",
  },
  {
    name: "Feasibility & Execution",
    score: 17,
    max: 20,
    icon: Star,
    feedback:
      "Technical approach is sound with a clear MVP roadmap. The use of existing APIs for carbon calculation shows practical thinking.",
  },
  {
    name: "Presentation Quality",
    score: 19,
    max: 20,
    icon: Presentation,
    feedback:
      "Excellent presentation skills. Clear communication, good pacing, and engaging delivery. Visuals were clean and professional.",
  },
  {
    name: "Faith Alignment",
    score: 17,
    max: 20,
    icon: Heart,
    feedback:
      "Strong connection between stewardship values and the product mission. The framing of environmental care as a faith imperative resonates well.",
  },
];

export default function SubmissionDetailPage() {
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const overallScore = rubricCategories.reduce((sum, c) => sum + c.score, 0);
  const maxScore = rubricCategories.reduce((sum, c) => sum + c.max, 0);

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
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-text-primary">
              EcoTrack - Carbon Footprint Tracker
            </h1>
            <Badge variant="success">Scored</Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              March 2026
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              34 votes
            </span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3.5 w-3.5" />
              Top 10%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card padding="none" className="overflow-hidden">
            <div className="aspect-video bg-surface-elevated flex items-center justify-center relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="p-4 rounded-2xl bg-brand-500/20 backdrop-blur-sm group-hover:bg-brand-500/30 transition-colors">
                <Video className="h-10 w-10 text-brand-500" />
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-sm font-medium text-white">
                  Pitch Video &bull; 4:32
                </p>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card>
            <CardTitle>Description</CardTitle>
            <p className="text-sm text-text-secondary leading-relaxed mt-3">
              EcoTrack is a mobile app that helps teens track and reduce their
              carbon footprint through gamification and community challenges. By
              making sustainability fun and social, we aim to empower the next
              generation of environmental stewards. The app uses AI to analyze
              daily habits and suggest personalized eco-friendly alternatives,
              while a community leaderboard drives engagement through friendly
              competition.
            </p>
          </Card>

          {/* AI Scoring Results */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand-500/10">
                  <Brain className="h-5 w-5 text-brand-500" />
                </div>
                <div>
                  <CardTitle>AI Scoring Results</CardTitle>
                  <p className="text-xs text-text-muted mt-0.5">
                    Rubric v2.1 &bull; Scored Mar 22, 2026
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
            <div className="mt-6 p-4 rounded-xl bg-brand-500/5 border border-brand-500/10">
              <h4 className="text-sm font-semibold text-brand-500 mb-2">
                Overall Assessment
              </h4>
              <p className="text-sm text-text-secondary leading-relaxed">
                EcoTrack demonstrates strong entrepreneurial thinking with a
                creative approach to a meaningful problem. The pitch was
                well-delivered with clear market understanding. To strengthen
                this concept, consider conducting user interviews with your
                target demographic and developing a more detailed competitive
                analysis. The faith alignment through stewardship is authentic
                and compelling.
              </p>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Supporting Links */}
          <Card>
            <CardTitle>Supporting Materials</CardTitle>
            <div className="mt-4 space-y-2">
              {[
                { icon: Code, label: "GitHub Repo", url: "#" },
                { icon: Globe, label: "Live Demo", url: "#" },
                { icon: FileText, label: "Slide Deck", url: "#" },
              ].map((link, i) => (
                <a
                  key={i}
                  href={link.url}
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

          {/* Team */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-brand-500" />
              <h3 className="text-sm font-semibold text-text-primary">
                Team ({3} members)
              </h3>
            </div>
            <div className="space-y-2">
              {[
                { id: "4", name: "Jake Oswald", role: "Lead" },
                { id: "1", name: "Sarah Chen", role: "Collaborator" },
                { id: "2", name: "David Park", role: "Collaborator" },
              ].map((member, i) => (
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
        </div>
      </div>
    </div>
  );
}
