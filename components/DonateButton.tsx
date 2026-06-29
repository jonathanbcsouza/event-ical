import { useTranslations } from "next-intl";
import { CoffeeIcon } from "@/components/CoffeeIcon";
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
  const t = useTranslations("donate");
  const isPrimary = variant === "primary";

  return (
    <a
      href={SITE.donateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center justify-center gap-1.5 rounded-full font-semibold transition-all",
        isPrimary
          ? "bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-2.5 text-sm text-white shadow-sm shadow-amber-900/20 hover:from-amber-700 hover:to-amber-600 hover:shadow-md"
          : "border border-amber-300/80 bg-amber-50 px-2.5 py-2 text-[11px] text-amber-900 hover:bg-amber-100 dark:border-amber-700/50 dark:bg-amber-950/50 dark:text-amber-100 dark:hover:bg-amber-950/80 sm:gap-2 sm:px-3.5 sm:text-xs",
        className,
      )}
    >
      <CoffeeIcon
        variant={isPrimary ? "light" : "inherit"}
        className="transition-transform group-hover:-translate-y-0.5 group-hover:scale-110 sm:size-[18px]"
      />
      <span className="whitespace-nowrap">{t("button")}</span>
    </a>
  );
}
