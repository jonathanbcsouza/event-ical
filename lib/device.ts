export type MobilePlatform = "ios" | "android";

export function getMobilePlatform(): MobilePlatform | null {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "ios";
  if (/Android/.test(ua)) return "android";
  return null;
}

export function isMobileDevice(): boolean {
  return getMobilePlatform() !== null;
}
