import { cn } from "@/lib/utils";
import { Card } from "./card";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  /** "percent" appends %; "delta" shows a hard count (use deltaPrefix/deltaSuffix for units). */
  changeFormat?: "percent" | "delta";
  deltaPrefix?: string;
  deltaSuffix?: string;
  icon?: React.ReactNode;
  className?: string;
}

function formatDelta(
  change: number,
  deltaPrefix = "",
  deltaSuffix = ""
): string {
  if (change > 0) {
    return `+${deltaPrefix}${change}${deltaSuffix}`;
  }
  if (change < 0) {
    return `-${deltaPrefix}${Math.abs(change)}${deltaSuffix}`;
  }
  return `0${deltaSuffix}`;
}

export function StatCard({
  label,
  value,
  change,
  changeLabel,
  changeFormat = "percent",
  deltaPrefix = "",
  deltaSuffix = "",
  icon,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNeutral = change !== undefined && change === 0;

  const changeText =
    change !== undefined && changeFormat === "delta"
      ? formatDelta(change, deltaPrefix, deltaSuffix)
      : change !== undefined
        ? `${isPositive ? "+" : ""}${change}%`
        : "";

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-text-secondary">{label}</p>
          <p className="mt-2 text-3xl font-bold text-text-primary tracking-tight">
            {value}
          </p>
          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {!isNeutral ? (
                isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5 text-error" />
                )
              ) : null}
              <span
                className={cn(
                  "text-xs font-medium",
                  isNeutral
                    ? "text-text-muted"
                    : isPositive
                      ? "text-success"
                      : "text-error"
                )}
              >
                {changeText}
              </span>
              {changeLabel && (
                <span className="text-xs text-text-muted">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-500">
            {icon}
          </div>
        )}
      </div>
      {/* Subtle brand glow decoration */}
      <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full bg-brand-500/5 blur-2xl" />
    </Card>
  );
}
