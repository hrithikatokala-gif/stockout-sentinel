import { inventoryData } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";
import { Repeat, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ReorderTrendItem {
  name: string;
  category: string;
  ordersPerMonth: number;
  trend: "up" | "down" | "stable";
  avgCostPerOrder: number;
}

// Simulated reorder frequency data based on inventory characteristics
const reorderTrends: ReorderTrendItem[] = inventoryData
  .map(item => {
    const ordersPerMonth = +(item.dailyUsage * 30 / item.suggestedOrderQty).toFixed(1);
    const trend: "up" | "down" | "stable" =
      item.risk === "critical" ? "up" : item.risk === "warning" ? "stable" : "down";
    return {
      name: item.name,
      category: item.category,
      ordersPerMonth,
      trend,
      avgCostPerOrder: +(item.suggestedOrderQty * item.pricePerUnit).toFixed(0),
    };
  })
  .sort((a, b) => b.ordersPerMonth - a.ordersPerMonth);

const trendIcon = { up: TrendingUp, down: TrendingDown, stable: Minus };
const trendColor = {
  up: "text-destructive",
  down: "text-primary",
  stable: "text-muted-foreground",
};
const trendLabel = { up: "Increasing", down: "Decreasing", stable: "Stable" };

export function ReorderTrend() {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-center gap-2">
        <Repeat className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-base font-semibold">Frequent Reorder Trends</h2>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Items ordered most frequently — watch for rising trends</p>

      <div className="mt-4 space-y-2">
        {reorderTrends.slice(0, 8).map(item => {
          const Icon = trendIcon[item.trend];
          return (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-md border px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.category}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold">{item.ordersPerMonth}x</p>
                  <p className="text-xs text-muted-foreground">/month</p>
                </div>
                <div className="text-right min-w-[70px]">
                  <p className="font-mono text-xs text-muted-foreground">${item.avgCostPerOrder}</p>
                  <p className="text-xs text-muted-foreground">per order</p>
                </div>
                <div className={cn("flex items-center gap-1 text-xs font-medium min-w-[80px]", trendColor[item.trend])}>
                  <Icon className="h-3.5 w-3.5" />
                  {trendLabel[item.trend]}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
