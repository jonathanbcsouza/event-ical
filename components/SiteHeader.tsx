import Image from "next/image";
import { DonateButton } from "@/components/DonateButton";
import { GitHubLink } from "@/components/GitHubLink";
import { ThemeToggle } from "@/components/ThemeToggle";

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
          <DonateButton variant="nav" />
          <GitHubLink />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
