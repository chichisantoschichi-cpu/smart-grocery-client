interface LoadingStateProps {
  message?: string;
  variant?: "panel" | "cards" | "table";
}

export default function LoadingState({
  message = "Loading data...",
  variant = "panel",
}: LoadingStateProps) {
  const indicator = (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-600"
      />
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );

  if (variant === "cards") {
    return (
      <section
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="space-y-5"
      >
        {indicator}

        <div
          aria-hidden="true"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-3 w-1/3 rounded-full bg-slate-200" />
                <div className="h-7 w-1/2 rounded-lg bg-slate-200" />
                <div className="h-2 w-full rounded-full bg-slate-100" />
                <div className="h-3 w-2/3 rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (variant === "table") {
    return (
      <section
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="space-y-4"
      >
        {indicator}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div
            aria-hidden="true"
            className="animate-pulse"
          >
            <div className="grid grid-cols-2 gap-4 border-b border-slate-100 bg-slate-50 p-4 sm:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-3 rounded-full bg-slate-200"
                />
              ))}
            </div>

            {[1, 2, 3, 4, 5].map((row) => (
              <div
                key={row}
                className="grid grid-cols-2 gap-4 border-b border-slate-100 p-4 last:border-b-0 sm:grid-cols-4"
              >
                {[1, 2, 3, 4].map((column) => (
                  <div
                    key={column}
                    className="h-4 rounded-full bg-slate-100"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      {indicator}

      <div
        aria-hidden="true"
        className="mt-7 animate-pulse space-y-4"
      >
        <div className="h-4 w-1/3 rounded-full bg-slate-200" />
        <div className="h-3 w-full rounded-full bg-slate-100" />
        <div className="h-3 w-5/6 rounded-full bg-slate-100" />
        <div className="h-3 w-2/3 rounded-full bg-slate-100" />
      </div>
    </section>
  );
}