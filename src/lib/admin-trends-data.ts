/** Mock monthly series for admin platform trends (replace with API / analytics later). */

export type AdminTrendMetricId =
  | "members"
  | "revenue"
  | "applicants"
  | "submissions"
  /** Same series as `submissions` (second wording from product copy). */
  | "submissionsPerMonth"
  | "avgAiScore"
  | "votes"
  | "points";

export type AdminTrendRow = {
  monthKey: string;
  label: string;
  members: number;
  revenue: number;
  applicants: number;
  submissions: number;
  avgAiScore: number;
  votes: number;
  points: number;
};

/** Last 12 months of demo data; `label` is short axis text. */
export const ADMIN_TRENDS_SERIES: AdminTrendRow[] = [
  {
    monthKey: "2025-05",
    label: "May",
    members: 118,
    revenue: 1420,
    applicants: 14,
    submissions: 22,
    avgAiScore: 71.2,
    votes: 340,
    points: 4200,
  },
  {
    monthKey: "2025-06",
    label: "Jun",
    members: 128,
    revenue: 1580,
    applicants: 18,
    submissions: 26,
    avgAiScore: 72.8,
    votes: 410,
    points: 5100,
  },
  {
    monthKey: "2025-07",
    label: "Jul",
    members: 135,
    revenue: 1690,
    applicants: 16,
    submissions: 24,
    avgAiScore: 73.1,
    votes: 395,
    points: 5480,
  },
  {
    monthKey: "2025-08",
    label: "Aug",
    members: 148,
    revenue: 1820,
    applicants: 22,
    submissions: 31,
    avgAiScore: 74.5,
    votes: 502,
    points: 6200,
  },
  {
    monthKey: "2025-09",
    label: "Sep",
    members: 162,
    revenue: 1910,
    applicants: 24,
    submissions: 28,
    avgAiScore: 75.2,
    votes: 540,
    points: 6800,
  },
  {
    monthKey: "2025-10",
    label: "Oct",
    members: 175,
    revenue: 2050,
    applicants: 26,
    submissions: 35,
    avgAiScore: 76.0,
    votes: 610,
    points: 7400,
  },
  {
    monthKey: "2025-11",
    label: "Nov",
    members: 186,
    revenue: 2088,
    applicants: 21,
    submissions: 30,
    avgAiScore: 76.8,
    votes: 580,
    points: 7920,
  },
  {
    monthKey: "2025-12",
    label: "Dec",
    members: 198,
    revenue: 2140,
    applicants: 19,
    submissions: 27,
    avgAiScore: 77.1,
    votes: 520,
    points: 8100,
  },
  {
    monthKey: "2026-01",
    label: "Jan",
    members: 205,
    revenue: 2180,
    applicants: 23,
    submissions: 33,
    avgAiScore: 77.9,
    votes: 640,
    points: 8600,
  },
  {
    monthKey: "2026-02",
    label: "Feb",
    members: 208,
    revenue: 2095,
    applicants: 20,
    submissions: 29,
    avgAiScore: 78.4,
    votes: 590,
    points: 8800,
  },
  {
    monthKey: "2026-03",
    label: "Mar",
    members: 212,
    revenue: 2155,
    applicants: 17,
    submissions: 31,
    avgAiScore: 79.0,
    votes: 620,
    points: 9050,
  },
  {
    monthKey: "2026-04",
    label: "Apr",
    members: 210,
    revenue: 2100,
    applicants: 15,
    submissions: 28,
    avgAiScore: 79.2,
    votes: 560,
    points: 9100,
  },
];

export const ADMIN_TREND_METRICS: {
  id: AdminTrendMetricId;
  label: string;
  /** Axis / tooltip number style */
  format: "integer" | "currency" | "oneDecimal";
}[] = [
  { id: "members", label: "Total members", format: "integer" },
  { id: "revenue", label: "Total revenue", format: "currency" },
  { id: "applicants", label: "Applicants", format: "integer" },
  { id: "submissions", label: "Submissions by month", format: "integer" },
  { id: "avgAiScore", label: "Avg. AI score (platform)", format: "oneDecimal" },
  { id: "votes", label: "Votes", format: "integer" },
  { id: "submissionsPerMonth", label: "Submissions per month", format: "integer" },
  { id: "points", label: "Points earned", format: "integer" },
];

const METRIC_TO_ROW_KEY: Record<
  AdminTrendMetricId,
  keyof Pick<
    AdminTrendRow,
    | "members"
    | "revenue"
    | "applicants"
    | "submissions"
    | "avgAiScore"
    | "votes"
    | "points"
  >
> = {
  members: "members",
  revenue: "revenue",
  applicants: "applicants",
  submissions: "submissions",
  submissionsPerMonth: "submissions",
  avgAiScore: "avgAiScore",
  votes: "votes",
  points: "points",
};

export function getTrendValue(row: AdminTrendRow, id: AdminTrendMetricId): number {
  return row[METRIC_TO_ROW_KEY[id]];
}
