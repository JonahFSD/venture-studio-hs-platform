"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  User,
  GraduationCap,
  Heart,
  Lightbulb,
  Clock,
} from "lucide-react";
import Link from "next/link";

const mockApplications = [
  {
    id: "a1",
    name: "Emma Watson",
    email: "emma@example.com",
    age: 16,
    school: "Cornerstone Academy",
    graduation_year: 2028,
    faith_statement:
      "My faith is the foundation of everything I do. I believe God has given us the creativity and drive to solve problems and serve others through innovation...",
    entrepreneurship_interest:
      "I've been building small projects since I was 14 - from a school supply marketplace to a tutoring matchmaking app...",
    ai_interest:
      "I'm fascinated by how AI can amplify human creativity. I've experimented with ChatGPT for brainstorming and want to learn more about building AI-powered products...",
    status: "pending",
    created_at: "2026-03-27",
  },
  {
    id: "a2",
    name: "Liam Johnson",
    email: "liam@example.com",
    age: 15,
    school: "Faith Academy",
    graduation_year: 2029,
    faith_statement:
      "I grew up in a Christian household and my faith guides my decision-making...",
    entrepreneurship_interest:
      "I love solving problems. I started a lawn care business last summer and learned about marketing and customer service...",
    ai_interest:
      "AI is the future and I want to be part of building it responsibly...",
    status: "pending",
    created_at: "2026-03-26",
  },
  {
    id: "a3",
    name: "Olivia Brown",
    email: "olivia@example.com",
    age: 17,
    school: "Grace Christian School",
    graduation_year: 2027,
    faith_statement:
      "As a worship leader at my church, my faith is central to who I am...",
    entrepreneurship_interest:
      "I designed and sold custom phone cases online and managed social media for three local businesses...",
    ai_interest:
      "I use AI tools daily for design work and content creation...",
    status: "pending",
    created_at: "2026-03-25",
  },
];

export default function ApplicationsPage() {
  const [selectedApp, setSelectedApp] = useState<
    (typeof mockApplications)[0] | null
  >(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Applications</h1>
          <p className="text-sm text-text-secondary mt-1">
            Review and manage membership applications
          </p>
        </div>
        <Badge variant="warning" className="text-sm py-1 px-3">
          <Clock className="h-3.5 w-3.5 mr-1.5" />
          {mockApplications.length} pending
        </Badge>
      </div>

      <Tabs
        tabs={[
          { id: "pending", label: "Pending", count: 3 },
          { id: "approved", label: "Approved", count: 42 },
          { id: "rejected", label: "Rejected", count: 5 },
        ]}
      >
        {() => (
          <div className="space-y-4">
            {mockApplications.map((app) => (
              <Card key={app.id} padding="none">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-base font-semibold text-text-primary">
                          {app.name}
                        </h3>
                        <Badge variant="warning">Pending</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Age {app.age}
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="h-3 w-3" />
                          {app.school} ({app.graduation_year})
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied {app.created_at}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye className="h-4 w-4" />}
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewModalOpen(true);
                        }}
                      >
                        Review
                      </Button>
                    </div>
                  </div>

                  {/* Preview sections */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                    <div className="p-3 rounded-lg bg-surface-elevated">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1">
                        <Heart className="h-3 w-3" />
                        Faith
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {app.faith_statement}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-elevated">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1">
                        <Lightbulb className="h-3 w-3" />
                        Venture
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {app.entrepreneurship_interest}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-elevated">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1">
                        <Lightbulb className="h-3 w-3" />
                        AI Interest
                      </div>
                      <p className="text-xs text-text-secondary line-clamp-2">
                        {app.ai_interest}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Tabs>

      {/* Review Modal */}
      <Modal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title={`Review: ${selectedApp?.name}`}
        size="lg"
      >
        {selectedApp && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-text-muted">Age</span>
                <p className="font-medium text-text-primary">
                  {selectedApp.age}
                </p>
              </div>
              <div>
                <span className="text-text-muted">School</span>
                <p className="font-medium text-text-primary">
                  {selectedApp.school}
                </p>
              </div>
              <div>
                <span className="text-text-muted">Graduation</span>
                <p className="font-medium text-text-primary">
                  {selectedApp.graduation_year}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-surface-primary border border-border-default">
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                  Faith Statement
                </h4>
                <p className="text-sm text-text-secondary">
                  {selectedApp.faith_statement}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-primary border border-border-default">
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                  Entrepreneurship Interest
                </h4>
                <p className="text-sm text-text-secondary">
                  {selectedApp.entrepreneurship_interest}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-primary border border-border-default">
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                  AI Interest
                </h4>
                <p className="text-sm text-text-secondary">
                  {selectedApp.ai_interest}
                </p>
              </div>
            </div>

            <Textarea
              label="Review Notes (Internal)"
              placeholder="Add notes about this application..."
            />

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
              <Button
                variant="danger"
                leftIcon={<XCircle className="h-4 w-4" />}
                onClick={() => setReviewModalOpen(false)}
              >
                Reject
              </Button>
              <Button
                variant="brand"
                leftIcon={<CheckCircle className="h-4 w-4" />}
                onClick={() => setReviewModalOpen(false)}
              >
                Approve
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
