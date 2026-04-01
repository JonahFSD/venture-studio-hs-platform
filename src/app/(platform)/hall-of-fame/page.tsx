"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import {
  Crown,
  Calendar,
  DollarSign,
  Users,
  Trophy,
} from "lucide-react";

const pastRounds = [
  {
    month: "February 2026",
    pool: 1773,
    placements: [
      {
        place: 1,
        projectId: "10",
        title: "FaithConnect - Community Platform",
        score: 92,
        prize: 975,
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
        prize: 532,
        team: [{ id: "2", name: "David Park" }],
      },
      {
        place: 3,
        projectId: "12",
        title: "GiveBack - Micro-Volunteering",
        score: 89,
        prize: 266,
        team: [
          { id: "3", name: "Maria Garcia" },
          { id: "6", name: "Noah Williams" },
          { id: "5", name: "Grace Kim" },
        ],
      },
    ],
  },
  {
    month: "January 2026",
    pool: 1620,
    placements: [
      {
        place: 1,
        projectId: "7",
        title: "MentorMatch v2",
        score: 93,
        prize: 891,
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
        prize: 486,
        team: [{ id: "5", name: "Elijah Thompson" }],
      },
      {
        place: 3,
        projectId: "9",
        title: "WorshipFlow - Church Tech",
        score: 85,
        prize: 243,
        team: [{ id: "6", name: "Grace Kim" }],
      },
    ],
  },
  {
    month: "December 2025",
    pool: 1500,
    placements: [
      {
        place: 1,
        projectId: "4",
        title: "GiveBack - Micro-Volunteering",
        score: 90,
        prize: 825,
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
        prize: 450,
        team: [{ id: "1", name: "Sarah Chen" }],
      },
      {
        place: 3,
        projectId: "6",
        title: "DataDash - Analytics Tool",
        score: 84,
        prize: 225,
        team: [
          { id: "7", name: "Noah Williams" },
          { id: "8", name: "Sophia Johnson" },
        ],
      },
    ],
  },
];

const placeColors = {
  1: { crown: "text-yellow-400", bg: "bg-yellow-500/5 border-yellow-500/20", prize: "text-yellow-400" },
  2: { crown: "text-gray-300", bg: "bg-surface-elevated border-border-default", prize: "text-text-primary" },
  3: { crown: "text-amber-600", bg: "bg-surface-elevated border-border-default", prize: "text-text-primary" },
} as const;

export default function HallOfFamePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <Trophy className="h-6 w-6 text-yellow-400" />
          Hall of Fame
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          A running history of winning projects, month by month
        </p>
      </div>

      {/* Monthly Rounds */}
      {pastRounds.map((round, ri) => (
        <Card key={ri}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-text-muted" />
              <span className="text-base font-semibold text-text-primary">
                {round.month}
              </span>
            </div>
            <Badge variant="outline">
              <DollarSign className="h-3 w-3 mr-1" />
              ${round.pool.toLocaleString()} pool
            </Badge>
          </div>

          <div className="space-y-3">
            {round.placements.map((p) => {
              const colors = placeColors[p.place as 1 | 2 | 3];
              return (
                <div
                  key={p.place}
                  className={`rounded-xl border ${colors.bg} overflow-hidden`}
                >
                  <Link
                    href={`/submissions/${p.projectId}`}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Place Crown */}
                    <Crown className={`h-5 w-5 flex-shrink-0 ${colors.crown}`} />

                    {/* Project Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text-primary truncate">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-text-muted">
                          Score: {p.score}
                        </span>
                        <span className="text-xs text-text-muted flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {p.team.length} {p.team.length === 1 ? "member" : "members"}
                        </span>
                      </div>
                    </div>

                    {/* Team Avatars */}
                    <div className="hidden sm:flex items-center -space-x-2">
                      {p.team.map((member) => (
                        <Avatar
                          key={member.id}
                          name={member.name}
                          size="sm"
                          className="ring-2 ring-surface-card"
                        />
                      ))}
                    </div>

                    {/* Prize */}
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-bold ${colors.prize}`}>
                        ${p.prize.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-text-muted">
                        {p.place === 1 ? "1st · 55%" : p.place === 2 ? "2nd · 30%" : "3rd · 15%"}
                      </p>
                    </div>
                  </Link>

                  {/* Team Members Row */}
                  <div className="px-4 pb-3 flex items-center gap-2 flex-wrap">
                    {p.team.map((member) => (
                      <Link
                        key={member.id}
                        href={`/members/${member.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-surface-card hover:bg-surface-overlay transition-colors text-xs text-text-secondary hover:text-text-primary"
                      >
                        <Avatar name={member.name} size="xs" />
                        {member.name}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
