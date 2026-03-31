"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Plus,
  Video,
  Calendar,
  ExternalLink,
  Eye,
  Clock,
  Filter,
} from "lucide-react";

const statusConfig: Record<string, { label: string; variant: "default" | "brand" | "success" | "warning" | "error" }> = {
  draft: { label: "Draft", variant: "default" },
  submitted: { label: "Submitted", variant: "brand" },
  scoring: { label: "AI Scoring", variant: "warning" },
  scored: { label: "Scored", variant: "success" },
  voting: { label: "In Voting", variant: "brand" },
  archived: { label: "Archived", variant: "default" },
};

const mockSubmissions = [
  {
    id: "1",
    title: "EcoTrack - Carbon Footprint Tracker",
    description:
      "A mobile app that helps teens track and reduce their carbon footprint through gamification and community challenges.",
    status: "scored",
    month_year: "2026-03",
    score: 87,
    vote_count: 34,
    created_at: "2026-03-15",
    has_video: true,
    has_github: true,
    has_website: false,
  },
  {
    id: "2",
    title: "FaithConnect - Community Platform",
    description:
      "A social platform connecting young Christians through shared interests, bible study groups, and local events.",
    status: "voting",
    month_year: "2026-02",
    score: 92,
    vote_count: 58,
    created_at: "2026-02-20",
    has_video: true,
    has_github: true,
    has_website: true,
  },
  {
    id: "3",
    title: "StudyBuddy - AI Homework Helper",
    description:
      "An AI-powered study companion that helps students understand difficult concepts through personalized explanations.",
    status: "archived",
    month_year: "2026-01",
    score: 78,
    vote_count: 12,
    created_at: "2026-01-18",
    has_video: true,
    has_github: false,
    has_website: false,
  },
  {
    id: "4",
    title: "PrayerWall - Digital Prayer Board",
    description:
      "A community-driven digital prayer board where students can share prayer requests and encourage one another.",
    status: "draft",
    month_year: "2026-03",
    score: null,
    vote_count: 0,
    created_at: "2026-03-28",
    has_video: false,
    has_github: false,
    has_website: false,
  },
];

const tabs = [
  { id: "all", label: "All", count: 4 },
  { id: "active", label: "Active", count: 2 },
  { id: "scored", label: "Scored", count: 1 },
  { id: "drafts", label: "Drafts", count: 1 },
];

export default function SubmissionsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            My Submissions
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your video pitches and AI scores
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Filter className="h-4 w-4" />}
          >
            Filter
          </Button>
          <Link href="/submissions/new">
            <Button
              variant="brand"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
            >
              New Pitch
            </Button>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs}>
        {() => (
          <div className="space-y-4">
            {mockSubmissions.map((sub) => (
              <Link key={sub.id} href={`/submissions/${sub.id}`}>
                <Card hover padding="none" className="mb-4">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-base font-semibold text-text-primary truncate">
                            {sub.title}
                          </h3>
                          <Badge variant={statusConfig[sub.status].variant}>
                            {statusConfig[sub.status].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-text-secondary line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 mt-4 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-text-muted">
                        <Calendar className="h-3.5 w-3.5" />
                        {sub.month_year}
                      </span>
                      {sub.has_video && (
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Video className="h-3.5 w-3.5" />
                          Video
                        </span>
                      )}
                      {sub.has_github && (
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <ExternalLink className="h-3.5 w-3.5" />
                          GitHub
                        </span>
                      )}
                      {sub.has_website && (
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <ExternalLink className="h-3.5 w-3.5" />
                          Website
                        </span>
                      )}
                      {sub.vote_count > 0 && (
                        <span className="flex items-center gap-1 text-xs text-text-muted">
                          <Eye className="h-3.5 w-3.5" />
                          {sub.vote_count} votes
                        </span>
                      )}
                    </div>

                    {/* Score bar */}
                    {sub.score && (
                      <div className="flex items-center gap-3 mt-4 p-3 rounded-lg bg-surface-elevated">
                        <span className="text-xs text-text-secondary whitespace-nowrap">
                          AI Score
                        </span>
                        <Progress
                          value={sub.score}
                          size="sm"
                          className="flex-1"
                        />
                        <span className="text-sm font-mono font-bold text-brand-500">
                          {sub.score}
                        </span>
                      </div>
                    )}

                    {sub.status === "draft" && (
                      <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-warning/5 border border-warning/10">
                        <Clock className="h-4 w-4 text-warning" />
                        <span className="text-xs text-warning">
                          Draft &mdash; finish and submit before Mar 20
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
}
