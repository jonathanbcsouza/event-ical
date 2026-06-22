"use client";

import { useState, type ReactNode } from "react";
import { StepHeader } from "@/components/StepHeader";
import { ChevronDown, Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type StepPanelProps = {
  step: number;
  title: string;
  description?: string;
  badge?: ReactNode;
  headerAction?: ReactNode;
  summary?: string;
  canComplete?: boolean;
  pendingLabel?: string;
  children: ReactNode;
  className?: string;
};

export function StepPanel({
  step,
  title,
  description,
  badge,
  headerAction,
  summary,
  canComplete = true,
  pendingLabel = "Select",
  children,
  className,
}: StepPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <section
        className={cn(
          "surface-card rounded-2xl px-4 py-3 sm:px-5",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          aria-expanded={false}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600/15 text-sm font-bold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            {step}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </span>
              {badge}
            </div>
            {summary && (
              <p className="truncate text-sm text-zinc-500">{summary}</p>
            )}
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
            Edit
            <Icon icon={ChevronDown} className="size-4 -rotate-90" />
          </span>
        </button>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "surface-card rounded-2xl px-4 py-4 sm:px-5",
        !canComplete && "ring-2 ring-amber-400/40",
        className,
      )}
    >
      <StepHeader
        step={step}
        title={title}
        description={description}
        badge={badge}
        action={
          <div className="flex flex-wrap items-center justify-end gap-2">
            {headerAction}
            {canComplete ? (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
              >
                Done
              </button>
            ) : (
              <span
                aria-live="polite"
                className="step-pending rounded-lg border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 dark:border-amber-500/60 dark:bg-amber-950/50 dark:text-amber-300"
              >
                {pendingLabel}
              </span>
            )}
          </div>
        }
      />
      <div className="mt-4">{children}</div>
    </section>
  );
}
