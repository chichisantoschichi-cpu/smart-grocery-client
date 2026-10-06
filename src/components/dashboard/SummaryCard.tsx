interface SummaryCardProps {
  label: string;
  value: string;
  helper: string;
  icon: "budget" | "spent" | "remaining" | "usage";
  trend?: string;
  trendPositive?: boolean;
}

function Icon({ type }: { type: SummaryCardProps["icon"] }) {
  if (type === "budget") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M7 9h10M7 13h4" />
      </svg>
    );
  }

  if (type === "spent") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3v18" />
        <path d="M16 7.5c-.8-1-2-1.5-4-1.5-2.2 0-3.5 1-3.5 2.5S9.8 11 12 11s3.5 1 3.5 2.5S14.2 16 12 16c-2 0-3.2-.5-4-1.5" />
      </svg>
    );
  }

  if (type === "remaining") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M20 12a8 8 0 1 1-2.34-5.66" />
        <path d="M20 4v6h-6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="m7 15 3-4 3 2 5-6" />
    </svg>
  );
}

function SummaryCard({
  label,
  value,
  helper,
  icon,
  trend,
  trendPositive,
}: SummaryCardProps) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-slate-400">{helper}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Icon type={icon} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
              trendPositive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {trend}
          </span>

          <span className="text-xs text-slate-400">vs previous month</span>
        </div>
      )}
    </div>
  );
}

export default SummaryCard;
