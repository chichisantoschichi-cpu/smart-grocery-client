interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong while loading the data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-red-800">Unable to load data</h3>
          <p className="mt-1 text-sm text-red-600">{message}</p>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98]"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
