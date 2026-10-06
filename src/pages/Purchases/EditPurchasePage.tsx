import { Link, useParams } from "react-router";

import PurchaseForm from "../../components/forms/PurchaseForm";
import { purchasesData } from "../../data/mockData";

function EditPurchasePage() {
  const { id } = useParams();

  const purchase = purchasesData.find(
    (item) => item.id === id,
  );

  if (!purchase) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-semibold text-rose-600">
          404
        </p>

        <h1 className="mt-1 text-2xl font-bold text-rose-900">
          Purchase Not Found
        </h1>

        <p className="mt-2 text-sm text-rose-700">
          The purchase you are trying to edit does not exist.
        </p>

        <Link
          to="/purchases"
          className="mt-6 inline-flex rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Purchases
        </Link>
      </div>
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

      <PurchaseForm
        mode="edit"
        defaultValues={{
          store: purchase.store,
          purchaseDate: purchase.purchaseDate,
          notes: purchase.notes,
          items: purchase.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        }}
      />
    </div>
  );
}

export default EditPurchasePage;
