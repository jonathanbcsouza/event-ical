import { writeFileSync, readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");

const SOURCE_URL =
  process.env.RESULTS_SOURCE_URL?.trim() ||
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

const teamsFile = JSON.parse(
  readFileSync(join(DATA_DIR, "teams.json"), "utf8"),
);

const aliasMap = new Map(
  Object.entries(teamsFile.aliases).map(([name, code]) => [
    normalizeName(name),
    code,
  ]),
);

function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s*&\s*/g, " and ");
}

function toCode(name) {
  return aliasMap.get(normalizeName(name));
}

function pairKey(a, b) {
  return [a, b].sort().join("-");
}

async function main() {
  const res = await fetch(SOURCE_URL);
  if (!res.ok) {
    throw new Error(`Source returned ${res.status}`);
  }
  const data = await res.json();
  const matches = Array.isArray(data?.matches) ? data.matches : [];

  const rows = [];
  let skipped = 0;

  for (const match of matches) {
    const ft = match?.score?.ft;
    if (!Array.isArray(ft) || ft.length !== 2) continue;
    if (typeof ft[0] !== "number" || typeof ft[1] !== "number") continue;

    const homeCode = toCode(match.team1 ?? "");
    const awayCode = toCode(match.team2 ?? "");
    if (!homeCode || !awayCode) {
      skipped += 1;
      continue;
    }

    const scores = { [homeCode]: ft[0], [awayCode]: ft[1] };
    let winner = "draw";
    if (ft[0] > ft[1]) winner = homeCode;
    else if (ft[1] > ft[0]) winner = awayCode;

    rows.push({
      pair: pairKey(homeCode, awayCode),
      date: match.date ?? "",
      scores,
      winner,
    });
  }

  rows.sort((a, b) => a.date.localeCompare(b.date));

  writeFileSync(
    join(DATA_DIR, "results-2026.json"),
    JSON.stringify(rows, null, 2) + "\n",
    "utf8",
  );

  console.log(`Wrote ${rows.length} results (${skipped} unmatched skipped).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
