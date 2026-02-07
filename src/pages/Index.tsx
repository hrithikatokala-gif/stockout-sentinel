import { useState } from "react";
import { ShoppingCart, BarChart3 } from "lucide-react";
import { StockoutTable } from "@/components/StockoutTable";
import { ReorderPanel } from "@/components/ReorderPanel";
import { UsageChart } from "@/components/UsageChart";
import { ReorderTrend } from "@/components/ReorderTrend";
import { inventoryData, categories } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredItems = activeCategory === "All"
    ? inventoryData
    : inventoryData.filter(i => i.category === activeCategory);

  const sortedItems = [...filteredItems].sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary p-2">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">StockPulse</h1>
              <p className="text-xs text-muted-foreground">Inventory Intelligence</p>
            </div>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Updated just now
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        {/* Usage Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UsageChart />
          <ReorderTrend />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main Table */}
          <div className="rounded-lg border bg-card p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold">Stockout Predictions</h2>
              <div className="flex gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                      activeCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <StockoutTable items={sortedItems} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-5">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                Urgent Reorders
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">Orders that should be placed today</p>
              <div className="mt-4">
                <ReorderPanel items={inventoryData} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
