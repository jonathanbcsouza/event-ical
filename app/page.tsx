import { HomePage } from "@/components/HomePage";
import { getResolvedMatches } from "@/lib/resolve";

export default async function Page() {
  const matches = await getResolvedMatches();
  return <HomePage matches={matches} serverNow={Date.now()} />;
}
