"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Crown,
  Info,
  Vote,
  Video,
  Star,
  Medal,
  Network,
  UserPlus,
  Target,
  CircleDollarSign,
} from "lucide-react";

const allTimeLeaders = [
  { id: "1", name: "Sarah Chen", school: "Grace Academy", wins: 3, avgScore: 94, totalEarnings: 5670, bountiesWon: 1, points: 18750, active: true },
  { id: "2", name: "David Park", school: "Covenant Prep", wins: 2, avgScore: 91, totalEarnings: 3780, bountiesWon: 1, points: 14200, active: true },
  { id: "3", name: "Maria Garcia", school: "Hope Academy", wins: 2, avgScore: 89, totalEarnings: 3200, bountiesWon: 0, points: 12500, active: true },
  { id: "4", name: "Jake Oswald", school: "Austin Christian High", wins: 1, avgScore: 87, totalEarnings: 1890, bountiesWon: 1, points: 8900, active: true },
  { id: "5", name: "Elijah Thompson", school: "Liberty Christian", wins: 1, avgScore: 86, totalEarnings: 1500, bountiesWon: 0, points: 7600, active: true },
  { id: "6", name: "Grace Kim", school: "Faith Lutheran", wins: 0, avgScore: 84, totalEarnings: 0, bountiesWon: 0, points: 3200, active: true },
  { id: "7", name: "Noah Williams", school: "Heritage Christian", wins: 0, avgScore: 82, totalEarnings: 0, bountiesWon: 0, points: 2800, active: false },
  { id: "8", name: "Sophia Johnson", school: "Trinity Prep", wins: 0, avgScore: 80, totalEarnings: 0, bountiesWon: 0, points: 1500, active: false },
  { id: "9", name: "Caleb Martinez", school: "Redeemer Prep", wins: 0, avgScore: 79, totalEarnings: 0, bountiesWon: 0, points: 1200, active: true },
  { id: "10", name: "Hannah Lee", school: "Cornerstone Academy", wins: 0, avgScore: 77, totalEarnings: 0, bountiesWon: 0, points: 950, active: true },
];

const pointsBreakdown = [
  { action: "Add an existing user to your network", points: 25, icon: Network },
  { action: "Invite a new user with your unique link", points: 100, icon: UserPlus },
  { action: "Vote in a monthly round", points: 50, icon: Vote },
  { action: "Submit a pitch as an individual or team member", points: 100, icon: Video },
  { action: "Submit a pitch as a team leader", points: 200, icon: Star },
  { action: "Make the top 10 for a month", points: 500, icon: Target },
  { action: "Win 3rd place", points: 1000, icon: Medal },
  { action: "Win 2nd place", points: 2500, icon: Medal },
  { action: "Win 1st place", points: 5000, icon: Crown },
  { action: "Win a bounty (points = 10× bounty $ amount)", points: 0, icon: CircleDollarSign },
];

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Crown className="h-5 w-5 text-gray-300" />;
  if (rank === 3) return <Crown className="h-5 w-5 text-amber-600" />;
  return (
    <span className="text-sm font-mono font-bold text-text-muted w-5 text-center">
      {rank}
    </span>
  );
};

export default function LeaderboardPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const sorted = useMemo(() => {
    const filtered = showActiveOnly
      ? allTimeLeaders.filter((l) => l.active)
      : allTimeLeaders;

    return [...filtered]
      .sort((a, b) => b.points - a.points)
      .map((l, i) => ({ ...l, rank: i + 1 }));
  }, [showActiveOnly]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Leaderboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Top performers ranked by points
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={showActiveOnly ? "brand" : "outline"}
          size="sm"
          onClick={() => setShowActiveOnly(true)}
        >
          Active Members
        </Button>
        <Button
          variant={!showActiveOnly ? "brand" : "outline"}
          size="sm"
          onClick={() => setShowActiveOnly(false)}
        >
          All Time
        </Button>
      </div>

      {/* Rankings Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                <th className="w-[50px] text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Rank
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  Member
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                  School
                </th>
                <th className="w-[100px] text-center text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Avg Score
                </th>
                <th className="w-[60px] text-center text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Wins
                </th>
                <th className="w-[80px] text-center text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Bounties
                </th>
                <th className="w-[90px] text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                  Earnings
                </th>
                <th className="w-[90px] text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Points
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((leader) => (
                <tr
                  key={leader.id}
                  className="border-b border-border-subtle hover:bg-surface-card-hover transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {rankIcon(leader.rank)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Link href={`/members/${leader.id}`}>
                      <div className="flex items-center gap-3">
                        <Avatar name={leader.name} size="sm" />
                        <div>
                          <span className="text-sm font-medium text-text-primary hover:text-brand-500 transition-colors">
                            {leader.name}
                          </span>
                          {!leader.active && (
                            <Badge variant="outline" className="ml-2 text-[10px]">
                              Archived
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-sm text-text-secondary hidden sm:table-cell truncate">
                    {leader.school}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-mono text-text-primary">
                      {leader.avgScore}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-text-primary">
                      {leader.wins}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm text-text-primary">
                      {leader.bountiesWon}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right text-sm font-medium text-text-primary hidden sm:table-cell">
                    {leader.totalEarnings > 0
                      ? `$${leader.totalEarnings.toLocaleString()}`
                      : "-"}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="text-sm font-mono font-bold text-brand-500">
                      {leader.points.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* How Points Are Calculated */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-brand-500/10">
            <Info className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              How Points Are Calculated
            </h2>
            <p className="text-xs text-text-muted">
              Earn points through participation and achievement
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {pointsBreakdown.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl bg-surface-elevated border border-border-default"
            >
              <div className="p-1.5 rounded-lg bg-brand-500/10">
                <item.icon className="h-4 w-4 text-brand-500" />
              </div>
              <span className="flex-1 text-sm text-text-secondary">
                {item.action}
              </span>
              <span className="text-sm font-mono font-bold text-brand-500">
                {item.points > 0 ? `+${item.points.toLocaleString()}` : "= 10×$"}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-text-muted">
          Members automatically lose membership on July 1st after their senior year.
          Archived members retain their historical points but are hidden from the active leaderboard.
        </p>
      </Card>
    </div>
  );
}
