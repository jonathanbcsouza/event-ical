type StepHeaderProps = {
  step: number;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
};

export function StepHeader({
  step,
  title,
  description,
  badge,
  action,
}: StepHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
          {step}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
              {title}
            </h2>
            {badge}
          </div>
          {description && (
            <p className="text-sm text-zinc-500">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
