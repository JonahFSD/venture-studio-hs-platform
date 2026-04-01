export interface Bounty {
  id: string;
  title: string;
  description: string;
  founder: { name: string; company: string };
  amount: number;
  dueDate: string;
  status: "active" | "reviewing" | "completed";
  requirements: string[];
  tags: string[];
  submissionsCount: number;
  winner?: { id: string; name: string; teamSize: number };
}

export const mockBounties: Bounty[] = [
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
    tags: ["Mobile", "Offline-first", "SMS", "Hardware"],
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
    tags: ["AI", "Audio", "Web", "Export"],
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
    tags: ["Chrome", "FinTech", "Privacy", "PDF"],
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
    tags: ["No-code", "Stripe", "Events", "Responsive"],
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
    tags: ["Dashboard", "Analytics", "Notifications", "CSV"],
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
    tags: ["Widget", "Moderation", "Community", "Email"],
    submissionsCount: 8,
    winner: { id: "2", name: "David Park", teamSize: 3 },
  },
];

export function getBountyById(id: string): Bounty | undefined {
  return mockBounties.find((b) => b.id === id);
}

export function formatBountyDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function daysUntilDue(dateStr: string) {
  const now = new Date();
  const due = new Date(dateStr);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
