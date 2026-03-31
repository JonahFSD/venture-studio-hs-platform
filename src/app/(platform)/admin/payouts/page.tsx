"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  DollarSign,
  Users,
  Trophy,
  Send,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";

const prizePoolHistory = [
  {
    month: "March 2026",
    total: 2100,
    fee: 210,
    prize: 1890,
    status: "pending",
    winner: null,
    members: 210,
  },
  {
    month: "February 2026",
    total: 1970,
    fee: 197,
    prize: 1773,
    status: "paid",
    winner: "Sarah Chen",
    members: 197,
  },
  {
    month: "January 2026",
    total: 1800,
    fee: 180,
    prize: 1620,
    status: "paid",
    winner: "David Park",
    members: 180,
  },
];

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

      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          Payouts & Prize Pool
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage monthly prize pools and winner payouts
        </p>
      </div>

      {/* Current Month */}
      <Card className="bg-gradient-to-r from-brand-500/5 to-transparent border-brand-500/20">
        <CardHeader>
          <div>
            <CardTitle>March 2026 Prize Pool</CardTitle>
            <p className="text-xs text-text-muted mt-1">
              Voting closes March 28 &bull; Winner payout pending
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

        <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-default">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-500/10">
              <Trophy className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Voting in progress
              </p>
              <p className="text-xs text-text-muted">
                Winner will be determined when voting closes
              </p>
            </div>
          </div>
          <Button variant="brand" disabled leftIcon={<Send className="h-4 w-4" />}>
            Execute Payout
          </Button>
        </div>
      </Card>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
        </CardHeader>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Month
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Winner
                </th>
                <th className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Members
                </th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Collected
                </th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Prize
                </th>
                <th className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {prizePoolHistory.map((pool, i) => (
                <tr
                  key={i}
                  className="border-b border-border-subtle hover:bg-surface-card-hover transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-text-muted" />
                      <span className="text-sm font-medium text-text-primary">
                        {pool.month}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {pool.winner ? (
                      <div className="flex items-center gap-2">
                        <Avatar name={pool.winner} size="sm" />
                        <span className="text-sm text-text-primary">
                          {pool.winner}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-text-muted italic">
                        TBD
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-text-secondary">
                    {pool.members}
                  </td>
                  <td className="px-4 py-4 text-right text-sm text-text-primary">
                    ${pool.total.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-semibold text-brand-500">
                    ${pool.prize.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge
                      variant={
                        pool.status === "paid" ? "success" : "warning"
                      }
                    >
                      {pool.status === "paid" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {pool.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
