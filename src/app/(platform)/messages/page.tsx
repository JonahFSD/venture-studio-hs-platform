"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, MessageCircle, Send } from "lucide-react";

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

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const threads = useQuery(api.messages.listThreads) ?? [];
  const selectedMessages = useQuery(
    api.messages.getThread,
    selectedThread ? { threadId: selectedThread } : "skip"
  );
  const sendMessage = useMutation(api.messages.send);
  const markRead = useMutation(api.messages.markThreadRead);

  // Auto-select first thread when threads load
  useEffect(() => {
    if (threads.length > 0 && selectedThread === null) {
      setSelectedThread(threads[0].threadId);
    }
  }, [threads, selectedThread]);

  // Mark thread as read when selected
  useEffect(() => {
    if (selectedThread) {
      const thread = threads.find((t) => t.threadId === selectedThread);
      if (thread && thread.unreadCount > 0) {
        markRead({ threadId: selectedThread });
      }
    }
  }, [selectedThread, threads, markRead]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedMessages]);

  const selectedThreadData = threads.find(
    (t) => t.threadId === selectedThread
  );

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedThreadData?.otherUser?._id) return;
    await sendMessage({
      recipientUserId: selectedThreadData.otherUser._id as Id<"users">,
      body: messageInput.trim(),
    });
    setMessageInput("");
  };

  const handleSelectThread = (threadId: string) => {
    setSelectedThread(threadId);
  };

  // Loading state
  if (threads === undefined) {
    return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <PlatformPageHeader
            icon={MessageCircle}
            title="Messages"
            description="Direct messages with community members"
          />
        </div>
        <div className="flex items-center justify-center h-[calc(100dvh-220px)]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            <p className="text-sm text-text-secondary">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <PlatformPageHeader
          icon={MessageCircle}
          title="Messages"
          description="Direct messages with community members"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-0 h-[calc(100dvh-220px)] rounded-2xl border border-border-default overflow-hidden">
        {/* Thread List */}
        <div className="lg:col-span-1 border-r border-border-default bg-surface-card overflow-y-auto">
          <div className="p-3 border-b border-border-default">
            <Input
              placeholder="Search messages..."
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>
          <div className="divide-y divide-border-subtle">
            {threads.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-text-muted">No conversations yet</p>
              </div>
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.threadId}
                  onClick={() => handleSelectThread(thread.threadId)}
                  className={`w-full text-left p-4 hover:bg-surface-card-hover transition-colors ${
                    selectedThread === thread.threadId
                      ? "bg-surface-elevated"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={thread.otherUser?.fullName ?? "Unknown"}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-sm font-medium truncate ${
                            thread.unreadCount > 0
                              ? "text-text-primary"
                              : "text-text-secondary"
                          }`}
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

        {/* Message View */}
        <div className="lg:col-span-2 flex flex-col bg-surface-primary">
          {selectedThread && selectedThreadData ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-border-default flex items-center gap-3">
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

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedMessages === undefined ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                  </div>
                ) : selectedMessages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
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
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                          msg.isMe
                            ? "bg-brand-500 text-black rounded-br-md"
                            : "bg-surface-elevated text-text-primary border border-border-default rounded-bl-md"
                        }`}
                      >
                        <p className="text-sm">{msg.body}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            msg.isMe ? "text-black/60" : "text-text-muted"
                          }`}
                        >
                          {formatMessageTime(msg._creationTime)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border-default">
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
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    variant="brand"
                    size="icon"
                    disabled={!messageInput.trim()}
                    onClick={handleSend}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={<MessageCircle className="h-8 w-8" />}
                title="No conversation selected"
                description="Choose a conversation from the sidebar to start chatting"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
