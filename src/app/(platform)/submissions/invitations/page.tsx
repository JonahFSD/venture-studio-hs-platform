"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Handshake,
  Users,
  Calendar,
  DollarSign,
  Shield,
  Inbox,
  Video,
} from "lucide-react";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import Link from "next/link";

const mockInvitations = [
  {
    id: "inv1",
    submission: {
      title: "GreenMind - Eco Education Platform",
      description:
        "An interactive learning platform that teaches sustainability through gamified lessons and real-world challenges.",
      month_year: "2026-04",
    },
    lead: { name: "Sarah Chen", school: "Grace Academy" },
    team: [
      { name: "Sarah Chen", role: "lead", splitPct: 50, status: "accepted" },
      { name: "Jake Oswald", role: "collaborator", splitPct: 30, status: "pending" },
      { name: "David Park", role: "collaborator", splitPct: 20, status: "accepted" },
    ],
    yourSplit: 30,
    created_at: "2026-03-28",
  },
  {
    id: "inv2",
    submission: {
      title: "PrayerPal - Daily Devotional App",
      description:
        "A mobile app that pairs users with prayer partners and delivers personalized daily devotionals.",
      month_year: "2026-04",
    },
    lead: { name: "Grace Kim", school: "Faith Lutheran" },
    team: [
      { name: "Grace Kim", role: "lead", splitPct: 40, status: "accepted" },
      { name: "Jake Oswald", role: "collaborator", splitPct: 35, status: "pending" },
      { name: "Maria Garcia", role: "collaborator", splitPct: 25, status: "pending" },
    ],
    yourSplit: 35,
    created_at: "2026-03-27",
  },
];

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState(mockInvitations);

  const handleAccept = (id: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== id));
  };

  const handleDecline = (id: string) => {
    setInvitations(invitations.filter((inv) => inv.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/submissions"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Submissions
      </Link>

      <PlatformPageHeader
        icon={Video}
        title="Team Invitations"
        description="Review and respond to collaboration requests"
        actions={
          invitations.length > 0 ? (
            <Badge variant="brand" className="text-sm py-1 px-3">
              {invitations.length} pending
            </Badge>
          ) : undefined
        }
      />

      {invitations.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-8 w-8" />}
          title="No pending invitations"
          description="You're all caught up! When someone invites you to collaborate on a pitch, it'll show up here."
        />
      ) : (
        <div className="space-y-6">
          {invitations.map((inv) => (
            <Card key={inv.id} padding="none" className="overflow-hidden">
              {/* Header */}
              <div className="p-5 border-b border-border-default">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-brand-500" />
                      <h3 className="text-base font-semibold text-text-primary">
                        {inv.submission.title}
                      </h3>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {inv.submission.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {inv.submission.month_year}
                      </span>
                      <span>
                        Invited by{" "}
                        <span className="text-text-secondary font-medium">
                          {inv.lead.name}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Split */}
              <div className="p-5 border-b border-border-default">
                <div className="flex items-center gap-2 mb-3">
                  <Handshake className="h-4 w-4 text-brand-500" />
                  <h4 className="text-sm font-semibold text-text-primary">
                    Proposed Revenue Split
                  </h4>
                </div>

                <div className="space-y-2">
                  {inv.team.map((member, i) => {
                    const isYou = member.name === "Jake Oswald";
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded-lg ${
                          isYou
                            ? "bg-brand-500/5 border border-brand-500/20"
                            : "bg-surface-elevated"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Avatar name={member.name} size="sm" />
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {member.name}
                              {isYou && (
                                <span className="text-brand-500 ml-1">
                                  (You)
                                </span>
                              )}
                            </p>
                          </div>
                          <Badge
                            variant={
                              member.role === "lead"
                                ? "brand"
                                : member.status === "accepted"
                                  ? "success"
                                  : "warning"
                            }
                          >
                            {member.role === "lead"
                              ? "Lead"
                              : member.status === "accepted"
                                ? "Accepted"
                                : "Pending"}
                          </Badge>
                        </div>
                        <span
                          className={`text-lg font-bold ${
                            isYou ? "text-brand-500" : "text-text-primary"
                          }`}
                        >
                          {member.splitPct}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 p-3 rounded-lg bg-warning/5 border border-warning/10">
                  <p className="text-xs text-text-secondary">
                    <Shield className="h-3 w-3 text-warning inline mr-1" />
                    <span className="font-medium text-warning">
                      Binding Agreement:
                    </span>{" "}
                    By accepting, you agree to receive{" "}
                    <span className="font-bold text-brand-500">
                      {inv.yourSplit}%
                    </span>{" "}
                    of any prize money won. This cannot be changed after the
                    pitch is submitted.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 flex items-center justify-end gap-3">
                <Button
                  variant="danger"
                  onClick={() => handleDecline(inv.id)}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Decline
                </Button>
                <Button
                  variant="brand"
                  onClick={() => handleAccept(inv.id)}
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                >
                  Accept Invitation
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
