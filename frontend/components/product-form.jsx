"use client"

import { useState } from "react"
import { useApi } from "@/hooks/useApi"

const validateProduct = (formData) => {
  const errors = {}

  if (!formData.sku?.trim()) {
    errors.sku = "SKU is required"
  } else if (formData.sku.length < 3) {
    errors.sku = "SKU must be at least 3 characters"
  }

  if (!formData.name?.trim()) {
    errors.name = "Product name is required"
  }

  if (!formData.unitPrice || formData.unitPrice <= 0) {
    errors.unitPrice = "Price must be greater than 0"
  }

  return errors
}

export default function ProductForm({ onSuccess }) {
  const { fetchApi, loading, error } = useApi()
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    unitPrice: "",
  })
  const [validationErrors, setValidationErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const errors = validateProduct(formData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      await fetchApi("/products", {
        method: "POST",
        body: JSON.stringify(formData),
      })
      setFormData({
        sku: "",
        name: "",
        unitPrice: "",
      })
      setValidationErrors({})
      onSuccess?.()
    } catch (err) {
      // Error is handled by a hook 
    }
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Add New Product</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 mb-4 text-sm rounded-lg bg-red-50 text-red-800 border border-red-200">
            <p className="font-medium">Unable to save product</p>
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium text-foreground mb-2">
              SKU
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="e.g., PROD001"
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition ${
                validationErrors.sku ? "border-red-500" : "border-input"
              }`}
              required
            />
            {validationErrors.sku && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.sku}</p>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition ${
                validationErrors.name ? "border-red-500" : "border-input"
              }`}
              required
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
            )}
          </div>

          {/* Unit Price */}
          <div className="md:col-span-2">
            <label htmlFor="unitPrice" className="block text-sm font-medium text-foreground mb-2">
              Unit Price ($)
            </label>
            <input
              type="number"
              id="unitPrice"
              name="unitPrice"
              value={formData.unitPrice}
              onChange={handleChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              className={`w-full px-4 py-2 bg-background border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition ${
                validationErrors.unitPrice ? "border-red-500" : "border-input"
              }`}
              required
            />
            {validationErrors.unitPrice && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.unitPrice}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
