"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  platformPaneGridCellFillClass,
  platformPaneGridHangingCellBottomClass,
  platformPaneGridPartialHairlineClass,
  platformPaneGridPartialRowTailFillClass,
  platformPaneGridRowFullClass,
  platformPaneGridRowPartialClass,
  platformPaneGridRowsStackClass,
  platformPaneStackGapClass,
  platformPaneTileClass,
} from "@/lib/platform-pane-grid";
import {
  BOUNTIES_GRID_BREAKPOINTS,
  chunkIntoRows,
  isLastRowCell,
  paneGridCellFractionStyle,
  useResponsiveGridColumnCount,
} from "@/lib/responsive-grid-columns";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  MapPin, GraduationCap, Calendar, Plus, Send,
  CheckCircle, MessageCircle, ChevronDown, ChevronUp, Building2, Briefcase,
} from "lucide-react";
interface Region {
  name: string;
  states: string[];
  director: { name: string; school: string; graduation: number } | null;
}

type ExecutiveLeader =
  | { name: string; role: string; school: string; graduation: number }
  | { name: string; role: string; company: string; jobTitle: string };

const regions: Region[] = [
  { name: "New England", states: ["Connecticut", "Maine", "Massachusetts", "New Hampshire", "New York", "Rhode Island", "Vermont"], director: { name: "Hannah Lee", school: "Cornerstone Academy", graduation: 2028 } },
  { name: "Mid-Atlantic", states: ["Delaware", "Maryland", "New Jersey", "North Carolina", "Pennsylvania", "Virginia", "West Virginia"], director: { name: "Aiden Brooks", school: "Covenant Christian", graduation: 2028 } },
  { name: "Southeast", states: ["Alabama", "Florida", "Georgia", "Kentucky", "Louisiana", "Mississippi", "South Carolina", "Tennessee"], director: { name: "Sophia Johnson", school: "Trinity Prep", graduation: 2029 } },
  { name: "Midwest", states: ["Illinois", "Indiana", "Iowa", "Michigan", "Minnesota", "Missouri", "Ohio", "Wisconsin"], director: { name: "Liam Carter", school: "Cornerstone Academy", graduation: 2028 } },
  { name: "South Central", states: ["Arkansas", "Kansas", "Nebraska", "North Dakota", "Oklahoma", "South Dakota", "Texas"], director: { name: "Caleb Martinez", school: "Redeemer Prep", graduation: 2028 } },
  { name: "Mountain West", states: ["Arizona", "Colorado", "Idaho", "Montana", "New Mexico", "Utah", "Wyoming"], director: null },
  { name: "Pacific", states: ["Alaska", "California", "Hawaii", "Nevada", "Oregon", "Washington"], director: null },
];

const leaders: ExecutiveLeader[] = [
  { name: "Sarah Chen", role: "President", school: "Grace Academy", graduation: 2027 },
  { name: "David Park", role: "VP Marketing", school: "Covenant Prep", graduation: 2027 },
  { name: "Maria Garcia", role: "VP Technology", school: "Hope Academy", graduation: 2028 },
  { name: "Elijah Thompson", role: "VP Recruitment", school: "Liberty Christian", graduation: 2028 },
  { name: "Grace Kim", role: "VP Operations", school: "Faith Lutheran", graduation: 2029 },
  { name: "Maya Patel", role: "VP Finance", school: "Heritage Christian", graduation: 2028 },
  { name: "Jake Oswald", role: "Advisor", company: "Austin Christian U", jobTitle: "Accelerator Director" },
  { name: "Lars Ostervold", role: "Advisor", company: "Austin Christian U", jobTitle: "CTO" },
];

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

function ExecutiveTeamMemberContent(props: ExecutiveLeader) {
  const { name, role } = props;
  const meta = "company" in props ? (
    <div className="mt-1 flex flex-col items-start gap-1 text-sm text-text-secondary">
      <span className="flex items-center gap-1.5">
        <Building2 className="h-3.5 w-3.5 shrink-0 text-brand-500" />
        {props.company}
      </span>
      <span className="flex items-center gap-1.5">
        <Briefcase className="h-3.5 w-3.5 shrink-0 text-brand-500" />
        {props.jobTitle}
      </span>
    </div>
  ) : (
    <div className="mt-1 flex flex-col items-start gap-1 text-sm text-text-secondary">
      <span className="flex items-center gap-1.5">
        <GraduationCap className="h-3.5 w-3.5 shrink-0 text-brand-500" />
        {props.school}
      </span>
      <span className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 shrink-0 text-brand-500" />
        Class of {props.graduation}
      </span>
    </div>
  );

  return (
    <div className="flex flex-row items-start gap-3 sm:gap-4">
      <Avatar name={name} size="lg" className="shrink-0" />
      <div className="min-w-0 flex-1 text-left">
        <h3 className="mb-1.5 text-base font-bold leading-snug text-text-primary">
          {name}
        </h3>
        <Badge
          variant="brand"
          className="mb-1.5 bg-brand-500/80 text-[10px] font-bold uppercase tracking-wide text-black"
        >
          {role}
        </Badge>
        {meta}
      </div>
    </div>
  );
}

function ExecutiveTeamGrid({ leaders, profileIdByName }: { leaders: ExecutiveLeader[]; profileIdByName: Map<string, string> }) {
  const gridCols = useResponsiveGridColumnCount(BOUNTIES_GRID_BREAKPOINTS);
  const rows = useMemo(
    () => chunkIntoRows(leaders, gridCols),
    [leaders, gridCols]
  );

  return (
    <div
      className={cn(
        "overflow-hidden rounded-none border-t border-solid border-border-default",
        "-mx-4 md:-mx-6 lg:-mx-8"
      )}
    >
      <div className={platformPaneGridRowsStackClass}>
        {rows.map((row, rowIndex) => {
          const isPartial = row.length < gridCols;
          const rowKey = `${rowIndex}-${row[0]!.name}`;

          const cells = row.map((leader, i) => {
            const index = rowIndex * gridCols + i;
            const userId = profileIdByName.get(leader.name);
            const href = userId ? `/community/${userId}` : undefined;

            const tile = (
              <Card
                hover={Boolean(href)}
                padding="none"
                className={cn(
                  platformPaneTileClass,
                  "flex h-full min-h-[11rem] min-w-0 flex-1 flex-col overflow-hidden p-4 sm:min-h-0 sm:p-5 md:p-[30px]"
                )}
              >
                <ExecutiveTeamMemberContent {...leader} />
              </Card>
            );

            return (
              <div
                key={leader.name}
                className={cn(
                  "min-w-0 flex flex-col",
                  platformPaneGridCellFillClass,
                  isLastRowCell(index, leaders.length, gridCols) &&
                    platformPaneGridHangingCellBottomClass
                )}
                style={
                  isPartial ? paneGridCellFractionStyle(gridCols) : undefined
                }
              >
                {href ? (
                  <Link
                    href={href}
                    className="block h-full min-h-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary"
                    aria-label={`View ${leader.name}'s profile`}
                  >
                    {tile}
                  </Link>
                ) : (
                  <div className="block h-full min-h-0">{tile}</div>
                )}
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
    </div>
  );
}

function RegionalDirectorsPane({
  regions: regionList,
  filledAmbassadors: ambassadors,
  onApply,
  profileIdByName,
}: {
  regions: Region[];
  filledAmbassadors: Record<string, { name: string; school: string; graduation: number }>;
  onApply: (state: string) => void;
  profileIdByName: Map<string, string>;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-none border-t border-solid border-border-default",
        "-mx-4 md:-mx-6 lg:-mx-8"
      )}
    >
      <div className={platformPaneGridRowsStackClass}>
        {regionList.map((region, regionIndex) => (
          <div
            key={region.name}
            className={platformPaneGridRowFullClass}
            style={{ gridTemplateColumns: "minmax(0, 1fr)" }}
          >
            <div
              className={cn(
                platformPaneGridCellFillClass,
                regionIndex === regionList.length - 1 &&
                  platformPaneGridHangingCellBottomClass
              )}
            >
              <RegionRow
                region={region}
                filledAmbassadors={ambassadors}
                onApply={onApply}
                profileIdByName={profileIdByName}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegionRow({
  region,
  filledAmbassadors: ambassadors,
  onApply,
  profileIdByName,
}: {
  region: Region;
  filledAmbassadors: Record<string, { name: string; school: string; graduation: number }>;
  onApply: (state: string) => void;
  profileIdByName: Map<string, string>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "flex w-full items-center gap-4 p-4 text-left transition-all duration-200 sm:p-5 md:p-[30px]",
          "hover:bg-surface-card-hover"
        )}
      >
        {region.director ? (
          (() => {
            const directorHref = profileIdByName.get(region.director!.name);
            return directorHref ? (
              <Link
                href={`/community/${directorHref}`}
                onClick={(e) => e.stopPropagation()}
                className="shrink-0 hover:opacity-80 transition-opacity"
              >
                <Avatar name={region.director!.name} size="md" />
              </Link>
            ) : (
              <Avatar name={region.director!.name} size="md" />
            );
          })()
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border-strong text-text-muted">
            <MapPin className="h-4 w-4" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-text-primary">{region.name}</h3>
          {region.director ? (
            (() => {
              const directorHref = profileIdByName.get(region.director!.name);
              const content = <>{region.director!.name} &bull; {region.director!.school}&apos;{String(region.director!.graduation).slice(2)}</>;
              return directorHref ? (
                <Link
                  href={`/community/${directorHref}`}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-0.5 block truncate text-[10px] text-text-muted hover:text-brand-500 transition-colors"
                >
                  {content}
                </Link>
              ) : (
                <p className="mt-0.5 truncate text-[10px] text-text-muted">{content}</p>
              );
            })()
          ) : (
            <p className="mt-0.5 text-[10px] italic text-text-muted">
              Regional Director — position open
            </p>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-text-muted" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-text-muted" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-solid border-border-default">
          <div className={platformPaneStackGapClass}>
            {region.states.map((state) => {
              const ambassador = ambassadors[state];
              if (ambassador) {
                const ambHref = profileIdByName.get(ambassador.name);
                return (
                  <div
                    key={state}
                    className="flex items-center gap-3 bg-surface-primary px-4 py-3 transition-colors duration-200 hover:bg-surface-card-hover sm:px-5 md:px-[30px]"
                  >
                    {ambHref ? (
                      <Link href={`/community/${ambHref}`} className="shrink-0 hover:opacity-80 transition-opacity">
                        <Avatar name={ambassador.name} size="md" />
                      </Link>
                    ) : (
                      <Avatar name={ambassador.name} size="md" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-text-secondary">
                        {state}
                      </p>
                      {ambHref ? (
                        <Link href={`/community/${ambHref}`} className="mt-0.5 block truncate text-[10px] text-text-muted hover:text-brand-500 transition-colors">
                          {ambassador.name} &bull; {ambassador.school}&apos;{String(ambassador.graduation).slice(2)}
                        </Link>
                      ) : (
                        <p className="mt-0.5 truncate text-[10px] text-text-muted">
                          {ambassador.name} &bull; {ambassador.school}&apos;{String(ambassador.graduation).slice(2)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              }
              return (
                <div
                  key={state}
                  className="group flex items-center gap-3 bg-surface-primary px-4 py-3 sm:px-5 md:px-[30px]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-border-strong text-text-muted transition-colors group-hover:border-brand-500/40 group-hover:text-brand-500">
                    <Plus className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text-secondary">
                      {state}
                    </p>
                    <p className="text-[10px] text-text-muted">Ambassador needed</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onApply(state)}
                    className="shrink-0 text-brand-500 hover:text-brand-400"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Apply
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadershipPage() {
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyState, setApplyState] = useState("");
  const [applied, setApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const members = useQuery(api.users.listMembers, {});
  const profileIdByName = useMemo(() => {
    const m = new Map<string, string>();
    if (!members) return m;
    for (const u of members) {
      if (!m.has(u.fullName)) m.set(u.fullName, u._id);
    }
    return m;
  }, [members]);

  const handleApply = (state: string) => { setApplyState(state); setApplied(false); setApplyModalOpen(true); };
  const handleSubmitApplication = () => { setIsSubmitting(true); setTimeout(() => { setIsSubmitting(false); setApplied(true); }, 1500); };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-bold text-text-primary mb-4">Executive Team</h2>
        <ExecutiveTeamGrid leaders={leaders} profileIdByName={profileIdByName} />
      </div>

      <div className="pt-[25px]">
        <h2 className="text-lg font-bold text-text-primary mb-4">Regional Directors &amp; State Ambassadors</h2>
        <RegionalDirectorsPane
          regions={regions}
          filledAmbassadors={filledAmbassadors}
          onApply={handleApply}
          profileIdByName={profileIdByName}
        />
      </div>

      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} title={applied ? "Application Submitted!" : `Apply for ${applyState} Ambassador`} size="lg">
        {applied ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4"><CheckCircle className="h-8 w-8 text-success" /></div>
            <p className="text-sm text-text-secondary">Your application for <span className="font-semibold text-text-primary">{applyState} Ambassador</span> has been submitted. The venture studio team will review your application and reach out during the November interview cycle.</p>
            <Button variant="brand" className="mt-6" onClick={() => setApplyModalOpen(false)}>Done</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-surface-elevated border border-border-default">
              <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-brand-500" /><span className="font-medium text-text-primary">{applyState}</span><Badge variant="brand">Ambassador</Badge></div>
            </div>
            <p className="text-sm text-text-secondary">As a State Ambassador, you&apos;ll represent the ACU Youth Venture community in your state, recruit new members, organize local events, and serve as a liaison between your region and the leadership team.</p>
            <Textarea label="Why do you want to represent this state?" placeholder="Tell us about your connection to this state and why you'd be a great ambassador..." rows={4} required />
            <Textarea label="Leadership experience" placeholder="Describe any relevant leadership, community involvement, or entrepreneurial experience..." rows={3} required />
            <Input label="City / Metro Area" placeholder="e.g., Austin, Dallas, Houston" required />
            <div className="p-3 rounded-lg bg-warning/5 border border-warning/10 text-xs text-text-secondary"><span className="font-medium text-warning">Note:</span> Sophomores and above are eligible for Ambassador roles. Applications are reviewed during the November interview cycle, announced in December, and new ambassadors begin their term on January 1.</div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-default">
              <Button variant="ghost" onClick={() => setApplyModalOpen(false)}>Cancel</Button>
              <Button variant="brand" onClick={handleSubmitApplication} isLoading={isSubmitting} leftIcon={<Send className="h-4 w-4" />}>Submit Application</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
