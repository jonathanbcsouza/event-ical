import { useTranslations } from "next-intl";
import { GitHubIcon } from "@/components/GitHubIcon";
import { SITE } from "@/lib/site";

export function GitHubLink() {
  const t = useTranslations("github");

  return (
    <a
      href={SITE.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      className="group relative inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      <GitHubIcon />
      <span
        role="tooltip"
        className="pointer-events-none absolute top-full right-0 z-50 mt-2 whitespace-nowrap rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
      >
        {t("tooltip")}
      </span>
    </a>
  );
}
