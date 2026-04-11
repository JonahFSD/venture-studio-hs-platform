"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Search, Compass } from "lucide-react";

export default function ExplorePage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search pitches by title, creator, or school..."
            leftIcon={<Search className="h-4 w-4" />}
          />
        </div>
      </div>

      <Card>
        <EmptyState
          icon={<Compass className="h-8 w-8" />}
          title="Explore all pitches"
          description="Browse and search through every submitted pitch across all months. Coming soon."
        />
      </Card>
    </div>
  );
}
