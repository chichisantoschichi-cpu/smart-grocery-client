interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  label?: string;
}

export default function LoadingSpinner({
  size = "md",
  label,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-7 w-7 border-3",
    lg: "h-10 w-10 border-4",
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <div
        className={`
          animate-spin
          rounded-full
          border-emerald-100
          border-t-emerald-600
          ${sizes[size]}
        `}
        aria-label="Loading"
      />

      {label && (
        <span className="text-sm font-medium text-slate-500">
          {label}
        </span>
      )}
    </div>
  );
}
