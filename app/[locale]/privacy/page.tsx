import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  const site = await getTranslations({ locale, namespace: "site" });

  return {
    title: t("metaTitle", { siteName: site("name") }),
    description: t("metaDescription"),
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
  const site = await getTranslations("site");
  const common = await getTranslations("common");

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="text-sm text-emerald-600 hover:underline dark:text-emerald-400"
      >
        {common("backToCalendar")}
      </Link>

      <h1 className="mt-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {t("title")}
      </h1>
      <p className="mt-2 text-sm text-zinc-500">{t("lastUpdated")}</p>

      <div className="prose prose-zinc mt-8 space-y-6 text-sm dark:prose-invert">
        <section>
          <h2 className="text-lg font-semibold">{t("overviewTitle")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("overviewBody", {
              siteName: site("name"),
              url: SITE.productionUrl,
            })}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">{t("collectTitle")}</h2>
          <ul className="list-disc space-y-2 pl-5 text-zinc-600 dark:text-zinc-400">
            <li>
              <strong>{t("analyticsTitle")}</strong> — {t("analyticsBody")}{" "}
              <a
                href="https://policies.google.com/privacy"
                className="text-emerald-600 underline dark:text-emerald-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("analyticsLink")}
              </a>
              .
            </li>
            <li>
              <strong>{t("adsTitle")}</strong> — {t("adsBody")}{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="text-emerald-600 underline dark:text-emerald-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("adsLink")}
              </a>
              .
            </li>
            <li>
              <strong>{t("storageTitle")}</strong> — {t("storageBody")}
            </li>
            <li>
              <strong>{t("donationsTitle")}</strong> — {t("donationsBody")}
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold">{t("feedsTitle")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{t("feedsBody")}</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">{t("thirdPartiesTitle")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            {t("thirdPartiesBody")}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold">{t("contactTitle")}</h2>
          <p className="text-zinc-600 dark:text-zinc-400">{t("contactBody")}</p>
        </section>

        <p className="text-xs text-zinc-400">{t("disclaimer")}</p>
      </div>
    </main>
  );
}
