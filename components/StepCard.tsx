"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef, useState } from "react";
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
  pendingLabel,
  doneLabel,
  onDone,
  isLastStep = false,
  children,
  className,
}: StepCardProps) {
  const tCommon = useTranslations("common");
  const tSteps = useTranslations("steps");
  const resolvedPendingLabel = pendingLabel ?? tSteps("selectToContinue");
  const resolvedDoneLabel = doneLabel ?? tCommon("next");

  const [hintOpen, setHintOpen] = useState(false);
  const hintTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (hintTimerRef.current !== null) {
        window.clearTimeout(hintTimerRef.current);
      }
    };
  }, []);

  function showBlockedHint() {
    setHintOpen(true);
    if (hintTimerRef.current !== null) {
      window.clearTimeout(hintTimerRef.current);
    }
    hintTimerRef.current = window.setTimeout(() => {
      setHintOpen(false);
      hintTimerRef.current = null;
    }, 3500);
  }

  function handleNextClick() {
    if (!canComplete) {
      showBlockedHint();
      return;
    }
    onDone?.();
  }

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
            {!isLastStep && (
              <div className="relative">
                <button
                  type="button"
                  onClick={handleNextClick}
                  aria-describedby={hintOpen ? `step-${step}-hint` : undefined}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
                    canComplete
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "border border-zinc-300 bg-zinc-100 text-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-500",
                  )}
                >
                  {resolvedDoneLabel}
                  <Icon
                    icon={ArrowRight}
                    className={cn("size-4", !canComplete && "opacity-60")}
                  />
                </button>
                {hintOpen && (
                  <p
                    id={`step-${step}-hint`}
                    role="status"
                    className="absolute right-0 top-full z-20 mt-1.5 w-max max-w-[14rem] rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-800 shadow-md dark:border-amber-500/50 dark:bg-amber-950 dark:text-amber-200"
                  >
                    {resolvedPendingLabel}
                  </p>
                )}
              </div>
            )}
          </div>
        }
      />
      <div className="mt-4">{children}</div>
    </section>
  );
}
