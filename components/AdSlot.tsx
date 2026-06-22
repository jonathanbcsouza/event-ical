"use client";

import { useEffect } from "react";
import Script from "next/script";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
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

  if (!ADSENSE_CLIENT || !ADSENSE_SLOT) {
    return (
      <div
        className={`rounded-lg border border-dashed border-zinc-300 bg-zinc-50/80 px-4 py-6 text-center text-xs text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900/40 ${className ?? ""}`}
        aria-hidden
      >
        Ad slot — set{" "}
        <code className="text-zinc-500">NEXT_PUBLIC_ADSENSE_CLIENT_ID</code> to
        enable
      </div>
    );
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ins
        className={`adsbygoogle block ${className ?? ""}`}
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={ADSENSE_SLOT}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </>
  );
}
