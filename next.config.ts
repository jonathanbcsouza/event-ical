import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @touch4it/ical-timezones reads VTIMEZONE .ics files from its own folder at
  // runtime. Keep it external so it loads from node_modules (not bundled), and
  // trace its zone files into the calendar API serverless function.
  serverExternalPackages: ["@touch4it/ical-timezones"],
  outputFileTracingIncludes: {
    "/api/calendar.ics": ["./node_modules/@touch4it/ical-timezones/zones/**"],
  },
};

export default nextConfig;
