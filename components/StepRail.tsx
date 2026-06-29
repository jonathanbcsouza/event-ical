"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations("common");

  return (
    <nav aria-label={t("progress")} className="surface-card overflow-hidden rounded-2xl p-1.5 sm:p-3">
      <ol className="flex min-w-0 items-stretch">
        {steps.map((step, index) => (
          <li key={step.n} className="flex min-w-0 flex-1 items-center">
            <StepRailButton step={step} onSelect={onSelect} />
            {index < steps.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mx-0.5 h-px w-2 shrink-0 rounded sm:mx-1 sm:w-5 transition-colors",
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
      aria-label={step.label}
      onClick={() => onSelect(step.n)}
      className={cn(
        "group flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-1 py-1.5 transition-colors sm:justify-start sm:px-3 sm:py-2",
        isActive && "bg-emerald-600/10 dark:bg-emerald-500/15",
        !isActive && !isLocked && "hover:bg-zinc-100 dark:hover:bg-zinc-800/70",
        isLocked && "cursor-not-allowed opacity-55",
      )}
    >
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:size-8 sm:text-sm",
          isActive && "bg-emerald-600 text-white",
          isDone && "bg-emerald-600/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
          (isLocked || step.status === "todo") &&
            "bg-zinc-200 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
        )}
      >
        {isDone ? (
          <Icon icon={Check} className="size-3.5 sm:size-4" />
        ) : isLocked ? (
          <Icon icon={Lock} className="size-3 sm:size-3.5" />
        ) : (
          step.n
        )}
      </span>
      <span className="hidden min-w-0 flex-1 sm:block">
        <span
          className={cn(
            "block truncate text-[0.95rem] font-semibold",
            isActive
              ? "text-zinc-900 dark:text-zinc-50"
              : "text-zinc-600 dark:text-zinc-300",
          )}
        >
          {step.label}
        </span>
        {step.summary && (
          <span className="block truncate text-xs text-zinc-500">
            {step.summary}
          </span>
        )}
      </span>
    </button>
  );
}
