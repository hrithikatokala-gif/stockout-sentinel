import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { inventoryData, MonthlyUsage } from "@/lib/inventory-data";

const viewOptions = ["Total", "Protein", "Produce", "Dairy", "Pantry", "Pasta"] as const;
const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

// Seed-based pseudo-random to get consistent per-chain data
function seededVariation(base: number, seed: number): number {
  const factor = 0.75 + ((Math.sin(seed * 9301 + 49297) % 1 + 1) % 1) * 0.5;
  return Math.round(base * factor);
}

const chainSeeds: Record<string, number> = {
  "CH-001": 1,
  "CH-002": 2,
  "CH-003": 3,
  "CH-004": 4,
};

const baseCategoryUsage: Record<string, { usage: number[]; cost: number[] }> = {
  Protein: { usage: [850, 920, 880, 940, 900, 870], cost: [14500, 15800, 15100, 16200, 15500, 14900] },
  Produce: { usage: [320, 350, 310, 380, 340, 330], cost: [1600, 1750, 1550, 1900, 1700, 1650] },
  Dairy: { usage: [280, 310, 290, 340, 320, 300], cost: [3920, 4340, 4060, 4760, 4480, 4200] },
  Pantry: { usage: [220, 250, 260, 300, 280, 240], cost: [1320, 1500, 1560, 1800, 1680, 1440] },
  Pasta: { usage: [380, 420, 400, 460, 430, 390], cost: [1520, 1680, 1600, 1840, 1720, 1560] },
};

function getChainCategoryData(chainId: string, category: string): MonthlyUsage[] {
  const seed = chainSeeds[chainId] ?? 1;
  const base = baseCategoryUsage[category];
  if (!base) return [];
  return months.map((m, i) => ({
    month: m,
    usage: seededVariation(base.usage[i], seed + i),
    cost: seededVariation(base.cost[i], seed + i + 100),
  }));
}

function getChainTotalData(chainId: string): MonthlyUsage[] {
  const categories = Object.keys(baseCategoryUsage);
  return months.map((m, i) => {
    let usage = 0, cost = 0;
    for (const cat of categories) {
      const data = getChainCategoryData(chainId, cat);
      usage += data[i].usage;
      cost += data[i].cost;
    }
    return { month: m, usage, cost };
  });
}

interface UsageChartProps {
  chainId: string;
}

export function UsageChart({ chainId }: UsageChartProps) {
  const [view, setView] = useState<string>("Total");

  const data = useMemo(() => {
    return view === "Total" ? getChainTotalData(chainId) : getChainCategoryData(chainId, view);
  }, [view, chainId]);

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Monthly Stock Usage & Cost</h2>
          <p className="text-xs text-muted-foreground">6-month rolling history</p>
        </div>
        <div className="flex gap-1.5">
          {viewOptions.map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                view === v
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) =>
                name === "cost" ? [`$${value.toLocaleString()}`, "Cost"] : [`${value} units`, "Usage"]
              }
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar yAxisId="left" dataKey="usage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Usage" />
            <Bar yAxisId="right" dataKey="cost" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Cost ($)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
