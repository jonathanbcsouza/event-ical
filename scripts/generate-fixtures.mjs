import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { DateTime } from "luxon";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Official kickoff times (UTC) sourced from the published FIFA World Cup 2026
// schedule. Keyed by team pairing for the group stage and by match number for
// the knockout rounds (our internal match numbering differs from the official
// numbering in the group stage, but knockout numbers align).
const OFFICIAL_SCHEDULE = JSON.parse(
  readFileSync(join(__dirname, "..", "data", "official-schedule-2026.json"), "utf8"),
);

// Map official feed team names to our internal codes (handles spelling diffs).
const FEED_TEAM_CODES = {
  Mexico: "MEX",
  "South Africa": "RSA",
  "Korea Republic": "KOR",
  Czechia: "CZE",
  Canada: "CAN",
  "Bosnia and Herzegovina": "BIH",
  USA: "USA",
  Paraguay: "PAR",
  Qatar: "QAT",
  Switzerland: "SUI",
  Brazil: "BRA",
  Morocco: "MAR",
  Haiti: "HAI",
  Scotland: "SCO",
  Australia: "AUS",
  "Türkiye": "TUR",
  Germany: "GER",
  "Curaçao": "CUW",
  Netherlands: "NED",
  Japan: "JPN",
  "Côte d'Ivoire": "CIV",
  Ecuador: "ECU",
  Sweden: "SWE",
  Tunisia: "TUN",
  Spain: "ESP",
  "Cabo Verde": "CPV",
  "Saudi Arabia": "KSA",
  Uruguay: "URU",
  Belgium: "BEL",
  Egypt: "EGY",
  "IR Iran": "IRN",
  "New Zealand": "NZL",
  France: "FRA",
  Senegal: "SEN",
  Iraq: "IRQ",
  Norway: "NOR",
  Argentina: "ARG",
  Algeria: "ALG",
  Austria: "AUT",
  Jordan: "JOR",
  Portugal: "POR",
  "Congo DR": "COD",
  England: "ENG",
  Croatia: "CRO",
  Ghana: "GHA",
  Panama: "PAN",
  Uzbekistan: "UZB",
  Colombia: "COL",
};

function pairKey(codeA, codeB) {
  return [codeA, codeB].sort().join("-");
}

function feedDateToUtcIso(dateUtc) {
  // Feed format: "2026-06-22 01:00:00Z" -> ISO 8601
  return new Date(dateUtc.replace(" ", "T")).toISOString();
}

const officialByPair = new Map();
const officialByNumber = new Map();
for (const m of OFFICIAL_SCHEDULE) {
  officialByNumber.set(m.MatchNumber, feedDateToUtcIso(m.DateUtc));
  const home = FEED_TEAM_CODES[m.HomeTeam];
  const away = FEED_TEAM_CODES[m.AwayTeam];
  if (home && away) {
    officialByPair.set(pairKey(home, away), feedDateToUtcIso(m.DateUtc));
  }
}

const unmatched = [];

function officialStartUtc(id, stage, homeCode, awayCode, fallback) {
  if (stage === "group") {
    const hit = officialByPair.get(pairKey(homeCode, awayCode));
    if (hit) return hit;
  } else {
    const hit = officialByNumber.get(id);
    if (hit) return hit;
  }
  unmatched.push(`#${id} ${homeCode} vs ${awayCode} (${stage})`);
  return fallback;
}

/** @type {Record<string, { code: string; name: string }>} */
const TEAMS = {
  Mexico: { code: "MEX", name: "Mexico" },
  "South Africa": { code: "RSA", name: "South Africa" },
  "South Korea": { code: "KOR", name: "South Korea" },
  "Czech Republic": { code: "CZE", name: "Czech Republic" },
  Canada: { code: "CAN", name: "Canada" },
  "Bosnia and Herzegovina": { code: "BIH", name: "Bosnia and Herzegovina" },
  USA: { code: "USA", name: "USA" },
  Paraguay: { code: "PAR", name: "Paraguay" },
  Qatar: { code: "QAT", name: "Qatar" },
  Switzerland: { code: "SUI", name: "Switzerland" },
  Brazil: { code: "BRA", name: "Brazil" },
  Morocco: { code: "MAR", name: "Morocco" },
  Haiti: { code: "HAI", name: "Haiti" },
  Scotland: { code: "SCO", name: "Scotland" },
  Australia: { code: "AUS", name: "Australia" },
  Türkiye: { code: "TUR", name: "Türkiye" },
  Germany: { code: "GER", name: "Germany" },
  Curaçao: { code: "CUW", name: "Curaçao" },
  "Ivory Coast": { code: "CIV", name: "Ivory Coast" },
  Ecuador: { code: "ECU", name: "Ecuador" },
  Netherlands: { code: "NED", name: "Netherlands" },
  Japan: { code: "JPN", name: "Japan" },
  Sweden: { code: "SWE", name: "Sweden" },
  Tunisia: { code: "TUN", name: "Tunisia" },
  Spain: { code: "ESP", name: "Spain" },
  "Cape Verde": { code: "CPV", name: "Cape Verde" },
  "Cabo Verde": { code: "CPV", name: "Cape Verde" },
  "Saudi Arabia": { code: "KSA", name: "Saudi Arabia" },
  Uruguay: { code: "URU", name: "Uruguay" },
  Belgium: { code: "BEL", name: "Belgium" },
  Egypt: { code: "EGY", name: "Egypt" },
  Iran: { code: "IRN", name: "Iran" },
  "New Zealand": { code: "NZL", name: "New Zealand" },
  France: { code: "FRA", name: "France" },
  Senegal: { code: "SEN", name: "Senegal" },
  Iraq: { code: "IRQ", name: "Iraq" },
  Norway: { code: "NOR", name: "Norway" },
  Argentina: { code: "ARG", name: "Argentina" },
  Algeria: { code: "ALG", name: "Algeria" },
  Austria: { code: "AUT", name: "Austria" },
  Jordan: { code: "JOR", name: "Jordan" },
  Portugal: { code: "POR", name: "Portugal" },
  "DR Congo": { code: "COD", name: "DR Congo" },
  England: { code: "ENG", name: "England" },
  Croatia: { code: "CRO", name: "Croatia" },
  Ghana: { code: "GHA", name: "Ghana" },
  Panama: { code: "PAN", name: "Panama" },
  Uzbekistan: { code: "UZB", name: "Uzbekistan" },
  Colombia: { code: "COL", name: "Colombia" },
};

const TBD = { code: "TBD", name: "TBD" };

function team(name) {
  if (TEAMS[name]) return TEAMS[name];
  return { code: "TBD", name };
}

/** Local kickoff hour slots by venue region (FIFA published schedule) */
const REGION_SLOTS = {
  Eastern: [17, 20, 23],
  Central: [18, 21, 0],
  Western: [20, 23, 2],
};

const REGION_TIMEZONE = {
  Eastern: "America/New_York",
  Central: "America/Chicago",
  Western: "America/Los_Angeles",
};

/** Cities that don't follow the default region timezone */
const CITY_TIMEZONE = {
  "Mexico City Stadium": "America/Mexico_City",
  "Estadio Guadalajara": "America/Mexico_City",
  "Estadio Monterrey": "America/Monterrey",
  "Toronto Stadium": "America/Toronto",
  "BC Place Vancouver": "America/Vancouver",
};

function timezoneForCity(city) {
  if (CITY_TIMEZONE[city]) return CITY_TIMEZONE[city];
  const region = regionForCity(city);
  return REGION_TIMEZONE[region];
}

function regionForCity(city) {
  if (
    city.includes("Los Angeles") ||
    city.includes("San Francisco") ||
    city.includes("Seattle") ||
    city.includes("Vancouver")
  ) {
    return "Western";
  }
  if (
    city.includes("Mexico City") ||
    city.includes("Guadalajara") ||
    city.includes("Monterrey") ||
    city.includes("Houston") ||
    city.includes("Dallas") ||
    city.includes("Kansas City")
  ) {
    return "Central";
  }
  return "Eastern";
}

function startUtc(dateStr, city, slotIndex) {
  const region = regionForCity(city);
  const tz = timezoneForCity(city);
  const slots = REGION_SLOTS[region];
  const hour = slots[slotIndex % slots.length];
  const local = DateTime.fromObject(
    {
      year: Number(dateStr.slice(0, 4)),
      month: Number(dateStr.slice(5, 7)),
      day: Number(dateStr.slice(8, 10)),
      hour,
      minute: 0,
      second: 0,
    },
    { zone: tz },
  );
  return local.toUTC().toISO();
}

/** Raw rows: [id, date, stage, home, away, venue, city] */
const ROWS = [
  [1, "2026-06-11", "group", "Mexico", "South Africa", "Mexico City Stadium", "Mexico City"],
  [2, "2026-06-11", "group", "South Korea", "Czech Republic", "Estadio Guadalajara", "Guadalajara"],
  [3, "2026-06-12", "group", "Canada", "Bosnia and Herzegovina", "Toronto Stadium", "Toronto"],
  [4, "2026-06-12", "group", "USA", "Paraguay", "Los Angeles Stadium", "Los Angeles"],
  [5, "2026-06-13", "group", "Qatar", "Switzerland", "San Francisco Bay Area Stadium", "San Francisco Bay Area"],
  [6, "2026-06-13", "group", "Brazil", "Morocco", "New York New Jersey Stadium", "New York/NJ"],
  [7, "2026-06-13", "group", "Haiti", "Scotland", "Boston Stadium", "Boston"],
  [8, "2026-06-13", "group", "Australia", "Türkiye", "BC Place Vancouver", "Vancouver"],
  [9, "2026-06-14", "group", "Germany", "Curaçao", "Houston Stadium", "Houston"],
  [10, "2026-06-14", "group", "Netherlands", "Japan", "Dallas Stadium", "Dallas"],
  [11, "2026-06-14", "group", "Ivory Coast", "Ecuador", "Philadelphia Stadium", "Philadelphia"],
  [12, "2026-06-14", "group", "Sweden", "Tunisia", "Estadio Monterrey", "Monterrey"],
  [13, "2026-06-15", "group", "Spain", "Cape Verde", "Atlanta Stadium", "Atlanta"],
  [14, "2026-06-15", "group", "Belgium", "Egypt", "Seattle Stadium", "Seattle"],
  [15, "2026-06-15", "group", "Saudi Arabia", "Uruguay", "Miami Stadium", "Miami"],
  [16, "2026-06-15", "group", "Iran", "New Zealand", "Los Angeles Stadium", "Los Angeles"],
  [17, "2026-06-16", "group", "France", "Senegal", "New York New Jersey Stadium", "New York/NJ"],
  [18, "2026-06-16", "group", "Iraq", "Norway", "Boston Stadium", "Boston"],
  [19, "2026-06-16", "group", "Argentina", "Algeria", "Kansas City Stadium", "Kansas City"],
  [20, "2026-06-16", "group", "Austria", "Jordan", "San Francisco Bay Area Stadium", "San Francisco Bay Area"],
  [21, "2026-06-17", "group", "Portugal", "DR Congo", "Houston Stadium", "Houston"],
  [22, "2026-06-17", "group", "England", "Croatia", "Dallas Stadium", "Dallas"],
  [23, "2026-06-17", "group", "Ghana", "Panama", "Toronto Stadium", "Toronto"],
  [24, "2026-06-17", "group", "Uzbekistan", "Colombia", "Mexico City Stadium", "Mexico City"],
  [25, "2026-06-18", "group", "Czech Republic", "South Africa", "Atlanta Stadium", "Atlanta"],
  [26, "2026-06-18", "group", "Switzerland", "Bosnia and Herzegovina", "Los Angeles Stadium", "Los Angeles"],
  [27, "2026-06-18", "group", "Canada", "Qatar", "BC Place Vancouver", "Vancouver"],
  [28, "2026-06-18", "group", "Mexico", "South Korea", "Estadio Guadalajara", "Guadalajara"],
  [29, "2026-06-19", "group", "USA", "Australia", "Seattle Stadium", "Seattle"],
  [30, "2026-06-19", "group", "Scotland", "Morocco", "Boston Stadium", "Boston"],
  [31, "2026-06-19", "group", "Brazil", "Haiti", "Philadelphia Stadium", "Philadelphia"],
  [32, "2026-06-19", "group", "Türkiye", "Paraguay", "San Francisco Bay Area Stadium", "San Francisco Bay Area"],
  [33, "2026-06-20", "group", "Netherlands", "Sweden", "Houston Stadium", "Houston"],
  [34, "2026-06-20", "group", "Germany", "Ivory Coast", "Toronto Stadium", "Toronto"],
  [35, "2026-06-20", "group", "Ecuador", "Curaçao", "Kansas City Stadium", "Kansas City"],
  [36, "2026-06-20", "group", "Tunisia", "Japan", "Estadio Monterrey", "Monterrey"],
  [37, "2026-06-21", "group", "Spain", "Saudi Arabia", "Atlanta Stadium", "Atlanta"],
  [38, "2026-06-21", "group", "Belgium", "Iran", "Los Angeles Stadium", "Los Angeles"],
  [39, "2026-06-21", "group", "Uruguay", "Cape Verde", "Miami Stadium", "Miami"],
  [40, "2026-06-21", "group", "New Zealand", "Egypt", "BC Place Vancouver", "Vancouver"],
  [41, "2026-06-22", "group", "Norway", "Senegal", "New York New Jersey Stadium", "New York/NJ"],
  [42, "2026-06-22", "group", "France", "Iraq", "Philadelphia Stadium", "Philadelphia"],
  [43, "2026-06-22", "group", "Argentina", "Austria", "Dallas Stadium", "Dallas"],
  [44, "2026-06-22", "group", "Jordan", "Algeria", "San Francisco Bay Area Stadium", "San Francisco Bay Area"],
  [45, "2026-06-23", "group", "England", "Ghana", "Boston Stadium", "Boston"],
  [46, "2026-06-23", "group", "Panama", "Croatia", "Toronto Stadium", "Toronto"],
  [47, "2026-06-23", "group", "Portugal", "Uzbekistan", "Houston Stadium", "Houston"],
  [48, "2026-06-23", "group", "Colombia", "DR Congo", "Estadio Guadalajara", "Guadalajara"],
  [49, "2026-06-24", "group", "Scotland", "Brazil", "Miami Stadium", "Miami"],
  [50, "2026-06-24", "group", "Morocco", "Haiti", "Atlanta Stadium", "Atlanta"],
  [51, "2026-06-24", "group", "Switzerland", "Canada", "BC Place Vancouver", "Vancouver"],
  [52, "2026-06-24", "group", "Bosnia and Herzegovina", "Qatar", "Seattle Stadium", "Seattle"],
  [53, "2026-06-24", "group", "Czech Republic", "Mexico", "Mexico City Stadium", "Mexico City"],
  [54, "2026-06-24", "group", "South Africa", "South Korea", "Estadio Monterrey", "Monterrey"],
  [55, "2026-06-25", "group", "Curaçao", "Ivory Coast", "Philadelphia Stadium", "Philadelphia"],
  [56, "2026-06-25", "group", "Ecuador", "Germany", "New York New Jersey Stadium", "New York/NJ"],
  [57, "2026-06-25", "group", "Japan", "Sweden", "Dallas Stadium", "Dallas"],
  [58, "2026-06-25", "group", "Tunisia", "Netherlands", "Kansas City Stadium", "Kansas City"],
  [59, "2026-06-25", "group", "Türkiye", "USA", "Los Angeles Stadium", "Los Angeles"],
  [60, "2026-06-25", "group", "Paraguay", "Australia", "San Francisco Bay Area Stadium", "San Francisco Bay Area"],
  [61, "2026-06-26", "group", "Belgium", "New Zealand", "Seattle Stadium", "Seattle"],
  [62, "2026-06-26", "group", "Iran", "Egypt", "BC Place Vancouver", "Vancouver"],
  [63, "2026-06-26", "group", "Spain", "Uruguay", "Mexico City Stadium", "Mexico City"],
  [64, "2026-06-26", "group", "Cabo Verde", "Saudi Arabia", "Estadio Guadalajara", "Guadalajara"],
  [65, "2026-06-26", "group", "France", "Norway", "Boston Stadium", "Boston"],
  [66, "2026-06-26", "group", "Senegal", "Iraq", "Miami Stadium", "Miami"],
  [67, "2026-06-27", "group", "Panama", "England", "New York New Jersey Stadium", "New York/NJ"],
  [68, "2026-06-27", "group", "Croatia", "Ghana", "Philadelphia Stadium", "Philadelphia"],
  [69, "2026-06-27", "group", "Jordan", "Argentina", "Dallas Stadium", "Dallas"],
  [70, "2026-06-27", "group", "Algeria", "Austria", "Kansas City Stadium", "Kansas City"],
  [71, "2026-06-27", "group", "Colombia", "Portugal", "Miami Stadium", "Miami"],
  [72, "2026-06-27", "group", "DR Congo", "Uzbekistan", "Atlanta Stadium", "Atlanta"],
  [73, "2026-06-28", "r32", "Group A Runner-up", "Group B Runner-up", "Los Angeles Stadium", "Los Angeles"],
  [74, "2026-06-29", "r32", "Group E Winner", "3rd Place (A/B/C/D/F)", "Boston Stadium", "Boston"],
  [75, "2026-06-29", "r32", "Group F Winner", "Group C Runner-up", "Estadio Monterrey", "Monterrey"],
  [76, "2026-06-29", "r32", "Group C Winner", "Group F Runner-up", "Houston Stadium", "Houston"],
  [77, "2026-06-30", "r32", "Group I Winner", "3rd Place (C/D/F/G/H)", "New York New Jersey Stadium", "New York/NJ"],
  [78, "2026-06-30", "r32", "Group E Runner-up", "Group I Runner-up", "Dallas Stadium", "Dallas"],
  [79, "2026-06-30", "r32", "Group A Winner", "3rd Place (C/E/F/H/I)", "Mexico City Stadium", "Mexico City"],
  [80, "2026-07-01", "r32", "Group L Winner", "3rd Place (E/H/I/J/K)", "Atlanta Stadium", "Atlanta"],
  [81, "2026-07-01", "r32", "Group D Winner", "3rd Place (B/E/F/I/J)", "San Francisco Bay Area Stadium", "San Francisco Bay Area"],
  [82, "2026-07-01", "r32", "Group G Winner", "3rd Place (A/E/H/I/J)", "Seattle Stadium", "Seattle"],
  [83, "2026-07-02", "r32", "Group K Runner-up", "Group L Runner-up", "Toronto Stadium", "Toronto"],
  [84, "2026-07-02", "r32", "Group H Winner", "Group J Runner-up", "Los Angeles Stadium", "Los Angeles"],
  [85, "2026-07-02", "r32", "Group B Winner", "3rd Place (E/F/G/I/J)", "BC Place Vancouver", "Vancouver"],
  [86, "2026-07-03", "r32", "Group J Winner", "Group H Runner-up", "Miami Stadium", "Miami"],
  [87, "2026-07-03", "r32", "Group K Winner", "3rd Place (D/E/I/J/L)", "Kansas City Stadium", "Kansas City"],
  [88, "2026-07-03", "r32", "Group D Runner-up", "Group G Runner-up", "Dallas Stadium", "Dallas"],
  [89, "2026-07-04", "r16", "Winner Match 74", "Winner Match 77", "Philadelphia Stadium", "Philadelphia"],
  [90, "2026-07-04", "r16", "Winner Match 73", "Winner Match 75", "Houston Stadium", "Houston"],
  [91, "2026-07-05", "r16", "Winner Match 76", "Winner Match 78", "New York New Jersey Stadium", "New York/NJ"],
  [92, "2026-07-05", "r16", "Winner Match 79", "Winner Match 80", "Mexico City Stadium", "Mexico City"],
  [93, "2026-07-06", "r16", "Winner Match 83", "Winner Match 84", "Dallas Stadium", "Dallas"],
  [94, "2026-07-06", "r16", "Winner Match 81", "Winner Match 82", "Seattle Stadium", "Seattle"],
  [95, "2026-07-07", "r16", "Winner Match 86", "Winner Match 88", "Atlanta Stadium", "Atlanta"],
  [96, "2026-07-07", "r16", "Winner Match 85", "Winner Match 87", "BC Place Vancouver", "Vancouver"],
  [97, "2026-07-09", "qf", "Winner Match 89", "Winner Match 90", "Boston Stadium", "Boston"],
  [98, "2026-07-10", "qf", "Winner Match 93", "Winner Match 94", "Los Angeles Stadium", "Los Angeles"],
  [99, "2026-07-11", "qf", "Winner Match 91", "Winner Match 92", "Miami Stadium", "Miami"],
  [100, "2026-07-11", "qf", "Winner Match 95", "Winner Match 96", "Kansas City Stadium", "Kansas City"],
  [101, "2026-07-14", "sf", "Winner Match 97", "Winner Match 98", "Dallas Stadium", "Dallas"],
  [102, "2026-07-15", "sf", "Winner Match 99", "Winner Match 100", "Atlanta Stadium", "Atlanta"],
  [103, "2026-07-18", "third", "Loser Match 101", "Loser Match 102", "Miami Stadium", "Miami"],
  [104, "2026-07-19", "final", "Winner Match 101", "Winner Match 102", "New York New Jersey Stadium", "New York/NJ"],
];

const daySlotCounter = {};

const matches = ROWS.map(([id, date, stage, homeName, awayName, venue, city]) => {
  const dayKey = date;
  daySlotCounter[dayKey] = (daySlotCounter[dayKey] ?? 0);
  const slotIndex = daySlotCounter[dayKey]++;
  const home = team(homeName);
  const away = team(awayName);
  // Prefer the official kickoff time; fall back to the synthetic slot time only
  // if a match can't be matched (reported below).
  const fallback = startUtc(date, city, slotIndex);
  const start = officialStartUtc(id, stage, home.code, away.code, fallback);
  return {
    id: String(id),
    matchNumber: id,
    stage,
    home,
    away,
    startUtc: start,
    venue,
    city,
  };
});

const groups = {
  A: ["MEX", "RSA", "KOR", "CZE"],
  B: ["CAN", "BIH", "SUI", "QAT"],
  C: ["BRA", "MAR", "SCO", "HAI"],
  D: ["USA", "PAR", "AUS", "TUR"],
  E: ["GER", "ECU", "CIV", "CUW"],
  F: ["NED", "JPN", "TUN", "SWE"],
  G: ["BEL", "IRN", "EGY", "NZL"],
  H: ["ESP", "CPV", "KSA", "URU"],
  I: ["FRA", "SEN", "IRQ", "NOR"],
  J: ["ARG", "ALG", "AUT", "JOR"],
  K: ["POR", "COL", "UZB", "COD"],
  L: ["ENG", "CRO", "PAN", "GHA"],
};

const output = {
  tournament: "FIFA World Cup 2026",
  startDate: "2026-06-11",
  endDate: "2026-07-19",
  groups,
  matches,
};

const outPath = join(__dirname, "..", "data", "fixtures-2026.json");
writeFileSync(outPath, JSON.stringify(output, null, 2) + "\n");
console.log(`Wrote ${matches.length} matches to ${outPath}`);

if (unmatched.length > 0) {
  console.warn(
    `WARNING: ${unmatched.length} match(es) used fallback times (no official match found):`,
  );
  for (const u of unmatched) console.warn(`  - ${u}`);
} else {
  console.log("All matches mapped to official kickoff times.");
}
