"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type LucideIcon,
  LayoutDashboard,
  Trophy,
  ArrowRight,
  Clock,
  Calendar,
  Plus,
  Sparkles,
  Target,
  Handshake,
  Award,
  Medal,
  UserPlus,
  CircleDollarSign,
  Network,
} from "lucide-react";

const DashboardTrendsChart = dynamic(
  () =>
    import("@/components/dashboard/dashboard-trends-chart").then(
      (m) => m.DashboardTrendsChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-72 rounded-xl border border-border-default bg-surface-card/50 animate-pulse" />
    ),
  }
);

const todoItems: {
  href: string;
  label: string;
  icon: LucideIcon;
  meta?: string;
}[] = [
  {
    href: "/submissions/invitations",
    label: "Team invitations",
    icon: Handshake,
    meta: "2 new",
  },
  {
    href: "/voting",
    label: "Vote now",
    icon: Target,
    meta: "10 new",
  },
  {
    href: "/bounties",
    label: "Review bounties",
    icon: CircleDollarSign,
    meta: "3 new",
  },
  {
    href: "/network",
    label: "Grow network",
    icon: Network,
    meta: "5 new members",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in w-full">
      <PlatformPageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description={"Welcome back! Here's your venture overview."}
        actions={
          <Link href="/submissions/new">
            <Button variant="brand" leftIcon={<Plus className="h-4 w-4" />}>
              New Pitch
            </Button>
          </Link>
        }
      />

      {/* To Do (left) + cycle (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card>
          <CardHeader>
            <CardTitle>To Do</CardTitle>
          </CardHeader>

          <div className="space-y-3">
            {todoItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-xl border border-border-default hover:bg-surface-card-hover hover:border-border-strong transition-all group"
              >
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-500 group-hover:bg-brand-500/20 transition-colors shrink-0">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium text-text-primary group-hover:text-brand-500 transition-colors">
                    {item.label}
                  </p>
                  <div className="flex items-center gap-2 shrink-0">
                    {item.meta && (
                      <span className="text-xs text-text-muted">{item.meta}</span>
                    )}
                    <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-brand-500 transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>March 2026 Cycle</CardTitle>
            <Badge variant="brand">Active</Badge>
          </CardHeader>

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
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total points"
          value="2,847"
          change={180}
          changeFormat="delta"
          deltaSuffix=" pts"
          changeLabel="mo/mo"
          icon={<Award className="h-5 w-5" />}
        />
        <StatCard
          label="Community rank"
          value="#4"
          change={1}
          changeFormat="delta"
          changeLabel="mo/mo"
          icon={<Medal className="h-5 w-5" />}
        />
        <StatCard
          label="Network growth"
          value="24"
          change={3}
          changeFormat="delta"
          deltaSuffix=" connections"
          changeLabel="mo/mo"
          icon={<UserPlus className="h-5 w-5" />}
        />
        <StatCard
          label="Total earnings"
          value="$4,250"
          change={340}
          changeFormat="delta"
          deltaPrefix="$"
          changeLabel="mo/mo"
          icon={<CircleDollarSign className="h-5 w-5" />}
        />
      </div>

      <DashboardTrendsChart />
    </div>
  );
}
