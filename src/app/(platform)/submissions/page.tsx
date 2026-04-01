"use client";

import { useMemo } from "react";
import Link from "next/link";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import {
  Plus,
  Video,
  Calendar,
  ExternalLink,
  Clock,
  Filter,
  Users,
  Inbox,
  Play,
  FileQuestion,
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { SubmissionStatus } from "@/types";

const statusConfig: Record<
  SubmissionStatus,
  { label: string; variant: "default" | "brand" | "success" | "warning" | "error" }
> = {
  draft: { label: "Draft", variant: "default" },
  submitted: { label: "Submitted", variant: "brand" },
  scored: { label: "Scored", variant: "success" },
};

type SubmissionListItem = {
  id: string;
  title: string;
  description: string;
  status: SubmissionStatus;
  month_year: string;
  score: number | null;
  created_at: string;
  has_video: boolean;
  has_github: boolean;
  has_website: boolean;
  is_team: boolean;
  team_count: number;
};

const mockSubmissions: SubmissionListItem[] = [
  {
    id: "1",
    title: "EcoTrack - Carbon Footprint Tracker",
    description:
      "A mobile app that helps teens track and reduce their carbon footprint through gamification and community challenges.",
    status: "scored",
    month_year: "2026-03",
    score: 87,
    created_at: "2026-03-15",
    has_video: true,
    has_github: true,
    has_website: false,
    is_team: true,
    team_count: 3,
  },
  {
    id: "2",
    title: "FaithConnect - Community Platform",
    description:
      "A social platform connecting young Christians through shared interests, bible study groups, and local events.",
    status: "submitted",
    month_year: "2026-02",
    score: null,
    created_at: "2026-02-20",
    has_video: true,
    has_github: true,
    has_website: true,
    is_team: false,
    team_count: 1,
  },
  {
    id: "3",
    title: "StudyBuddy - AI Homework Helper",
    description:
      "An AI-powered study companion that helps students understand difficult concepts through personalized explanations.",
    status: "scored",
    month_year: "2026-01",
    score: 78,
    created_at: "2026-01-18",
    has_video: true,
    has_github: false,
    has_website: false,
    is_team: false,
    team_count: 1,
  },
  {
    id: "4",
    title: "PrayerWall - Digital Prayer Board",
    description:
      "A community-driven digital prayer board where students can share prayer requests and encourage one another.",
    status: "draft",
    month_year: "2026-03",
    score: null,
    created_at: "2026-03-28",
    has_video: false,
    has_github: false,
    has_website: false,
    is_team: true,
    team_count: 2,
  },
];

function filterSubmissionsByTab<
  T extends { status: SubmissionStatus },
>(subs: T[], tabId: string): T[] {
  switch (tabId) {
    case "all":
      return subs;
    case "submitted":
      return subs.filter((s) => s.status === "submitted");
    case "scored":
      return subs.filter((s) => s.status === "scored");
    case "drafts":
      return subs.filter((s) => s.status === "draft");
    default:
      return subs;
  }
}

export default function SubmissionsPage() {
  const tabs = useMemo(
    () => [
      { id: "all", label: "All", count: mockSubmissions.length },
      {
        id: "submitted",
        label: "Submitted",
        count: filterSubmissionsByTab(mockSubmissions, "submitted").length,
      },
      {
        id: "scored",
        label: "Scored",
        count: filterSubmissionsByTab(mockSubmissions, "scored").length,
      },
      {
        id: "drafts",
        label: "Drafts",
        count: filterSubmissionsByTab(mockSubmissions, "drafts").length,
      },
    ],
    []
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PlatformPageHeader
        icon={Video}
        title="My Submissions"
        description="Track your video pitches and AI scores"
        actions={
          <div className="flex items-center gap-3">
          <Link href="/submissions/invitations">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Inbox className="h-4 w-4" />}
            >
              Invitations
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-brand-500 text-black text-[10px] font-bold">
                2
              </span>
            </Button>
          </Link>
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
        }
      />

      {/* Tabs */}
      <Tabs tabs={tabs}>
        {(activeTab) => {
          const filtered = filterSubmissionsByTab(mockSubmissions, activeTab);
          if (filtered.length === 0) {
            const emptyCopy: Record<
              string,
              { title: string; description: string }
            > = {
              all: {
                title: "No submissions yet",
                description:
                  "Create a pitch to see it here.",
              },
              submitted: {
                title: "No submitted pitches",
                description:
                  "Submit a draft to move it here while it awaits AI scoring.",
              },
              scored: {
                title: "No scored pitches",
                description:
                  "AI scores appear here after scoring finishes.",
              },
              drafts: {
                title: "No drafts",
                description:
                  "Start a new pitch to build a draft.",
              },
            };
            const copy = emptyCopy[activeTab] ?? emptyCopy.all;
            return (
              <EmptyState
                icon={<FileQuestion className="h-8 w-8" />}
                title={copy.title}
                description={copy.description}
              />
            );
          }
          return (
          <div className="space-y-3">
            {filtered.map((sub) => (
              <Link key={sub.id} href={`/submissions/${sub.id}`} className="block">
                <Card
                  hover
                  padding="none"
                  className="overflow-hidden mb-1"
                >
                  <div className="flex flex-col sm:flex-row items-stretch">
                    {/* Video column */}
                    <div
                      className={`relative w-full sm:w-80 md:w-[500px] flex-shrink-0 ${
                        sub.has_video
                          ? "bg-surface-elevated group"
                          : "bg-surface-elevated/80"
                      }`}
                    >
                      {sub.has_video ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 pointer-events-none" />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                              <Play className="h-6 w-6 text-white fill-white" />
                            </div>
                          </div>
                          <div className="aspect-[16/10]" />
                        </>
                      ) : (
                        <div className="aspect-[16/10] flex items-center justify-center border-b sm:border-b-0 sm:border-r border-border-default">
                          <div className="flex flex-col items-center gap-2 text-text-muted">
                            <Video className="h-8 w-8 opacity-50" />
                            <span className="text-xs">No video yet</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Details column */}
                    <div className="flex-1 p-5 min-w-0 overflow-hidden flex flex-col">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {sub.status === "scored" && sub.score != null && (
                          <Badge
                            variant="brand"
                            className="text-xs bg-brand-500/80 text-black font-bold"
                          >
                            AI Score: {sub.score}
                          </Badge>
                        )}
                        <Badge variant={statusConfig[sub.status].variant}>
                          {statusConfig[sub.status].label}
                        </Badge>
                        {sub.is_team && (
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1" />
                            Team ({sub.team_count})
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-base font-semibold text-text-primary truncate">
                        {sub.title}
                      </h3>
                      <p className="text-sm text-text-secondary line-clamp-2 mt-1">
                        {sub.description}
                      </p>

                      <div className="flex items-center gap-4 mt-3 flex-wrap text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {sub.month_year}
                        </span>
                        {sub.has_video && (
                          <span className="flex items-center gap-1">
                            <Video className="h-3.5 w-3.5" />
                            Video
                          </span>
                        )}
                        {sub.has_github && (
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                            GitHub
                          </span>
                        )}
                        {sub.has_website && (
                          <span className="flex items-center gap-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Website
                          </span>
                        )}
                      </div>

                      {sub.status === "draft" && (
                        <div className="flex items-center gap-2 mt-4 p-3 rounded-lg bg-warning/5 border border-warning/10">
                          <Clock className="h-4 w-4 text-warning shrink-0" />
                          <span className="text-xs text-warning">
                            Draft &mdash; finish and submit before Mar 20
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          );
        }}
      </Tabs>
    </div>
  );
}
