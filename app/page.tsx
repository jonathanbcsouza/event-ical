import { HomePage } from "@/components/HomePage";
import { getResolvedMatches } from "@/lib/resolve";

export default function Page() {
  const matches = getResolvedMatches();
  return <HomePage matches={matches} serverNow={Date.now()} />;
}
