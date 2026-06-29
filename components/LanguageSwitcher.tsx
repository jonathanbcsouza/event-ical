"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  defaultLocale,
  isLocale,
  localeNames,
  supportedLocales,
  type Locale,
} from "@/i18n/config";
import { Globe, Icon } from "@/lib/icons";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const t = useTranslations("language");
  const rawLocale = useLocale();
  const activeLocale: Locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const router = useRouter();
  const pathname = usePathname();

  function onLocaleChange(next: string) {
    if (!isLocale(next)) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{t("select")}</span>
      <Icon
        icon={Globe}
        className="pointer-events-none absolute left-2 size-4 text-zinc-500"
        aria-hidden
      />
      <select
        value={activeLocale}
        onChange={(e) => onLocaleChange(e.target.value)}
        aria-label={t("label")}
        className={cn(
          "h-9 max-w-[11rem] cursor-pointer appearance-none rounded-lg border border-zinc-200 bg-white pl-8 pr-7 text-xs font-medium text-zinc-800",
          "hover:border-zinc-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30",
          "dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600",
        )}
      >
        {supportedLocales.map((code) => (
          <option key={code} value={code}>
            {localeNames[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
