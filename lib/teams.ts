import teamsData from "@/data/teams.json";
import type { TeamRef } from "@/lib/fixtures";

type TeamsFile = {
  teams: Record<string, TeamRef>;
  aliases: Record<string, string>;
};

const { teams, aliases } = teamsData as TeamsFile;

const aliasMap = new Map<string, string>(
  Object.entries(aliases).map(([alias, code]) => [alias.toLowerCase(), code]),
);

/** Slot codes and placeholders from the live feed that are not real teams. */
const SLOT_PATTERN =
  /^(?:\d+[A-L]|[123][A-L]{2,}|To be announced|TBD|Draw|Winner Match \d+|Loser Match \d+|Group [A-L] (?:Winner|Runner-up)|3rd Place.*)$/i;

export function isSlotPlaceholder(name: string): boolean {
  const trimmed = name.trim();
  if (!trimmed) return true;
  if (trimmed === "To be announced" || trimmed === "TBD") return true;
  if (/^\d+[A-L]$/.test(trimmed)) return true;
  if (/^[123][A-L]{2,}$/.test(trimmed)) return true;
  if (/^Winner Match \d+$/i.test(trimmed)) return true;
  if (/^Loser Match \d+$/i.test(trimmed)) return true;
  if (/^Group [A-L] (Winner|Runner-up)$/i.test(trimmed)) return true;
  if (/^3rd Place/i.test(trimmed)) return true;
  return SLOT_PATTERN.test(trimmed);
}

export function resolveTeam(name: string): TeamRef {
  const trimmed = name.trim();
  if (!trimmed || isSlotPlaceholder(trimmed)) {
    return { code: "TBD", name: trimmed || "TBD" };
  }

  const aliasCode = aliasMap.get(trimmed.toLowerCase());
  if (aliasCode && teams[aliasCode]) {
    return teams[aliasCode];
  }

  if (teams[trimmed]) {
    return teams[trimmed];
  }

  return { code: "TBD", name: trimmed };
}

export function resolveTeamByCode(code: string): TeamRef | undefined {
  return teams[code];
}

export function getAllTeamRefs(): TeamRef[] {
  return Object.values(teams);
}

/** For the fixture generator: map display name to TeamRef. */
export function teamFromGeneratorName(name: string): TeamRef {
  const hit = resolveTeam(name);
  if (hit.code !== "TBD") return hit;
  return { code: "TBD", name };
}

/** For official schedule pairing: feed name to FIFA code. */
export function feedNameToCode(name: string): string | undefined {
  const resolved = resolveTeam(name);
  return resolved.code !== "TBD" ? resolved.code : undefined;
}
