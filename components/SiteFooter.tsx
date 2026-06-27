import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { DonateButton } from "@/components/DonateButton";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-emerald-900/10 dark:border-white/10">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <AdSlot className="mb-8" />

        <div className="flex flex-col items-center gap-4 rounded-2xl border border-amber-200/80 bg-white/90 px-6 py-8 text-center backdrop-blur-sm dark:border-amber-900/40 dark:bg-emerald-950/60">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Enjoying the calendar?
          </h2>
          <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            This project is free to use. If it saved you time, buy me a nice
            coffee too.
          </p>
          <DonateButton variant="primary" />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          Not affiliated with FIFA. Match data for informational use only. Scores
          update every 30 minutes.{" "}
          <Link
            href="/privacy"
            className="underline hover:text-zinc-500 dark:hover:text-zinc-300"
          >
            Privacy
          </Link>
        </p>
      </div>
    </footer>
  );
}
