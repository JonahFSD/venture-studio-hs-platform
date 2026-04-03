"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Rocket,
  Star,
  Download,
  Flag,
  ExternalLink,
  Shield,
} from "lucide-react";

export default function PipelinePage() {
  const flaggedStudents = useQuery(api.admin.getFlaggedStudents);

  if (flaggedStudents === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm text-text-secondary">Loading pipeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <PlatformPageHeader
        icon={Shield}
        title={
          <span className="inline-flex items-center gap-3 flex-wrap">
            <span>Venture Studio Pipeline</span>
            <Badge variant="brand">
              <Rocket className="h-3 w-3 mr-1" />
              {flaggedStudents.length} candidates
            </Badge>
          </span>
        }
        description="High-potential students flagged for ACU venture studio recruitment"
        actions={
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export CSV
          </Button>
        }
      />

      {flaggedStudents.length === 0 ? (
        <Card padding="lg" className="text-center">
          <p className="text-text-muted">No students have been flagged yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {flaggedStudents.map((flag) => (
            <Card key={flag._id} hover>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar name={flag.student?.fullName ?? "Unknown"} size="lg" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-base font-semibold text-text-primary">
                        {flag.student?.fullName ?? "Unknown Student"}
                      </h3>
                      <Badge variant="brand">
                        <Flag className="h-3 w-3 mr-1" />
                        Flagged
                      </Badge>
                    </div>
                    <p className="text-sm text-text-muted">
                      {flag.student?.schoolName ?? "Unknown School"}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-6 mt-3">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-brand-500" />
                        <span className="text-xs text-text-secondary">
                          Points:{" "}
                          <span className="font-bold text-brand-500">
                            {(flag.student?.points ?? 0).toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="text-xs text-text-muted">
                        {flag.submissionCount} submissions
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="mt-3 p-3 rounded-lg bg-surface-elevated border border-border-default">
                      <p className="text-xs text-text-muted mb-1">
                        Flagged by {flag.adminName} on{" "}
                        {new Date(flag._creationTime).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {flag.notes}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:flex-col">
                  {flag.student && (
                    <Link href={`/members/${flag.student._id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                      >
                        View Profile
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
