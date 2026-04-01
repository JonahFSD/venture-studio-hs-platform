import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Video,
  Vote,
  Trophy,
  Users,
  MessageCircle,
  Settings,
  Shield,
  Crown,
  Star,
  Network,
  Brain,
  CircleDollarSign,
} from "lucide-react";

export interface PlatformNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Opens in a new tab (e.g. external tools) */
  external?: boolean;
}

/** Primary sidebar routes — keep in sync with page headers using the same icon */
export const mainNavItems: PlatformNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/submissions", label: "Submissions", icon: Video },
  { href: "/voting", label: "Voting", icon: Vote },
  { href: "/bounties", label: "Bounties", icon: CircleDollarSign },
  { href: "/leaderboard", label: "Leaderboard", icon: Star },
  { href: "/hall-of-fame", label: "Hall of Fame", icon: Trophy },
  { href: "/members", label: "Community", icon: Users },
  { href: "/network", label: "Network", icon: Network },
  { href: "/leadership", label: "Leadership", icon: Crown },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  {
    href: "https://bq.austinchristianu.org/",
    label: "Builder's Quotient",
    icon: Brain,
    external: true,
  },
];

export const bottomNavItems: PlatformNavItem[] = [
  { href: "/settings", label: "Settings", icon: Settings },
];

export const adminNavItems: PlatformNavItem[] = [
  { href: "/admin", label: "Admin", icon: Shield },
];
