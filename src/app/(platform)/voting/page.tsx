"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Vote,
  Clock,
  Play,
  CheckCircle2,
  ThumbsUp,
  Trophy,
  Users,
  Calendar,
} from "lucide-react";

const votableSubmissions = [
  {
    id: "1",
    title: "FaithConnect - Community Platform",
    description:
      "A social platform connecting young Christians through shared interests, bible study groups, and local events.",
    user: { name: "Sarah Chen", school: "Grace Academy" },
    score: 92,
    votes: 58,
    thumbnail: null,
  },
  {
    id: "2",
    title: "EcoTrack - Carbon Footprint Tracker",
    description:
      "A mobile app that helps teens track and reduce their carbon footprint through gamification and community challenges.",
    user: { name: "Jake Oswald", school: "Austin Christian High" },
    score: 87,
    votes: 34,
    thumbnail: null,
  },
  {
    id: "3",
    title: "MentorMatch - Youth Mentorship",
    description:
      "An AI-powered platform matching high school students with mentors in their areas of interest.",
    user: { name: "David Park", school: "Covenant Prep" },
    score: 91,
    votes: 45,
    thumbnail: null,
  },
  {
    id: "4",
    title: "GiveBack - Micro-Volunteering",
    description:
      "Find and complete short volunteering tasks in your local community in under an hour.",
    user: { name: "Maria Garcia", school: "Hope Academy" },
    score: 89,
    votes: 39,
    thumbnail: null,
  },
  {
    id: "5",
    title: "StudyCircle - Group Learning",
    description:
      "AI-facilitated study groups that match students by subject, level, and schedule.",
    user: { name: "Elijah Thompson", school: "Liberty Christian" },
    score: 86,
    votes: 27,
    thumbnail: null,
  },
];

export default function VotingPage() {
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
  const votesRemaining = 3 - votedIds.size;

  const handleVote = (id: string) => {
    if (votedIds.has(id)) {
      const next = new Set(votedIds);
      next.delete(id);
      setVotedIds(next);
    } else if (votesRemaining > 0) {
      setVotedIds(new Set([...votedIds, id]));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Monthly Voting
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Vote for the best pitches this month
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="brand" className="text-sm py-1 px-3">
            <Clock className="h-3.5 w-3.5 mr-1.5" />4 days remaining
          </Badge>
        </div>
      </div>

      {/* Voting Info */}
      <Card className="bg-gradient-to-r from-brand-500/5 to-transparent border-brand-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-brand-500/10">
              <Vote className="h-6 w-6 text-brand-500" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-primary">
                March 2026 Voting Round
              </h3>
              <p className="text-sm text-text-secondary">
                Top 10% of AI-scored submissions &bull; 5 pitches eligible
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-500">
                {votesRemaining}
              </p>
              <p className="text-xs text-text-muted">votes left</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">$1,890</p>
              <p className="text-xs text-text-muted">prize pool</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {votableSubmissions.map((sub) => {
          const hasVoted = votedIds.has(sub.id);
          return (
            <Card
              key={sub.id}
              padding="none"
              className={`overflow-hidden transition-all duration-300 ${
                hasVoted
                  ? "border-brand-500/40 shadow-glow"
                  : "hover:border-border-strong"
              }`}
            >
              {/* Video Thumbnail */}
              <div className="aspect-video bg-surface-elevated relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                    <Play className="h-6 w-6 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge
                    variant="brand"
                    className="backdrop-blur-sm bg-brand-500/80"
                  >
                    Score: {sub.score}
                  </Badge>
                </div>
              </div>

              <div className="p-5">
                {/* User */}
                <div className="flex items-center gap-2 mb-3">
                  <Avatar name={sub.user.name} size="sm" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {sub.user.name}
                    </p>
                    <p className="text-xs text-text-muted">{sub.user.school}</p>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-semibold text-text-primary mb-1">
                  {sub.title}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                  {sub.description}
                </p>

                {/* Vote Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{sub.votes + (hasVoted ? 1 : 0)} votes</span>
                  </div>
                  <Button
                    variant={hasVoted ? "brand" : "outline"}
                    size="sm"
                    onClick={() => handleVote(sub.id)}
                    disabled={!hasVoted && votesRemaining === 0}
                    leftIcon={
                      hasVoted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <ThumbsUp className="h-4 w-4" />
                      )
                    }
                  >
                    {hasVoted ? "Voted" : "Vote"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
