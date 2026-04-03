"use client";

import { Card } from "@/components/ui/card";
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
  Shield,
  Inbox,
  Video,
  Loader2,
} from "lucide-react";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useCurrentUser } from "@/contexts/user-context";

export default function InvitationsPage() {
  const currentUser = useCurrentUser();
  const invitations = useQuery(api.collaborators.listMyInvitations);
  const respond = useMutation(api.collaborators.respond);

  const handleAccept = async (collaboratorId: typeof invitations extends (infer T)[] | undefined ? T extends { _id: infer I } ? I : never : never) => {
    await respond({ collaboratorId, accept: true });
  };

  const handleDecline = async (collaboratorId: typeof invitations extends (infer T)[] | undefined ? T extends { _id: infer I } ? I : never : never) => {
    await respond({ collaboratorId, accept: false });
  };

  // Loading state
  if (invitations === undefined) {
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
        />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-text-muted" />
        </div>
      </div>
    );
  }

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
            <Card key={inv._id} padding="none" className="overflow-hidden">
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
                        {inv.submission.monthYear}
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
                  {inv.team.map((member) => {
                    const isYou = currentUser?.fullName === member.name;
                    return (
                      <div
                        key={member._id}
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
                      {inv.revenueSplitPct}%
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
                  onClick={() => handleDecline(inv._id)}
                  leftIcon={<XCircle className="h-4 w-4" />}
                >
                  Decline
                </Button>
                <Button
                  variant="brand"
                  onClick={() => handleAccept(inv._id)}
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
