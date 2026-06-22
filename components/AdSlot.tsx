"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? SITE.adsenseClientId;
const ADSENSE_SLOT = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

type AdSlotProps = {
  className?: string;
};

export function AdSlot({ className }: AdSlotProps) {
  useEffect(() => {
    if (!ADSENSE_CLIENT || !ADSENSE_SLOT) return;
    try {
      // @ts-expect-error adsbygoogle global
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore ad push errors in dev
    }
  }, []);

  if (!ADSENSE_CLIENT || !ADSENSE_SLOT) return null;

  return (
    <ins
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={ADSENSE_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
