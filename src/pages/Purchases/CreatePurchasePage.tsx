import { Link } from "react-router";

import api from "../../api/axios";
import PurchaseForm from "../../components/forms/PurchaseForm";
import type { PurchaseFormData } from "../../schemas/purchaseSchema";

function CreatePurchasePage() {
  const createPurchase = async (data: PurchaseFormData) => {
    await api.post("/purchases", data);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <section>
        <Link
          to="/purchases"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Purchases
        </Link>

        <p className="mt-6 text-sm font-semibold text-emerald-600">
          Purchase entry
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Add Grocery Purchase
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Record the products and amount from a grocery trip.
        </p>
      </section>

      <PurchaseForm mode="create" onSubmit={createPurchase} />
    </div>
  );
}

export default CreatePurchasePage;
