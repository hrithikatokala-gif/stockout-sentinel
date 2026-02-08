import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { TrendingUp, ArrowUpRight, ArrowRight, ArrowDownRight } from "lucide-react";
import { inventoryData } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CURRENT_MONTH = 1; // Feb, 0-indexed
const CURRENT_YEAR = 2026;

type DemandLevel = "low" | "medium" | "high";

interface DemandRow {
  month: string;
  item: string;
  salesVolume: number;
  demandLevel: DemandLevel;
}

function seeded(seed: number): number {
  return ((Math.sin(seed * 9301 + 49297) % 1) + 1) % 1;
}

function getDemandLevel(volume: number, avgVolume: number): DemandLevel {
  const ratio = volume / avgVolume;
  if (ratio >= 1.2) return "high";
  if (ratio >= 0.8) return "medium";
  return "low";
}

const DEMAND_COLORS: Record<DemandLevel, string> = {
  high: "hsl(0 72% 51%)",
  medium: "hsl(38 92% 50%)",
  low: "hsl(142 71% 45%)",
};

const DEMAND_BG: Record<DemandLevel, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  low: "bg-green-500/10 text-green-600 border-green-500/20",
};

const DemandIcon: Record<DemandLevel, typeof ArrowUpRight> = {
  high: ArrowUpRight,
  medium: ArrowRight,
  low: ArrowDownRight,
};

function generateDemandData(chainId: string): { rows: DemandRow[]; monthlySummary: { month: string; volume: number; demandLevel: DemandLevel }[] } {
  const chainItems = inventoryData.filter(i => i.chainId === chainId);
  const uniqueItems = [...new Map(chainItems.map(i => [i.name, i])).values()];

  // Generate 6 months of data (3 past + current + 2 projected)
  const monthRange: number[] = [];
  for (let offset = -3; offset <= 2; offset++) {
    monthRange.push((CURRENT_MONTH + offset + 12) % 12);
  }

  const rows: DemandRow[] = [];
  const monthlyTotals: Record<string, number> = {};

  for (const mi of monthRange) {
    const isHistorical = mi > CURRENT_MONTH;
    const year = isHistorical ? CURRENT_YEAR - 1 : CURRENT_YEAR;
    const monthLabel = `${MONTHS[mi]} '${String(year).slice(-2)}`;
    let monthTotal = 0;

    for (const item of uniqueItems) {
      const seed = mi * 31 + item.name.length + (year % 100);
      const variation = 0.5 + seeded(seed) * 1.0;
      const volume = Math.round(item.dailyUsage * 30 * variation);
      monthTotal += volume;

      rows.push({
        month: monthLabel,
        item: item.name,
        salesVolume: volume,
        demandLevel: "medium", // placeholder, computed below
      });
    }
    monthlyTotals[monthLabel] = monthTotal;
  }

  // Compute average and assign demand levels
  const avgVolume = Object.values(monthlyTotals).reduce((s, v) => s + v, 0) / Object.values(monthlyTotals).length;
  
  const monthlySummary = Object.entries(monthlyTotals).map(([month, volume]) => ({
    month,
    volume,
    demandLevel: getDemandLevel(volume, avgVolume),
  }));

  // Update rows with correct demand levels per month
  for (const row of rows) {
    const summary = monthlySummary.find(s => s.month === row.month);
    if (summary) row.demandLevel = summary.demandLevel;
  }

  return { rows, monthlySummary };
}

interface DemandTrendsProps {
  chainId: string;
}

export function DemandTrends({ chainId }: DemandTrendsProps) {
  const { monthlySummary } = useMemo(() => generateDemandData(chainId), [chainId]);

  const currentMonth = monthlySummary[3]; // current month is index 3 in our 6-month window
  const Icon = currentMonth ? DemandIcon[currentMonth.demandLevel] : ArrowRight;

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            Sales & Demand Trends
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Inventory demand forecast — higher demand may require earlier reordering.
          </p>
        </div>
        {currentMonth && (
          <div className={cn("flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium", DEMAND_BG[currentMonth.demandLevel])}>
            <Icon className="h-3.5 w-3.5" />
            {currentMonth.demandLevel.charAt(0).toUpperCase() + currentMonth.demandLevel.slice(1)} Demand
          </div>
        )}
      </div>

      {/* Bar chart */}
      <div className="h-[180px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySummary} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-card p-2.5 shadow-lg text-xs">
                    <p className="font-semibold text-sm">{d.month}</p>
                    <p className="text-muted-foreground">Volume: {d.volume.toLocaleString()} units</p>
                    <p className="text-muted-foreground">Demand: {d.demandLevel}</p>
                  </div>
                );
              }}
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
            />
            <Bar dataKey="volume" name="Sales Volume" radius={[4, 4, 0, 0]}>
              {monthlySummary.map((entry, index) => (
                <Cell key={index} fill={DEMAND_COLORS[entry.demandLevel]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="py-1.5 text-left font-medium">Month</th>
              <th className="py-1.5 text-right font-medium">Sales Volume</th>
              <th className="py-1.5 text-right font-medium">Demand Level</th>
            </tr>
          </thead>
          <tbody>
            {monthlySummary.map((row) => {
              const RowIcon = DemandIcon[row.demandLevel];
              return (
                <tr key={row.month} className="border-b border-border/50 last:border-0">
                  <td className="py-1.5 font-medium">{row.month}</td>
                  <td className="py-1.5 text-right tabular-nums">{row.volume.toLocaleString()}</td>
                  <td className="py-1.5 text-right">
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border", DEMAND_BG[row.demandLevel])}>
                      <RowIcon className="h-3 w-3" />
                      {row.demandLevel.charAt(0).toUpperCase() + row.demandLevel.slice(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-muted-foreground italic border-t pt-2.5">
        Higher demand this month may require earlier reordering. Review critical stock items above to adjust order timing.
      </p>
    </div>
  );
}