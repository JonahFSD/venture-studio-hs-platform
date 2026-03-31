"use client";

import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  MessageCircle,
  Handshake,
  Trophy,
  Video,
  Star,
  Calendar,
  MapPin,
  GraduationCap,
} from "lucide-react";

const memberSubmissions = [
  { title: "FaithConnect", score: 92, month: "Feb 2026", status: "Winner" },
  { title: "PrayerWall", score: 88, month: "Jan 2026", status: "Top 10%" },
  { title: "ChurchFinder", score: 85, month: "Dec 2025", status: "Finalist" },
];

export default function MemberProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/members"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Community
      </Link>

      {/* Profile Header */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-brand-500/10 to-brand-600/5" />
        <div className="relative pt-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <Avatar name="Sarah Chen" size="xl" className="ring-4 ring-surface-card" />
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-text-primary">
                  Sarah Chen
                </h1>
                <Badge variant="brand">
                  <Handshake className="h-3 w-3 mr-1" />
                  Looking for co-founders
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4" />
                  Grace Academy
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Class of 2027
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Austin, TX
                </span>
              </div>
            </div>
            <Button variant="brand" leftIcon={<MessageCircle className="h-4 w-4" />}>
              Message
            </Button>
          </div>

          <p className="mt-4 text-sm text-text-secondary leading-relaxed">
            Passionate about connecting faith communities through technology.
            I love building apps that make a difference in people&apos;s
            spiritual lives. Currently working on a social platform for young
            Christians and always looking for collaborators!
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {["React", "Python", "UI/UX", "Product Management", "Faith & Leadership"].map(
              (skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              )
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border-default">
            <div className="text-center">
              <p className="text-2xl font-bold text-text-primary">5</p>
              <p className="text-xs text-text-muted">Pitches</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-brand-500">94</p>
              <p className="text-xs text-text-muted">Avg Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">3</p>
              <p className="text-xs text-text-muted">Wins</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">$5.6k</p>
              <p className="text-xs text-text-muted">Earned</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Submissions */}
      <Card>
        <CardTitle>Pitch History</CardTitle>
        <div className="mt-4 space-y-3">
          {memberSubmissions.map((sub, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-xl border border-border-default hover:bg-surface-card-hover transition-colors"
            >
              <div className="p-2 rounded-lg bg-brand-500/10">
                <Video className="h-4 w-4 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">
                  {sub.title}
                </p>
                <p className="text-xs text-text-muted">{sub.month}</p>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={sub.score} size="sm" className="w-16" />
                <span className="text-sm font-mono text-brand-500">
                  {sub.score}
                </span>
                <Badge
                  variant={
                    sub.status === "Winner" ? "success" : "brand"
                  }
                >
                  {sub.status === "Winner" && (
                    <Trophy className="h-3 w-3 mr-1" />
                  )}
                  {sub.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
