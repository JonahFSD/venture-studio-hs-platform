"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Video,
  Trophy,
  DollarSign,
  Users,
  ArrowRight,
  Clock,
  TrendingUp,
  Calendar,
  Plus,
  Sparkles,
  Target,
  Handshake,
} from "lucide-react";

// Mock data
const recentSubmissions = [
  {
    id: "1",
    title: "EcoTrack - Sustainability App",
    status: "scored" as const,
    score: 87,
    date: "Mar 15, 2026",
  },
  {
    id: "2",
    title: "FaithConnect Social Platform",
    status: "voting" as const,
    score: 92,
    date: "Feb 20, 2026",
  },
  {
    id: "3",
    title: "StudyBuddy AI Tutor",
    status: "archived" as const,
    score: 78,
    date: "Jan 18, 2026",
  },
];

const statusConfig = {
  draft: { label: "Draft", variant: "default" as const },
  submitted: { label: "Submitted", variant: "brand" as const },
  scoring: { label: "Scoring", variant: "warning" as const },
  scored: { label: "Scored", variant: "success" as const },
  voting: { label: "In Voting", variant: "brand" as const },
  archived: { label: "Archived", variant: "default" as const },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-secondary mt-1">
            Welcome back! Here&apos;s your venture overview.
          </p>
        </div>
        <Link href="/submissions/new">
          <Button variant="brand" leftIcon={<Plus className="h-4 w-4" />}>
            New Pitch
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="My Submissions"
          value="7"
          change={40}
          changeLabel="vs last quarter"
          icon={<Video className="h-5 w-5" />}
        />
        <StatCard
          label="Best Score"
          value="92"
          change={8}
          changeLabel="improvement"
          icon={<Trophy className="h-5 w-5" />}
        />
        <StatCard
          label="Current Pool"
          value="$1,890"
          change={12}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Community Rank"
          value="#4"
          change={2}
          changeLabel="positions up"
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Cycle */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>March 2026 Cycle</CardTitle>
            <Badge variant="brand">Active</Badge>
          </CardHeader>

          <div className="space-y-6">
            {/* Timeline */}
            <div className="space-y-4">
              {[
                {
                  icon: Calendar,
                  label: "Submission Window",
                  dates: "Mar 1 - Mar 20",
                  active: true,
                  done: false,
                },
                {
                  icon: Sparkles,
                  label: "AI Scoring",
                  dates: "Mar 21 - Mar 23",
                  active: false,
                  done: false,
                },
                {
                  icon: Target,
                  label: "Community Voting",
                  dates: "Mar 24 - Mar 28",
                  active: false,
                  done: false,
                },
                {
                  icon: Trophy,
                  label: "Winner Announced",
                  dates: "Mar 29 - Mar 30",
                  active: false,
                  done: false,
                },
              ].map((phase, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    phase.active
                      ? "bg-brand-500/5 border border-brand-500/20"
                      : "border border-transparent"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      phase.active
                        ? "bg-brand-500/10 text-brand-500"
                        : phase.done
                          ? "bg-success/10 text-success"
                          : "bg-surface-elevated text-text-tertiary"
                    }`}
                  >
                    <phase.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        phase.active ? "text-brand-500" : "text-text-primary"
                      }`}
                    >
                      {phase.label}
                    </p>
                    <p className="text-xs text-text-secondary">{phase.dates}</p>
                  </div>
                  {phase.active && (
                    <Badge variant="brand">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Pool Progress */}
            <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text-secondary">
                  Prize Pool Progress
                </span>
                <span className="text-sm font-semibold text-brand-500">
                  $1,890 / ~$2,100
                </span>
              </div>
              <Progress value={90} />
              <p className="text-xs text-text-muted mt-2">
                210 members &times; $10 &times; 90% = ~$1,890 pool &bull; 1st: 55% &bull; 2nd: 30% &bull; 3rd: 15%
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <Link
              href="/submissions"
              className="text-xs text-brand-500 hover:text-brand-400 transition-colors"
            >
              View all
            </Link>
          </CardHeader>

          <div className="space-y-3">
            {recentSubmissions.map((sub) => (
              <Link
                key={sub.id}
                href={`/submissions/${sub.id}`}
                className="block p-3 rounded-xl border border-border-default hover:bg-surface-card-hover hover:border-border-strong transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate group-hover:text-brand-500 transition-colors">
                      {sub.title}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{sub.date}</p>
                  </div>
                  <Badge variant={statusConfig[sub.status].variant}>
                    {statusConfig[sub.status].label}
                  </Badge>
                </div>
                {sub.score && (
                  <div className="flex items-center gap-2 mt-2">
                    <Progress
                      value={sub.score}
                      size="sm"
                      className="flex-1"
                    />
                    <span className="text-xs font-mono text-text-secondary">
                      {sub.score}/100
                    </span>
                  </div>
                )}
              </Link>
            ))}

            <Link href="/submissions/new">
              <Button variant="ghost" className="w-full mt-2" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Submit New Pitch
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/submissions/invitations" className="group">
          <Card hover glow padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 group-hover:bg-brand-500/20 transition-colors relative">
                <Handshake className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 text-black text-[9px] font-bold flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Team Invitations
                </p>
                <p className="text-xs text-text-secondary">
                  2 pending requests
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
            </div>
          </Card>
        </Link>

        <Link href="/voting" className="group">
          <Card hover glow padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 group-hover:bg-brand-500/20 transition-colors">
                <Target className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Vote Now
                </p>
                <p className="text-xs text-text-secondary">
                  5 pitches need your vote
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
            </div>
          </Card>
        </Link>

        <Link href="/members" className="group">
          <Card hover glow padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 group-hover:bg-brand-500/20 transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Find Co-Founders
                </p>
                <p className="text-xs text-text-secondary">
                  12 members looking
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
            </div>
          </Card>
        </Link>

        <Link href="/leaderboard" className="group">
          <Card hover glow padding="md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500 group-hover:bg-brand-500/20 transition-colors">
                <Trophy className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Leaderboard
                </p>
                <p className="text-xs text-text-secondary">
                  See top performers
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
