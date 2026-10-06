import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export default function Card({
  children,
  className = "",
  padding = "md",
}: CardProps) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-5 sm:p-6",
    lg: "p-6 sm:p-8",
  };

  return (
    <div
      className={`
        rounded-2xl
        border border-slate-200
        bg-white
        shadow-sm
        ${paddingStyles[padding]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
