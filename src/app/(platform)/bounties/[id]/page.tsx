"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { type Id } from "../../../../../convex/_generated/dataModel";
import { PaywallGate } from "@/components/auth/paywall-gate";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSign,
  Clock,
  Trophy,
  Calendar,
  CheckCircle,
  ArrowLeft,
  AlertCircle,
  Send,
  X,
  LinkIcon,
} from "lucide-react";

function formatBountyDate(epochMs: number) {
  const d = new Date(epochMs);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntilDue(epochMs: number) {
  const now = Date.now();
  return Math.ceil((epochMs - now) / (1000 * 60 * 60 * 24));
}

export default function BountyDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const bounty = useQuery(
    api.bounties.getById,
    id ? { bountyId: id as Id<"bounties"> } : "skip"
  );

  const submitSolution = useMutation(api.bounties.submitSolution);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitNotes, setSubmitNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Loading state
  if (bounty === undefined) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-circle border-2 border-brand-500 border-t-transparent" />
        </div>
      </div>
    );
  }

  // Not found
  if (!bounty) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <Card className="text-center py-12">
          <CircleDollarSign className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary mb-4">This bounty could not be found.</p>
          <Link href="/bounties">
            <Button variant="brand" size="sm">
              View all bounties
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const days = daysUntilDue(bounty.dueDate);

  return (
    <PaywallGate feature="submit for bounties">
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-text-primary">{bounty.title}</h1>
          {bounty.status === "completed" && (
            <Badge variant="success">
              <Trophy className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          )}
          {bounty.status === "needs_review" && (
            <Badge variant="warning">Pending Review</Badge>
          )}
          {bounty.status === "archived" && (
            <Badge variant="default">Archived</Badge>
          )}
          {bounty.status === "active" && (
            <Badge variant="brand">Open</Badge>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 text-sm text-text-secondary">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            Due {formatBountyDate(bounty.dueDate)}
          </span>
          {bounty.status === "active" && (
            <span
              className={`flex items-center gap-1 ${
                days <= 7 ? "text-warning" : days <= 0 ? "text-error" : ""
              }`}
            >
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              {days > 0 ? `${days} days left` : "Overdue"}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-sm font-semibold text-text-primary mb-3">About this bounty</h2>
            <p className="text-sm text-text-secondary leading-relaxed">{bounty.description}</p>
          </Card>

          <Card>
            <h2 className="text-sm font-semibold text-text-primary mb-3">Requirements</h2>
            <ul className="space-y-2">
              {bounty.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
                  {req}
                </li>
              ))}
            </ul>
          </Card>

          {/* Submissions list */}
          {bounty.submissions.length > 0 && (
            <Card>
              <h2 className="text-sm font-semibold text-text-primary mb-3">
                Submissions ({bounty.submissions.length})
              </h2>
              <ul className="space-y-3">
                {bounty.submissions.map((sub) => (
                  <li
                    key={sub._id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated"
                  >
                    <Avatar name={sub.user?.fullName ?? "Unknown"} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {sub.user?.fullName ?? "Unknown"}
                      </p>
                      {sub.user?.schoolName && (
                        <p className="text-xs text-text-muted">{sub.user.schoolName}</p>
                      )}
                    </div>
                    {sub.isWinner && (
                      <Badge variant="success" className="text-[10px]">
                        <Trophy className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="flex flex-col gap-4">
            <p className="text-3xl font-bold tabular-nums text-brand-500">
              ${bounty.bountyAmount.toLocaleString()}
            </p>
            <ul className="flex flex-col gap-1.5 text-sm text-text-secondary border-t border-border-default pt-4">
              <li className="flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5 text-brand-500" />
                {bounty.submissionsCount} submission{bounty.submissionsCount !== 1 ? "s" : ""}
              </li>
            </ul>
          </Card>

          <Card className="flex items-center gap-3">
            <Avatar name={bounty.founderName} size="sm" />
            <div>
              <p className="text-sm font-medium text-text-primary">{bounty.founderName}</p>
              <p className="text-xs text-text-muted">
                {bounty.founderCompany} · Venture Studio Founder
              </p>
            </div>
          </Card>

          {bounty.status === "active" && (
            <Button
              variant="brand"
              className="w-full"
              leftIcon={<Send className="h-4 w-4" />}
              onClick={() => setShowSubmitModal(true)}
            >
              Submit your work
            </Button>
          )}
        </div>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">Submit for bounty</h2>
                <p className="text-xs text-text-muted mt-0.5">{bounty.title}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  setSubmitUrl("");
                  setSubmitNotes("");
                }}
                className="p-1 rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <X className="h-5 w-5 text-text-muted" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Submission link *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="url"
                    placeholder="https://github.com/your-repo or deployed URL"
                    value={submitUrl}
                    onChange={(e) => setSubmitUrl(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">
                  Notes (optional)
                </label>
                <textarea
                  placeholder="Anything the founder should know about your submission..."
                  value={submitNotes}
                  onChange={(e) => setSubmitNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border-default">
                <p className="text-xs text-text-muted">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  You can submit as an individual or add team members after submitting, just like the
                  standard pitch flow. The founder will review all submissions and select a single
                  winner.
                </p>
              </div>

              {submitError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20">
                  <AlertCircle className="h-4 w-4 text-error flex-shrink-0" />
                  <p className="text-xs text-error">{submitError}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setShowSubmitModal(false);
                    setSubmitUrl("");
                    setSubmitNotes("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="brand"
                  className="flex-1"
                  disabled={!submitUrl || isSubmitting}
                  isLoading={isSubmitting}
                  leftIcon={<Send className="h-4 w-4" />}
                  onClick={async () => {
                    if (!submitUrl) return;
                    setIsSubmitting(true);
                    setSubmitError(null);
                    try {
                      await submitSolution({
                        bountyId: id as Id<"bounties">,
                        submissionUrl: submitUrl.trim(),
                        notes: submitNotes.trim() || undefined,
                      });
                      setShowSubmitModal(false);
                      setSubmitUrl("");
                      setSubmitNotes("");
                    } catch (err: unknown) {
                      setSubmitError(
                        err instanceof Error ? err.message : "Failed to submit"
                      );
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
    </PaywallGate>
  );
}
