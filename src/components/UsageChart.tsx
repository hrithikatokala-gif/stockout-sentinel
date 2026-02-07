import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { monthlyUsageByCategory, totalMonthlyUsage } from "@/lib/inventory-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

const viewOptions = ["Total", "Protein", "Produce", "Dairy", "Pantry"] as const;

export function UsageChart() {
  const [view, setView] = useState<string>("Total");

  const data = view === "Total" ? totalMonthlyUsage : monthlyUsageByCategory[view] ?? [];

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
