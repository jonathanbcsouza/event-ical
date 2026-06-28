"use client";

import { type ReactNode } from "react";
import { StepHeader } from "@/components/StepHeader";
import { ArrowRight, Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type StepCardProps = {
  step: number;
  title: string;
  description?: string;
  badge?: ReactNode;
  headerAction?: ReactNode;
  canComplete?: boolean;
  pendingLabel?: string;
  doneLabel?: string;
  onDone?: () => void;
  isLastStep?: boolean;
  children: ReactNode;
  className?: string;
};

export function StepCard({
  step,
  title,
  description,
  badge,
  headerAction,
  canComplete = true,
  pendingLabel = "Select",
  doneLabel = "Next",
  onDone,
  isLastStep = false,
  children,
  className,
}: StepCardProps) {
  return (
    <section
      className={cn(
        "surface-card step-card-enter rounded-2xl px-4 py-4 sm:px-5",
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
            {!isLastStep &&
              (canComplete ? (
                <button
                  type="button"
                  onClick={onDone}
                  className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  {doneLabel}
                  <Icon icon={ArrowRight} className="size-4" />
                </button>
              ) : (
                <span
                  aria-live="polite"
                  className="step-pending rounded-lg border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 dark:border-amber-500/60 dark:bg-amber-950/50 dark:text-amber-300"
                >
                  {pendingLabel}
                </span>
              ))}
          </div>
        }
      />
      <div className="mt-4">{children}</div>
    </section>
  );
}
