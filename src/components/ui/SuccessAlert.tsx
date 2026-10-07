interface SuccessAlertProps {
  message: string;
  onClose?: () => void;
}

export default function SuccessAlert({
  message,
  onClose,
}: SuccessAlertProps) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
          ✓
        </div>

        <div>
          <p className="text-sm font-semibold">Success</p>
          <p className="mt-0.5 text-sm text-emerald-700">{message}</p>
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-lg px-2 py-1 text-emerald-700 transition hover:bg-emerald-100"
        >
          ×
        </button>
      )}
    </div>
  );
}
