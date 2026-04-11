"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  DollarSign,
  Rocket,
  ArrowRight,
  Activity,
  Trophy,
} from "lucide-react";

const AdminPlatformTrendsChart = dynamic(
  () =>
    import("@/components/admin/admin-platform-trends-chart").then(
      (m) => m.AdminPlatformTrendsChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[12rem] rounded-xl border border-border-default bg-surface-card/50 animate-pulse" />
    ),
  }
);

export default function AdminPage() {
  const stats = useQuery(api.admin.getDashboardStats);

  const quickLinks = [
    {
      href: "/admin/applications",
      icon: FileText,
      label: "Applications",
      description: "Review pending applications",
      count: stats?.pendingApplications ?? null,
      countLabel: "pending",
    },
    {
      href: "/admin/payouts",
      icon: DollarSign,
      label: "Payouts",
      description: "Manage prize pool & payouts",
      count: null,
      countLabel: null,
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
      count: stats?.flaggedStudents ?? null,
      countLabel: "flagged",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:gap-6 animate-fade-in w-full min-h-0",
        "min-h-[calc(100dvh-11rem)]",
        "lg:h-[calc(100dvh-8rem)] lg:max-h-[calc(100dvh-8rem)] lg:min-h-[calc(100dvh-8rem)]",
        "lg:overflow-hidden"
      )}
    >
      {/* To-do / quick links first */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
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

      {/* Time series — grows on desktop to fill viewport with header + grids */}
      <div className="flex flex-col flex-1 min-h-[min(50vh,22rem)] lg:min-h-0 w-full">
        <AdminPlatformTrendsChart className="h-full min-h-0" />
      </div>

      {/* Metric cards last */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        <StatCard
          label="Total Members"
          value={stats ? stats.totalMembers.toLocaleString() : "--"}
          icon={<Users className="h-5 w-5" />}
        />
        <StatCard
          label="Total Submissions"
          value={stats ? stats.totalSubmissions.toLocaleString() : "--"}
          icon={<FileText className="h-5 w-5" />}
        />
        <StatCard
          label="Total Revenue"
          value={stats ? `$${stats.totalRevenue.toLocaleString()}` : "--"}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          label="This Month"
          value={stats ? stats.currentMonthSubmissions.toLocaleString() : "--"}
          icon={<Trophy className="h-5 w-5" />}
        />
      </div>
    </div>
  );
}
