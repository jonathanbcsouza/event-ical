const FIFA_TO_ISO2: Record<string, string> = {
  MEX: "MX",
  RSA: "ZA",
  KOR: "KR",
  CZE: "CZ",
  CAN: "CA",
  BIH: "BA",
  SUI: "CH",
  QAT: "QA",
  BRA: "BR",
  MAR: "MA",
  HAI: "HT",
  USA: "US",
  PAR: "PY",
  AUS: "AU",
  TUR: "TR",
  GER: "DE",
  ECU: "EC",
  CIV: "CI",
  CUW: "CW",
  NED: "NL",
  JPN: "JP",
  TUN: "TN",
  SWE: "SE",
  BEL: "BE",
  IRN: "IR",
  EGY: "EG",
  NZL: "NZ",
  ESP: "ES",
  CPV: "CV",
  KSA: "SA",
  URU: "UY",
  FRA: "FR",
  SEN: "SN",
  IRQ: "IQ",
  NOR: "NO",
  ARG: "AR",
  ALG: "DZ",
  AUT: "AT",
  JOR: "JO",
  POR: "PT",
  COL: "CO",
  UZB: "UZ",
  COD: "CD",
  CRO: "HR",
  PAN: "PA",
  GHA: "GH",
};

const SPECIAL_FLAGS: Record<string, string> = {
  ENG: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0065}\u{E006E}\u{E0067}\u{E007F}",
  SCO: "\u{1F3F4}\u{E0067}\u{E0062}\u{E0073}\u{E0063}\u{E0074}\u{E007F}",
};

const NEUTRAL_MARKER = "\u26BD";

function iso2ToEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) =>
      String.fromCodePoint(127397 + char.charCodeAt(0)),
    );
}

export function getFlag(code: string): string {
  if (!code || code === "TBD") return NEUTRAL_MARKER;
  if (SPECIAL_FLAGS[code]) return SPECIAL_FLAGS[code];
  const iso2 = FIFA_TO_ISO2[code];
  if (!iso2) return NEUTRAL_MARKER;
  return iso2ToEmoji(iso2);
}

export function hasFlag(code: string): boolean {
  return code !== "TBD" && (code in FIFA_TO_ISO2 || code in SPECIAL_FLAGS);
}
