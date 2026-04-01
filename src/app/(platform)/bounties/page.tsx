"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSign,
  Clock,
  Trophy,
  Calendar,
  ChevronRight,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockBounties, formatBountyDate, daysUntilDue } from "@/lib/bounties-data";

export default function BountiesPage() {
  const [tab, setTab] = useState<"active" | "past">("active");

  const filtered = useMemo(() => {
    if (tab === "active") {
      return mockBounties.filter((b) => b.status === "active" || b.status === "reviewing");
    }
    return mockBounties.filter((b) => b.status === "completed");
  }, [tab]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PlatformPageHeader
        icon={CircleDollarSign}
        title="Bounties"
        description="Side projects from real Christian business leaders; winner takes all"
      />

      <div className="flex items-center gap-2">
        <Button
          variant={tab === "active" ? "brand" : "outline"}
          size="sm"
          onClick={() => setTab("active")}
        >
          Active ({mockBounties.filter((b) => b.status === "active" || b.status === "reviewing").length})
        </Button>
        <Button
          variant={tab === "past" ? "brand" : "outline"}
          size="sm"
          onClick={() => setTab("past")}
        >
          Past ({mockBounties.filter((b) => b.status === "completed").length})
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((bounty) => {
          const days = daysUntilDue(bounty.dueDate);

          return (
            <Card
              key={bounty.id}
              padding="none"
              className="overflow-hidden flex flex-col border-border-default"
            >
              <div className="flex flex-col gap-4 p-5">
                <span className="text-3xl font-bold tabular-nums text-brand-500 tracking-tight">
                  ${bounty.amount.toLocaleString()}
                </span>

                <div className="flex flex-col gap-2">
                  <h3 className="text-base font-semibold text-text-primary leading-snug line-clamp-4">
                    {bounty.title}
                  </h3>

                  {(bounty.status === "completed" && bounty.winner) ||
                  bounty.status === "reviewing" ? (
                    <div className="flex flex-wrap items-center gap-2">
                      {bounty.status === "completed" && bounty.winner && (
                        <Badge variant="success" className="text-[10px]">
                          <Trophy className="h-3 w-3 mr-1" />
                          {bounty.winner.name}
                        </Badge>
                      )}
                      {bounty.status === "reviewing" && (
                        <Badge variant="warning" className="text-[10px]">
                          Reviewing
                        </Badge>
                      )}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-1.5 text-[11px] text-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 flex-shrink-0 text-brand-500" />
                      Due {formatBountyDate(bounty.dueDate)}
                    </span>
                    {bounty.status === "active" && (
                      <span
                        className={`flex items-center gap-1.5 ${
                          days <= 7 ? "text-warning" : days <= 0 ? "text-error" : ""
                        }`}
                      >
                        <Clock className="h-3 w-3 flex-shrink-0 text-brand-500" />
                        {days > 0 ? `${days} days left` : "Overdue"}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <Send className="h-3 w-3 flex-shrink-0 text-brand-500" />
                      {bounty.submissionsCount} submission{bounty.submissionsCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/bounties/${bounty.id}`}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border-default",
                    "bg-surface-card px-3 py-2.5 text-sm font-medium text-text-primary",
                    "transition-colors hover:bg-surface-elevated active:bg-surface-overlay",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary"
                  )}
                >
                  See details
                  <ChevronRight className="h-4 w-4 text-text-muted" aria-hidden />
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <CircleDollarSign className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">
            {tab === "active"
              ? "No active bounties right now. Check back soon!"
              : "No past bounties yet."}
          </p>
        </Card>
      )}
    </div>
  );
}
