interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading data...",
}: LoadingStateProps) {
  return (
    <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
        <p className="text-sm font-medium text-slate-500">{message}</p>
      </div>
    </div>
  );
}
