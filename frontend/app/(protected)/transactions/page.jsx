"use client";

import { useState, useCallback } from "react";
import TransactionForm from "@/components/transaction-form";
import TransactionHistory from "@/components/transaction-history";

export default function TransactionsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransactionSuccess = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Transactions</h1>
        <p className="text-muted-foreground">Record and track inventory movements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">New Transaction</h2>
            <TransactionForm onSuccess={handleTransactionSuccess} />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <TransactionHistory key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}
