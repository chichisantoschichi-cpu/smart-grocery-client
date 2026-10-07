import { useMemo } from "react";
import { Link, useParams } from "react-router";

import api from "../../api/axios";
import ProductForm from "../../components/forms/ProductForm";
import { LoadingState, NotFoundCard } from "../../components/ui";
import { useApi } from "../../hooks/useApi";
import type { ProductFormData } from "../../schemas/productSchema";
import type { Product } from "../../types";

function EditProductPage() {
  const { id } = useParams();
  const { data: product, loading, error } = useApi<Product>(`/products/${id}`);

  const defaultValues = useMemo<ProductFormData | undefined>(
    () =>
      product
        ? {
            name: product.name,
            categoryId: product.categoryId,
            unit: product.unit,
            price: product.price,
            stock: product.stock,
            minStock: product.minStock,
          }
        : undefined,
    [product],
  );

  const updateProduct = async (data: ProductFormData) => {
    await api.put(`/products/${id}`, data);
  };

  if (loading) {
    return <LoadingState message="Loading product..." />;
  }

  if (error || !product) {
    return (
      <NotFoundCard
        title="Product Not Found"
        message={error ?? "The product you are trying to edit does not exist."}
        backTo="/products"
        backLabel="Back to Products"
      />
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

      <ProductForm mode="edit" defaultValues={defaultValues} onSubmit={updateProduct} />
    </div>
  );
}

export default EditProductPage;
