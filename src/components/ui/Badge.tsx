import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "danger"
    | "info";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    info: "bg-sky-50 text-sky-700",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full
        px-2.5 py-1 text-xs font-semibold
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
