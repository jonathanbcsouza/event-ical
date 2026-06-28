import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

type IconProps = LucideProps & {
  icon: LucideIcon;
};

export function Icon({ icon: LucideIcon, className, ...props }: IconProps) {
  return (
    <LucideIcon
      className={cn("size-5 shrink-0", className)}
      aria-hidden
      {...props}
    />
  );
}

export {
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Download,
  Globe,
  Lightbulb,
  List,
  Lock,
  Mail,
  MapPin,
  Moon,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
