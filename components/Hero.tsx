import Image from "next/image";
import { CalendarCheck, Icon, MapPin, Trophy } from "@/lib/icons";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-emerald-900/15 shadow-lg shadow-emerald-950/10 dark:border-emerald-500/15">
      <Image
        src="/hero-stadium.png"
        alt="World Cup 2026 stadium with the host nations' flags and the trophy"
        width={1024}
        height={434}
        priority
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-zinc-950/55 to-zinc-950/25" />

      <div className="relative flex min-h-[16rem] flex-col justify-end gap-3 p-5 sm:min-h-[20rem] sm:p-8">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm">
          <Icon icon={Trophy} className="size-3.5" />
          {SITE.name.replace(" Calendar", "")}
        </span>

        <h1 className="max-w-2xl text-3xl font-bold tracking-tight text-white drop-shadow-sm sm:text-5xl">
          {SITE.tagline}
        </h1>

        <p className="max-w-xl text-sm text-zinc-200 sm:text-base">
          Pick the teams you support, choose the matches you care about, then
          download or subscribe in one click.
        </p>

        <div className="mt-1 flex flex-wrap gap-2">
          <Badge icon={CalendarCheck}>{SITE.dateRange}</Badge>
          <Badge icon={MapPin}>{SITE.hosts}</Badge>
        </div>
      </div>
    </section>
  );
}

function Badge({
  icon,
  children,
}: {
  icon: typeof Trophy;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm sm:text-sm">
      <Icon icon={icon} className="size-3.5 sm:size-4" />
      {children}
    </span>
  );
}
