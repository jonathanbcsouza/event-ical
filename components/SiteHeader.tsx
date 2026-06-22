import Image from "next/image";
import { DonateButton } from "@/components/DonateButton";
import { GitHubIcon } from "@/components/GitHubIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SITE } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/10 bg-white/85 backdrop-blur-md dark:border-white/10 dark:bg-zinc-950/75">
      <div className="mx-auto flex h-14 w-full max-w-4xl items-center justify-between gap-2 px-3 sm:h-16 sm:gap-3 sm:px-6">
        <a href="/" className="flex min-w-0 items-center gap-2">
          <Image
            src="/logo.png"
            alt=""
            width={36}
            height={36}
            className="size-8 shrink-0 sm:size-9"
            priority
          />
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-50 sm:text-base">
              World Cup 2026
            </span>
            <span className="hidden text-xs text-zinc-500 sm:block">
              Match Calendar
            </span>
          </span>
        </a>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-1.5 rounded-full border border-zinc-200 bg-white px-2.5 py-2 text-[11px] font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 sm:gap-2 sm:px-3.5 sm:text-xs"
          >
            <GitHubIcon className="size-3.5 text-zinc-500 transition-colors group-hover:text-zinc-800 dark:text-zinc-400 dark:group-hover:text-zinc-100 sm:size-4" />
            <span className="whitespace-nowrap">Contribute</span>
          </a>
          <DonateButton variant="nav" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
