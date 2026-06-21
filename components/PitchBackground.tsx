export function PitchBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950" />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/hero-stadium.png')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-zinc-950/65 to-zinc-950/92" />
    </div>
  );
}
