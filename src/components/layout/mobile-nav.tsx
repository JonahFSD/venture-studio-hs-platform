"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  Vote,
  Users,
  MessageCircle,
} from "lucide-react";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/submissions", label: "Pitches", icon: Video },
  { href: "/voting", label: "Vote", icon: Vote },
  { href: "/members", label: "Community", icon: Users },
  { href: "/messages", label: "Chat", icon: MessageCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface-secondary/95 backdrop-blur-xl border-t border-border-default">
      <div className="flex items-center justify-around h-16 px-2">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors",
                isActive
                  ? "text-brand-500"
                  : "text-text-tertiary active:text-text-secondary"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
