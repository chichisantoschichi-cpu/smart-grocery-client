import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import {
  budgetSchema,
  type BudgetFormData,
} from "../../schemas/budgetSchema";

interface BudgetFormProps {
  mode: "create" | "edit";
  defaultValues?: BudgetFormData;
  onSubmit: (data: BudgetFormData) => Promise<void>;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function BudgetForm({
  mode,
  defaultValues,
  onSubmit,
}: BudgetFormProps) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: defaultValues ?? {
      month: "",
      year: 2026,
      amount: 0,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const submitHandler = async (data: BudgetFormData) => {
    try {
      await onSubmit(data);
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "Failed to save budget.",
      });
      return;
    }

    const message =
      mode === "create"
        ? "Budget created successfully."
        : "Budget updated successfully.";

    window.alert(message);

    navigate("/budgets");
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6"
    >
      {/* Month */}
      <div>
        <label
          htmlFor="month"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Budget Month
        </label>

        <select
          id="month"
          {...register("month")}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
            errors.month
              ? "border-rose-300"
              : "border-slate-200"
          }`}
        >
          <option value="">Select month</option>

          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>

        {errors.month && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.month.message}
          </p>
        )}
      </div>

      {/* Year */}
      <div>
        <label
          htmlFor="year"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Year
        </label>

        <input
          id="year"
          type="number"
          {...register("year", {
            valueAsNumber: true,
          })}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
            errors.year
              ? "border-rose-300"
              : "border-slate-200"
          }`}
        />

        {errors.year && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.year.message}
          </p>
        )}
      </div>

      {/* Amount */}
      <div>
        <label
          htmlFor="amount"
          className="mb-2 block text-sm font-semibold text-slate-700"
        >
          Budget Amount
        </label>

        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
            ₱
          </span>

          <input
            id="amount"
            type="number"
            step="0.01"
            {...register("amount", {
              valueAsNumber: true,
            })}
            placeholder="15000"
            className={`w-full rounded-xl border bg-white py-3 pl-9 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 ${
              errors.amount
                ? "border-rose-300"
                : "border-slate-200"
            }`}
          />
        </div>

        {errors.amount && (
          <p className="mt-1.5 text-xs font-medium text-rose-600">
            {errors.amount.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {errors.root.message}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => navigate("/budgets")}
          className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Create Budget"
              : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;
