"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Search,
  MessageCircle,
  Handshake,
  Filter,
  X,
  ChevronDown,
  Brain,
} from "lucide-react";

const BQ_TYPES = ["Anchor", "Visionary", "Operator", "Catalyst", "Strategist", "Builder"];
const SKILLS = ["React", "Python", "UI/UX", "Machine Learning", "Node.js", "Marketing", "Design", "Swift", "Leadership", "TypeScript", "Go", "DevOps", "Figma", "Branding", "Content", "Data Science", "SQL", "Analytics"];
const STATES = ["TX", "CA", "FL", "VA", "WA", "OH", "GA"];
const GRAD_YEARS = [2025, 2026, 2027, 2028, 2029, 2030];

const mockMembers = [
  {
    id: "1",
    name: "Sarah Chen",
    school: "Grace Academy",
    state: "TX",
    gradYear: 2027,
    bio: "Passionate about connecting faith communities through technology. Love building apps that make a difference.",
    skills: ["React", "Python", "UI/UX"],
    looking_for_cofounders: true,
    submissions_count: 5,
    wins: 3,
    totalEarnings: 5670,
    avgScore: 94,
    bqType: "Visionary",
    networkCount: 12,
  },
  {
    id: "2",
    name: "David Park",
    school: "Covenant Prep",
    state: "CA",
    gradYear: 2027,
    bio: "Future tech entrepreneur. Building AI-powered solutions for education and mentorship.",
    skills: ["Machine Learning", "Node.js", "Marketing"],
    looking_for_cofounders: true,
    submissions_count: 4,
    wins: 2,
    totalEarnings: 3780,
    avgScore: 91,
    bqType: "Operator",
    networkCount: 8,
  },
  {
    id: "3",
    name: "Maria Garcia",
    school: "Hope Academy",
    state: "FL",
    gradYear: 2026,
    bio: "Social impact enthusiast. I believe technology can solve our biggest community challenges.",
    skills: ["Design", "Swift", "Leadership"],
    looking_for_cofounders: false,
    submissions_count: 3,
    wins: 2,
    totalEarnings: 3200,
    avgScore: 89,
    bqType: "Catalyst",
    networkCount: 6,
  },
  {
    id: "4",
    name: "Elijah Thompson",
    school: "Liberty Christian",
    state: "VA",
    gradYear: 2027,
    bio: "Full-stack developer and aspiring founder. Interested in EdTech and productivity tools.",
    skills: ["TypeScript", "Go", "DevOps"],
    looking_for_cofounders: true,
    submissions_count: 3,
    wins: 1,
    totalEarnings: 1500,
    avgScore: 86,
    bqType: "Strategist",
    networkCount: 4,
  },
  {
    id: "5",
    name: "Grace Kim",
    school: "Faith Lutheran",
    state: "WA",
    gradYear: 2028,
    bio: "Designer and storyteller. I help startups communicate their vision through beautiful products.",
    skills: ["Figma", "Branding", "Content"],
    looking_for_cofounders: true,
    submissions_count: 2,
    wins: 0,
    totalEarnings: 0,
    avgScore: 84,
    bqType: "Anchor",
    networkCount: 3,
  },
  {
    id: "6",
    name: "Noah Williams",
    school: "Heritage Christian",
    state: "OH",
    gradYear: 2025,
    bio: "Data nerd who loves finding patterns. Building tools for smart decision-making.",
    skills: ["Data Science", "SQL", "Analytics"],
    looking_for_cofounders: false,
    submissions_count: 2,
    wins: 0,
    totalEarnings: 0,
    avgScore: 82,
    bqType: "Builder",
    networkCount: 2,
  },
];

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCoFoundersOnly, setShowCoFoundersOnly] = useState(false);
  const [filterSkill, setFilterSkill] = useState("");
  const [filterBQ, setFilterBQ] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterGradYear, setFilterGradYear] = useState("");
  const [filterMinSubmissions, setFilterMinSubmissions] = useState("");
  const [filterMinWins, setFilterMinWins] = useState("");
  const [filterMinScore, setFilterMinScore] = useState("");
  const [filterMinEarnings, setFilterMinEarnings] = useState("");
  const [filterMaxEarnings, setFilterMaxEarnings] = useState("");

  const activeFilterCount = [
    filterSkill, filterBQ, filterState, filterGradYear,
    filterMinSubmissions, filterMinWins, filterMinScore,
    filterMinEarnings, filterMaxEarnings,
    showCoFoundersOnly ? "1" : "",
  ].filter(Boolean).length;

  const clearFilters = () => {
    setFilterSkill("");
    setFilterBQ("");
    setFilterState("");
    setFilterGradYear("");
    setFilterMinSubmissions("");
    setFilterMinWins("");
    setFilterMinScore("");
    setFilterMinEarnings("");
    setFilterMaxEarnings("");
    setShowCoFoundersOnly(false);
  };

  const filtered = useMemo(() => {
    return mockMembers.filter((m) => {
      if (showCoFoundersOnly && !m.looking_for_cofounders) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterSkill && !m.skills.includes(filterSkill)) return false;
      if (filterBQ && m.bqType !== filterBQ) return false;
      if (filterState && m.state !== filterState) return false;
      if (filterGradYear && m.gradYear !== Number(filterGradYear)) return false;
      if (filterMinSubmissions && m.submissions_count < Number(filterMinSubmissions)) return false;
      if (filterMinWins && m.wins < Number(filterMinWins)) return false;
      if (filterMinScore && (m.avgScore || 0) < Number(filterMinScore)) return false;
      if (filterMinEarnings && m.totalEarnings < Number(filterMinEarnings)) return false;
      if (filterMaxEarnings && m.totalEarnings > Number(filterMaxEarnings)) return false;
      return true;
    });
  }, [search, showCoFoundersOnly, filterSkill, filterBQ, filterState, filterGradYear, filterMinSubmissions, filterMinWins, filterMinScore, filterMinEarnings, filterMaxEarnings]);

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

      {/* Search & Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by name..."
            leftIcon={<Search className="h-4 w-4" />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant={showFilters ? "brand" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<Filter className="h-4 w-4" />}
        >
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-brand-500 text-black text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
        <Button
          variant={showCoFoundersOnly ? "brand" : "outline"}
          onClick={() => setShowCoFoundersOnly(!showCoFoundersOnly)}
          leftIcon={<Handshake className="h-4 w-4" />}
        >
          Co-Founders
        </Button>
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <Card className="animate-slide-down">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-brand-500 hover:text-brand-400 flex items-center gap-1"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Skill */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Skill</label>
              <select
                value={filterSkill}
                onChange={(e) => setFilterSkill(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary"
              >
                <option value="">All skills</option>
                {SKILLS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* BQ Type */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">BQ Type</label>
              <select
                value={filterBQ}
                onChange={(e) => setFilterBQ(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary"
              >
                <option value="">All types</option>
                {BQ_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* State */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">State</label>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary"
              >
                <option value="">All states</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Grad Year</label>
              <select
                value={filterGradYear}
                onChange={(e) => setFilterGradYear(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary"
              >
                <option value="">All years</option>
                {GRAD_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Min Submissions */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Min Submissions</label>
              <input
                type="number"
                min="0"
                placeholder="Any"
                value={filterMinSubmissions}
                onChange={(e) => setFilterMinSubmissions(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted"
              />
            </div>

            {/* Min Wins */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Min Wins</label>
              <input
                type="number"
                min="0"
                placeholder="Any"
                value={filterMinWins}
                onChange={(e) => setFilterMinWins(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted"
              />
            </div>

            {/* Min Avg AI Score */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">Min Avg AI Score</label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Any"
                value={filterMinScore}
                onChange={(e) => setFilterMinScore(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted"
              />
            </div>

            {/* $ Won Range */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1">$ Won (range)</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filterMinEarnings}
                  onChange={(e) => setFilterMinEarnings(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filterMaxEarnings}
                  onChange={(e) => setFilterMaxEarnings(e.target.value)}
                  className="w-full h-9 px-2 rounded-lg text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

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
                  <p className="text-xs text-text-muted">
                    {member.school} &bull; {member.state}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {member.looking_for_cofounders && (
                      <Badge variant="brand">
                        <Handshake className="h-3 w-3 mr-1" />
                        Co-founder
                      </Badge>
                    )}
                    {member.bqType && (
                      <span
                        role="link"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open("https://bq.austinchristianu.org/", "_blank");
                        }}
                      >
                        <Badge variant="outline" className="text-[10px] cursor-pointer">
                          <Brain className="h-3 w-3 mr-0.5" />
                          BQ: {member.bqType}
                        </Badge>
                      </span>
                    )}
                  </div>
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
                  <span>Score: {member.avgScore}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <Search className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">
            No members match your search and filters.
          </p>
        </Card>
      )}
    </div>
  );
}
