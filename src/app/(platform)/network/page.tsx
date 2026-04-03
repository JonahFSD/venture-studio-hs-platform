"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card } from "@/components/ui/card";
import { InfoCallout } from "@/components/ui/info-callout";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { cn } from "@/lib/utils";
import {
  BQ_TYPES,
  GRAD_YEARS,
  SKILLS,
  STATES,
} from "@/lib/community-filter.constants";
import {
  Network,
  Search,
  Handshake,
  Filter,
  X,
  Info,
} from "lucide-react";

export default function NetworkPage() {
  const membersRaw = useQuery(api.users.listMembers, {});

  const members = useMemo(() => {
    if (!membersRaw) return [];
    return membersRaw.map((m) => ({
      id: m._id,
      name: m.fullName,
      school: m.schoolName ?? "",
      state: m.state ?? "",
      gradYear: m.graduationYear ?? 0,
      skills: m.skills ?? [],
      looking_for_cofounders: m.lookingForCofounders ?? false,
      bqType: m.bqType ?? "",
      points: m.points ?? 0,
    }));
  }, [membersRaw]);

  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showCoFoundersOnly, setShowCoFoundersOnly] = useState(false);
  const [filterSkills, setFilterSkills] = useState<string[]>([]);
  const [filterBQTypes, setFilterBQTypes] = useState<string[]>([]);
  const [filterStates, setFilterStates] = useState<string[]>([]);
  const [filterGradYears, setFilterGradYears] = useState<string[]>([]);
  const [filterMinPoints, setFilterMinPoints] = useState("");
  const [filterMaxPoints, setFilterMaxPoints] = useState("");

  const activeFilterCount =
    filterSkills.length +
    filterBQTypes.length +
    filterStates.length +
    filterGradYears.length +
    (filterMinPoints ? 1 : 0) +
    (filterMaxPoints ? 1 : 0) +
    (showCoFoundersOnly ? 1 : 0);

  const clearFilters = () => {
    setFilterSkills([]);
    setFilterBQTypes([]);
    setFilterStates([]);
    setFilterGradYears([]);
    setFilterMinPoints("");
    setFilterMaxPoints("");
    setShowCoFoundersOnly(false);
  };

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (showCoFoundersOnly && !m.looking_for_cofounders) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (
        filterSkills.length > 0 &&
        !filterSkills.some((s) => m.skills.includes(s))
      ) {
        return false;
      }
      if (filterBQTypes.length > 0 && !filterBQTypes.includes(m.bqType)) {
        return false;
      }
      if (filterStates.length > 0 && !filterStates.includes(m.state)) {
        return false;
      }
      if (
        filterGradYears.length > 0 &&
        !filterGradYears.includes(String(m.gradYear))
      ) {
        return false;
      }
      if (filterMinPoints && m.points < Number(filterMinPoints)) return false;
      if (filterMaxPoints && m.points > Number(filterMaxPoints)) return false;
      return true;
    });
  }, [
    members,
    search,
    showCoFoundersOnly,
    filterSkills,
    filterBQTypes,
    filterStates,
    filterGradYears,
    filterMinPoints,
    filterMaxPoints,
  ]);

  // Loading state
  if (membersRaw === undefined) {
    return (
      <div className="space-y-6 animate-fade-in">
        <PlatformPageHeader
          icon={Network}
          title="Network"
          description="Loading..."
        />
        <Card className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            <p className="text-sm text-text-secondary">Loading network...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <PlatformPageHeader
        icon={Network}
        title="Network"
        description={`${members.length} members • Build relationships with fellow founders`}
      />

      <InfoCallout>
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-secondary">
              When you and another member have each exchanged at least{" "}
              <strong className="text-text-primary">10 DMs</strong>, you&apos;re
              automatically added to each other&apos;s network. Each new
              connection earns you{" "}
              <strong className="text-brand-500">50 points</strong>.
            </p>
          </div>
        </div>
      </InfoCallout>

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
      </div>

      {showFilters && (
        <Card className="animate-slide-down">
          {activeFilterCount > 0 && (
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-brand-500 hover:text-brand-400"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <MultiSelectDropdown
              label="Skill"
              options={SKILLS}
              value={filterSkills}
              onChange={setFilterSkills}
              emptyLabel="All skills"
            />

            <MultiSelectDropdown
              label="BQ Type"
              options={BQ_TYPES}
              value={filterBQTypes}
              onChange={setFilterBQTypes}
              emptyLabel="All types"
            />

            <MultiSelectDropdown
              label="State"
              options={STATES}
              value={filterStates}
              onChange={setFilterStates}
              emptyLabel="All states"
            />

            <MultiSelectDropdown
              label="Grad Year"
              options={GRAD_YEARS.map(String)}
              value={filterGradYears}
              onChange={setFilterGradYears}
              emptyLabel="All years"
            />

            <div className="flex flex-col">
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Points
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filterMinPoints}
                  onChange={(e) => setFilterMinPoints(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border-default bg-surface-elevated px-2 text-sm text-text-primary placeholder:text-text-primary"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filterMaxPoints}
                  onChange={(e) => setFilterMaxPoints(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border-default bg-surface-elevated px-2 text-sm text-text-primary placeholder:text-text-primary"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="mb-1 block text-xs font-medium text-text-muted">
                Open to Cofounders
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={showCoFoundersOnly}
                aria-label="Open to Cofounders"
                onClick={() => setShowCoFoundersOnly((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setShowCoFoundersOnly((v) => !v);
                  }
                }}
                className={cn(
                  "relative h-9 w-[3.75rem] shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
                  showCoFoundersOnly
                    ? "border-brand-500 bg-brand-500/15"
                    : "border-border-default bg-surface-elevated"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none absolute left-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface-card shadow-sm transition-transform duration-200",
                    showCoFoundersOnly
                      ? "translate-x-7 text-brand-500"
                      : "translate-x-0 text-white"
                  )}
                >
                  <Handshake className="h-4 w-4" aria-hidden />
                </span>
              </button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filtered.map((person) => (
          <Link key={person.id} href={`/members/${person.id}`}>
            <Card hover glow padding="sm" className="h-full">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <Avatar name={person.name} size="lg" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {person.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {person.school}{person.state ? ` \u2022 ${person.state}` : ""}
                    </p>
                    <div
                      className="mt-2 border-t border-border-default pt-2 space-y-1"
                      role="presentation"
                    >
                      <p className="text-xs text-text-muted tabular-nums">
                        Points: {person.points.toLocaleString()}
                      </p>
                      {person.bqType && (
                        <p className="text-xs text-text-muted tabular-nums">
                          BQ: {person.bqType}
                        </p>
                      )}
                      {person.gradYear > 0 && (
                        <p className="text-xs text-text-muted tabular-nums">
                          Class of {person.gradYear}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                {person.looking_for_cofounders && (
                  <span
                    className="shrink-0 text-brand-500"
                    aria-label="Open to co-founders"
                    title="Open to co-founders"
                  >
                    <Handshake className="h-4 w-4" />
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <Search className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">
            {search || activeFilterCount > 0
              ? "No members match your search and filters."
              : "No members found."}
          </p>
        </Card>
      )}
    </div>
  );
}
