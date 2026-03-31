"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap, ArrowRight, ArrowLeft, CheckCircle } from "lucide-react";

const STEPS = [
  { id: "personal", label: "About You" },
  { id: "faith", label: "Faith & Mission" },
  { id: "venture", label: "Your Venture" },
  { id: "parent", label: "Parent Info" },
];

const graduationYears = Array.from({ length: 6 }, (_, i) => ({
  value: String(2026 + i),
  label: String(2026 + i),
}));

export default function ApplyPage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSubmitted(true);
      }, 2000);
    }
  };

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
          <p className="mt-3 text-text-secondary max-w-sm mx-auto">
            We&apos;ll review your application and get back to you within 3-5
            business days. Check your email for a confirmation.
          </p>
          <Link href="/">
            <Button variant="brand" className="mt-6">
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
          <Zap className="h-6 w-6 text-black" />
        </div>
        <span className="text-xl font-bold text-text-primary">
          Apply to Join
        </span>
      </div>

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
        {/* Step 1: Personal */}
        {step === 0 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Tell Us About Yourself
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" placeholder="John" required />
              <Input label="Last Name" placeholder="Doe" required />
            </div>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Age"
                type="number"
                placeholder="16"
                required
                min={14}
                max={18}
              />
              <Select
                label="Graduation Year"
                options={graduationYears}
                placeholder="Select year"
              />
            </div>
            <Input
              label="School Name"
              placeholder="Your high school"
              required
            />
          </div>
        )}

        {/* Step 2: Faith & Mission */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Faith & Mission
            </h2>
            <Textarea
              label="Faith Statement"
              placeholder="Tell us about your faith journey and how it shapes your approach to entrepreneurship..."
              hint="This helps us understand your alignment with our faith-driven community (100-500 words)"
              rows={5}
              required
            />
            <Textarea
              label="Why do you want to join?"
              placeholder="What excites you about entrepreneurship and this community?"
              rows={4}
              required
            />
          </div>
        )}

        {/* Step 3: Venture */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Your Venture Interests
            </h2>
            <Textarea
              label="Entrepreneurship Interest"
              placeholder="Tell us about your entrepreneurial interests or any projects you've worked on..."
              rows={4}
              required
            />
            <Textarea
              label="AI & Technology Interest"
              placeholder="How do you see AI and technology shaping your entrepreneurial journey?"
              rows={4}
              required
            />
            <Input
              label="Video Introduction (Optional)"
              type="url"
              placeholder="https://youtube.com/watch?v=..."
              hint="Record a 1-2 minute video introducing yourself (YouTube or Loom link)"
            />
          </div>
        )}

        {/* Step 4: Parent Info */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-semibold text-text-primary mb-4">
              Parent/Guardian Information
            </h2>
            <p className="text-sm text-text-secondary bg-surface-elevated rounded-xl p-4 border border-border-default">
              Since all members are under 18, we require parent/guardian consent.
              They&apos;ll receive an email to verify and co-sign your membership.
            </p>
            <Input
              label="Parent/Guardian Full Name"
              placeholder="Jane Doe"
              required
            />
            <Input
              label="Parent/Guardian Email"
              type="email"
              placeholder="parent@example.com"
              required
            />
            <Input
              label="Parent/Guardian Phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              required
            />
            <label className="flex items-start gap-3 text-sm text-text-secondary mt-2">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-border-default bg-surface-elevated text-brand-500 focus:ring-brand-500"
              />
              <span>
                I confirm that I am between 14-18 years old and that the
                parent/guardian information provided is accurate. I agree to the{" "}
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
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-default">
          <Button
            variant="ghost"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <Button
            variant="brand"
            onClick={handleNext}
            isLoading={isLoading}
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {step === STEPS.length - 1 ? "Submit Application" : "Continue"}
          </Button>
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
