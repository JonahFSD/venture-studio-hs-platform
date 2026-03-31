"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Video,
  Vote,
  TrendingUp,
  Activity,
} from "lucide-react";

const monthlyData = [
  { month: "Oct", members: 120, submissions: 32, revenue: 1200 },
  { month: "Nov", members: 145, submissions: 38, revenue: 1450 },
  { month: "Dec", members: 165, submissions: 41, revenue: 1650 },
  { month: "Jan", members: 180, submissions: 45, revenue: 1800 },
  { month: "Feb", members: 197, submissions: 52, revenue: 1970 },
  { month: "Mar", members: 210, submissions: 58, revenue: 2100 },
];

export default function AnalyticsPage() {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
        <p className="text-sm text-text-secondary mt-1">
          Platform metrics and growth insights
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Members"
          value="210"
          change={15}
          changeLabel="this month"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Submissions This Month"
          value="58"
          change={12}
          changeLabel="vs last month"
          icon={<Video className="h-5 w-5" />}
        />
        <StatCard
          label="Votes Cast"
          value="342"
          change={18}
          changeLabel="vs last month"
          icon={<Vote className="h-5 w-5" />}
        />
        <StatCard
          label="Total Revenue"
          value="$12.4k"
          change={22}
          changeLabel="vs last quarter"
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>

      {/* Revenue Chart (Simplified Bar Chart) */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Monthly Revenue</CardTitle>
            <p className="text-xs text-text-muted mt-1">
              Last 6 months &bull; $10/member/month
            </p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-success">
            <TrendingUp className="h-4 w-4" />
            +75%
          </div>
        </CardHeader>

        <div className="flex items-end gap-3 h-48 mt-4">
          {monthlyData.map((data) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-text-muted">
                ${(data.revenue / 1000).toFixed(1)}k
              </span>
              <div className="w-full relative">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-brand-600 to-brand-400 transition-all duration-500"
                  style={{
                    height: `${(data.revenue / maxRevenue) * 140}px`,
                  }}
                />
              </div>
              <span className="text-xs text-text-muted">{data.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-2">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <span className="text-xs text-text-muted w-8">
                  {data.month}
                </span>
                <Progress
                  value={data.members}
                  max={250}
                  size="sm"
                  className="flex-1"
                />
                <span className="text-xs font-mono text-text-secondary w-8 text-right">
                  {data.members}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-surface-elevated border border-border-default">
            <p className="text-xs text-text-secondary">
              <span className="text-brand-500 font-medium">Target: 250 members</span>{" "}
              &bull; At 250+ members, the 10% operational fee covers all
              infrastructure costs
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Submission Metrics</CardTitle>
          </CardHeader>
          <div className="space-y-4 mt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
              <span className="text-sm text-text-secondary">
                Avg submissions per member
              </span>
              <span className="text-sm font-bold text-text-primary">0.28</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
              <span className="text-sm text-text-secondary">
                Avg AI score
              </span>
              <span className="text-sm font-bold text-brand-500">82.4</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
              <span className="text-sm text-text-secondary">
                Score trend
              </span>
              <span className="text-sm font-bold text-success">+3.2% MoM</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
              <span className="text-sm text-text-secondary">
                Voting participation
              </span>
              <span className="text-sm font-bold text-text-primary">68%</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-surface-elevated">
              <span className="text-sm text-text-secondary">
                Avg votes per submission
              </span>
              <span className="text-sm font-bold text-text-primary">41</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
