"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { PaywallGate } from "@/components/auth/paywall-gate";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { InfoCallout } from "@/components/ui/info-callout";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { cn } from "@/lib/utils";
import {
  platformPaneBleedClass,
  platformPaneCellPaddingClass,
  platformPaneGridCellFillClass,
  platformPaneGridHangingCellBottomClass,
  platformPaneGridPartialHairlineClass,
  platformPaneGridPartialRowTailFillClass,
  platformPaneGridRowFullClass,
  platformPaneGridRowPartialClass,
  platformPaneGridRowsStackClass,
  platformPaneTileClass,
} from "@/lib/platform-pane-grid";
import {
  BQ_TYPES,
  GRAD_YEARS,
  SKILLS,
  STATES,
} from "@/lib/community-filter.constants";
import { useCommunityMembersFilters } from "@/contexts/community-members-filters-context";
import {
  COMMUNITY_MEMBERS_GRID_BREAKPOINTS,
  chunkIntoRows,
  isLastRowCell,
  paneGridCellFractionStyle,
  useResponsiveGridColumnCount,
} from "@/lib/responsive-grid-columns";
import { Search, Handshake, Info, Link2 } from "lucide-react";

/** e.g. 2027 → '27 */
function formatGradYearShort(year: number): string {
  if (year <= 0) return "";
  const yy = year % 100;
  return `'${String(yy).padStart(2, "0")}`;
}

function formatSchoolYearRow(school: string, gradYear: number): string {
  const s = school.trim();
  const y = formatGradYearShort(gradYear);
  if (!s && !y) return "";
  if (!y) return s;
  if (!s) return y;
  return `${s} | ${y}`;
}

/** e.g. Minneapolis + MN → "Minneapolis, MN"; state-only still shown */
function formatCityStateLine(city: string, state: string): string | null {
  const c = city.trim();
  const st = state.trim();
  if (c && st) return `${c}, ${st}`;
  if (st) return st;
  if (c) return c;
  return null;
}

export default function MembersPage() {
  const rawMembers = useQuery(api.users.listMembers, {});

  const {
    search,
    showFilters,
    networkView,
    showCoFoundersOnly,
    filterSkills,
    setFilterSkills,
    filterBQTypes,
    setFilterBQTypes,
    filterStates,
    setFilterStates,
    filterGradYears,
    setFilterGradYears,
    filterMinScore,
    setFilterMinScore,
    filterMaxScore,
    setFilterMaxScore,
    filterMinPoints,
    setFilterMinPoints,
    filterMaxPoints,
    setFilterMaxPoints,
    filterMinMemberMonths,
    setFilterMinMemberMonths,
    filterMaxMemberMonths,
    setFilterMaxMemberMonths,
    setNetworkView,
    setShowCoFoundersOnly,
    activeFilterCount,
  } = useCommunityMembersFilters();

  const members = (rawMembers ?? []).map((m) => ({
    id: m._id,
    name: m.fullName,
    school: m.schoolName ?? "",
    city: m.city ?? "",
    state: m.state ?? "",
    gradYear: m.graduationYear ?? 0,
    bio: m.bio ?? "",
    skills: m.skills ?? [],
    looking_for_cofounders: m.lookingForCofounders,
    avgScore: 0,
    bqType: m.bqType ?? "",
    networkCount: m.networkCount ?? 0,
    points: m.points ?? 0,
    monthsAsMember: 0,
    isInNetwork: false,
    avatarUrl: m.avatarUrl ?? null,
  }));

  const networkMembers = useMemo(
    () => members.filter((m) => m.isInNetwork),
    [members]
  );

  const filtered = useMemo(() => {
    const base = networkView === "network" ? networkMembers : members;
    return base.filter((m) => {
      if (showCoFoundersOnly && !m.looking_for_cofounders) return false;
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      if (
        filterSkills.length > 0 &&
        !filterSkills.some((s) => m.skills.includes(s))
      )
        return false;
      if (filterBQTypes.length > 0 && !filterBQTypes.includes(m.bqType))
        return false;
      if (filterStates.length > 0 && !filterStates.includes(m.state))
        return false;
      if (
        filterGradYears.length > 0 &&
        !filterGradYears.includes(String(m.gradYear))
      )
        return false;
      if (filterMinScore && (m.avgScore || 0) < Number(filterMinScore))
        return false;
      if (filterMaxScore && (m.avgScore || 0) > Number(filterMaxScore))
        return false;
      if (filterMinPoints && m.points < Number(filterMinPoints)) return false;
      if (filterMaxPoints && m.points > Number(filterMaxPoints)) return false;
      if (
        filterMinMemberMonths &&
        m.monthsAsMember < Number(filterMinMemberMonths)
      )
        return false;
      if (
        filterMaxMemberMonths &&
        m.monthsAsMember > Number(filterMaxMemberMonths)
      )
        return false;
      return true;
    });
  }, [
    members,
    networkMembers,
    networkView,
    search,
    showCoFoundersOnly,
    filterSkills,
    filterBQTypes,
    filterStates,
    filterGradYears,
    filterMinScore,
    filterMaxScore,
    filterMinPoints,
    filterMaxPoints,
    filterMinMemberMonths,
    filterMaxMemberMonths,
  ]);

  const gridCols = useResponsiveGridColumnCount(COMMUNITY_MEMBERS_GRID_BREAKPOINTS);
  const memberRows = useMemo(
    () => chunkIntoRows(filtered, gridCols),
    [filtered, gridCols]
  );

  if (rawMembers === undefined) {
    return (
      <div
        className={cn("overflow-hidden rounded-none", platformPaneBleedClass)}
      >
          <div className={platformPaneGridRowsStackClass}>
            {chunkIntoRows(Array.from({ length: 8 }), gridCols).map(
              (row, rowIndex) => {
                const isPartial = row.length < gridCols;
                const rowKey = `sk-${rowIndex}`;
                const cells = row.map((_, i) => (
                  <div
                    key={`${rowKey}-${i}`}
                    className={cn("min-w-0", platformPaneGridCellFillClass)}
                    style={
                      isPartial ? paneGridCellFractionStyle(gridCols) : undefined
                    }
                  >
                    <Card
                      padding="none"
                      className={cn(
                        platformPaneTileClass,
                        "h-24 animate-pulse p-4 md:p-6 lg:p-8"
                      )}
                    />
                  </div>
                ));
                if (isPartial) {
                  return (
                    <div key={rowKey} className={platformPaneGridRowPartialClass}>
                      {cells.flatMap((node, i) =>
                        i === 0
                          ? [node]
                          : [
                              <div
                                key={`${rowKey}-v-${i}`}
                                className={platformPaneGridPartialHairlineClass}
                                aria-hidden
                              />,
                              node,
                            ]
                      )}
                      <div
                        key={`${rowKey}-v-end`}
                        className={platformPaneGridPartialHairlineClass}
                        aria-hidden
                      />
                      <div
                        className={platformPaneGridPartialRowTailFillClass}
                        aria-hidden
                      />
                    </div>
                  );
                }
                return (
                  <div
                    key={rowKey}
                    className={platformPaneGridRowFullClass}
                    style={{
                      gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                    }}
                  >
                    {cells}
                  </div>
                );
              }
            )}
          </div>
      </div>
    );
  }

  return (
    <PaywallGate feature="view the member directory">
    <div className="space-y-6">
      {networkView === "network" && (
        <InfoCallout>
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-text-secondary">
              When you and another member have each exchanged at least{" "}
              <strong className="text-text-primary">10 DMs</strong>, you&apos;re
              automatically added to each other&apos;s network. Each new
              connection earns you{" "}
              <strong className="text-brand-500">50 points</strong>.
            </p>
          </div>
        </InfoCallout>
      )}

      {showFilters ? (
        <Card className="animate-slide-down">
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
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Avg AI Score
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Min"
                  value={filterMinScore}
                  onChange={(e) => setFilterMinScore(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border-default bg-surface-elevated px-2 text-sm text-text-primary placeholder:text-text-primary"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Max"
                  value={filterMaxScore}
                  onChange={(e) => setFilterMaxScore(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border-default bg-surface-elevated px-2 text-sm text-text-primary placeholder:text-text-primary"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="mb-1 block text-xs font-medium text-text-muted">
                Months on Platform
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={filterMinMemberMonths}
                  onChange={(e) => setFilterMinMemberMonths(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border-default bg-surface-elevated px-2 text-sm text-text-primary placeholder:text-text-primary"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={filterMaxMemberMonths}
                  onChange={(e) => setFilterMaxMemberMonths(e.target.value)}
                  className="h-9 w-full rounded-lg border border-border-default bg-surface-elevated px-2 text-sm text-text-primary placeholder:text-text-primary"
                />
              </div>
            </div>

            <div className="flex flex-row flex-wrap items-end gap-4 sm:gap-6">
              <div className="flex flex-col">
                <span className="mb-1 block text-xs font-medium text-text-muted">
                  My network only
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={networkView === "network"}
                  aria-label="Show only members in my network"
                  onClick={() =>
                    setNetworkView(
                      networkView === "network" ? "all" : "network"
                    )
                  }
                  title={
                    networkView === "network"
                      ? "Showing only your network"
                      : "Show all members"
                  }
                  className={cn(
                    "relative h-9 w-[3.75rem] shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
                    networkView === "network"
                      ? "border-brand-500 bg-brand-500/15"
                      : "border-border-default bg-surface-elevated"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute left-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface-card shadow-sm transition-transform duration-200",
                      networkView === "network"
                        ? "translate-x-7 text-brand-500"
                        : "translate-x-0 text-white"
                    )}
                  >
                    <Link2 className="h-4 w-4" aria-hidden />
                  </span>
                </button>
              </div>
              <div className="flex flex-col">
                <span className="mb-1 block text-xs font-medium text-text-muted">
                  Open to cofounders
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={showCoFoundersOnly}
                  aria-label="Open to cofounders"
                  onClick={() =>
                    setShowCoFoundersOnly(!showCoFoundersOnly)
                  }
                  className={cn(
                    "relative h-9 w-[3.75rem] shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40",
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
          </div>
        </Card>
      ) : null}

      <div
        className={cn("overflow-hidden rounded-none", platformPaneBleedClass)}
      >
        {filtered.length === 0 ? (
          <div
            className={cn(
              platformPaneCellPaddingClass,
              platformPaneGridCellFillClass,
              "py-12 text-center"
            )}
          >
            <Search className="h-10 w-10 text-text-muted mx-auto mb-3" />
            <p className="text-sm text-text-secondary">
              {search || activeFilterCount > 0
                ? "No members match your search and filters."
                : networkView === "network"
                  ? "No one in your network yet. Exchange 10+ DMs with a member to connect."
                  : "No members found."}
            </p>
          </div>
        ) : (
          <div className={platformPaneGridRowsStackClass}>
            {memberRows.map((row, rowIndex) => {
              const isPartial = row.length < gridCols;
              const rowKey = `${rowIndex}-${String(row[0]!.id)}`;

              const cells = row.map((member, i) => {
                const index = rowIndex * gridCols + i;
                const schoolYearLine = formatSchoolYearRow(
                  member.school,
                  member.gradYear
                );
                const cityStateLine = formatCityStateLine(
                  member.city,
                  member.state
                );
                return (
                  <div
                    key={member.id as string}
                    className={cn(
                      "min-w-0",
                      platformPaneGridCellFillClass,
                      isLastRowCell(index, filtered.length, gridCols) &&
                        platformPaneGridHangingCellBottomClass
                    )}
                    style={
                      isPartial ? paneGridCellFractionStyle(gridCols) : undefined
                    }
                  >
                    <Link href={`/community/${member.id}`} className="block h-full">
                      <Card
                        hover
                        padding="none"
                        className={cn(
                          platformPaneTileClass,
                          "h-full p-4 md:p-6 lg:p-8"
                        )}
                      >
                        <div className="flex flex-col gap-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="grid min-w-0 flex-1 grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                              <div
                                className={cn(
                                  "flex items-stretch justify-center",
                                  member.bqType ? "row-span-3" : "row-span-2"
                                )}
                              >
                                <div className="aspect-square h-full w-auto shrink-0">
                                  <Avatar
                                    src={member.avatarUrl}
                                    name={member.name}
                                    size="lg"
                                    className="!h-full !w-full !max-w-none aspect-square min-h-0"
                                  />
                                </div>
                              </div>
                              <p className="col-start-2 min-w-0 truncate text-sm font-semibold text-text-primary">
                                {member.name}
                              </p>
                              <p className="col-start-2 text-xs text-text-muted tabular-nums">
                                {member.points.toLocaleString()} pts
                              </p>
                              {member.bqType ? (
                                <p className="col-start-2 text-xs text-text-muted tabular-nums">
                                  {member.bqType}
                                </p>
                              ) : null}
                            </div>
                            <div className="flex shrink-0 flex-col items-center gap-1 self-start">
                              {member.looking_for_cofounders && (
                                <span
                                  className="text-brand-500"
                                  aria-label="Open to co-founders"
                                  title="Open to co-founders"
                                >
                                  <Handshake className="h-4 w-4" />
                                </span>
                              )}
                              {member.isInNetwork && (
                                <span
                                  className="text-brand-500"
                                  aria-label="In your network"
                                  title="In your network"
                                >
                                  <Link2 className="h-4 w-4" />
                                </span>
                              )}
                            </div>
                          </div>
                          <div
                            className="mt-[calc(0.5rem+2px)] border-t border-border-default pt-2"
                            role="presentation"
                          >
                            <div className="space-y-1">
                              {schoolYearLine ? (
                                <p className="text-xs text-text-muted truncate">
                                  {schoolYearLine}
                                </p>
                              ) : null}
                              {cityStateLine ? (
                                <p className="text-xs text-text-muted truncate">
                                  {cityStateLine}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              });

              if (isPartial) {
                return (
                  <div key={rowKey} className={platformPaneGridRowPartialClass}>
                    {cells.flatMap((node, i) =>
                      i === 0
                        ? [node]
                        : [
                            <div
                              key={`${rowKey}-v-${i}`}
                              className={platformPaneGridPartialHairlineClass}
                              aria-hidden
                            />,
                            node,
                          ]
                    )}
                    <div
                      key={`${rowKey}-v-end`}
                      className={platformPaneGridPartialHairlineClass}
                      aria-hidden
                    />
                    <div
                      className={platformPaneGridPartialRowTailFillClass}
                      aria-hidden
                    />
                  </div>
                );
              }

              return (
                <div
                  key={rowKey}
                  className={platformPaneGridRowFullClass}
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
                  }}
                >
                  {cells}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
    </PaywallGate>
  );
}
