import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <section className="flex min-h-[250px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 sm:p-10">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            className="h-8 w-8"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 7.5h16.5v11.25A1.5 1.5 0 0 1 18.75 20.25h-13.5a1.5 1.5 0 0 1-1.5-1.5V7.5Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m3.75 7.5 2.1-3.15a1.5 1.5 0 0 1 1.25-.6h9.8a1.5 1.5 0 0 1 1.25.6l2.1 3.15M9 12.75h6"
            />
          </svg>
        </div>

        <h3 className="text-lg font-bold tracking-tight text-slate-900">
          {title}
        </h3>

        {description && (
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}

        {action && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {action}
          </div>
        )}
      </div>
    </section>
  );
}