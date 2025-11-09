"use client";
import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";
import ProductForm from "@/components/product-form";
import EditProductForm from "@/components/edit-product-form";

// Skeleton loader for product table
function ProductTableSkeleton() {
  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden animate-pulse">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                Unit Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-foreground">
                Total Value
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, idx) => (
              <tr
                key={idx}
                className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}
              >
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-2/5"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-muted rounded w-1/4 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { fetchApi, deleteProduct, loading, error } = useApi();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchApi("/products");
      setProducts(response.data);
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleDelete = async (id, productName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      try {
        await deleteProduct(id);
        fetchProducts();
      } catch (err) {
        // Error handled by useApi hook
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleUpdateSuccess = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
        <p className="text-muted-foreground">Manage your product inventory</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          {/* Editing Product Form */}
          {editingProduct ? (
            <div>
              <h2 className="text-xl mb-4">Edit Product</h2>
              <EditProductForm
                product={editingProduct}
                onSuccess={handleUpdateSuccess}
                onCancel={() => setEditingProduct(null)}
              />
            </div>
          ) : (
            <div>
              <h2 className="text-xl mb-4">Add New Product</h2>
              <ProductForm onSuccess={fetchProducts} />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          {/* Loading State with Skeleton */}
          {loading && <ProductTableSkeleton />}

          {/* Products Table */}
          {!loading && products.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">{product.name}</td>
                      <td className="px-6 py-4">{product.sku}</td>
                      <td className="px-6 py-4">{product.current_stock}</td>
                      <td className="px-6 py-4">${product.unit_price}</td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-blue-600 hover:text-blue-900 cursor-pointer"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="text-red-600 hover:text-red-900"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="bg-card rounded-lg border border-border p-12 text-center">
              <svg
                className="w-12 h-12 text-muted-foreground mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No products yet
              </h3>
              <p className="text-muted-foreground">
                Create your first product to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
