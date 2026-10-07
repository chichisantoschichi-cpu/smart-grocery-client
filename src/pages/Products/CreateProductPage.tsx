import { Link } from "react-router";

import api from "../../api/axios";
import ProductForm from "../../components/forms/ProductForm";
import type { ProductFormData } from "../../schemas/productSchema";

function CreateProductPage() {
  const createProduct = async (data: ProductFormData) => {
    await api.post("/products", data);
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <section>
        <Link
          to="/products"
          className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
        >
          ← Back to Products
        </Link>

        <p className="mt-6 text-sm font-semibold text-emerald-600">
          Product setup
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Add Product
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Add a grocery item to your product catalog.
        </p>
      </section>

      <ProductForm mode="create" onSubmit={createProduct} />
    </div>
  );
}

export default CreateProductPage;
