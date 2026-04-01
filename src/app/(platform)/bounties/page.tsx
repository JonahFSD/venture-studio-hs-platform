"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CircleDollarSign,
  Clock,
  Users,
  Trophy,
  ExternalLink,
  Calendar,
  CheckCircle,
  Building2,
  ChevronRight,
  AlertCircle,
  Send,
  X,
  LinkIcon,
} from "lucide-react";

interface Bounty {
  id: string;
  title: string;
  description: string;
  founder: { name: string; company: string };
  amount: number;
  dueDate: string;
  status: "active" | "reviewing" | "completed";
  requirements: string[];
  submissionsCount: number;
  winner?: { id: string; name: string; teamSize: number };
}

const mockBounties: Bounty[] = [
  {
    id: "1",
    title: "Build a Church Check-In Kiosk App",
    description:
      "Design and develop a tablet-based check-in kiosk application for churches. The app should allow families to check in their children for Sunday school, print name badges, and notify parents via SMS when their child is checked out. Must support offline mode for churches with unreliable internet.",
    founder: { name: "Marcus Rivera", company: "FaithOps" },
    amount: 5000,
    dueDate: "2026-04-30",
    status: "active",
    requirements: [
      "React Native or Flutter for cross-platform tablet support",
      "Offline-first architecture with sync when connected",
      "SMS notification integration (Twilio or similar)",
      "Badge printing via Bluetooth thermal printer",
      "Admin dashboard for managing rooms and volunteers",
    ],
    submissionsCount: 3,
  },
  {
    id: "2",
    title: "AI-Powered Sermon Notes Summarizer",
    description:
      "Create a web app that takes a sermon audio recording or YouTube link as input and generates structured sermon notes with key scripture references, main points, and discussion questions for small groups. Should support batch processing for churches that want to generate notes for their sermon archive.",
    founder: { name: "Angela Brooks", company: "SermonCloud" },
    amount: 2500,
    dueDate: "2026-04-15",
    status: "active",
    requirements: [
      "Audio transcription using Whisper or similar",
      "LLM-based summarization with scripture extraction",
      "Export to PDF, Markdown, and email formats",
      "YouTube URL input support",
      "Clean, mobile-friendly UI",
    ],
    submissionsCount: 7,
  },
  {
    id: "3",
    title: "Donation Tracker Chrome Extension",
    description:
      "Build a Chrome extension that helps users track their charitable giving across multiple platforms (Tithe.ly, Pushpay, Venmo, PayPal, etc.) and generates a year-end giving summary for tax purposes. Should automatically detect donation confirmations on supported sites.",
    founder: { name: "James Whitfield", company: "GiveSmart" },
    amount: 1000,
    dueDate: "2026-05-15",
    status: "active",
    requirements: [
      "Chrome extension with Manifest V3",
      "Auto-detection of donation confirmation pages",
      "Secure local storage of giving data",
      "Year-end PDF report generation",
      "Support for at least 5 major giving platforms",
    ],
    submissionsCount: 1,
  },
  {
    id: "4",
    title: "Event Landing Page Generator",
    description:
      "Build a tool that lets church leaders create beautiful event landing pages with registration forms in under 5 minutes. No code required. Pages should be shareable, include calendar integration, and support ticket/donation collection via Stripe.",
    founder: { name: "Marcus Rivera", company: "FaithOps" },
    amount: 3500,
    dueDate: "2026-03-15",
    status: "completed",
    requirements: [
      "Drag-and-drop page builder with templates",
      "Stripe integration for tickets and donations",
      "Google Calendar / Apple Calendar integration",
      "Custom domain support",
      "Mobile-responsive output",
    ],
    submissionsCount: 12,
    winner: { id: "1", name: "Sarah Chen", teamSize: 2 },
  },
  {
    id: "5",
    title: "Youth Group Attendance Dashboard",
    description:
      "Create a simple dashboard for youth pastors to track weekly attendance, see trends over time, and identify students who haven't shown up in 2+ weeks. Include a parent notification feature for absences.",
    founder: { name: "Angela Brooks", company: "SermonCloud" },
    amount: 750,
    dueDate: "2026-02-28",
    status: "completed",
    requirements: [
      "Simple check-in interface (name search or QR code)",
      "Attendance trend charts and analytics",
      "Automated absence alerts to parents",
      "Export attendance reports as CSV",
      "Multi-group support (middle school, high school, etc.)",
    ],
    submissionsCount: 5,
    winner: { id: "4", name: "Jake Oswald", teamSize: 1 },
  },
  {
    id: "6",
    title: "Prayer Request Board Widget",
    description:
      "Build an embeddable widget that churches can add to their websites for anonymous or named prayer requests. Include a moderation queue for church staff and the ability for community members to indicate they are praying for a request.",
    founder: { name: "James Whitfield", company: "GiveSmart" },
    amount: 500,
    dueDate: "2026-01-31",
    status: "completed",
    requirements: [
      "Embeddable via iframe or script tag",
      "Moderation dashboard for church staff",
      "Anonymous and named request support",
      "'Praying for you' counter",
      "Email digest of new requests for prayer team",
    ],
    submissionsCount: 8,
    winner: { id: "2", name: "David Park", teamSize: 3 },
  },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(dateStr: string) {
  const now = new Date();
  const due = new Date(dateStr);
  const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function BountiesPage() {
  const [tab, setTab] = useState<"active" | "past">("active");
  const [selectedBounty, setSelectedBounty] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitNotes, setSubmitNotes] = useState("");

  const filtered = useMemo(() => {
    if (tab === "active") {
      return mockBounties.filter((b) => b.status === "active" || b.status === "reviewing");
    }
    return mockBounties.filter((b) => b.status === "completed");
  }, [tab]);

  const activeBounty = selectedBounty
    ? mockBounties.find((b) => b.id === selectedBounty)
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <CircleDollarSign className="h-6 w-6 text-brand-500" />
          Bounties
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Side projects from venture studio founders &bull; Build it, win the bounty
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <Button
          variant={tab === "active" ? "brand" : "outline"}
          size="sm"
          onClick={() => setTab("active")}
        >
          Active ({mockBounties.filter((b) => b.status === "active" || b.status === "reviewing").length})
        </Button>
        <Button
          variant={tab === "past" ? "brand" : "outline"}
          size="sm"
          onClick={() => setTab("past")}
        >
          Past ({mockBounties.filter((b) => b.status === "completed").length})
        </Button>
      </div>

      {/* Bounty List */}
      <div className="space-y-4">
        {filtered.map((bounty) => {
          const days = daysUntil(bounty.dueDate);
          const isExpanded = selectedBounty === bounty.id;

          return (
            <Card
              key={bounty.id}
              padding="none"
              className={`overflow-hidden transition-all ${
                isExpanded ? "border-brand-500/30" : ""
              }`}
            >
              {/* Summary Row */}
              <button
                onClick={() => setSelectedBounty(isExpanded ? null : bounty.id)}
                className="w-full text-left p-5 hover:bg-surface-card-hover transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Amount */}
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl bg-brand-500/10 border border-brand-500/20 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold text-brand-500">
                      ${bounty.amount >= 1000 ? `${(bounty.amount / 1000).toFixed(bounty.amount % 1000 === 0 ? 0 : 1)}k` : bounty.amount}
                    </span>
                    <span className="text-[10px] text-text-muted uppercase tracking-wider">
                      Bounty
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-text-primary">
                        {bounty.title}
                      </h3>
                      {bounty.status === "completed" && bounty.winner && (
                        <Badge variant="success">
                          <Trophy className="h-3 w-3 mr-1" />
                          Won by {bounty.winner.name}
                        </Badge>
                      )}
                      {bounty.status === "reviewing" && (
                        <Badge variant="warning">Reviewing</Badge>
                      )}
                    </div>

                    <p className="text-sm text-text-secondary line-clamp-2 mt-1">
                      {bounty.description}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-text-muted flex-wrap">
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {bounty.founder.name} · {bounty.founder.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Due {formatDate(bounty.dueDate)}
                      </span>
                      {bounty.status === "active" && (
                        <span
                          className={`flex items-center gap-1 ${
                            days <= 7 ? "text-warning" : days <= 0 ? "text-error" : ""
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {days > 0 ? `${days} days left` : "Overdue"}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Send className="h-3 w-3" />
                        {bounty.submissionsCount} submission{bounty.submissionsCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Expand Arrow */}
                  <ChevronRight
                    className={`h-5 w-5 text-text-muted flex-shrink-0 transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-border-default animate-slide-down">
                  <div className="p-5 space-y-5">
                    {/* Full Description */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2">
                        About This Bounty
                      </h4>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {bounty.description}
                      </p>
                    </div>

                    {/* Requirements */}
                    <div>
                      <h4 className="text-sm font-semibold text-text-primary mb-2">
                        Requirements
                      </h4>
                      <ul className="space-y-2">
                        {bounty.requirements.map((req, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <CheckCircle className="h-4 w-4 text-brand-500 flex-shrink-0 mt-0.5" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Founder Info */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-elevated border border-border-default">
                      <Avatar name={bounty.founder.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {bounty.founder.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {bounty.founder.company} · Venture Studio Founder
                        </p>
                      </div>
                    </div>

                    {/* Winner (if completed) */}
                    {bounty.status === "completed" && bounty.winner && (
                      <div className="p-4 rounded-xl bg-success/5 border border-success/20">
                        <div className="flex items-center gap-3">
                          <Trophy className="h-5 w-5 text-success" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-text-primary">
                              Winner: {bounty.winner.name}
                            </p>
                            <p className="text-xs text-text-muted">
                              {bounty.winner.teamSize === 1
                                ? "Solo submission"
                                : `Team of ${bounty.winner.teamSize}`}
                              {" · "}Awarded ${bounty.amount.toLocaleString()} + {(bounty.amount * 10).toLocaleString()} points
                            </p>
                          </div>
                          <Link href={`/members/${bounty.winner.id}`}>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Prize & Points Info */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/10 text-center">
                        <p className="text-2xl font-bold text-brand-500">
                          ${bounty.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-text-muted">Winner-takes-all prize</p>
                      </div>
                      <div className="p-3 rounded-xl bg-brand-500/5 border border-brand-500/10 text-center">
                        <p className="text-2xl font-bold text-brand-500">
                          +{(bounty.amount * 10).toLocaleString()}
                        </p>
                        <p className="text-xs text-text-muted">Points for the winner (10×$)</p>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    {bounty.status === "active" && (
                      <div className="flex items-center gap-3">
                        <Button
                          variant="brand"
                          className="flex-1"
                          leftIcon={<Send className="h-4 w-4" />}
                          onClick={() => setShowSubmitModal(true)}
                        >
                          Submit Your Work
                        </Button>
                        <p className="text-xs text-text-muted">
                          Solo or team submission
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <CircleDollarSign className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">
            {tab === "active"
              ? "No active bounties right now. Check back soon!"
              : "No past bounties yet."}
          </p>
        </Card>
      )}

      {/* Submit Modal */}
      {showSubmitModal && activeBounty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <Card className="w-full max-w-lg" padding="lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Submit for Bounty
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {activeBounty.title}
                </p>
              </div>
              <button
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
                  Submission Link *
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <input
                    type="url"
                    placeholder="https://github.com/your-repo or deployed URL"
                    value={submitUrl}
                    onChange={(e) => setSubmitUrl(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30"
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
                  className="w-full px-3 py-2 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-surface-elevated border border-border-default">
                <p className="text-xs text-text-muted">
                  <AlertCircle className="h-3 w-3 inline mr-1" />
                  You can submit as an individual or add team members after submitting, just like the standard pitch flow. The founder will review all submissions and select a single winner.
                </p>
              </div>

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
                  disabled={!submitUrl}
                  leftIcon={<Send className="h-4 w-4" />}
                >
                  Submit
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
