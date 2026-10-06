interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 13.5V7a2 2 0 0 0-1.1-1.8l-6-3a2 2 0 0 0-1.8 0l-6 3A2 2 0 0 0 4 7v10a2 2 0 0 0 1.1 1.8l6 3a2 2 0 0 0 1.8 0l6-3A2 2 0 0 0 20 17v-3.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 12h8"
            />
          </svg>
        </div>

        <h3 className="text-base font-semibold text-slate-800">{title}</h3>

        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
