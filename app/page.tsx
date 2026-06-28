import { headers } from "next/headers";
import { HomePage } from "@/components/HomePage";
import { getResolvedMatches } from "@/lib/resolve";
import { getRequestTimeZone } from "@/lib/timezones";

export default async function Page() {
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
