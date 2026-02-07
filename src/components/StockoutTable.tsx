import { useState } from "react";
import { InventoryItem, RiskLevel } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, Package, ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const riskConfig: Record<RiskLevel, { label: string; className: string; icon: typeof AlertTriangle }> = {
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
  warning: { label: "Low Stock", className: "bg-accent/15 text-warning-foreground border-accent/25", icon: Clock },
  healthy: { label: "Healthy", className: "bg-primary/10 text-primary border-primary/20", icon: Package },
};

interface StockoutTableProps {
  items: InventoryItem[];
}

export function StockoutTable({ items }: StockoutTableProps) {
  const [orderQuantities, setOrderQuantities] = useState<Record<string, number>>({});
  const { addToCart, isInCart } = useCart();

  const getOrderQty = (item: InventoryItem) => {
    return orderQuantities[item.id] ?? item.suggestedOrderQty;
  };

  const handleQtyChange = (itemId: string, value: string) => {
    const qty = parseInt(value) || 0;
    setOrderQuantities(prev => ({ ...prev, [itemId]: qty }));
  };

  const handleAddToCart = (item: InventoryItem) => {
    const qty = getOrderQty(item);
    if (qty > 0) {
      addToCart(item, qty);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-semibold text-muted-foreground">Item</th>
            <th className="pb-3 font-semibold text-muted-foreground">Category</th>
            <th className="pb-3 font-semibold text-muted-foreground">Stock</th>
            <th className="pb-3 font-semibold text-muted-foreground">Price/Unit</th>
            <th className="pb-3 font-semibold text-muted-foreground">Daily Use</th>
            <th className="pb-3 font-semibold text-muted-foreground">Days Left</th>
            <th className="pb-3 font-semibold text-muted-foreground">Shelf Life</th>
            <th className="pb-3 font-semibold text-muted-foreground">Status</th>
            <th className="pb-3 font-semibold text-muted-foreground">Order Qty</th>
            <th className="pb-3 font-semibold text-muted-foreground"></th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => {
            const config = riskConfig[item.risk];
            const RiskIcon = config.icon;
            const inCart = isInCart(item.id);
            return (
              <tr
                key={item.id}
                className={cn(
                  "transition-colors hover:bg-muted/50",
                  item.risk === "critical" && "bg-destructive/[0.03]"
                )}
              >
                <td className="py-3.5 font-medium">{item.name}</td>
                <td className="py-3.5 text-muted-foreground">{item.category}</td>
                <td className="py-3.5 font-mono text-sm">
                  {item.currentStock} {item.unit}
                </td>
                <td className="py-3.5 font-mono text-sm text-muted-foreground">
                  ${item.pricePerUnit.toFixed(2)}
                </td>
                <td className="py-3.5 font-mono text-sm text-muted-foreground">
                  {item.dailyUsage} {item.unit}/d
                </td>
                <td className="py-3.5">
                  <span className={cn(
                    "font-mono font-bold",
                    item.daysUntilStockout <= 2 && "text-destructive animate-pulse-soft",
                    item.daysUntilStockout <= 4 && item.daysUntilStockout > 2 && "text-accent-foreground"
                  )}>
                    {item.daysUntilStockout}d
                  </span>
                </td>
                <td className="py-3.5">
                  <span className={cn(
                    "font-mono text-sm",
                    item.shelfLifeDays <= 3 && "text-destructive font-bold",
                    item.shelfLifeDays <= 7 && item.shelfLifeDays > 3 && "text-accent-foreground font-semibold",
                    item.shelfLifeDays > 7 && "text-muted-foreground"
                  )}>
                    {item.shelfLifeDays}d
                  </span>
                </td>
                <td className="py-3.5">
                  <Badge variant="outline" className={cn("gap-1 text-xs font-medium", config.className)}>
                    <RiskIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={getOrderQty(item)}
                      onChange={(e) => handleQtyChange(item.id, e.target.value)}
                      className={cn(
                        "h-8 w-20 text-center font-mono text-sm",
                        getOrderQty(item) !== item.suggestedOrderQty && "border-primary ring-1 ring-primary/20"
                      )}
                    />
                    <span className="text-xs text-muted-foreground">{item.unit}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Suggested: {item.suggestedOrderQty}
                  </p>
                </td>
                <td className="py-3.5">
                  <Button
                    size="sm"
                    variant={inCart ? "secondary" : "default"}
                    className="gap-1.5"
                    onClick={() => handleAddToCart(item)}
                  >
                    {inCart ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Added
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add
                      </>
                    )}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
