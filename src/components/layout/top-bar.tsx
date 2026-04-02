"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Bell, Plus, LogOut, Settings } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsWrapRef = useRef<HTMLDivElement>(null);
  const profileWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showNotifications && !showProfile) return;

    function handlePointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (notificationsWrapRef.current?.contains(target)) return;
      if (profileWrapRef.current?.contains(target)) return;
      setShowNotifications(false);
      setShowProfile(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [showNotifications, showProfile]);

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-end px-6 bg-surface-primary/80 backdrop-blur-xl border-b border-border-default font-sans">
      <div className="flex items-center gap-2">
        {/* New Submission */}
        <Link
          href="/submissions/new"
          className="hidden sm:inline-flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-medium bg-brand-500 text-black hover:bg-brand-400 active:bg-brand-600 transition-colors shadow-glow"
        >
          <Plus className="h-4 w-4" />
          New Pitch
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notificationsWrapRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-elevated border border-border-default rounded-xl shadow-elevated animate-slide-down">
              <div className="p-4 border-b border-border-default">
                <h3 className="text-sm font-semibold text-text-primary">
                  Notifications
                </h3>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {[
                  {
                    title: "AI scoring complete",
                    body: 'Your pitch "EcoTrack App" has been scored',
                    time: "2h ago",
                  },
                  {
                    title: "Voting round opens",
                    body: "March 2026 voting is now open",
                    time: "1d ago",
                  },
                  {
                    title: "New message",
                    body: "Sarah Chen sent you a message",
                    time: "2d ago",
                  },
                ].map((notif, i) => (
                  <div
                    key={i}
                    className="px-3 py-2.5 rounded-lg hover:bg-surface-overlay cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-medium text-text-primary">
                      {notif.title}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {notif.body}
                    </p>
                    <p className="text-xs text-text-muted mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-border-default">
                <Link
                  href="/settings"
                  className="block text-center text-xs text-text-tertiary hover:text-brand-500 py-1 transition-colors"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative" ref={profileWrapRef}>
          <button
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-elevated transition-colors"
          >
            <Avatar name="Jake Oswald" size="sm" />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-surface-elevated border border-border-default rounded-xl shadow-elevated animate-slide-down">
              <div className="p-3 border-b border-border-default">
                <p className="text-sm font-medium text-text-primary">
                  Jake Oswald
                </p>
                <p className="text-xs text-text-secondary">jake@example.com</p>
              </div>
              <div className="p-1.5">
                <Link
                  href="/settings"
                  onClick={() => setShowProfile(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-surface-overlay transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors w-full">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
