'use client';
import { useState, useEffect } from 'react';
import { useApi } from '@/hooks/useApi';

const validateProduct = (formData) => {
  const errors = {};

  if (!formData.sku?.trim()) {
    errors.sku = "SKU is required";
  } else if (formData.sku.length < 3) {
    errors.sku = "SKU must be at least 3 characters";
  }

  if (!formData.name?.trim()) {
    errors.name = "Product name is required";
  }

  if (!formData.unitPrice || formData.unitPrice <= 0) {
    errors.unitPrice = "Price must be greater than 0";
  }

  return errors;
};

const EditProductForm = ({ product, onSuccess, onCancel }) => {
  const { updateProduct, loading, error } = useApi();
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    unitPrice: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        unitPrice: product.unit_price
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateProduct(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await updateProduct(product.id, {
        ...formData,
        unitPrice: Number(formData.unitPrice)
      });
      setValidationErrors({});
      onSuccess();
    } catch (err) {
      // Error handled by hook in future
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-xl border border-gray-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Edit Product</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-4 text-sm rounded-lg bg-red-50 text-red-800 border border-red-200">
              <p className="font-medium">Unable to update product</p>
              <p>{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="sku" className="block text-sm font-semibold text-gray-900 mb-2">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g., PROD001"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition ${
                validationErrors.sku ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.sku && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.sku}</p>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition ${
                validationErrors.name ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="unitPrice" className="block text-sm font-semibold text-gray-900 mb-2">
              Unit Price ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className={`w-full pl-7 pr-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition ${
                  validationErrors.unitPrice ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>
            {validationErrors.unitPrice && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.unitPrice}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                  Updating...
                </span>
              ) : (
                'Update Product'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-200 text-gray-900 font-semibold py-2.5 rounded-lg hover:bg-gray-300 cursor-pointer transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductForm;