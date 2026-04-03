"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card } from "@/components/ui/card";
import { InfoCallout } from "@/components/ui/info-callout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";
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
  Sparkles,
} from "lucide-react";

/** Fixed point values; least → most. Bounty and AI score use formulas (see rows). */
const pointsBreakdown: Array<{
  action: string;
  icon: LucideIcon;
  points?: number;
  formula?: string;
}> = [
  { action: "Add an existing user to your network", points: 50, icon: Network },
  { action: "Vote in a monthly round", points: 100, icon: Vote },
  { action: "Submit a pitch as an individual or team member", points: 200, icon: Video },
  { action: "Submit a pitch as a team leader", points: 300, icon: Video },
  {
    action: "Make the top 10 submissions for a month",
    points: 400,
    icon: Target,
  },
  { action: "Invite a new user with your unique link", points: 500, icon: UserPlus },
  { action: "Win 3rd place", points: 500, icon: Medal },
  { action: "Win 2nd place", points: 750, icon: Medal },
  { action: "Win 1st place", points: 1000, icon: Crown },
  {
    action: "Win a bounty (points = 2× bounty $ amount)",
    icon: CircleDollarSign,
    formula: "= 2 × BOUNTY $",
  },
  {
    action: "Bonus points when AI score exceeds 70 out of 100",
    icon: Sparkles,
    formula: "= (YOUR AI SCORE-70) × 1000/30",
  },
];

/** Rounds to the nearest tenth and formats with one decimal (e.g. 92.3). */
const formatAvgScore = (n: number) =>
  (Math.round(n * 10) / 10).toFixed(1);

const RANK_STAR_CLASS: Record<1 | 2 | 3, string> = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

const rankIcon = (rank: number) => {
  const number = (
    <span className="text-sm font-mono font-bold text-text-muted tabular-nums inline-block w-5 text-right">
      {rank}
    </span>
  );
  return (
    <div className="flex items-center gap-1">
      <span
        className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center"
        aria-hidden
      >
        {rank <= 3 && (
          <Star className={`h-4 w-4 ${RANK_STAR_CLASS[rank as 1 | 2 | 3]}`} />
        )}
      </span>
      {number}
    </div>
  );
};

export default function LeaderboardPage() {
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const rawLeaders = useQuery(api.users.getLeaderboard, { activeOnly: showActiveOnly });
  const sorted = (rawLeaders ?? []).map((l, i) => ({
    id: l._id,
    name: l.fullName,
    school: l.schoolName ?? "",
    graduationYear: l.graduationYear ?? 0,
    wins: 0, // not tracked on user yet
    avgScore: 0, // not tracked on user yet
    totalEarnings: l.totalEarnings ?? 0,
    bountiesWon: 0, // not tracked yet
    points: l.points ?? 0,
    active: true,
    rank: i + 1,
  }));

  if (rawLeaders === undefined) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PlatformPageHeader
          icon={Star}
          title="Leaderboard"
          description="Top competitors ranked by points"
        />
        <div className="flex items-center justify-center py-16 text-text-muted">
          Loading leaderboard...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PlatformPageHeader
        icon={Star}
        title="Leaderboard"
        description="Top competitors ranked by points"
      />

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
                <th className="min-w-[72px] text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Rank
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  Member
                </th>
                <th className="w-[88px] text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  Grad year
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
                        <span className="text-sm font-medium text-text-primary hover:text-brand-500 transition-colors">
                          {leader.name}
                        </span>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-text-secondary tabular-nums">
                      {leader.graduationYear}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-text-secondary hidden sm:table-cell truncate">
                    {leader.school}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-sm font-mono text-text-primary tabular-nums">
                      {formatAvgScore(leader.avgScore)}
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
      <InfoCallout>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-xl bg-brand-500/10">
            <Info className="h-5 w-5 text-brand-500" />
          </div>
          <h2 className="text-lg font-semibold text-text-primary">
            How Points Are Calculated
          </h2>
        </div>
        <div className="space-y-1">
          {pointsBreakdown.map((item) => (
            <div
              key={item.action}
              className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-surface-elevated border border-border-default"
            >
              <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-brand-500/10">
                <item.icon className="h-3.5 w-3.5 text-brand-500" />
              </div>
              <span className="flex-1 min-w-0 text-sm text-text-secondary leading-tight">
                {item.action}
              </span>
              <span className="shrink-0 text-sm font-mono font-bold text-brand-500 text-right leading-tight max-w-[min(100%,12rem)] sm:max-w-none">
                {item.formula ?? `+${item.points!.toLocaleString()}`}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-text-muted">
          Members automatically lose membership on July 1st after their senior year.
          Archived members retain their historical points but are hidden from the active leaderboard.
        </p>
      </InfoCallout>
    </div>
  );
}
