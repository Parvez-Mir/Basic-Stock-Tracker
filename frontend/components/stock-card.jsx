export default function StockCard({ stock }) {
  const getStatusColor = (quantity) => {
    const minQuantity = 20
    if (quantity <= minQuantity) return "bg-destructive/10 text-destructive"
    if (quantity <= minQuantity * 1.5) return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400"
    return "bg-green-500/10 text-green-700 dark:text-green-400"
  }

  const getStatusLabel = (quantity) => {
    const minQuantity = 20
    if (quantity <= minQuantity) return "Low Stock"
    if (quantity <= minQuantity * 1.5) return "Medium Stock"
    return "Good Stock"
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm hover:shadow-md transition p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground truncate">{stock.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{stock.sku}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusColor(stock.current_stock)}`}
        >
          {getStatusLabel(stock.current_stock)}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Current Stock</p>
          <p className="text-2xl font-bold text-foreground">{stock.current_stock}</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Unit Price</p>
            <p className="text-sm font-semibold text-foreground">${stock.unit_price?.toFixed(2) || "0.00"}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">Total Value</p>
          <p className="text-lg font-bold text-primary">
            ${(stock.current_stock * (stock.unit_price || 0)).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  )
}
