"use client";

import Link from "next/link";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Trophy,
  Send,
  CheckCircle,
  Clock,
  Calendar,
  Medal,
  Crown,
  Shield,
} from "lucide-react";

const prizePoolHistory = [
  {
    month: "March 2026",
    total: 2100,
    fee: 210,
    pool: 1890,
    status: "pending",
    placements: [
      { place: 1, name: null, amount: 1040 },
      { place: 2, name: null, amount: 567 },
      { place: 3, name: null, amount: 283 },
    ],
    members: 210,
  },
  {
    month: "February 2026",
    total: 1970,
    fee: 197,
    pool: 1773,
    status: "paid",
    placements: [
      { place: 1, name: "Sarah Chen", amount: 975 },
      { place: 2, name: "David Park", amount: 532 },
      { place: 3, name: "Maria Garcia", amount: 266 },
    ],
    members: 197,
  },
  {
    month: "January 2026",
    total: 1800,
    fee: 180,
    pool: 1620,
    status: "paid",
    placements: [
      { place: 1, name: "David Park", amount: 891 },
      { place: 2, name: "Elijah Thompson", amount: 486 },
      { place: 3, name: "Grace Kim", amount: 243 },
    ],
    members: 180,
  },
];

const placeIcon = (place: number) => {
  if (place === 1) return <Crown className="h-4 w-4 text-yellow-400" />;
  if (place === 2) return <Medal className="h-4 w-4 text-gray-300" />;
  return <Medal className="h-4 w-4 text-amber-600" />;
};

const placeLabel = (place: number) => {
  if (place === 1) return "1st";
  if (place === 2) return "2nd";
  return "3rd";
};

const placePct = (place: number) => {
  if (place === 1) return 55;
  if (place === 2) return 30;
  return 15;
};

export default function PayoutsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <PlatformPageHeader
        icon={Shield}
        title="Payouts & Prize Pool"
        description="Manage monthly prize pools and 1st / 2nd / 3rd place payouts"
      />

      {/* Current Month */}
      <Card className="bg-gradient-to-r from-brand-500/5 to-transparent border border-dashed border-brand-500/30">
        <CardHeader>
          <div>
            <CardTitle>March 2026 Prize Pool</CardTitle>
            <p className="text-xs text-text-muted mt-1">
              Voting closes March 28 &bull; Payouts pending
            </p>
          </div>
          <Badge variant="warning">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        </CardHeader>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
          <div className="p-4 rounded-xl bg-surface-elevated border border-border-default text-center">
            <p className="text-xs text-text-muted">Active Members</p>
            <p className="text-2xl font-bold text-text-primary mt-1">210</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border-default text-center">
            <p className="text-xs text-text-muted">Total Collected</p>
            <p className="text-2xl font-bold text-text-primary mt-1">$2,100</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-elevated border border-border-default text-center">
            <p className="text-xs text-text-muted">Operational Fee (10%)</p>
            <p className="text-2xl font-bold text-error mt-1">-$210</p>
          </div>
          <div className="p-4 rounded-xl bg-brand-500/10 border border-brand-500/20 text-center">
            <p className="text-xs text-brand-400">Prize Pool</p>
            <p className="text-2xl font-bold text-brand-500 mt-1">$1,890</p>
          </div>
        </div>

        {/* Prize Breakdown */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { place: 1, pct: 55, amount: 1040, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
            { place: 2, pct: 30, amount: 567, color: "text-gray-300", bg: "bg-gray-400/10", border: "border-gray-400/20" },
            { place: 3, pct: 15, amount: 283, color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20" },
          ].map((p) => (
            <div key={p.place} className={`p-3 rounded-xl ${p.bg} border ${p.border} text-center`}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {placeIcon(p.place)}
                <span className={`text-xs font-bold ${p.color}`}>
                  {placeLabel(p.place)} Place
                </span>
              </div>
              <p className="text-lg font-bold text-text-primary">${p.amount.toLocaleString()}</p>
              <p className="text-[10px] text-text-muted">{p.pct}% of pool</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-default">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-500/10">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Voting in progress
              </p>
              <p className="text-xs text-text-muted">
                Top 3 will be determined when voting closes
              </p>
            </div>
          </div>
          <Button variant="brand" disabled leftIcon={<Send className="h-4 w-4" />}>
            Execute Payouts
          </Button>
        </div>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>

        <div className="space-y-4">
          {prizePoolHistory.map((pool, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border-default hover:bg-surface-card-hover transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-text-muted" />
                  <span className="text-sm font-semibold text-text-primary">
                    {pool.month}
                  </span>
                  <span className="text-xs text-text-muted">
                    {pool.members} members
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-brand-500">
                    ${pool.pool.toLocaleString()} pool
                  </span>
                  <Badge
                    variant={pool.status === "paid" ? "success" : "warning"}
                  >
                    {pool.status === "paid" ? (
                      <CheckCircle className="h-3 w-3 mr-1" />
                    ) : (
                      <Clock className="h-3 w-3 mr-1" />
                    )}
                    {pool.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {pool.placements.map((p) => (
                  <div
                    key={p.place}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-surface-elevated"
                  >
                    {placeIcon(p.place)}
                    <div className="flex-1 min-w-0">
                      {p.name ? (
                        <div className="flex items-center gap-2">
                          <Avatar name={p.name} size="sm" />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-text-primary truncate">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-text-muted">
                              {placeLabel(p.place)} &bull; {placePct(p.place)}%
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-text-muted italic">TBD</p>
                      )}
                    </div>
                    <span className="text-sm font-bold text-text-primary">
                      ${p.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
