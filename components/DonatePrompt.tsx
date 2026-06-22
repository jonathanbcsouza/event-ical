import { DonateButton } from "@/components/DonateButton";

type DonatePromptProps = {
  matchCount: number;
};

export function DonatePrompt({ matchCount }: DonatePromptProps) {
  return (
    <div className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/80 px-4 py-3 dark:border-amber-900/40 dark:bg-amber-950/25">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Calendar ready — {matchCount}{" "}
            {matchCount === 1 ? "match" : "matches"} exported
          </p>
          <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
            Free to use. If this saved you time, buy me a nice coffee too.
          </p>
        </div>
        <DonateButton variant="primary" className="shrink-0 self-start sm:self-auto" />
      </div>
    </div>
  );
}
