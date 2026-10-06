import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-400",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    ghost:
      "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-300",
  };

  const sizes = {
    sm: "min-h-9 px-3 text-xs",
    md: "min-h-10 px-4 text-sm",
    lg: "min-h-11 px-5 text-sm",
  };

  return (
    <button
      {...props}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-xl font-semibold
        transition-all duration-150
        focus:outline-none focus:ring-4
        active:scale-[0.98]
        disabled:pointer-events-none disabled:opacity-50
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
