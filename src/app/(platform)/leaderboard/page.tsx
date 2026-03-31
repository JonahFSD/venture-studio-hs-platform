"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Medal,
  Crown,
  DollarSign,
  Calendar,
  TrendingUp,
  Star,
} from "lucide-react";

const allTimeLeaders = [
  {
    rank: 1,
    name: "Sarah Chen",
    school: "Grace Academy",
    wins: 3,
    avgScore: 94,
    totalEarnings: 5670,
  },
  {
    rank: 2,
    name: "David Park",
    school: "Covenant Prep",
    wins: 2,
    avgScore: 91,
    totalEarnings: 3780,
  },
  {
    rank: 3,
    name: "Maria Garcia",
    school: "Hope Academy",
    wins: 2,
    avgScore: 89,
    totalEarnings: 3200,
  },
  {
    rank: 4,
    name: "Jake Oswald",
    school: "Austin Christian High",
    wins: 1,
    avgScore: 87,
    totalEarnings: 1890,
  },
  {
    rank: 5,
    name: "Elijah Thompson",
    school: "Liberty Christian",
    wins: 1,
    avgScore: 86,
    totalEarnings: 1500,
  },
  {
    rank: 6,
    name: "Grace Kim",
    school: "Faith Lutheran",
    wins: 0,
    avgScore: 84,
    totalEarnings: 0,
  },
  {
    rank: 7,
    name: "Noah Williams",
    school: "Heritage Christian",
    wins: 0,
    avgScore: 82,
    totalEarnings: 0,
  },
  {
    rank: 8,
    name: "Sophia Johnson",
    school: "Trinity Prep",
    wins: 0,
    avgScore: 80,
    totalEarnings: 0,
  },
];

const pastRounds = [
  {
    month: "February 2026",
    pool: 1773,
    placements: [
      { place: 1, name: "Sarah Chen", title: "FaithConnect - Community Platform", prize: 975, score: 92 },
      { place: 2, name: "David Park", title: "MentorMatch - Youth Mentorship", prize: 532, score: 91 },
      { place: 3, name: "Maria Garcia", title: "GiveBack - Micro-Volunteering", prize: 266, score: 89 },
    ],
  },
  {
    month: "January 2026",
    pool: 1620,
    placements: [
      { place: 1, name: "David Park", title: "MentorMatch v2", prize: 891, score: 93 },
      { place: 2, name: "Elijah Thompson", title: "StudyCircle - Group Learning", prize: 486, score: 88 },
      { place: 3, name: "Grace Kim", title: "WorshipFlow - Church Tech", prize: 243, score: 85 },
    ],
  },
  {
    month: "December 2025",
    pool: 1500,
    placements: [
      { place: 1, name: "Maria Garcia", title: "GiveBack - Micro-Volunteering", prize: 825, score: 90 },
      { place: 2, name: "Sarah Chen", title: "PrayerWall - Digital Board", prize: 450, score: 87 },
      { place: 3, name: "Noah Williams", title: "DataDash - Analytics Tool", prize: 225, score: 84 },
    ],
  },
];

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-300" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
  return (
    <span className="text-sm font-mono font-bold text-text-muted w-5 text-center">
      {rank}
    </span>
  );
};

export default function LeaderboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Leaderboard</h1>
        <p className="text-sm text-text-secondary mt-1">
          Top performers and past winners
        </p>
      </div>

      <Tabs
        tabs={[
          { id: "rankings", label: "Rankings", icon: <Trophy className="h-4 w-4" /> },
          { id: "winners", label: "Winners Archive", icon: <Star className="h-4 w-4" /> },
        ]}
      >
        {(activeTab) =>
          activeTab === "rankings" ? (
            <div className="space-y-6">
              {/* Top 3 Podium */}
              <div className="grid grid-cols-3 gap-4">
                {allTimeLeaders.slice(0, 3).map((leader, i) => (
                  <Card
                    key={leader.rank}
                    className={`text-center ${
                      i === 0
                        ? "bg-gradient-to-b from-yellow-500/5 to-transparent border-yellow-500/20 order-2 lg:-mt-4"
                        : i === 1
                          ? "bg-gradient-to-b from-gray-400/5 to-transparent border-gray-400/20 order-1"
                          : "bg-gradient-to-b from-amber-600/5 to-transparent border-amber-600/20 order-3"
                    }`}
                  >
                    <div className="flex justify-center mb-3">
                      {rankIcon(leader.rank)}
                    </div>
                    <Avatar
                      name={leader.name}
                      size="lg"
                      className="mx-auto"
                    />
                    <p className="text-sm font-semibold text-text-primary mt-3">
                      {leader.name}
                    </p>
                    <p className="text-xs text-text-muted">{leader.school}</p>
                    <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border-default">
                      <div className="text-center">
                        <p className="text-lg font-bold text-brand-500">
                          {leader.avgScore}
                        </p>
                        <p className="text-[10px] text-text-muted">Avg Score</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-bold text-text-primary">
                          {leader.wins}
                        </p>
                        <p className="text-[10px] text-text-muted">Wins</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Full Rankings Table */}
              <Card padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-default">
                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                          Rank
                        </th>
                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                          Member
                        </th>
                        <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                          School
                        </th>
                        <th className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                          Avg Score
                        </th>
                        <th className="text-center text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3">
                          Wins
                        </th>
                        <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                          Earnings
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTimeLeaders.map((leader) => (
                        <tr
                          key={leader.rank}
                          className="border-b border-border-subtle hover:bg-surface-card-hover transition-colors"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center">
                              {rankIcon(leader.rank)}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={leader.name} size="sm" />
                              <span className="text-sm font-medium text-text-primary">
                                {leader.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-text-secondary hidden sm:table-cell">
                            {leader.school}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="text-sm font-mono font-bold text-brand-500">
                              {leader.avgScore}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className="text-sm text-text-primary">
                              {leader.wins}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right text-sm font-medium text-text-primary hidden sm:table-cell">
                            {leader.totalEarnings > 0
                              ? `$${leader.totalEarnings.toLocaleString()}`
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              {pastRounds.map((round, i) => (
                <Card key={i}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-text-muted" />
                      <span className="text-sm font-bold text-text-primary">
                        {round.month}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-brand-500">
                      ${round.pool.toLocaleString()} pool
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {round.placements.map((p) => (
                      <div
                        key={p.place}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          p.place === 1
                            ? "bg-yellow-500/5 border border-yellow-500/20"
                            : "bg-surface-elevated border border-border-default"
                        }`}
                      >
                        {rankIcon(p.place)}
                        <Avatar name={p.name} size="sm" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text-primary truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {p.title} &bull; Score: {p.score}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-bold ${p.place === 1 ? "text-yellow-400" : "text-text-primary"}`}>
                            ${p.prize.toLocaleString()}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            {p.place === 1 ? "55%" : p.place === 2 ? "30%" : "15%"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )
        }
      </Tabs>
    </div>
  );
}
