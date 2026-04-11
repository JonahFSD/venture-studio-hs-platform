"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { MessageCircle, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  platformPaneBleedClass,
  platformPaneGridCellFillClass,
} from "@/lib/platform-pane-grid";
import {
  filterMessagesThreadsBySearch,
  filterMessagesThreadsByToggles,
  parseMessagesCofoundersOnly,
  parseMessagesNetworkOnly,
  parseMessagesSearchFromSearch,
  parseMessagesSortFromSearch,
  sortMessagesThreads,
} from "@/lib/messages-list-filters";

function formatRelativeTime(epochMs: number): string {
  const now = Date.now();
  const diffMs = now - epochMs;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  return `${diffWeeks}w ago`;
}

function formatMessageTime(epochMs: number): string {
  const date = new Date(epochMs);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

function MessagesPageInner() {
  const searchParams = useSearchParams();
  const q = parseMessagesSearchFromSearch(searchParams);
  const sort = parseMessagesSortFromSearch(searchParams);
  const cofoundersOnly = parseMessagesCofoundersOnly(searchParams);
  const networkOnly = parseMessagesNetworkOnly(searchParams);

  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threadsRaw = useQuery(api.messages.listThreads);
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markThreadRead);

  const threads = threadsRaw ?? [];

  const filteredThreads = useMemo(() => {
    let list = threads;
    list = filterMessagesThreadsBySearch(list, q);
    list = filterMessagesThreadsByToggles(list, cofoundersOnly, networkOnly);
    list = sortMessagesThreads(list, sort);
    return list;
  }, [threads, q, sort, cofoundersOnly, networkOnly]);

  const displayThreadId = useMemo(() => {
    if (filteredThreads.length === 0) return null;
    if (
      selectedThread &&
      filteredThreads.some((t) => t.threadId === selectedThread)
    ) {
      return selectedThread;
    }
    return filteredThreads[0]!.threadId;
  }, [filteredThreads, selectedThread]);

  useEffect(() => {
    if (displayThreadId !== selectedThread) {
      setSelectedThread(displayThreadId);
    }
  }, [displayThreadId, selectedThread]);

  const selectedMessages = useQuery(
    api.messages.getThread,
    displayThreadId ? { threadId: displayThreadId } : "skip"
  );

  useEffect(() => {
    if (displayThreadId) {
      const thread = threads.find((t) => t.threadId === displayThreadId);
      if (thread && thread.unreadCount > 0) {
        markRead({ threadId: displayThreadId });
      }
    }
  }, [displayThreadId, threads, markRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessages]);

  const selectedThreadData = threads.find((t) => t.threadId === displayThreadId);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedThreadData?.otherUser?._id) return;
    await sendMessage({
      recipientUserId: selectedThreadData.otherUser._id as Id<"users">,
      body: messageInput.trim(),
    });
    setMessageInput("");
  };

  if (threadsRaw === undefined) {
    return (
      <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-circle border-2 border-brand-500 border-t-transparent" />
          <p className="text-sm text-text-secondary">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      <div
        className={cn(
          "overflow-hidden rounded-none -mb-24 lg:-mb-8",
          platformPaneBleedClass
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-col lg:flex-row lg:items-stretch",
            "h-[calc(100dvh-4rem)]"
          )}
        >
          {/* Thread list */}
          <div
            className={cn(
              "flex min-h-0 flex-1 basis-0 flex-col overflow-hidden border-b border-border-default lg:w-[33.333%] lg:flex-none lg:border-b-0 lg:border-r lg:border-solid lg:border-border-default",
              platformPaneGridCellFillClass
            )}
          >
            <div className="min-h-0 flex-1 overflow-y-auto">
              <div className="divide-y divide-border-subtle">
                {filteredThreads.length === 0 ? (
                  <div className="px-4 md:px-6 lg:px-8 py-10 text-center">
                    <p className="text-sm text-text-muted">
                      {threads.length === 0
                        ? "No conversations yet"
                        : "No threads match your search or filters."}
                    </p>
                  </div>
                ) : (
                  filteredThreads.map((thread) => (
                    <button
                      key={thread.threadId}
                      type="button"
                      onClick={() => setSelectedThread(thread.threadId)}
                      className={`w-full text-left py-4 pr-4 pl-4 md:pl-6 lg:pl-8 hover:bg-surface-card-hover transition-colors ${displayThreadId === thread.threadId ? "bg-surface-elevated" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          name={thread.otherUser?.fullName ?? "Unknown"}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`text-sm font-medium truncate ${thread.unreadCount > 0 ? "text-text-primary" : "text-text-secondary"}`}
                            >
                              {thread.otherUser?.fullName ?? "Unknown"}
                            </p>
                            <span className="text-xs text-text-muted flex-shrink-0">
                              {thread.lastMessage
                                ? formatRelativeTime(
                                    thread.lastMessage._creationTime
                                  )
                                : ""}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted truncate mt-0.5">
                            {thread.lastMessage?.body ?? ""}
                          </p>
                        </div>
                        {thread.unreadCount > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500 text-black text-[10px] font-bold flex items-center justify-center">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Message view */}
          <div
            className={cn(
              "flex min-h-0 flex-1 basis-0 flex-col overflow-hidden lg:min-h-0",
              platformPaneGridCellFillClass
            )}
          >
            {displayThreadId && selectedThreadData ? (
              <>
                <div className="p-4 border-b border-border-default flex items-center gap-3 shrink-0">
                  <Avatar
                    name={selectedThreadData.otherUser?.fullName ?? "Unknown"}
                    size="sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-text-primary">
                      {selectedThreadData.otherUser?.fullName ?? "Unknown"}
                    </p>
                    <p className="text-xs text-text-muted">
                      {selectedThreadData.otherUser?.schoolName ?? ""}
                    </p>
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedMessages === undefined ? (
                    <div className="flex items-center justify-center h-full min-h-[12rem]">
                      <div className="h-6 w-6 animate-spin rounded-circle border-2 border-brand-500 border-t-transparent" />
                    </div>
                  ) : selectedMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full min-h-[12rem]">
                      <p className="text-sm text-text-muted">
                        No messages yet. Say hello!
                      </p>
                    </div>
                  ) : (
                    (selectedMessages ?? []).map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.isMe ? "bg-brand-500 text-black rounded-br-md" : "bg-surface-elevated text-text-primary border border-border-default rounded-bl-md"}`}
                        >
                          <p className="text-sm">{msg.body}</p>
                          <p
                            className={`text-[10px] mt-1 ${msg.isMe ? "text-black/60" : "text-text-muted"}`}
                          >
                            {formatMessageTime(msg._creationTime)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-border-default shrink-0">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 h-10 px-4 rounded-xl text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-white transition-colors"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          void handleSend();
                        }
                      }}
                    />
                    <Button
                      variant="brand"
                      size="icon"
                      disabled={!messageInput.trim()}
                      onClick={() => void handleSend()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-6">
                <EmptyState
                  icon={<MessageCircle className="h-8 w-8" />}
                  title="No conversation selected"
                  description="Choose a conversation from the list to start chatting"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100dvh-10rem)] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-circle border-2 border-brand-500 border-t-transparent" />
        </div>
      }
    >
      <MessagesPageInner />
    </Suspense>
  );
}
