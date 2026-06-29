/** Supported locale codes — must match a file in `messages/`. */
export const supportedLocales = [
  "en",
  "zh",
  "hi",
  "es",
  "fr",
  "ar",
  "bn",
  "pt",
  "ru",
  "mi",
] as const;

/** @deprecated Use `supportedLocales`. */
export const locales = supportedLocales;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

/** Native endonym for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  zh: "中文",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  bn: "বাংলা",
  pt: "Português",
  ru: "Русский",
  mi: "Te Reo Māori",
};

export function isLocale(value: string): value is Locale {
  return (supportedLocales as readonly string[]).includes(value);
}
