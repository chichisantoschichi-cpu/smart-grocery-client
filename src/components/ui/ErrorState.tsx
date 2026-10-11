import { useState } from "react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void | Promise<unknown>;
}

export default function ErrorState({
  title = "Unable to load data",
  message = "Something went wrong while loading the data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  const [retrying, setRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry || retrying) return;

    setRetrying(true);

    try {
      await onRetry();
    } catch (error) {
      console.error("Retry failed:", error);
    } finally {
      setRetrying(false);
    }
  };

  return (
    <section
      role="alert"
      className="rounded-2xl border border-rose-200 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01"
            />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 break-words text-sm leading-6 text-slate-600">
            {message}
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={handleRetry}
            disabled={retrying}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`h-4 w-4 ${retrying ? "animate-spin" : ""}`}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20 7v5h-5M4.5 16.5A8 8 0 0 0 18.2 19M4 17v-5h5m10.5-4.5A8 8 0 0 0 5.8 5"
              />
            </svg>
            {retrying ? "Retrying..." : "Try Again"}
          </button>
        )}
      </div>
    </section>
  );
}