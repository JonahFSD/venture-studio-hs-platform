"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Rocket,
  Trophy,
  Star,
  Download,
  Calendar,
  Flag,
  ExternalLink,
} from "lucide-react";

const flaggedStudents = [
  {
    id: "1",
    name: "Sarah Chen",
    school: "Grace Academy",
    graduation: 2027,
    avgScore: 94,
    wins: 3,
    submissions: 5,
    flaggedDate: "2026-02-15",
    notes:
      "Exceptional entrepreneur. Consistent top scorer with strong faith integration. Recommended for early admission pipeline.",
    flaggedBy: "Dr. Martinez",
  },
  {
    id: "2",
    name: "David Park",
    school: "Covenant Prep",
    graduation: 2027,
    avgScore: 91,
    wins: 2,
    submissions: 4,
    flaggedDate: "2026-01-20",
    notes:
      "Strong technical skills in AI/ML. MentorMatch project shows real product thinking. Consider for tech track.",
    flaggedBy: "Prof. Johnson",
  },
  {
    id: "3",
    name: "Maria Garcia",
    school: "Hope Academy",
    graduation: 2028,
    avgScore: 89,
    wins: 2,
    submissions: 3,
    flaggedDate: "2026-03-01",
    notes:
      "Social impact focus is exceptional. Leadership qualities evident in community engagement. Watch for scholarship consideration.",
    flaggedBy: "Dr. Martinez",
  },
  {
    id: "4",
    name: "Elijah Thompson",
    school: "Liberty Christian",
    graduation: 2028,
    avgScore: 86,
    wins: 1,
    submissions: 3,
    flaggedDate: "2026-03-10",
    notes:
      "Full-stack developer with strong technical chops. StudyCircle shows understanding of EdTech market.",
    flaggedBy: "Prof. Johnson",
  },
  {
    id: "5",
    name: "Grace Kim",
    school: "Faith Lutheran",
    graduation: 2029,
    avgScore: 84,
    wins: 0,
    submissions: 2,
    flaggedDate: "2026-03-20",
    notes:
      "Youngest flagged student. Design talent is remarkable. Early engagement recommended - could be a star by graduation.",
    flaggedBy: "Dr. Martinez",
  },
];

export default function PipelinePage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">
              Venture Studio Pipeline
            </h1>
            <Badge variant="brand">
              <Rocket className="h-3 w-3 mr-1" />
              {flaggedStudents.length} candidates
            </Badge>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            High-potential students flagged for ACU venture studio recruitment
          </p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
        >
          Export CSV
        </Button>
      </div>

      {/* Pipeline Cards */}
      <div className="space-y-4">
        {flaggedStudents.map((student) => (
          <Card key={student.id} hover>
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <div className="flex items-start gap-4 flex-1">
                <Avatar name={student.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-text-primary">
                      {student.name}
                    </h3>
                    <Badge variant="brand">
                      <Flag className="h-3 w-3 mr-1" />
                      Flagged
                    </Badge>
                  </div>
                  <p className="text-sm text-text-muted">
                    {student.school} &bull; Class of {student.graduation}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-6 mt-3">
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-brand-500" />
                      <span className="text-xs text-text-secondary">
                        Avg Score:{" "}
                        <span className="font-bold text-brand-500">
                          {student.avgScore}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-yellow-500" />
                      <span className="text-xs text-text-secondary">
                        {student.wins} wins
                      </span>
                    </div>
                    <div className="text-xs text-text-muted">
                      {student.submissions} submissions
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="mt-3 p-3 rounded-lg bg-surface-elevated border border-border-default">
                    <p className="text-xs text-text-muted mb-1">
                      Flagged by {student.flaggedBy} on {student.flaggedDate}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {student.notes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:flex-col">
                <Link href={`/members/${student.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                  >
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
