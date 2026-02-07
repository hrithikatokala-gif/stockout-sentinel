import { InventoryItem, RiskLevel } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";
import { AlertTriangle, Clock, ArrowRight, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const riskConfig: Record<RiskLevel, { label: string; className: string; icon: typeof AlertTriangle }> = {
  critical: { label: "Critical", className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
  warning: { label: "Low Stock", className: "bg-accent/15 text-warning-foreground border-accent/25", icon: Clock },
  healthy: { label: "Healthy", className: "bg-primary/10 text-primary border-primary/20", icon: Package },
};

interface StockoutTableProps {
  items: InventoryItem[];
}

export function StockoutTable({ items }: StockoutTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="pb-3 font-semibold text-muted-foreground">Item</th>
            <th className="pb-3 font-semibold text-muted-foreground">Category</th>
            <th className="pb-3 font-semibold text-muted-foreground">Stock</th>
            <th className="pb-3 font-semibold text-muted-foreground">Daily Use</th>
            <th className="pb-3 font-semibold text-muted-foreground">Days Left</th>
            <th className="pb-3 font-semibold text-muted-foreground">Status</th>
            <th className="pb-3 font-semibold text-muted-foreground">Reorder</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => {
            const config = riskConfig[item.risk];
            const RiskIcon = config.icon;
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
                  <Badge variant="outline" className={cn("gap-1 text-xs font-medium", config.className)}>
                    <RiskIcon className="h-3 w-3" />
                    {config.label}
                  </Badge>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-xs font-medium",
                      item.suggestedOrderDate === "Today" && "text-destructive font-bold",
                      item.suggestedOrderDate === "Tomorrow" && "text-accent-foreground font-semibold"
                    )}>
                      {item.suggestedOrderDate}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {item.suggestedOrderQty} {item.unit}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
