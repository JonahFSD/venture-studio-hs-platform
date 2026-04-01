"use client";

import { useState, useId, Fragment } from "react";
import Link from "next/link";
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

const pastRounds: MonthRound[] = [
  {
    month: "February 2026",
    grossPool: 1773,
    placements: [
      {
        place: 1,
        projectId: "10",
        title: "FaithConnect - Community Platform",
        score: 92,
        team: [
          { id: "1", name: "Sarah Chen" },
          { id: "5", name: "Grace Kim" },
        ],
      },
      {
        place: 2,
        projectId: "11",
        title: "MentorMatch - Youth Mentorship",
        score: 91,
        team: [{ id: "2", name: "David Park" }],
      },
      {
        place: 3,
        projectId: "12",
        title: "GiveBack - Micro-Volunteering",
        score: 89,
        team: [
          { id: "3", name: "Maria Garcia" },
          { id: "6", name: "Noah Williams" },
          { id: "5", name: "Grace Kim" },
        ],
      },
    ],
    mostPoints: { userId: "4", name: "Jake Oswald", monthlyPoints: 2840 },
  },
  {
    month: "January 2026",
    grossPool: 1620,
    placements: [
      {
        place: 1,
        projectId: "7",
        title: "MentorMatch v2",
        score: 93,
        team: [
          { id: "2", name: "David Park" },
          { id: "4", name: "Jake Oswald" },
        ],
      },
      {
        place: 2,
        projectId: "8",
        title: "StudyCircle - Group Learning",
        score: 88,
        team: [{ id: "5", name: "Elijah Thompson" }],
      },
      {
        place: 3,
        projectId: "9",
        title: "WorshipFlow - Church Tech",
        score: 85,
        team: [{ id: "6", name: "Grace Kim" }],
      },
    ],
    mostPoints: { userId: "1", name: "Sarah Chen", monthlyPoints: 3120 },
  },
  {
    month: "December 2025",
    grossPool: 1500,
    placements: [
      {
        place: 1,
        projectId: "4",
        title: "GiveBack - Micro-Volunteering",
        score: 90,
        team: [
          { id: "3", name: "Maria Garcia" },
          { id: "1", name: "Sarah Chen" },
        ],
      },
      {
        place: 2,
        projectId: "5",
        title: "PrayerWall - Digital Board",
        score: 87,
        team: [{ id: "1", name: "Sarah Chen" }],
      },
      {
        place: 3,
        projectId: "6",
        title: "DataDash - Analytics Tool",
        score: 84,
        team: [
          { id: "7", name: "Noah Williams" },
          { id: "8", name: "Sophia Johnson" },
        ],
      },
    ],
    mostPoints: { userId: "2", name: "David Park", monthlyPoints: 2650 },
  },
];

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
  const [expandedMonth, setExpandedMonth] = useState<string | null>(
    pastRounds[0]?.month ?? null,
  );
  const baseId = useId();

  const toggleMonth = (month: string) => {
    setExpandedMonth((m) => (m === month ? null : month));
  };

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
                const open = expandedMonth === round.month;
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
