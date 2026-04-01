"use client";

import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Camera,
  Save,
  ExternalLink,
  CheckCircle,
  Settings,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PlatformPageHeader
        icon={Settings}
        title="Settings"
        description="Manage your profile, subscription, and preferences"
      />

      <Tabs
        tabs={[
          { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
          { id: "subscription", label: "Subscription", icon: <CreditCard className="h-4 w-4" /> },
          { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
        ]}
      >
        {(activeTab) => (
          <>
            {activeTab === "profile" && (
              <div className="space-y-6">
                {/* Avatar */}
                <Card>
                  <CardTitle>Profile Photo</CardTitle>
                  <div className="flex items-center gap-6 mt-4">
                    <div className="relative">
                      <Avatar name="Jake Oswald" size="xl" />
                      <button className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-brand-500 text-black hover:bg-brand-400 transition-colors">
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div>
                      <Button variant="outline" size="sm">
                        Upload Photo
                      </Button>
                      <p className="text-xs text-text-muted mt-1">
                        JPG, PNG. Max 2MB.
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Personal Info */}
                <Card>
                  <CardTitle>Personal Information</CardTitle>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" defaultValue="Jake" />
                      <Input label="Last Name" defaultValue="Oswald" />
                    </div>
                    <Input
                      label="Email"
                      type="email"
                      defaultValue="jake@example.com"
                      disabled
                      hint="Contact support to change your email"
                    />
                    <Input
                      label="School"
                      defaultValue="Austin Christian High"
                    />
                    <Textarea
                      label="Bio"
                      defaultValue="Aspiring tech entrepreneur passionate about sustainability and faith-driven innovation."
                      hint="Tell the community about yourself"
                    />
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-1.5">
                        Skills & Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["React", "TypeScript", "AI/ML", "Sustainability"].map(
                          (skill) => (
                            <Badge key={skill} variant="outline">
                              {skill} &times;
                            </Badge>
                          )
                        )}
                        <Button variant="ghost" size="sm">
                          + Add
                        </Button>
                      </div>
                    </div>
                    <label className="flex items-center gap-3 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-border-default bg-surface-elevated text-brand-500 focus:ring-brand-500"
                      />
                      I&apos;m looking for co-founders
                    </label>
                  </div>
                  <div className="mt-6 pt-4 border-t border-border-default">
                    <Button
                      variant="brand"
                      leftIcon={<Save className="h-4 w-4" />}
                    >
                      Save Changes
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-6">
                {/* Current Plan */}
                <Card className="bg-gradient-to-r from-brand-500/5 to-transparent border border-dashed border-brand-500/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>Youth Venture Membership</CardTitle>
                        <Badge variant="success">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        $10/month &bull; 90% goes to the monthly prize pool
                      </CardDescription>
                    </div>
                    <p className="text-3xl font-bold text-text-primary">
                      $10
                      <span className="text-sm font-normal text-text-muted">
                        /mo
                      </span>
                    </p>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-surface-elevated border border-border-default">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-secondary">
                        Current billing period
                      </span>
                      <span className="text-text-primary font-medium">
                        Mar 1 - Mar 31, 2026
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-text-secondary">Next payment</span>
                      <span className="text-text-primary font-medium">
                        April 1, 2026
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardTitle>Payment Method</CardTitle>
                  <div className="mt-4 p-4 rounded-xl border border-border-default flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-surface-elevated">
                        <CreditCard className="h-5 w-5 text-text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Visa ending in 4242
                        </p>
                        <p className="text-xs text-text-muted">
                          Expires 12/2027
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      Update
                    </Button>
                  </div>
                </Card>

                {/* Billing Portal */}
                <Card>
                  <CardTitle>Billing Management</CardTitle>
                  <CardDescription>
                    Manage your invoices, update payment method, or cancel
                    your subscription through Stripe&apos;s billing portal.
                  </CardDescription>
                  <Button
                    variant="outline"
                    className="mt-4"
                    rightIcon={<ExternalLink className="h-4 w-4" />}
                  >
                    Open Billing Portal
                  </Button>
                </Card>
              </div>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardTitle>Notification Preferences</CardTitle>
                <div className="mt-6 space-y-4">
                  {[
                    {
                      label: "AI scoring complete",
                      description: "When your pitch has been scored by AI",
                      email: true,
                      push: true,
                    },
                    {
                      label: "Voting round opens",
                      description: "When a new monthly voting round begins",
                      email: true,
                      push: true,
                    },
                    {
                      label: "New votes received",
                      description: "When someone votes for your pitch",
                      email: false,
                      push: true,
                    },
                    {
                      label: "Winner announced",
                      description: "Monthly winner announcements",
                      email: true,
                      push: true,
                    },
                    {
                      label: "New messages",
                      description: "Direct messages from community members",
                      email: true,
                      push: true,
                    },
                    {
                      label: "Community updates",
                      description: "New members, features, and announcements",
                      email: true,
                      push: false,
                    },
                  ].map((notif, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {notif.label}
                        </p>
                        <p className="text-xs text-text-muted">
                          {notif.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-xs text-text-secondary">
                          <input
                            type="checkbox"
                            defaultChecked={notif.email}
                            className="rounded border-border-default bg-surface-elevated text-brand-500 focus:ring-brand-500"
                          />
                          Email
                        </label>
                        <label className="flex items-center gap-2 text-xs text-text-secondary">
                          <input
                            type="checkbox"
                            defaultChecked={notif.push}
                            className="rounded border-border-default bg-surface-elevated text-brand-500 focus:ring-brand-500"
                          />
                          Push
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-border-default">
                  <Button
                    variant="brand"
                    leftIcon={<Save className="h-4 w-4" />}
                  >
                    Save Preferences
                  </Button>
                </div>
              </Card>
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
