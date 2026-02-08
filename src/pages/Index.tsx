import { useState } from "react";
import { ShoppingCart, AlertTriangle, Clock, Package, LayoutDashboard, Building2 } from "lucide-react";
import { StockoutTable } from "@/components/StockoutTable";
import { ReorderPanel } from "@/components/ReorderPanel";
import { UsageChart } from "@/components/UsageChart";
import { ReorderTrend } from "@/components/ReorderTrend";
import { DemandTrends } from "@/components/DemandTrends";
import { ChainBadge, ChainSwitchPanel, chains } from "@/components/ChainSelector";
import { AppHeader } from "@/components/AppHeader";
import { inventoryData, categories, RiskLevel } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";

const stockTabs: { id: RiskLevel; label: string; icon: typeof AlertTriangle }[] = [
  { id: "critical", label: "Critical", icon: AlertTriangle },
  { id: "warning", label: "Low Stock", icon: Clock },
  { id: "healthy", label: "Healthy", icon: Package },
];

type PageTab = "dashboard" | "location";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeStockLevel, setActiveStockLevel] = useState<RiskLevel>("critical");
  const [selectedChain, setSelectedChain] = useState<string>(chains[0].id);
  const [activeTab, setActiveTab] = useState<PageTab>("dashboard");

  const chainFilteredItems = inventoryData.filter(i => i.chainId === selectedChain);
  const stockFilteredItems = chainFilteredItems.filter(i => i.risk === activeStockLevel);
  const filteredItems = activeCategory === "All"
    ? stockFilteredItems
    : stockFilteredItems.filter(i => i.category === activeCategory);
  const sortedItems = [...filteredItems].sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);

  const stockCounts = {
    critical: chainFilteredItems.filter(i => i.risk === "critical").length,
    warning: chainFilteredItems.filter(i => i.risk === "warning").length,
    healthy: chainFilteredItems.filter(i => i.risk === "healthy").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader>
        <ChainBadge chainId={selectedChain} />
        <p className="font-mono text-xs text-muted-foreground">Updated just now</p>
      </AppHeader>

      {/* Page-level tabs */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-1">
            {([
              { id: "dashboard" as PageTab, label: "Dashboard", icon: LayoutDashboard },
              { id: "location" as PageTab, label: "Switch Location", icon: Building2 },
            ]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-6 space-y-6">
        {activeTab === "location" ? (
          <ChainSwitchPanel selectedChain={selectedChain} onChainChange={(id) => {
            setSelectedChain(id);
            setActiveTab("dashboard");
          }} />
        ) : (
          <>
            {/* Usage Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              <UsageChart chainId={selectedChain} />
              <ReorderTrend chainId={selectedChain} />
            </div>

            {/* Sales & Demand Trends */}
            <DemandTrends chainId={selectedChain} />

            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
              {/* Main Table */}
              <div className="rounded-lg border bg-card p-5">
                <div className="flex flex-col gap-4">
                  {/* Stock Level Tabs */}
                  <div className="flex gap-2 border-b pb-3">
                    {stockTabs.map(tab => {
                      const TabIcon = tab.icon;
                      const count = stockCounts[tab.id];
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveStockLevel(tab.id)}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all",
                            activeStockLevel === tab.id
                              ? tab.id === "critical"
                                ? "bg-destructive/10 text-destructive border border-destructive/20"
                                : tab.id === "warning"
                                ? "bg-accent/15 text-accent-foreground border border-accent/25"
                                : "bg-primary/10 text-primary border border-primary/20"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <TabIcon className="h-4 w-4" />
                          {tab.label}
                          <span className={cn(
                            "ml-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                            activeStockLevel === tab.id
                              ? tab.id === "critical"
                                ? "bg-destructive/20 text-destructive"
                                : tab.id === "warning"
                                ? "bg-accent/25 text-accent-foreground"
                                : "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          )}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Category Filters & Table Header */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-base font-semibold">
                      {activeStockLevel === "critical" && "Critical Stock Items"}
                      {activeStockLevel === "warning" && "Low Stock Items"}
                      {activeStockLevel === "healthy" && "Healthy Stock Items"}
                    </h2>
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
                  
                  <div>
                    <StockoutTable items={sortedItems} />
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="rounded-lg border bg-card p-5">
                <h2 className="flex items-center gap-2 text-base font-semibold">
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                  Urgent Reorders
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">Orders that should be placed today</p>
                <div className="mt-4">
                  <ReorderPanel items={chainFilteredItems} />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Index;
