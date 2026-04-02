"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { sidebarRailClass, useSidebar } from "@/components/layout/sidebar-context";
import {
  adminNavItems,
  bottomNavItems,
  mainNavItems,
} from "@/lib/platform-nav";
import { ChevronLeft, ChevronRight, Swords } from "lucide-react";

interface SidebarProps {
  isAdmin?: boolean;
}

const tronLogoClass =
  "font-tron font-bold uppercase text-brand-500 tracking-[0.18em] [text-shadow:0_0_14px_rgba(0,229,220,0.55),0_0_28px_rgba(0,229,220,0.22)]";

/** Same horizontal inset as nav rows (`px-3` shell + `px-3` control) so collapse chevron lines up with nav icons. */
const shellPadX = "px-3";

export function Sidebar({ isAdmin = false }: SidebarProps) {
  const { collapsed, setCollapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col font-sans",
        "bg-surface-secondary border-r border-border-default",
        "transition-all duration-300 ease-in-out",
        sidebarRailClass(collapsed)
      )}
    >
      {/* Logo — same row pattern as nav: icon + label; collapsed shows icon only */}
      <div
        className={cn(
          "h-16 flex items-center border-b border-border-default",
          shellPadX
        )}
      >
        <Link
          href="/dashboard"
          aria-label={collapsed ? "The Arena — home" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-w-0 w-full",
            "transition-all duration-200",
            "text-brand-500 hover:text-brand-400 hover:bg-surface-elevated"
          )}
        >
          <Swords
            className="h-5 w-5 flex-shrink-0 [filter:drop-shadow(0_0_10px_rgba(0,229,220,0.45))]"
            aria-hidden
          />
          {!collapsed && (
            <span className={cn("text-[13px] leading-none truncate", tronLogoClass)}>
              THE ARENA
            </span>
          )}
        </Link>
      </div>

      {/* Collapse — under logo, flows into main nav (no divider) */}
      <div className={cn("shrink-0 pt-2 pb-1", shellPadX)}>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium text-text-tertiary hover:text-text-secondary hover:bg-surface-elevated transition-all duration-200 w-full"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 flex-shrink-0" />
          ) : (
            <ChevronLeft className="h-5 w-5 flex-shrink-0" />
          )}
        </button>
      </div>

      {/* Main Nav */}
      <nav className={cn("flex-1 py-3 space-y-1 overflow-y-auto", shellPadX)}>
        {mainNavItems.map((item) => {
          const isActive =
            !item.external &&
            (pathname === item.href || pathname.startsWith(item.href + "/"));
          if (item.external) {
            return (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-200",
                  "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </a>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                "transition-all duration-200",
                isActive
                  ? "bg-brand-500/10 text-brand-500 shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              )}
            >
              <item.icon className={cn("h-5 w-5 flex-shrink-0")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={cn("py-4 space-y-1 border-t border-border-default", shellPadX)}>
        {isAdmin &&
          adminNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-200",
                  isActive
                    ? "bg-brand-500/10 text-brand-500"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

        {bottomNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                "transition-all duration-200",
                isActive
                  ? "bg-brand-500/10 text-brand-500"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
