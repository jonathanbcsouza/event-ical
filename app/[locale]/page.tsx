import { headers } from "next/headers";
import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/HomePage";
import { getResolvedMatches } from "@/lib/resolve";
import { getRequestTimeZone } from "@/lib/timezones";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const headerStore = await headers();
  const requestTimeZone = getRequestTimeZone((name) => headerStore.get(name));
  const matches = getResolvedMatches();

  return (
    <HomePage
      matches={matches}
      serverNow={Date.now()}
      requestTimeZone={requestTimeZone}
    />
  );
}
