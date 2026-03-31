"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Video,
  Code,
  Globe,
  FileText,
  Link2,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  Send,
  CheckCircle,
} from "lucide-react";

export default function NewSubmissionPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [additionalLinks, setAdditionalLinks] = useState<
    { label: string; url: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { label: "Pitch Details" },
    { label: "Video Upload" },
    { label: "Supporting Links" },
    { label: "Review & Submit" },
  ];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      router.push("/submissions");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-text-primary">
          Submit New Pitch
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Share your venture idea with the community
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                i <= step
                  ? "bg-brand-500 text-black"
                  : "bg-surface-elevated text-text-muted"
              }`}
            >
              {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-xs font-medium hidden sm:block ${
                i <= step ? "text-text-primary" : "text-text-muted"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px ${
                  i < step ? "bg-brand-500" : "bg-border-default"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Card padding="lg">
        {/* Step 1: Pitch Details */}
        {step === 0 && (
          <div className="space-y-5 animate-fade-in">
            <CardTitle>Pitch Details</CardTitle>
            <Input
              label="Pitch Title"
              placeholder="Give your venture a compelling name"
              required
            />
            <Textarea
              label="Description"
              placeholder="Describe your venture idea, the problem it solves, and who it helps..."
              hint="Be clear and concise. Judges will read this alongside your video. (50-500 words)"
              rows={6}
              required
            />
          </div>
        )}

        {/* Step 2: Video Upload */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <CardTitle>Video Pitch</CardTitle>
            <p className="text-sm text-text-secondary">
              Record a 2-5 minute video pitching your idea. Be passionate,
              clear, and concise.
            </p>

            {!videoFile ? (
              <label className="flex flex-col items-center justify-center p-12 rounded-2xl border-2 border-dashed border-border-default bg-surface-elevated hover:bg-surface-overlay hover:border-brand-500/30 transition-all cursor-pointer group">
                <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-500 mb-4 group-hover:bg-brand-500/20 transition-colors">
                  <Upload className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-text-primary">
                  Drag & drop or click to upload
                </p>
                <p className="text-xs text-text-muted mt-1">
                  MP4, MOV, or WebM &bull; Max 500MB &bull; 2-5 minutes
                </p>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    setVideoFile(e.target.files?.[0] || null)
                  }
                />
              </label>
            ) : (
              <div className="p-4 rounded-xl border border-border-default bg-surface-elevated">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-brand-500/10">
                      <Video className="h-5 w-5 text-brand-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {(videoFile.size / 1024 / 1024).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setVideoFile(null)}
                    className="p-1.5 rounded-lg hover:bg-surface-overlay text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <Progress value={100} size="sm" className="mt-3" />
              </div>
            )}

            <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
              <h4 className="text-sm font-medium text-text-primary mb-2">
                Tips for a great pitch video:
              </h4>
              <ul className="space-y-1.5 text-xs text-text-secondary">
                <li>&bull; Start with the problem you&apos;re solving</li>
                <li>&bull; Explain your solution clearly</li>
                <li>&bull; Share your target market/audience</li>
                <li>&bull; Mention how faith drives your mission</li>
                <li>&bull; End with your ask or next steps</li>
              </ul>
            </div>
          </div>
        )}

        {/* Step 3: Supporting Links */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <CardTitle>Supporting Materials</CardTitle>
            <p className="text-sm text-text-secondary">
              Add links to demonstrate your work (all optional)
            </p>

            <Input
              label="GitHub Repository"
              type="url"
              placeholder="https://github.com/your-repo"
              leftIcon={<Code className="h-4 w-4" />}
            />
            <Input
              label="Website / Demo"
              type="url"
              placeholder="https://your-project.com"
              leftIcon={<Globe className="h-4 w-4" />}
            />
            <Input
              label="Slide Deck"
              type="url"
              placeholder="https://docs.google.com/presentation/..."
              leftIcon={<FileText className="h-4 w-4" />}
            />

            {/* Additional Links */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-secondary">
                Additional Links
              </label>
              {additionalLinks.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Label"
                    className="w-1/3"
                    value={link.label}
                    onChange={(e) => {
                      const updated = [...additionalLinks];
                      updated[i].label = e.target.value;
                      setAdditionalLinks(updated);
                    }}
                  />
                  <Input
                    placeholder="URL"
                    className="flex-1"
                    value={link.url}
                    leftIcon={<Link2 className="h-4 w-4" />}
                    onChange={(e) => {
                      const updated = [...additionalLinks];
                      updated[i].url = e.target.value;
                      setAdditionalLinks(updated);
                    }}
                  />
                  <button
                    onClick={() =>
                      setAdditionalLinks(
                        additionalLinks.filter((_, j) => j !== i)
                      )
                    }
                    className="p-2 rounded-lg hover:bg-surface-overlay text-text-tertiary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAdditionalLinks([
                    ...additionalLinks,
                    { label: "", url: "" },
                  ])
                }
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Link
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <CardTitle>Review & Submit</CardTitle>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                  Pitch Title
                </h4>
                <p className="text-sm text-text-primary">
                  EcoTrack - Carbon Footprint Tracker
                </p>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
                <h4 className="text-xs font-medium text-text-muted uppercase tracking-wider mb-2">
                  Video
                </h4>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-brand-500" />
                  <p className="text-sm text-text-primary">
                    {videoFile?.name || "pitch_video.mp4"}
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
                <p className="text-sm text-text-secondary">
                  By submitting, your pitch will be processed by our AI judging
                  engine. You&apos;ll receive detailed feedback within 24-48 hours.
                  Top scoring pitches qualify for community voting.
                </p>
              </div>
            </div>
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
          {step < steps.length - 1 ? (
            <Button
              variant="brand"
              onClick={() => setStep(step + 1)}
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="brand"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              rightIcon={<Send className="h-4 w-4" />}
            >
              Submit Pitch
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
