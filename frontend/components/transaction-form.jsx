"use client";

import { useState, useEffect } from "react";
import { useApi } from "@/hooks/useApi";

export default function TransactionForm({ onSuccess }) {
  const { fetchApi, loading, error } = useApi();
  const [products, setProducts] = useState([]);
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    type: "INBOUND",
    quantity: "",
    notes: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetchApi("/products");
      if (response.success) {
        setProducts(response.data);
      }
    } catch (err) {
      // Error handled by hook
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update selectedProduct when product changes
    if (name === "productId" && value) {
      const product = products.find((p) => p.id === Number(value));
      setSelectedProduct(product);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false); // Reset success state
    try {
      const response = await fetchApi("/transactions", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          productId: Number(formData.productId),
          quantity: Number(formData.quantity),
        }),
      });

      if (response.success) {
        setSuccess(true);
        setFormData({
          productId: "",
          type: "INBOUND",
          quantity: "",
          notes: "",
        });
        onSuccess?.();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 sticky top-24 space-y-6">
      {/* Enhanced header with better visual hierarchy */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">
          Record Transaction
        </h3>
      </div>

      {/* Improved error display with icons */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm font-medium flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm8-7a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5a2 2 0 012-2zm-8-2a2 2 0 00-2 2v7a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2zm-2 9a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 002 0h4a2 2 0 000-4H8a2 2 0 00-2 0z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Success notification styling */}
      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-700 dark:text-green-400 text-sm font-medium flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Transaction recorded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Selection */}
        <div>
          <label
            htmlFor="productId"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Product <span className="text-destructive">*</span>
          </label>
          <select
            id="productId"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          >
            <option value="">Select a product...</option>
            {products?.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} ({product.sku})
              </option>
            ))}
          </select>
          {/* Improved stock display styling */}
          {selectedProduct && (
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
              Stock:{" "}
              <span className="font-semibold text-foreground">
                {selectedProduct.current_stock || 0} units
              </span>
            </p>
          )}
        </div>

        {/* Enhanced transaction type buttons with better styling */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-3">
            Type <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            {["INBOUND", "OUTBOUND"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, type }))}
                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  formData.type === type
                    ? type === "INBOUND"
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                      : "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {type === "INBOUND" ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Inbound
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Outbound
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Quantity <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="0"
            min="1"
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
          />
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="notes"
            className="block text-sm font-semibold text-foreground mb-2"
          >
            Notes{" "}
            <span className="text-muted-foreground text-xs font-normal">
              (Optional)
            </span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add any additional notes..."
            rows="3"
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition resize-none"
          />
        </div>

        {/* Enhanced submit button with loading state */}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin"></span>
              Recording...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Record Transaction
            </>
          )}
        </button>
      </form>
    </div>
  );
}
