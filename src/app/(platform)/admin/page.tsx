"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  DollarSign,
  Rocket,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Activity,
} from "lucide-react";

const quickLinks = [
  {
    href: "/admin/applications",
    icon: FileText,
    label: "Applications",
    description: "Review pending applications",
    count: 8,
    countLabel: "pending",
  },
  {
    href: "/admin/payouts",
    icon: DollarSign,
    label: "Payouts",
    description: "Manage prize pool & payouts",
    count: 1,
    countLabel: "pending",
  },
  {
    href: "/admin/analytics",
    icon: Activity,
    label: "Analytics",
    description: "Platform metrics & insights",
    count: null,
    countLabel: null,
  },
  {
    href: "/admin/pipeline",
    icon: Rocket,
    label: "Venture Pipeline",
    description: "Flagged students for ACU",
    count: 5,
    countLabel: "flagged",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-text-primary">Admin Panel</h1>
          <Badge variant="brand">Staff</Badge>
        </div>
        <p className="text-sm text-text-secondary">
          Manage applications, payouts, and the venture studio pipeline
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Members"
          value="210"
          change={15}
          changeLabel="this month"
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Applications"
          value="8"
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Monthly Revenue"
          value="$2,100"
          change={12}
          changeLabel="vs last month"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="Pipeline Candidates"
          value="5"
          change={25}
          changeLabel="this quarter"
          icon={<Rocket className="h-5 w-5" />}
        />
      </div>

      {/* Alert */}
      <Card className="bg-warning/5 border-warning/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-text-primary">
              8 applications awaiting review
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Applications older than 5 days should be prioritized. The oldest
              pending application is from 4 days ago.
            </p>
            <Link
              href="/admin/applications"
              className="inline-flex items-center gap-1 text-xs font-medium text-warning hover:text-yellow-400 mt-2 transition-colors"
            >
              Review now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <Card hover glow>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-brand-500/10 text-brand-500 group-hover:bg-brand-500/20 transition-colors">
                  <link.icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-text-primary">
                      {link.label}
                    </h3>
                    {link.count !== null && (
                      <Badge variant="brand">
                        {link.count} {link.countLabel}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1">
                    {link.description}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-text-tertiary group-hover:text-brand-500 transition-colors mt-1" />
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <div className="space-y-3">
          {[
            {
              action: "Application approved",
              detail: "Noah Williams - Heritage Christian",
              time: "2h ago",
              icon: "success",
            },
            {
              action: "Payout executed",
              detail: "Sarah Chen - $1,890 for February winner",
              time: "1d ago",
              icon: "brand",
            },
            {
              action: "Student flagged for pipeline",
              detail: "David Park - High potential for venture studio",
              time: "2d ago",
              icon: "brand",
            },
            {
              action: "Application rejected",
              detail: "John Doe - Did not meet age requirements",
              time: "3d ago",
              icon: "error",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl border border-border-subtle hover:bg-surface-card-hover transition-colors"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  activity.icon === "success"
                    ? "bg-success"
                    : activity.icon === "error"
                      ? "bg-error"
                      : "bg-brand-500"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">
                  {activity.action}
                </p>
                <p className="text-xs text-text-muted">{activity.detail}</p>
              </div>
              <span className="text-xs text-text-muted">{activity.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
