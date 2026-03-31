"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Crown,
  Star,
  MapPin,
  GraduationCap,
  Calendar,
  Trophy,
  Plus,
  Send,
  Info,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

// US States
const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
  "New Hampshire", "New Jersey", "New Mexico", "New York",
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
  "West Virginia", "Wisconsin", "Wyoming",
];

// Mock leadership data
const president = {
  name: "Sarah Chen",
  school: "Grace Academy",
  graduation: 2027,
  bio: "Leading our community with a passion for connecting faith and entrepreneurship. 3x monthly winner and top-ranked member.",
  avgScore: 94,
  wins: 3,
};

const vicePresident = {
  name: "David Park",
  school: "Covenant Prep",
  graduation: 2027,
  bio: "Driving innovation through AI and mentorship initiatives. Focused on building bridges between young entrepreneurs.",
  avgScore: 91,
  wins: 2,
};

// Mock ambassadors - only a few states filled
const filledAmbassadors: Record<string, { name: string; school: string; graduation: number }> = {
  "California": { name: "Maria Garcia", school: "Hope Academy", graduation: 2028 },
  "Florida": { name: "Elijah Thompson", school: "Liberty Christian", graduation: 2028 },
  "New York": { name: "Grace Kim", school: "Faith Lutheran", graduation: 2029 },
  "Texas": { name: "Noah Williams", school: "Heritage Christian", graduation: 2028 },
  "Georgia": { name: "Sophia Johnson", school: "Trinity Prep", graduation: 2029 },
  "Illinois": { name: "Liam Carter", school: "Cornerstone Academy", graduation: 2028 },
  "Ohio": { name: "Emma Davis", school: "Beacon Christian", graduation: 2029 },
  "Virginia": { name: "Aiden Brooks", school: "Covenant Christian", graduation: 2028 },
};

function LeaderCard({
  name,
  role,
  school,
  graduation,
  bio,
  avgScore,
  wins,
}: {
  name: string;
  role: string;
  school: string;
  graduation: number;
  bio: string;
  avgScore?: number;
  wins?: number;
}) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-brand-500/10 to-brand-600/5" />
      <div className="relative pt-8">
        <div className="flex flex-col items-center text-center">
          <Avatar name={name} size="xl" className="ring-4 ring-surface-card" />
          <div className="mt-3">
            <Badge
              variant="brand"
              className="mb-2 bg-brand-500/80 text-black font-bold"
            >
              <Crown className="h-3 w-3 mr-1" />
              {role}
            </Badge>
            <h3 className="text-lg font-bold text-text-primary">{name}</h3>
            <div className="flex items-center justify-center gap-3 mt-1 text-sm text-text-secondary">
              <span className="flex items-center gap-1">
                <GraduationCap className="h-3.5 w-3.5" />
                {school}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Class of {graduation}
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm text-text-secondary max-w-sm">
            {bio}
          </p>
          {(avgScore || wins) && (
            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border-default">
              {avgScore && (
                <div className="text-center">
                  <p className="text-xl font-bold text-brand-500">{avgScore}</p>
                  <p className="text-[10px] text-text-muted">Avg Score</p>
                </div>
              )}
              {wins !== undefined && (
                <div className="text-center">
                  <p className="text-xl font-bold text-yellow-500">{wins}</p>
                  <p className="text-[10px] text-text-muted">Wins</p>
                </div>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="mt-3"
            leftIcon={<MessageCircle className="h-3.5 w-3.5" />}
          >
            Message
          </Button>
        </div>
      </div>
    </Card>
  );
}

function AmbassadorCard({
  name,
  state,
  school,
  graduation,
}: {
  name: string;
  state: string;
  school: string;
  graduation: number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-border-default bg-surface-card hover:bg-surface-card-hover hover:border-border-strong transition-all">
      <Avatar name={name} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">
          {name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <Badge variant="brand" className="text-[10px]">
            <MapPin className="h-2.5 w-2.5 mr-0.5" />
            {state}
          </Badge>
          <span className="text-[10px] text-text-muted">
            {school} &apos;{String(graduation).slice(2)}
          </span>
        </div>
      </div>
      <Button variant="ghost" size="sm">
        <MessageCircle className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

function VacantAmbassadorCard({
  state,
  onApply,
}: {
  state: string;
  onApply: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border-default bg-surface-elevated/50 hover:border-brand-500/30 transition-all group">
      <div className="w-10 h-10 rounded-full border-2 border-dashed border-border-strong flex items-center justify-center text-text-muted group-hover:border-brand-500/40 group-hover:text-brand-500 transition-colors">
        <Plus className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-secondary truncate">
          {state}
        </p>
        <p className="text-[10px] text-text-muted">Ambassador needed</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onApply}
        className="text-brand-500 hover:text-brand-400"
      >
        <Plus className="h-3.5 w-3.5 mr-1" />
        Apply
      </Button>
    </div>
  );
}

export default function LeadershipPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyState, setApplyState] = useState("");
  const [applied, setApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = (state: string) => {
    setApplyState(state);
    setApplied(false);
    setApplyModalOpen(true);
  };

  const handleSubmitApplication = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setApplied(true);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Leadership</h1>
        <p className="text-sm text-text-secondary mt-1">
          Student leaders appointed by the venture studio
        </p>
      </div>

      {/* Eligibility Notice */}
      <Card className="bg-brand-500/5 border-brand-500/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-brand-500/10 flex-shrink-0">
            <Info className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-2">
              How Leadership Works
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              The venture studio appoints student community members for
              leadership positions in one-year terms based on engagement and
              performance on the platform.
            </p>
            <ul className="space-y-1.5 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <Crown className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                <span>
                  <span className="font-medium text-text-primary">
                    Seniors &amp; Juniors
                  </span>{" "}
                  &mdash; Eligible for President &amp; Vice President
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="h-4 w-4 text-brand-500 mt-0.5 flex-shrink-0" />
                <span>
                  <span className="font-medium text-text-primary">
                    Sophomores &amp; up
                  </span>{" "}
                  &mdash; Eligible for State Ambassador roles
                </span>
              </li>
              <li className="flex items-start gap-2">
                <GraduationCap className="h-4 w-4 text-text-tertiary mt-0.5 flex-shrink-0" />
                <span>
                  <span className="font-medium text-text-primary">
                    Freshmen
                  </span>{" "}
                  &mdash; Participate as community members (not yet eligible for
                  leadership)
                </span>
              </li>
            </ul>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-brand-500/10 text-xs text-text-muted">
              <Calendar className="h-3.5 w-3.5" />
              Interviews in November &bull; Announced in December &bull;
              Transition on January 1
            </div>
          </div>
        </div>
      </Card>

      {/* President & Vice President */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Crown className="h-5 w-5 text-yellow-500" />
          <h2 className="text-lg font-bold text-text-primary">Leadership</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LeaderCard
            name={president.name}
            role="President"
            school={president.school}
            graduation={president.graduation}
            bio={president.bio}
            avgScore={president.avgScore}
            wins={president.wins}
          />
          <LeaderCard
            name={vicePresident.name}
            role="Vice President"
            school={vicePresident.school}
            graduation={vicePresident.graduation}
            bio={vicePresident.bio}
            avgScore={vicePresident.avgScore}
            wins={vicePresident.wins}
          />
        </div>
      </div>

      {/* State Ambassadors */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-brand-500" />
            <h2 className="text-lg font-bold text-text-primary">
              State Ambassadors
            </h2>
          </div>
          <span className="text-xs text-text-muted">
            {Object.keys(filledAmbassadors).length} / {US_STATES.length} filled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {US_STATES.map((state) => {
            const ambassador = filledAmbassadors[state];
            if (ambassador) {
              return (
                <AmbassadorCard
                  key={state}
                  name={ambassador.name}
                  state={state}
                  school={ambassador.school}
                  graduation={ambassador.graduation}
                />
              );
            }
            return (
              <VacantAmbassadorCard
                key={state}
                state={state}
                onApply={() => handleApply(state)}
              />
            );
          })}
        </div>
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={
          applied
            ? "Application Submitted!"
            : `Apply for ${applyState} Ambassador`
        }
        size="lg"
      >
        {applied ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <p className="text-sm text-text-secondary">
              Your application for{" "}
              <span className="font-semibold text-text-primary">
                {applyState} Ambassador
              </span>{" "}
              has been submitted. The venture studio team will review your
              application and reach out during the November interview cycle.
            </p>
            <Button
              variant="brand"
              className="mt-6"
              onClick={() => setApplyModalOpen(false)}
            >
              Done
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-surface-elevated border border-border-default">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-brand-500" />
                <span className="font-medium text-text-primary">
                  {applyState}
                </span>
                <Badge variant="brand">Ambassador</Badge>
              </div>
            </div>

            <p className="text-sm text-text-secondary">
              As a State Ambassador, you&apos;ll represent the ACU Youth Venture
              community in your state, recruit new members, organize local
              events, and serve as a liaison between your region and the
              leadership team.
            </p>

            <Textarea
              label="Why do you want to represent this state?"
              placeholder="Tell us about your connection to this state and why you'd be a great ambassador..."
              rows={4}
              required
            />

            <Textarea
              label="Leadership experience"
              placeholder="Describe any relevant leadership, community involvement, or entrepreneurial experience..."
              rows={3}
              required
            />

            <Input
              label="City / Metro Area"
              placeholder="e.g., Austin, Dallas, Houston"
              required
            />

            <div className="p-3 rounded-lg bg-warning/5 border border-warning/10 text-xs text-text-secondary">
              <span className="font-medium text-warning">Note:</span>{" "}
              Sophomores and above are eligible for Ambassador roles. Applications
              are reviewed during the November interview cycle, announced in
              December, and new ambassadors begin their term on January 1.
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
              <Button
                variant="ghost"
                onClick={() => setApplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="brand"
                onClick={handleSubmitApplication}
                isLoading={isSubmitting}
                leftIcon={<Send className="h-4 w-4" />}
              >
                Submit Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
