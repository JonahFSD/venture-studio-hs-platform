"use client";

import { Suspense, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MultiSelectDropdown } from "@/components/ui/multi-select-dropdown";
import { CategorizedMultiSelectDropdown } from "@/components/ui/categorized-multi-select-dropdown";
import { PROFILE_SKILL_OPTIONS, PROFILE_TOOL_CATEGORIES } from "@/lib/profile-options";
import { US_STATE_ABBREVIATIONS } from "@/lib/us-states";
import {
  schoolToKey,
  keyToSchool,
  formatSchoolLabel,
  type NewSchoolPayload,
  type SchoolListing,
} from "@/lib/school-directory";
import { SchoolPicker } from "@/components/school-picker";
import { cn } from "@/lib/utils";
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Handshake,
  X,
  Plus,
  ExternalLink,
  ClipboardList,
  User,
  Sparkles,
  Link2,
  Heart,
  ShieldCheck,
  FileCheck,
} from "lucide-react";

const STEPS = [
  { id: "personal", label: "About You", icon: User },
  { id: "profile", label: "Your Profile", icon: Sparkles },
  { id: "portfolio", label: "Portfolio", icon: Link2 },
  { id: "faith", label: "Faith & Venture", icon: Heart },
  { id: "parent", label: "Parent / Guardian", icon: ShieldCheck },
  { id: "review", label: "Review & Submit", icon: FileCheck },
];

const graduationYears = Array.from({ length: 7 }, (_, i) => ({
  value: String(2025 + i),
  label: String(2025 + i),
}));

type PortfolioLink = { label: string; url: string };

function ApplyReferralBanner({ onRef }: { onRef: (code: string) => void }) {
  const params = useSearchParams();
  const ref = params.get("ref");
  const calledRef = useRef(false);

  useEffect(() => {
    if (ref && !calledRef.current) {
      calledRef.current = true;
      onRef(ref);
    }
  }, [ref, onRef]);

  if (!ref) return null;
  return (
    <div
      className="mb-6 rounded-lg border border-brand-500/20 bg-brand-500/5 px-4 py-3 text-center"
      role="status"
    >
      <p className="text-xs text-text-secondary">
        You&apos;re applying with a member invite. When you&apos;re approved, your referrer
        earns <span className="font-medium text-brand-500">500 points</span> on the
        leaderboard.
      </p>
    </div>
  );
}

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Step 1: About You
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // School picker state
  const [extraSchoolsByState, setExtraSchoolsByState] = useState<
    Record<string, SchoolListing[]>
  >({});
  const [selectedSchoolKey, setSelectedSchoolKey] = useState<string | null>(null);

  // Step 2: Your Profile
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [lookingForCofounders, setLookingForCofounders] = useState(false);

  // Step 3: Portfolio
  const [portfolioLinks, setPortfolioLinks] = useState<PortfolioLink[]>([
    { label: "", url: "" },
  ]);

  // Step 4: Faith & Venture
  const [faithStatement, setFaithStatement] = useState("");
  const [entrepreneurshipInterest, setEntrepreneurshipInterest] = useState("");
  const [aiInterest, setAiInterest] = useState("");

  // Step 5: Parent / Guardian
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [videoIntroUrl, setVideoIntroUrl] = useState("");

  // Referral
  const [referralCode, setReferralCode] = useState<string | undefined>(undefined);
  const handleReferralCode = useCallback((code: string) => setReferralCode(code), []);

  const submitApplication = useMutation(api.applications.submitApplication);

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
  }

  // Extract school name from key
  function getSchoolName(): string {
    if (!selectedSchoolKey) return "";
    const parts = selectedSchoolKey.split("|");
    return parts.length >= 3 ? parts[2] : "";
  }

  // Portfolio link helpers
  function updatePortfolioLink(index: number, field: "label" | "url", value: string) {
    setPortfolioLinks((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addPortfolioLink() {
    if (portfolioLinks.length >= 5) return;
    setPortfolioLinks((prev) => [...prev, { label: "", url: "" }]);
  }

  function removePortfolioLink(index: number) {
    if (portfolioLinks.length <= 1) {
      setPortfolioLinks([{ label: "", url: "" }]);
      return;
    }
    setPortfolioLinks((prev) => prev.filter((_, i) => i !== index));
  }

  // Check if last portfolio link row is populated (both fields have values)
  const lastLink = portfolioLinks[portfolioLinks.length - 1];
  const lastLinkPopulated = lastLink.label.trim() !== "" && lastLink.url.trim() !== "";
  const canAddMore = portfolioLinks.length < 5 && lastLinkPopulated;

  // Validation
  function validateStep(stepIndex: number): boolean {
    const errors: Record<string, string> = {};

    if (stepIndex === 0) {
      if (!firstName.trim()) errors.firstName = "First name is required";
      if (!lastName.trim()) errors.lastName = "Last name is required";
      if (!email.trim()) errors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
        errors.email = "Please enter a valid email";
      if (!age) errors.age = "Age is required";
      else if (Number(age) < 14 || Number(age) > 18)
        errors.age = "Must be between 14 and 18";
      if (!graduationYear) errors.graduationYear = "Graduation year is required";
      if (!selectedSchoolKey) errors.school = "School is required";
    }

    if (stepIndex === 3) {
      if (!faithStatement.trim()) errors.faithStatement = "Faith statement is required";
      else if (faithStatement.trim().split(/\s+/).length < 20)
        errors.faithStatement = "Please write at least 20 words";
    }

    if (stepIndex === 4) {
      if (!parentName.trim()) errors.parentName = "Parent/guardian name is required";
      if (!parentEmail.trim()) errors.parentEmail = "Parent/guardian email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.trim()))
        errors.parentEmail = "Please enter a valid email";
      if (!parentPhone.trim()) errors.parentPhone = "Parent/guardian phone is required";
      if (!consent) errors.consent = "You must agree to proceed";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      // Validate current step before proceeding
      if (validateStep(step)) {
        setStep(step + 1);
      }
    }
  }

  async function handleSubmit() {
    setIsLoading(true);
    setError(null);
    try {
      // Gather non-empty portfolio links
      const filledLinks = portfolioLinks
        .filter((l) => l.label.trim() && l.url.trim())
        .map((l) => ({ label: l.label.trim(), url: l.url.trim() }));

      await submitApplication({
        userEmail: email.trim(),
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        age: Number(age),
        school: getSchoolName(),
        graduationYear: Number(graduationYear),
        faithStatement,
        entrepreneurshipInterest,
        aiInterest,
        videoIntroUrl: videoIntroUrl || undefined,
        parentName,
        parentEmail,
        parentPhone,
        referralCode,
        phone: phone || undefined,
        city: city || undefined,
        state: state || undefined,
        bio: bio || undefined,
        skills: skills.length > 0 ? skills : undefined,
        tools: tools.length > 0 ? tools : undefined,
        lookingForCofounders: lookingForCofounders || undefined,
        portfolioLinks: filledLinks.length > 0 ? filledLinks : undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ---------- Success screen ----------
  if (submitted) {
    return (
      <div className="w-full animate-fade-in">
        <Card padding="lg" className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Application Submitted!
          </h1>
          <p className="mt-3 text-text-secondary max-w-md mx-auto">
            Thank you for applying to ACU Youth Venture! Our executive team will review
            your application within 1-3 business days.
          </p>
          <p className="mt-2 text-sm text-text-muted">
            You&apos;ll receive an email at{" "}
            <span className="font-medium text-text-primary">{email}</span> when a
            decision has been made.
          </p>

          <div className="mt-6 rounded-xl border border-brand-500/20 bg-brand-500/5 p-5 text-left max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardList className="h-5 w-5 text-brand-500" />
              <h3 className="font-semibold text-text-primary">
                Builder&apos;s Quotient Assessment
              </h3>
            </div>
            <p className="text-sm text-text-secondary mb-3">
              In the meantime, complete your Builder&apos;s Quotient assessment to help us
              understand your entrepreneurial strengths.
            </p>
            <a
              href="https://bq.austinchristianu.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="brand"
                rightIcon={<ExternalLink className="h-4 w-4" />}
              >
                Take the BQ Assessment
              </Button>
            </a>
          </div>

          <Link href="/">
            <Button variant="ghost" className="mt-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ---------- Review helpers ----------
  const parsedSchool = selectedSchoolKey ? keyToSchool(selectedSchoolKey) : null;
  const schoolLabel = parsedSchool
    ? formatSchoolLabel(parsedSchool)
    : "Not selected";

  const filledPortfolioLinks = portfolioLinks.filter(
    (l) => l.label.trim() && l.url.trim()
  );

  // ---------- Main form ----------
  return (
    <div className="w-full animate-fade-in">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
          <Zap className="h-6 w-6 text-black" />
        </div>
        <span className="text-xl font-bold text-text-primary">Apply to Join</span>
      </div>

      <Suspense fallback={null}>
        <ApplyReferralBanner onRef={handleReferralCode} />
      </Suspense>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`text-xs font-medium ${
                i <= step ? "text-brand-500" : "text-text-muted"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>
        <Progress value={step + 1} max={STEPS.length} size="sm" />
      </div>

      <Card padding="lg">
        {/* ──────────── Step 1: About You ──────────── */}
        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Tell Us About Yourself
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={validationErrors.firstName}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={validationErrors.lastName}
              />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
            />
            <Input
              label="Phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="(555) 555-5555"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              hint="Optional"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                placeholder="16"
                required
                min={14}
                max={18}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                error={validationErrors.age}
              />
              <Select
                label="Graduation Year"
                options={graduationYears}
                placeholder="Select year"
                value={graduationYear}
                onChange={(e) => setGraduationYear(e.target.value)}
                error={validationErrors.graduationYear}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Austin"
                autoComplete="address-level2"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Select
                label="State"
                options={US_STATE_ABBREVIATIONS.map((abbr) => ({
                  value: abbr,
                  label: abbr,
                }))}
                placeholder="Select state"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div>
              <SchoolPicker
                value={selectedSchoolKey}
                onChange={setSelectedSchoolKey}
                extraSchoolsByState={extraSchoolsByState}
                onAddSchool={handleAddSchool}
              />
              {validationErrors.school && (
                <p className="text-xs text-error mt-1.5">{validationErrors.school}</p>
              )}
            </div>
          </div>
        )}

        {/* ──────────── Step 2: Your Profile ──────────── */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Your Profile
            </h2>
            <Textarea
              label="Bio"
              placeholder="Tell us about yourself and what drives you..."
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              hint="Optional -- give us a sense of who you are"
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
        )}

        {/* ──────────── Step 3: Portfolio ──────────── */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-1">
              Portfolio
            </h2>
            <p className="text-sm text-text-secondary">
              Share links to any published work -- existing startups, websites, social
              media profiles, codebases, YouTube channels, etc. (Optional)
            </p>

            <div className="space-y-3">
              {portfolioLinks.map((link, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <Input
                      label={index === 0 ? "Label" : undefined}
                      placeholder="e.g., My GitHub Profile"
                      value={link.label}
                      onChange={(e) =>
                        updatePortfolioLink(index, "label", e.target.value)
                      }
                    />
                    <Input
                      label={index === 0 ? "URL" : undefined}
                      type="url"
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) =>
                        updatePortfolioLink(index, "url", e.target.value)
                      }
                    />
                  </div>
                  {(portfolioLinks.length > 1 || link.label || link.url) && (
                    <button
                      type="button"
                      onClick={() => removePortfolioLink(index)}
                      className={cn(
                        "shrink-0 rounded-lg p-2 text-text-muted hover:text-error hover:bg-error/10 transition-colors",
                        index === 0 ? "mt-7" : "mt-0.5"
                      )}
                      aria-label="Remove link"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {canAddMore && (
              <button
                type="button"
                onClick={addPortfolioLink}
                className="flex items-center gap-2 text-sm text-brand-500 hover:text-brand-400 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add another link
              </button>
            )}

            {portfolioLinks.length >= 5 && (
              <p className="text-xs text-text-muted">
                Maximum of 5 portfolio links reached.
              </p>
            )}
          </div>
        )}

        {/* ──────────── Step 4: Faith & Venture ──────────── */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Faith & Venture
            </h2>
            <Textarea
              label="Faith Statement"
              placeholder="Share how your faith shapes your approach to entrepreneurship and innovation..."
              hint="100-500 words"
              rows={5}
              required
              value={faithStatement}
              onChange={(e) => setFaithStatement(e.target.value)}
              error={validationErrors.faithStatement}
            />
            <Textarea
              label="Entrepreneurship Interest"
              placeholder="What entrepreneurial experiences do you have? What problems do you want to solve?"
              rows={4}
              value={entrepreneurshipInterest}
              onChange={(e) => setEntrepreneurshipInterest(e.target.value)}
            />
            <Textarea
              label="AI & Technology Interest"
              placeholder="How do you use or want to use AI and technology?"
              rows={4}
              value={aiInterest}
              onChange={(e) => setAiInterest(e.target.value)}
            />
          </div>
        )}

        {/* ──────────── Step 5: Parent / Guardian ──────────── */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Parent / Guardian Information
            </h2>
            <p className="text-sm text-text-secondary bg-surface-elevated rounded-xl p-4 border border-border-default">
              Since all members are under 18, we require parent/guardian consent.
              They&apos;ll receive an email to verify and co-sign your membership.
            </p>
            <Input
              label="Parent/Guardian Full Name"
              placeholder="Jane Doe"
              required
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              error={validationErrors.parentName}
            />
            <Input
              label="Parent/Guardian Email"
              type="email"
              placeholder="parent@example.com"
              required
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              error={validationErrors.parentEmail}
            />
            <Input
              label="Parent/Guardian Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              required
              value={parentPhone}
              onChange={(e) => setParentPhone(e.target.value)}
              error={validationErrors.parentPhone}
            />
            <div>
              <label className="flex items-start gap-3 text-sm text-text-secondary mt-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 rounded border-border-default bg-surface-elevated text-brand-500 focus:ring-brand-500"
                />
                <span>
                  I confirm the applicant is between 14-18 years old and I consent to
                  their participation. I have reviewed and agree to the{" "}
                  <Link
                    href="#"
                    className="text-brand-500 hover:text-brand-400"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-brand-500 hover:text-brand-400"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {validationErrors.consent && (
                <p className="text-xs text-error mt-1.5 ml-7">
                  {validationErrors.consent}
                </p>
              )}
            </div>
            <Input
              label="Video Introduction URL"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              hint="Optional: Link to a 1-2 minute video introduction"
              value={videoIntroUrl}
              onChange={(e) => setVideoIntroUrl(e.target.value)}
            />
          </div>
        )}

        {/* ──────────── Step 6: Review & Submit ──────────── */}
        {step === 5 && (
          <div className="space-y-5 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Review Your Application
            </h2>

            {/* Personal Info */}
            <div className="rounded-xl border border-border-default bg-surface-elevated p-4 space-y-2">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <User className="h-4 w-4 text-brand-500" />
                Personal Information
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <ReviewRow label="Name" value={`${firstName} ${lastName}`} />
                <ReviewRow label="Email" value={email} />
                <ReviewRow label="Phone" value={phone || "Not provided"} />
                <ReviewRow label="Age" value={age} />
                <ReviewRow label="Graduation Year" value={graduationYear} />
                <ReviewRow label="Location" value={city && state ? `${city}, ${state}` : city || state || "Not provided"} />
                <ReviewRow label="School" value={schoolLabel} />
              </div>
            </div>

            {/* Profile */}
            <div className="rounded-xl border border-border-default bg-surface-elevated p-4 space-y-2">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-500" />
                Profile
              </h3>
              <div className="space-y-2 text-sm">
                <ReviewRow label="Bio" value={bio || "Not provided"} />
                <div>
                  <span className="text-text-muted">Skills: </span>
                  {skills.length > 0 ? (
                    <span className="inline-flex flex-wrap gap-1 mt-1">
                      {skills.map((s) => (
                        <Badge key={s} variant="brand" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                    </span>
                  ) : (
                    <span className="text-text-secondary">None selected</span>
                  )}
                </div>
                <div>
                  <span className="text-text-muted">Tools: </span>
                  {tools.length > 0 ? (
                    <span className="inline-flex flex-wrap gap-1 mt-1">
                      {tools.map((t) => (
                        <Badge key={t} variant="default" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </span>
                  ) : (
                    <span className="text-text-secondary">None selected</span>
                  )}
                </div>
                <ReviewRow
                  label="Open to Cofounders"
                  value={lookingForCofounders ? "Yes" : "No"}
                />
              </div>
            </div>

            {/* Portfolio Links */}
            {filledPortfolioLinks.length > 0 && (
              <div className="rounded-xl border border-border-default bg-surface-elevated p-4 space-y-2">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-brand-500" />
                  Portfolio Links
                </h3>
                <div className="space-y-1 text-sm">
                  {filledPortfolioLinks.map((l, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-text-muted">{l.label}:</span>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-500 hover:text-brand-400 truncate"
                      >
                        {l.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Faith & Venture */}
            <div className="rounded-xl border border-border-default bg-surface-elevated p-4 space-y-2">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Heart className="h-4 w-4 text-brand-500" />
                Faith & Venture
              </h3>
              <div className="space-y-2 text-sm">
                <ReviewRow label="Faith Statement" value={faithStatement} multiline />
                <ReviewRow
                  label="Entrepreneurship Interest"
                  value={entrepreneurshipInterest || "Not provided"}
                  multiline
                />
                <ReviewRow
                  label="AI & Technology Interest"
                  value={aiInterest || "Not provided"}
                  multiline
                />
              </div>
            </div>

            {/* Parent Info */}
            <div className="rounded-xl border border-border-default bg-surface-elevated p-4 space-y-2">
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-brand-500" />
                Parent / Guardian
              </h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <ReviewRow label="Name" value={parentName} />
                <ReviewRow label="Email" value={parentEmail} />
                <ReviewRow label="Phone" value={parentPhone} />
                <ReviewRow
                  label="Video Intro"
                  value={videoIntroUrl || "Not provided"}
                />
              </div>
            </div>

            {/* BQ Assessment CTA */}
            <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-5">
              <div className="flex items-center gap-2 mb-2">
                <ClipboardList className="h-5 w-5 text-brand-500" />
                <h3 className="font-semibold text-text-primary">
                  Builder&apos;s Quotient Assessment
                </h3>
              </div>
              <p className="text-sm text-text-secondary mb-3">
                After submitting your application, we recommend completing the
                Builder&apos;s Quotient (BQ) assessment. This helps us understand your
                entrepreneurial strengths and match you with the right opportunities.
              </p>
              <a
                href="https://bq.austinchristianu.org/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                >
                  Take the BQ Assessment
                </Button>
              </a>
              <p className="text-xs text-text-muted mt-2">
                You can complete this before or after your application is reviewed.
              </p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-error/20 bg-error/5 px-4 py-3">
            <AlertCircle className="h-4 w-4 text-error shrink-0" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-default">
          <Button
            variant="ghost"
            onClick={() => {
              setValidationErrors({});
              setStep(step - 1);
            }}
            disabled={step === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          {step === STEPS.length - 1 ? (
            <Button
              variant="brand"
              onClick={handleSubmit}
              isLoading={isLoading}
              rightIcon={<CheckCircle className="h-4 w-4" />}
            >
              Submit Application
            </Button>
          ) : (
            <Button
              variant="brand"
              onClick={handleNext}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Continue
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-6 text-center text-sm text-text-secondary">
        Already a member?{" "}
        <Link
          href="/login"
          className="text-brand-500 hover:text-brand-400 font-medium transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

// ---------- Review row helper ----------
function ReviewRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className={multiline ? "" : ""}>
      <span className="text-text-muted">{label}: </span>
      {multiline ? (
        <p className="text-text-secondary mt-0.5 whitespace-pre-wrap">{value}</p>
      ) : (
        <span className="text-text-secondary">{value}</span>
      )}
    </div>
  );
}
