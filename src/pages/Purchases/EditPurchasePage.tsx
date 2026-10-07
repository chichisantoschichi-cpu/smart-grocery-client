import { useMemo } from "react";
import { Link, useParams } from "react-router";

import api from "../../api/axios";
import PurchaseForm from "../../components/forms/PurchaseForm";
import { LoadingState, NotFoundCard } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import type { PurchaseFormData } from "../../schemas/purchaseSchema";
import type { Purchase } from "../../types";
import { toDateInputValue } from "../../utils/date";

function EditPurchasePage() {
  const { id } = useParams();
  const { data: purchase, loading, error } = useApi<Purchase>(`/purchases/${id}`);

  const defaultValues = useMemo<PurchaseFormData | undefined>(
    () =>
      purchase
        ? {
            storeId: purchase.storeId,
            purchaseDate: toDateInputValue(purchase.purchaseDate),
            notes: purchase.notes ?? "",
            items: purchase.items.map((item) => ({
              productId: item.productId,
              productName: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          }
        : undefined,
    [purchase],
  );

  const updatePurchase = async (data: PurchaseFormData) => {
    await api.put(`/purchases/${id}`, data);
  };

  if (loading) {
    return <LoadingState message="Loading purchase..." />;
  }

  if (error || !purchase) {
    return (
      <NotFoundCard
        title="Purchase Not Found"
        message={error ?? "The purchase you are trying to edit does not exist."}
        backTo="/purchases"
        backLabel="Back to Purchases"
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section>
        <Link
          to={`/purchases/${purchase.id}`}
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Purchase
        </Link>

        <p className="mt-6 text-sm font-semibold text-emerald-600">
          Purchase management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Edit Purchase
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update the details of this grocery purchase.
        </p>
      </section>

      <PurchaseForm mode="edit" defaultValues={defaultValues} onSubmit={updatePurchase} />
    </div>
  );
}

export default EditPurchasePage;
