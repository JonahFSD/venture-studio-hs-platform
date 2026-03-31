"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, MessageCircle, Send, Plus } from "lucide-react";

const mockThreads = [
  {
    id: "t1",
    user: { name: "Sarah Chen", school: "Grace Academy" },
    lastMessage: "That sounds great! Let's connect on the project this weekend.",
    time: "2h ago",
    unread: 2,
  },
  {
    id: "t2",
    user: { name: "David Park", school: "Covenant Prep" },
    lastMessage: "I saw your EcoTrack pitch - really impressive work! Have you considered...",
    time: "1d ago",
    unread: 0,
  },
  {
    id: "t3",
    user: { name: "Elijah Thompson", school: "Liberty Christian" },
    lastMessage: "Thanks for the feedback on my pitch. I'll incorporate those changes.",
    time: "3d ago",
    unread: 0,
  },
  {
    id: "t4",
    user: { name: "Grace Kim", school: "Faith Lutheran" },
    lastMessage: "Would love to collaborate on a design project together!",
    time: "5d ago",
    unread: 0,
  },
];

const mockMessages = [
  {
    id: "m1",
    sender: "Sarah Chen",
    body: "Hey! I loved your EcoTrack pitch. The gamification angle is really smart.",
    time: "Yesterday, 3:42 PM",
    isMe: false,
  },
  {
    id: "m2",
    sender: "Me",
    body: "Thanks Sarah! I was inspired by how FaithConnect brings community together. Maybe we could combine our ideas somehow?",
    time: "Yesterday, 4:15 PM",
    isMe: true,
  },
  {
    id: "m3",
    sender: "Sarah Chen",
    body: "That's exactly what I was thinking! A faith-driven sustainability community could be really powerful.",
    time: "Today, 9:30 AM",
    isMe: false,
  },
  {
    id: "m4",
    sender: "Sarah Chen",
    body: "That sounds great! Let's connect on the project this weekend.",
    time: "Today, 10:15 AM",
    isMe: false,
  },
];

export default function MessagesPage() {
  const [selectedThread, setSelectedThread] = useState<string | null>("t1");
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
          <p className="text-sm text-text-secondary mt-1">
            Direct messages with community members
          </p>
        </div>
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
            {mockThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setSelectedThread(thread.id)}
                className={`w-full text-left p-4 hover:bg-surface-card-hover transition-colors ${
                  selectedThread === thread.id ? "bg-surface-elevated" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={thread.user.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          thread.unread > 0
                            ? "text-text-primary"
                            : "text-text-secondary"
                        }`}
                      >
                        {thread.user.name}
                      </p>
                      <span className="text-xs text-text-muted flex-shrink-0">
                        {thread.time}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted truncate mt-0.5">
                      {thread.lastMessage}
                    </p>
                  </div>
                  {thread.unread > 0 && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-500 text-black text-[10px] font-bold flex items-center justify-center">
                      {thread.unread}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Message View */}
        <div className="lg:col-span-2 flex flex-col bg-surface-primary">
          {selectedThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-border-default flex items-center gap-3">
                <Avatar name="Sarah Chen" size="sm" />
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    Sarah Chen
                  </p>
                  <p className="text-xs text-text-muted">Grace Academy</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {mockMessages.map((msg) => (
                  <div
                    key={msg.id}
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
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border-default">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 h-10 px-4 rounded-xl text-sm bg-surface-elevated border border-border-default text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/30 transition-colors"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <Button
                    variant="brand"
                    size="icon"
                    disabled={!messageInput.trim()}
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
