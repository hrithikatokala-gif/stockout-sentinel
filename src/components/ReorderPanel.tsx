import { InventoryItem } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";
import { ShoppingCart, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReorderPanelProps {
  items: InventoryItem[];
}

export function ReorderPanel({ items }: ReorderPanelProps) {
  const urgentItems = items.filter(i => i.suggestedOrderDate === "Today");

  if (urgentItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <ShoppingCart className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-3 font-medium">All caught up!</p>
        <p className="text-sm text-muted-foreground">No urgent reorders needed</p>
      </div>
    );
  }

  // Group by supplier
  const bySupplier = urgentItems.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    if (!acc[item.supplier]) acc[item.supplier] = [];
    acc[item.supplier].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(bySupplier).map(([supplier, supplierItems]) => (
        <div key={supplier} className="rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">{supplier}</h4>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {supplierItems[0].leadTimeDays}d lead
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {supplierItems.map(item => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-mono font-medium text-foreground">
                  {item.suggestedOrderQty} {item.unit}
                </span>
              </li>
            ))}
          </ul>
          <Button size="sm" className="mt-3 w-full gap-2">
            <ShoppingCart className="h-3.5 w-3.5" />
            Place Order
          </Button>
        </div>
      ))}
    </div>
  );
}
