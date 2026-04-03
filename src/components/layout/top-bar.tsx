"use client";

import { useState, useRef, useEffect } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useCurrentUser } from "@/contexts/user-context";

import { Avatar } from "@/components/ui/avatar";
import { Bell, Plus, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatRelativeTime } from "@/lib/utils";

export function TopBar() {
  const user = useCurrentUser();
  const { signOut } = useAuthActions();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notificationsWrapRef = useRef<HTMLDivElement>(null);
  const profileWrapRef = useRef<HTMLDivElement>(null);

  // Real notification data from Convex
  const notifications = useQuery(api.notifications.list) ?? [];
  const unreadCount = useQuery(api.notifications.getUnreadCount) ?? 0;

  // Avatar from Convex file storage
  const avatarUrl = useQuery(
    api.storage.getUrl,
    user?.avatarStorageId ? { storageId: user.avatarStorageId } : "skip"
  );

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

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

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
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-brand-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-surface-elevated border border-border-default rounded-xl shadow-elevated animate-slide-down">
              <div className="p-4 border-b border-border-default">
                <h3 className="text-sm font-semibold text-text-primary">
                  Notifications
                </h3>
              </div>
              <div className="p-2 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-3 py-4 text-sm text-text-muted text-center">
                    No notifications yet
                  </p>
                ) : (
                  notifications.slice(0, 5).map((notif) => (
                    <Link
                      key={notif._id}
                      href={notif.actionUrl ?? "/dashboard"}
                      onClick={() => setShowNotifications(false)}
                      className={`block px-3 py-2.5 rounded-lg hover:bg-surface-overlay cursor-pointer transition-colors ${
                        !notif.read ? "bg-brand-500/5" : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-text-primary">
                        {notif.title}
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {notif.body}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {formatRelativeTime(new Date(notif._creationTime).toISOString())}
                      </p>
                    </Link>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t border-border-default">
                  <Link
                    href="/settings"
                    className="block text-center text-xs text-text-tertiary hover:text-brand-500 py-1 transition-colors"
                  >
                    View all notifications
                  </Link>
                </div>
              )}
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
            <Avatar name={user?.fullName ?? "User"} size="sm" src={avatarUrl} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-56 bg-surface-elevated border border-border-default rounded-xl shadow-elevated animate-slide-down">
              <div className="p-3 border-b border-border-default">
                <p className="text-sm font-medium text-text-primary">
                  {user?.fullName ?? "User"}
                </p>
                <p className="text-xs text-text-secondary">
                  {user?.email ?? ""}
                </p>
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
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/10 transition-colors w-full"
                >
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
