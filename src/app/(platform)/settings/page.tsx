"use client";

import { useState, useRef } from "react";
import { PlatformPageHeader } from "@/components/layout/platform-page-header";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Tabs } from "@/components/ui/tabs";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { CategorizedMultiSelectDropdown } from "@/components/ui/categorized-multi-select-dropdown";
import { PROFILE_SKILL_OPTIONS, PROFILE_TOOL_CATEGORIES } from "@/lib/profile-options";
import { US_STATE_ABBREVIATIONS } from "@/lib/us-states";
import {
  schoolToKey,
  type NewSchoolPayload,
  type SchoolListing,
} from "@/lib/school-directory";
import { SchoolPicker } from "@/components/school-picker";
import { ProfilePhotoCropModal } from "@/components/profile-photo-crop-modal";
import { InviteLinkCard } from "@/components/invite-link-card";
import { MOCK_REFERRAL_CODE } from "@/lib/referral";
import { cn } from "@/lib/utils";
import {
  User,
  CreditCard,
  Bell,
  Camera,
  Save,
  ExternalLink,
  CheckCircle,
  Settings,
  Handshake,
} from "lucide-react";

export default function SettingsPage() {
  const [skills, setSkills] = useState<string[]>([
    "Vibe Coding",
    "UX/UI",
    "Marketing",
  ]);
  const [tools, setTools] = useState<string[]>([
    "Cursor",
    "Supabase",
    "Stripe",
    "Vercel",
  ]);
  const [lookingForCofounders, setLookingForCofounders] = useState(true);
  const [extraSchoolsByState, setExtraSchoolsByState] = useState<
    Record<string, SchoolListing[]>
  >({});
  const [selectedSchoolKey, setSelectedSchoolKey] = useState<string | null>(() =>
    schoolToKey({
      state: "TX",
      name: "Austin Christian High School",
      city: "Austin",
    })
  );
  const [, setSchoolSubmissions] = useState<NewSchoolPayload[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  function openPhotoPicker() {
    fileInputRef.current?.click();
  }

  function onAvatarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      window.alert("Please choose a JPG or PNG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      window.alert("File must be 2MB or smaller.");
      return;
    }
    const url = URL.createObjectURL(file);
    setCropSrc(url);
    setCropOpen(true);
  }

  function closePhotoCrop() {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setCropOpen(false);
  }

  function onAvatarCropped(dataUrl: string) {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    setCropOpen(false);
    setAvatarSrc(dataUrl);
  }

  function handleAddSchool(payload: NewSchoolPayload) {
    const { schoolCity, schoolState, schoolName } = payload;
    setExtraSchoolsByState((prev) => {
      const next = { ...prev };
      const list = next[schoolState] ?? [];
      next[schoolState] = [...list, { name: schoolName, city: schoolCity }];
      return next;
    });
    setSelectedSchoolKey(
      schoolToKey({ state: schoolState, name: schoolName, city: schoolCity })
    );
    setSchoolSubmissions((prev) => [...prev, payload]);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <PlatformPageHeader icon={Settings} title="Settings" />

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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
                  {/* Avatar */}
                  <Card className="flex h-full min-h-0 flex-col">
                    <CardTitle>Profile Photo</CardTitle>
                    <div className="mt-4 flex min-h-0 flex-1 flex-col justify-center">
                      <div className="flex items-center gap-6">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png"
                          className="sr-only"
                          aria-label="Upload profile photo, JPG or PNG, max 2MB"
                          onChange={onAvatarFileChange}
                        />
                        <div className="relative shrink-0">
                          <Avatar name="Jake Oswald" size="2xl" src={avatarSrc} />
                          <button
                            type="button"
                            onClick={openPhotoPicker}
                            className="absolute -bottom-0.5 -right-0.5 rounded-full bg-brand-500 p-2 text-black hover:bg-brand-400 transition-colors"
                            aria-label="Upload profile photo"
                          >
                            <Camera className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={openPhotoPicker}
                          >
                            Upload Photo
                          </Button>
                          <p className="text-xs text-text-muted mt-1">
                            JPG, PNG. Max 2MB.
                          </p>
                        </div>
                      </div>
                    </div>
                    <ProfilePhotoCropModal
                      isOpen={cropOpen && !!cropSrc}
                      imageSrc={cropSrc}
                      onClose={closePhotoCrop}
                      onSave={onAvatarCropped}
                    />
                  </Card>

                  <InviteLinkCard referralCode={MOCK_REFERRAL_CODE} />
                </div>

                {/* Personal Info */}
                <Card>
                  <CardTitle>Personal Information</CardTitle>
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="First Name" defaultValue="Jake" />
                      <Input label="Last Name" defaultValue="Oswald" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Email"
                        type="email"
                        defaultValue="jake@example.com"
                        disabled
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="(555) 555-5555"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        defaultValue="Austin"
                        autoComplete="address-level2"
                      />
                      <Select
                        label="State"
                        options={US_STATE_ABBREVIATIONS.map((abbr) => ({
                          value: abbr,
                          label: abbr,
                        }))}
                        defaultValue="TX"
                      />
                    </div>
                    <SchoolPicker
                      value={selectedSchoolKey}
                      onChange={setSelectedSchoolKey}
                      extraSchoolsByState={extraSchoolsByState}
                      onAddSchool={handleAddSchool}
                    />
                    <Textarea
                      label="Bio"
                      defaultValue="Aspiring tech entrepreneur passionate about sustainability and faith-driven innovation."
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="min-w-0">
                        <MultiSelectDropdown
                          label="Skills"
                          options={[...PROFILE_SKILL_OPTIONS]}
                          value={skills}
                          onChange={setSkills}
                          emptyLabel="Select skills"
                        />
                      </div>
                      <div className="min-w-0">
                        <CategorizedMultiSelectDropdown
                          label="Tools"
                          categories={PROFILE_TOOL_CATEGORIES}
                          value={tools}
                          onChange={setTools}
                          emptyLabel="Select tools"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="mb-1 block text-xs font-medium text-text-muted">
                        Open to Cofounders
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={lookingForCofounders}
                        aria-label="Open to Cofounders"
                        onClick={() => setLookingForCofounders((v) => !v)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setLookingForCofounders((v) => !v);
                          }
                        }}
                        className={cn(
                          "relative h-9 w-[3.75rem] shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card",
                          lookingForCofounders
                            ? "border-brand-500 bg-brand-500/15"
                            : "border-border-default bg-surface-elevated"
                        )}
                      >
                        <span
                          className={cn(
                            "pointer-events-none absolute left-0.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-surface-card shadow-sm transition-transform duration-200",
                            lookingForCofounders
                              ? "translate-x-7 text-brand-500"
                              : "translate-x-0 text-white"
                          )}
                        >
                          <Handshake className="h-4 w-4" aria-hidden />
                        </span>
                      </button>
                    </div>
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
                      sms: true,
                    },
                    {
                      label: "Voting round opens",
                      description: "When a new monthly voting round begins",
                      email: true,
                      sms: true,
                    },
                    {
                      label: "Winners announced",
                      description: "Monthly winner announcements",
                      email: true,
                      sms: true,
                    },
                    {
                      label: "Monthly recap",
                      description: "Overview of how well you performed",
                      email: true,
                      sms: false,
                    },
                    {
                      label: "New messages",
                      description: "Direct messages from community members",
                      email: true,
                      sms: true,
                    },
                    {
                      label: "Community updates",
                      description: "New members, features, and announcements",
                      email: true,
                      sms: false,
                    },
                  ].map((notif) => (
                    <div
                      key={notif.label}
                      className="flex items-center justify-between gap-4 py-3 border-b border-border-subtle last:border-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary">
                          {notif.label}
                        </p>
                        <p className="text-xs text-text-muted">
                          {notif.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
                          <input
                            type="checkbox"
                            defaultChecked={notif.email}
                            className="h-4 w-4 cursor-pointer rounded border-border-strong accent-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 focus:ring-offset-surface-card"
                          />
                          Email
                        </label>
                        <label className="flex cursor-pointer items-center gap-2 text-xs text-text-secondary">
                          <input
                            type="checkbox"
                            defaultChecked={notif.sms}
                            className="h-4 w-4 cursor-pointer rounded border-border-strong accent-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:ring-offset-2 focus:ring-offset-surface-card"
                          />
                          SMS
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
