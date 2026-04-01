"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  Network,
  Search,
  MessageCircle,
  Trophy,
  Calendar,
  Info,
} from "lucide-react";

const mockNetwork = [
  {
    id: "1",
    name: "Sarah Chen",
    school: "Grace Academy",
    state: "TX",
    bqType: "Visionary",
    connectedSince: "Jan 2026",
    mutualDMs: 47,
    wins: 3,
  },
  {
    id: "2",
    name: "David Park",
    school: "Covenant Prep",
    state: "CA",
    bqType: "Operator",
    connectedSince: "Dec 2025",
    mutualDMs: 32,
    wins: 2,
  },
  {
    id: "5",
    name: "Elijah Thompson",
    school: "Liberty Christian",
    state: "VA",
    bqType: "Strategist",
    connectedSince: "Feb 2026",
    mutualDMs: 18,
    wins: 1,
  },
  {
    id: "6",
    name: "Grace Kim",
    school: "Faith Lutheran",
    state: "WA",
    bqType: "Anchor",
    connectedSince: "Mar 2026",
    mutualDMs: 12,
    wins: 0,
  },
];

export default function NetworkPage() {
  const [search, setSearch] = useState("");

  const filtered = mockNetwork.filter((m) =>
    !search || m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <Network className="h-6 w-6 text-brand-500" />
          Your Network
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {mockNetwork.length} connections &bull; People you&apos;ve built relationships with
        </p>
      </div>

      {/* Info */}
      <Card className="bg-brand-500/5 border-brand-500/10">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-brand-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-text-secondary">
              When you and another member have each exchanged at least <strong className="text-text-primary">10 DMs</strong>, you&apos;re automatically added to each other&apos;s network.
              Each new connection earns you <strong className="text-brand-500">25 points</strong>.
            </p>
          </div>
        </div>
      </Card>

      {/* Search */}
      <Input
        placeholder="Search your network..."
        leftIcon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Network Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((person) => (
          <Card key={person.id} hover glow className="h-full">
            <div className="flex items-start gap-3 mb-3">
              <Link href={`/members/${person.id}`}>
                <Avatar name={person.name} size="lg" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/members/${person.id}`}>
                  <p className="text-sm font-semibold text-text-primary hover:text-brand-500 transition-colors truncate">
                    {person.name}
                  </p>
                </Link>
                <p className="text-xs text-text-muted">{person.school}</p>
                {person.bqType && (
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    BQ: {person.bqType}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Connected {person.connectedSince}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {person.mutualDMs} DMs
              </span>
              {person.wins > 0 && (
                <span className="flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  {person.wins} wins
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-border-default">
              <Link href={`/members/${person.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">
                  View Profile
                </Button>
              </Link>
              <Link href="/messages">
                <Button variant="ghost" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="text-center py-12">
          <Network className="h-10 w-10 text-text-muted mx-auto mb-3" />
          <p className="text-sm text-text-secondary">
            {search ? "No connections match your search." : "No connections yet. Start chatting with other members to build your network!"}
          </p>
        </Card>
      )}
    </div>
  );
}
