"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import ProductTable from '@/components/product-table';
import ProductForm from '@/components/product-form';

export default function Home() {
  const router = useRouter()

  useEffect(() => {

    const token = localStorage.getItem("demo_token")
    if (token) {
      router.push("/dashboard")
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Inventory</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
        <ProductForm />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Product List</h2>
        <ProductTable />
      </div>
    </div>
  );
}
