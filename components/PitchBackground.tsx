export function PitchBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/hero-stadium.png')" }}
      />

      {/* Soft sky clouds */}
      <div className="absolute inset-x-0 top-0 h-[42%] bg-gradient-to-b from-sky-950/25 via-transparent to-transparent" />
      <Cloud className="left-[-8%] top-[6%] h-24 w-56 opacity-[0.18] blur-[1px] animate-[cloud-drift_48s_linear_infinite]" />
      <Cloud className="left-[38%] top-[3%] h-20 w-44 opacity-[0.14] blur-[0.5px] animate-[cloud-drift_62s_linear_infinite_reverse]" />
      <Cloud className="left-[68%] top-[10%] h-28 w-64 opacity-[0.16] blur-[1px] animate-[cloud-drift_54s_linear_infinite]" />
      <Cloud className="left-[12%] top-[16%] h-16 w-36 opacity-[0.1] blur-[0.5px] animate-[cloud-drift_70s_linear_infinite_reverse]" />

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/65 to-zinc-950/92" />
    </div>
  );
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 96"
      fill="none"
      className={`absolute text-white ${className ?? ""}`}
    >
      <ellipse cx="72" cy="58" rx="58" ry="30" fill="currentColor" />
      <ellipse cx="128" cy="48" rx="52" ry="34" fill="currentColor" />
      <ellipse cx="176" cy="60" rx="48" ry="26" fill="currentColor" />
      <ellipse cx="104" cy="36" rx="40" ry="24" fill="currentColor" opacity="0.85" />
    </svg>
  );
}
