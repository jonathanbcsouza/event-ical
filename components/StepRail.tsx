"use client";

import { Check, Icon, Lock } from "@/lib/icons";
import { cn } from "@/lib/utils";

export type StepStatus = "done" | "active" | "locked" | "todo";

export type StepRailItem = {
  n: number;
  label: string;
  summary?: string;
  status: StepStatus;
};

type StepRailProps = {
  steps: StepRailItem[];
  onSelect: (step: number) => void;
};

export function StepRail({ steps, onSelect }: StepRailProps) {
  return (
    <nav aria-label="Progress" className="surface-card rounded-2xl p-2 sm:p-3">
      <ol className="flex items-stretch gap-1 sm:gap-2">
        {steps.map((step, index) => (
          <li key={step.n} className="flex flex-1 items-center">
            <StepRailButton step={step} onSelect={onSelect} />
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mx-1 h-px w-3 shrink-0 rounded sm:w-6 transition-colors",
                  step.status === "done"
                    ? "bg-emerald-500"
                    : "bg-zinc-200 dark:bg-zinc-700",
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepRailButton({
  step,
  onSelect,
}: {
  step: StepRailItem;
  onSelect: (step: number) => void;
}) {
  const isActive = step.status === "active";
  const isDone = step.status === "done";
  const isLocked = step.status === "locked";

  return (
    <button
      type="button"
      disabled={isLocked}
      aria-current={isActive ? "step" : undefined}
      onClick={() => onSelect(step.n)}
      className={cn(
        "group flex min-w-0 flex-1 items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors sm:px-3",
        isActive && "bg-emerald-600/10 dark:bg-emerald-500/15",
        !isActive && !isLocked && "hover:bg-zinc-100 dark:hover:bg-zinc-800/70",
        isLocked && "cursor-not-allowed opacity-55",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors sm:size-8",
          isActive && "bg-emerald-600 text-white",
          isDone && "bg-emerald-600/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
          (isLocked || step.status === "todo") &&
            "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        )}
      >
        {isDone ? (
          <Icon icon={Check} className="size-4" />
        ) : isLocked ? (
          <Icon icon={Lock} className="size-3.5" />
        ) : (
          step.n
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-xs font-semibold sm:text-[0.95rem]",
            isActive
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-zinc-600 dark:text-zinc-300",
          )}
        >
          {step.label}
        </span>
        {step.summary && (
          <span className="hidden truncate text-xs text-zinc-500 sm:block">
            {step.summary}
          </span>
        )}
      </span>
    </button>
  );
}
