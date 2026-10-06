import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        {...props}
        className={`
          ui-input
          ${error ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100" : ""}
          ${className}
        `}
      />

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-rose-600">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
