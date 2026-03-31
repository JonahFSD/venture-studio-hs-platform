"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Users, MessageCircle, Filter, Handshake } from "lucide-react";

const mockMembers = [
  {
    id: "1",
    name: "Sarah Chen",
    school: "Grace Academy",
    bio: "Passionate about connecting faith communities through technology. Love building apps that make a difference.",
    skills: ["React", "Python", "UI/UX"],
    looking_for_cofounders: true,
    submissions_count: 5,
    wins: 3,
  },
  {
    id: "2",
    name: "David Park",
    school: "Covenant Prep",
    bio: "Future tech entrepreneur. Building AI-powered solutions for education and mentorship.",
    skills: ["Machine Learning", "Node.js", "Marketing"],
    looking_for_cofounders: true,
    submissions_count: 4,
    wins: 2,
  },
  {
    id: "3",
    name: "Maria Garcia",
    school: "Hope Academy",
    bio: "Social impact enthusiast. I believe technology can solve our biggest community challenges.",
    skills: ["Design", "Swift", "Leadership"],
    looking_for_cofounders: false,
    submissions_count: 3,
    wins: 2,
  },
  {
    id: "4",
    name: "Elijah Thompson",
    school: "Liberty Christian",
    bio: "Full-stack developer and aspiring founder. Interested in EdTech and productivity tools.",
    skills: ["TypeScript", "Go", "DevOps"],
    looking_for_cofounders: true,
    submissions_count: 3,
    wins: 1,
  },
  {
    id: "5",
    name: "Grace Kim",
    school: "Faith Lutheran",
    bio: "Designer and storyteller. I help startups communicate their vision through beautiful products.",
    skills: ["Figma", "Branding", "Content"],
    looking_for_cofounders: true,
    submissions_count: 2,
    wins: 0,
  },
  {
    id: "6",
    name: "Noah Williams",
    school: "Heritage Christian",
    bio: "Data nerd who loves finding patterns. Building tools for smart decision-making.",
    skills: ["Data Science", "SQL", "Analytics"],
    looking_for_cofounders: false,
    submissions_count: 2,
    wins: 0,
  },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [showCoFoundersOnly, setShowCoFoundersOnly] = useState(false);

  const filtered = mockMembers.filter((m) => {
    if (showCoFoundersOnly && !m.looking_for_cofounders) return false;
    if (
      search &&
      !m.name.toLowerCase().includes(search.toLowerCase()) &&
      !m.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Community</h1>
          <p className="text-sm text-text-secondary mt-1">
            {mockMembers.length} members &bull; Connect with fellow founders
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name or skill..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant={showCoFoundersOnly ? "brand" : "outline"}
          onClick={() => setShowCoFoundersOnly(!showCoFoundersOnly)}
          leftIcon={<Handshake className="h-4 w-4" />}
        >
          Looking for Co-Founders
        </Button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <Link key={member.id} href={`/members/${member.id}`}>
            <Card hover glow className="h-full">
              <div className="flex items-start gap-3 mb-4">
                <Avatar name={member.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-text-muted">{member.school}</p>
                  {member.looking_for_cofounders && (
                    <Badge variant="brand" className="mt-1">
                      <Handshake className="h-3 w-3 mr-1" />
                      Looking for co-founders
                    </Badge>
                  )}
                </div>
              </div>

              <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                {member.bio}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {member.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-border-default">
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{member.submissions_count} pitches</span>
                  <span>{member.wins} wins</span>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
