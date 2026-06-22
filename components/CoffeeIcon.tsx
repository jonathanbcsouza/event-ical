import { cn } from "@/lib/utils";

type CoffeeIconProps = {
  className?: string;
  variant?: "light" | "dark" | "inherit";
};

export function CoffeeIcon({
  className,
  variant = "inherit",
}: CoffeeIconProps) {
  const cup =
    variant === "light"
      ? "#fff7ed"
      : variant === "dark"
        ? "#78350f"
        : "currentColor";
  const liquid = variant === "light" ? "#d97706" : "#b45309";
  const foam = variant === "light" ? "#fef3c7" : "#fde68a";
  const steam =
    variant === "light" ? "#fffbeb" : variant === "dark" ? "#a8a29e" : "currentColor";

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn("size-4 shrink-0", className)}
    >
      <path
        d="M7.5 4.5c.4-.8 1.2-1.3 2.1-1.3.7 0 1.3.3 1.7.8"
        stroke={steam}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M11 3.8c.3-.7 1-1.1 1.8-1.1.6 0 1.1.2 1.5.6"
        stroke={steam}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.4"
      />
      <path
        d="M14.5 4.8c.3-.6.9-1 1.6-1 .5 0 1 .2 1.3.5"
        stroke={steam}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.35"
      />
      <path
        d="M5.5 9.5h11.5a2 2 0 0 1 2 2v1.2a4.3 4.3 0 0 1-4.3 4.3H7.8A2.3 2.3 0 0 1 5.5 14.7V9.5Z"
        fill={cup}
        stroke={variant === "inherit" ? "currentColor" : cup}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M19 11.2h.8a2.2 2.2 0 0 1 0 4.4H19"
        stroke={variant === "inherit" ? "currentColor" : cup}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M7 11.8h8.2a1.6 1.6 0 0 1 1.6 1.6v.2a1.6 1.6 0 0 1-1.6 1.6H7a1.6 1.6 0 0 1-1.6-1.6v-.2A1.6 1.6 0 0 1 7 11.8Z"
        fill={liquid}
        opacity="0.9"
      />
      <ellipse cx="11.2" cy="11.1" rx="4.8" ry="1.1" fill={foam} />
      <path
        d="M6.2 18.2h11.1"
        stroke={variant === "inherit" ? "currentColor" : cup}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}
