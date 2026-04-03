"use client";

import { useState, useId, Fragment } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  PLACEMENT_LEADERBOARD_POINTS,
  splitCompetitorPrizePool,
  type CompetitorPrizeSplit,
} from "@/lib/hall-of-fame-prize-pool";
import {
  Calendar,
  DollarSign,
  Users,
  Trophy,
  ChevronDown,
} from "lucide-react";

type PitchPlacement = {
  place: 1 | 2 | 3;
  projectId: string;
  title: string;
  score: number;
  team: { id: string; name: string }[];
};

type MostPointsWinner = {
  userId: string;
  name: string;
  monthlyPoints: number;
};

type MonthRound = {
  month: string;
  /** Full gross pool before the 10% company allocation (not shown). */
  grossPool: number;
  placements: PitchPlacement[];
  mostPoints: MostPointsWinner;
};

/** Format "2026-02" into "February 2026". */
function formatMonthYear(monthYear: string): string {
  const [yearStr, monthStr] = monthYear.split("-");
  const date = new Date(Number(yearStr), Number(monthStr) - 1, 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

const placeColors = {
  1: {
    trophy: "text-yellow-400",
    prize: "text-text-primary",
  },
  2: {
    trophy: "text-gray-300",
    prize: "text-text-primary",
  },
  3: {
    trophy: "text-amber-600",
    prize: "text-text-primary",
  },
} as const;

const placeOrdinalUnderTrophy: Record<1 | 2 | 3, string> = {
  1: "1st",
  2: "2nd",
  3: "3rd",
};

const poolSharePercent: Record<1 | 2 | 3, string> = {
  1: "50%",
  2: "30%",
  3: "10%",
};

/** Under-trophy placement label colors (match trophy metals). */
const placeLabelColor: Record<1 | 2 | 3, string> = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

const MOST_POINTS_BONUS_PTS = 500;

type WinnerRowsProps = {
  split: CompetitorPrizeSplit;
  placements: PitchPlacement[];
  mostPoints: MostPointsWinner;
};

function WinnerRows({ split, placements, mostPoints }: WinnerRowsProps) {
  const prizeForPlace = (place: 1 | 2 | 3) =>
    place === 1 ? split.first : place === 2 ? split.second : split.third;

  return (
    <div className="divide-y divide-border-subtle">
      {placements.map((p) => {
        const colors = placeColors[p.place];
        const submissionHref = `/submissions/${p.projectId}`;
        const prize = prizeForPlace(p.place);
        const bonusPts = PLACEMENT_LEADERBOARD_POINTS[p.place];
        return (
          <div
            key={p.place}
            className="px-3 py-3 sm:px-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex gap-4 items-start">
              <div className="flex flex-col items-center gap-1 shrink-0 w-14">
                <Link
                  href={submissionHref}
                  className={`${colors.trophy}`}
                  aria-label={`View submission: ${p.title}`}
                >
                  <Trophy className="h-5 w-5" />
                </Link>
                <span
                  className={`text-[10px] font-mono tabular-nums text-center leading-tight ${placeLabelColor[p.place]}`}
                >
                  {placeOrdinalUnderTrophy[p.place]}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex gap-4 items-start justify-between">
                  <Link href={submissionHref} className="min-w-0 flex-1 block">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {p.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="text-xs text-text-muted">
                        Score: {p.score}
                      </span>
                      <span className="text-xs text-text-muted flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {p.team.length}{" "}
                        {p.team.length === 1 ? "member" : "members"}
                      </span>
                    </div>
                  </Link>

                  <Link
                    href={submissionHref}
                    className="text-right shrink-0 min-w-[5.5rem]"
                  >
                    <p
                      className={`text-lg sm:text-xl font-bold tabular-nums leading-tight ${colors.prize}`}
                    >
                      ${prize.toLocaleString()}
                    </p>
                    <p className="mt-0.5 text-sm font-mono text-text-secondary tabular-nums">
                      +{bonusPts.toLocaleString()} pts · {poolSharePercent[p.place]}
                    </p>
                  </Link>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {p.team.map((member) => (
                    <Link
                      key={member.id}
                      href={`/members/${member.id}`}
                      className="inline-flex items-center gap-1.5 py-1 pl-0 pr-2 rounded-lg bg-surface-card hover:bg-surface-overlay transition-colors text-xs text-text-secondary hover:text-text-primary"
                    >
                      <Avatar name={member.name} size="xs" />
                      {member.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="px-3 py-3 sm:px-4 hover:bg-white/[0.03] transition-colors">
        <div className="flex gap-4 items-start">
          <div className="flex flex-col items-center gap-1 shrink-0 w-14">
            <Trophy className="h-5 w-5 text-brand-500" aria-hidden />
            <span className="text-[10px] font-mono text-brand-500 tabular-nums text-center leading-tight">
              Points
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex gap-4 items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Most Points Earned
                </p>
                <p className="text-xs text-text-muted mt-1 tabular-nums">
                  {mostPoints.monthlyPoints.toLocaleString()} points
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/members/${mostPoints.userId}`}
                    className="inline-flex items-center gap-1.5 py-1 pl-0 pr-2 rounded-lg bg-surface-card hover:bg-surface-overlay transition-colors text-xs text-text-secondary hover:text-text-primary"
                  >
                    <Avatar name={mostPoints.name} size="xs" />
                    {mostPoints.name}
                  </Link>
                </div>
              </div>

              <Link
                href={`/members/${mostPoints.userId}`}
                className="text-right shrink-0 min-w-[5.5rem]"
              >
                <p className="text-lg sm:text-xl font-bold tabular-nums leading-tight text-text-primary">
                  ${split.mostPoints.toLocaleString()}
                </p>
                <p className="mt-0.5 text-sm font-mono text-text-secondary tabular-nums">
                  +{MOST_POINTS_BONUS_PTS.toLocaleString()} pts · 10%
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HallOfFamePage() {
  const rawRounds = useQuery(api.prizes.getPastRounds);

  // Map Convex data to the shape the UI expects
  const pastRounds: MonthRound[] = (rawRounds ?? []).map((pool) => {
    const placements: PitchPlacement[] = [];

    if (pool.firstPlaceUser) {
      placements.push({
        place: 1,
        projectId: pool._id,
        title: pool.firstPlaceUser.fullName,
        score: 0,
        team: [{ id: pool.firstPlaceUser._id, name: pool.firstPlaceUser.fullName }],
      });
    }
    if (pool.secondPlaceUser) {
      placements.push({
        place: 2,
        projectId: pool._id,
        title: pool.secondPlaceUser.fullName,
        score: 0,
        team: [{ id: pool.secondPlaceUser._id, name: pool.secondPlaceUser.fullName }],
      });
    }
    if (pool.thirdPlaceUser) {
      placements.push({
        place: 3,
        projectId: pool._id,
        title: pool.thirdPlaceUser.fullName,
        score: 0,
        team: [{ id: pool.thirdPlaceUser._id, name: pool.thirdPlaceUser.fullName }],
      });
    }

    // Use first place winner as "most points" placeholder (we don't have monthly points data)
    const mostPointsUser = pool.firstPlaceUser;

    return {
      month: formatMonthYear(pool.monthYear),
      grossPool: pool.totalCollected,
      placements,
      mostPoints: {
        userId: mostPointsUser?._id ?? "",
        name: mostPointsUser?.fullName ?? "N/A",
        monthlyPoints: 0,
      },
    };
  });

  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const baseId = useId();

  // Auto-expand first round once data loads
  const firstMonth = pastRounds[0]?.month ?? null;
  const effectiveExpanded = expandedMonth ?? firstMonth;

  const toggleMonth = (month: string) => {
    setExpandedMonth((m) => (m === month ? null : month));
  };

  // Loading state
  if (rawRounds === undefined) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PlatformPageHeader
          icon={Trophy}
          title="Hall of Fame"
          description="A running history of winning projects, month by month"
        />
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            <p className="text-sm text-text-secondary">Loading hall of fame...</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (pastRounds.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PlatformPageHeader
          icon={Trophy}
          title="Hall of Fame"
          description="A running history of winning projects, month by month"
        />
        <Card>
          <div className="py-12 text-center">
            <Trophy className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary">
              No completed rounds yet. Check back after the first voting round finalizes.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PlatformPageHeader
        icon={Trophy}
        title="Hall of Fame"
        description="A running history of winning projects, month by month"
      />

      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3">
                  Month
                </th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-4 py-3 whitespace-nowrap">
                  Prize pool
                </th>
                <th className="w-12 px-2 py-3" aria-hidden />
              </tr>
            </thead>
            <tbody>
              {pastRounds.map((round) => {
                const open = effectiveExpanded === round.month;
                const panelId = `${baseId}-panel-${round.month.replace(/\s+/g, "-")}`;
                const prizeSplit = splitCompetitorPrizePool(round.grossPool);
                return (
                  <Fragment key={round.month}>
                    <tr
                      className="border-b border-border-subtle hover:bg-surface-card-hover transition-colors cursor-pointer"
                      onClick={() => toggleMonth(round.month)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleMonth(round.month);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={open}
                      aria-controls={open ? panelId : undefined}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <Calendar className="h-4 w-4 text-text-muted flex-shrink-0" />
                          <span className="text-sm font-semibold text-text-primary truncate">
                            {round.month}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap">
                        <Badge variant="brand" className="tabular-nums">
                          <DollarSign className="h-3 w-3 mr-1" />
                          {prizeSplit.displayPool.toLocaleString()}
                        </Badge>
                      </td>
                      <td className="px-2 py-4 text-center">
                        <ChevronDown
                          className={`h-4 w-4 text-text-muted mx-auto transition-transform duration-200 ${
                            open ? "rotate-180" : ""
                          }`}
                          aria-hidden
                        />
                      </td>
                    </tr>
                    {open && (
                      <tr className="border-b border-border-subtle bg-surface-secondary/50">
                        <td colSpan={3} className="px-4 py-4" id={panelId}>
                          <WinnerRows
                            split={prizeSplit}
                            placements={round.placements}
                            mostPoints={round.mostPoints}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
