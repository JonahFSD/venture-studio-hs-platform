import type { Doc } from "../../convex/_generated/dataModel";

/** Open tab: active bounties only. Past: completed + reviewing. */
export type BountiesActiveFilter = "all" | "open";
export type BountiesPastFilter = "all" | "reward";

export function parseBountiesSearchFromSearch(
  searchParams: URLSearchParams
): string {
  return (searchParams.get("q") ?? "").trim();
}

export function parseBountiesFilterFromSearch(
  pathname: string,
  searchParams: URLSearchParams
): BountiesActiveFilter | BountiesPastFilter {
  const raw = searchParams.get("bounty") ?? "all";
  if (pathname === "/bounties/past") {
    return raw === "reward" ? "reward" : "all";
  }
  if (raw === "open") return "open";
  return "all";
}

export function filterBountiesBySearch<
  T extends { title: string; description: string },
>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q)
  );
}

type BountyRow = Doc<"bounties"> & { submissionsCount: number };

export function filterActiveBountiesByStatus(
  items: BountyRow[],
  _f: BountiesActiveFilter
): BountyRow[] {
  return items.filter((b) => b.status === "active");
}

export function sortPastBounties(
  items: BountyRow[],
  f: BountiesPastFilter
): BountyRow[] {
  if (f !== "reward") return [...items].sort((a, b) => b.dueDate - a.dueDate);
  return [...items].sort((a, b) => b.bountyAmount - a.bountyAmount);
}
