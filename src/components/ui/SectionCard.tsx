import type { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
