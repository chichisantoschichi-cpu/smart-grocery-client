interface InsightCardProps {
  title: string;
  description: string;
  type: "success" | "warning" | "info";
}

function InsightCard({
  title,
  description,
  type,
}: InsightCardProps) {
  const styles = {
    success: {
      wrapper: "border-emerald-200 bg-emerald-50",
      icon: "bg-emerald-100 text-emerald-700",
      title: "text-emerald-900",
    },
    warning: {
      wrapper: "border-amber-200 bg-amber-50",
      icon: "bg-amber-100 text-amber-700",
      title: "text-amber-900",
    },
    info: {
      wrapper: "border-blue-200 bg-blue-50",
      icon: "bg-blue-100 text-blue-700",
      title: "text-blue-900",
    },
  };

  const style = styles[type];

  return (
    <div className={`rounded-2xl border p-4 ${style.wrapper}`}>
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${style.icon}`}
        >
          {type === "success" ? "✓" : type === "warning" ? "!" : "i"}
        </div>

        <div>
          <h4 className={`text-sm font-bold ${style.title}`}>{title}</h4>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default InsightCard;
