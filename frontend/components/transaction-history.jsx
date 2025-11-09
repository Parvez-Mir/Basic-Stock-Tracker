"use client";

import { useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";

export default function TransactionHistory() {
  const { fetchApi, loading, error } = useApi();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetchApi("/transactions");
      if (response.success) {
        setTransactions(response.data);
      }
    } catch (err) {
      // Error handled by hook
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="bg-muted/50">
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Current Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {formatDate(transaction.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {transaction.product_name} ({transaction.sku})
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    transaction.type === "INBOUND"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {transaction.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {transaction.current_stock}
              </td>
              <td className="px-6 py-4 text-sm">
                {transaction.notes || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {transactions.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">
          No transactions found
        </div>
      )}
    </div>
  );
}
