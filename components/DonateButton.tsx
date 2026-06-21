import { Heart, Icon } from "@/lib/icons";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

type DonateButtonProps = {
  variant?: "nav" | "primary";
  className?: string;
};

export function DonateButton({
  variant = "nav",
  className,
}: DonateButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <a
      href={SITE.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all",
        isPrimary
          ? "bg-rose-500 px-5 py-2.5 text-sm text-white shadow-sm hover:bg-rose-600 hover:shadow-md"
          : "border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70 sm:text-sm",
        className,
      )}
    >
      <Icon
        icon={Heart}
        className={cn(
          "size-4 transition-transform group-hover:scale-110",
          isPrimary ? "fill-white/90" : "fill-rose-500/80",
        )}
      />
      <span className={isPrimary ? "" : "hidden sm:inline"}>
        {isPrimary ? "Support this project" : "Donate"}
      </span>
    </a>
  );
}
