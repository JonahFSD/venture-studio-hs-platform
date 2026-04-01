import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PlatformPageHeader({
  icon: Icon,
  title,
  description,
  actions,
  className,
}: {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3 flex-wrap">
          <Icon
            className="h-6 w-6 flex-shrink-0 text-brand-500"
            aria-hidden
          />
          <span className="min-w-0">{title}</span>
        </h1>
        {description != null && description !== false && (
          <div className="text-sm text-text-secondary mt-1">{description}</div>
        )}
      </div>
      {actions}
    </div>
  );
}
