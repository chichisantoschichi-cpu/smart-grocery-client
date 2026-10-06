import { Link, useParams } from "react-router";

import ProductForm from "../../components/forms/ProductForm";
import { groceryProducts } from "../../data/mockData";

function EditProductPage() {
  const { id } = useParams();

  const product = groceryProducts.find(
    (item) => item.id === id,
  );

  if (!product) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-sm font-semibold text-rose-600">
          404
        </p>

        <h1 className="mt-1 text-2xl font-bold text-rose-900">
          Product Not Found
        </h1>

        <p className="mt-2 text-sm text-rose-700">
          The product you are trying to edit does not exist.
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Products
        </Link>
      </div>
    );
  }

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
          Product management
        </p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Edit Product
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Update information for {product.name}.
        </p>
      </section>

      <ProductForm
        mode="edit"
        defaultValues={{
          name: product.name,
          category: product.category,
          unit: product.unit,
          estimatedPrice:
            product.estimatedPrice,
        }}
      />
    </div>
  );
}

export default EditProductPage;
