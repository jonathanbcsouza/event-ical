import { getRequestConfig } from "next-intl/server";
import { defaultLocale, isLocale, type Locale } from "./config";
import { routing } from "./routing";

async function loadMessages(locale: Locale): Promise<Record<string, unknown>> {
  const en = (await import("../messages/en.json")).default;
  if (locale === "en") return en;

  try {
    const localized = (await import(`../messages/${locale}.json`)).default;
    return deepMerge(en, localized);
  } catch {
    return en;
  }
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      typeof out[key] === "object" &&
      out[key] !== null &&
      !Array.isArray(out[key])
    ) {
      out[key] = deepMerge(
        out[key] as Record<string, unknown>,
        value as Record<string, unknown>,
      );
    } else {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale =
    requested && isLocale(requested) && routing.locales.includes(requested)
      ? requested
      : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});
