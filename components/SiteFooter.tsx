import { DonateButton } from "@/components/DonateButton";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-emerald-900/10 dark:border-white/10">
      <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-rose-200/80 bg-white/90 px-6 py-8 text-center backdrop-blur-sm dark:border-rose-900/40 dark:bg-emerald-950/60">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Enjoying the calendar?
          </h2>
          <p className="max-w-md text-sm text-zinc-600 dark:text-zinc-400">
            This project is free and ad-free. If it saved you time, consider
            chipping in to keep it running.
          </p>
          <DonateButton variant="primary" />
        </div>

        <p className="mt-8 text-center text-xs text-zinc-400">
          Not affiliated with FIFA. Match data for informational use only.
        </p>
      </div>
    </footer>
  );
}
