import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { ArrowUpRight, ArrowRight, ArrowDownRight } from "lucide-react";
import { inventoryData } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CURRENT_MONTH = 1;
const CURRENT_YEAR = 2026;

type DemandLevel = "low" | "medium" | "high";

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

function generateDemandData(chainId: string) {
  const chainItems = inventoryData.filter(i => i.chainId === chainId);
  const uniqueItems = [...new Map(chainItems.map(i => [i.name, i])).values()];

  const monthRange: number[] = [];
  for (let offset = -3; offset <= 2; offset++) {
    monthRange.push((CURRENT_MONTH + offset + 12) % 12);
  }

  const monthlyTotals: Record<string, number> = {};

  for (const mi of monthRange) {
    const isHistorical = mi > CURRENT_MONTH;
    const year = isHistorical ? CURRENT_YEAR - 1 : CURRENT_YEAR;
    const monthLabel = `${MONTHS[mi]} '${String(year).slice(-2)}`;
    let monthTotal = 0;

    for (const item of uniqueItems) {
      const seed = mi * 31 + item.name.length + (year % 100);
      const variation = 0.5 + seeded(seed) * 1.0;
      monthTotal += Math.round(item.dailyUsage * 30 * variation);
    }
    monthlyTotals[monthLabel] = monthTotal;
  }

  const avgVolume = Object.values(monthlyTotals).reduce((s, v) => s + v, 0) / Object.values(monthlyTotals).length;

  return Object.entries(monthlyTotals).map(([month, volume]) => ({
    month,
    volume,
    demandLevel: getDemandLevel(volume, avgVolume),
  }));
}

interface DemandTrendsContentProps {
  chainId: string;
}

export function DemandTrendsContent({ chainId }: DemandTrendsContentProps) {
  const monthlySummary = useMemo(() => generateDemandData(chainId), [chainId]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Inventory demand forecast — higher demand may require earlier reordering.
      </p>

      {/* Chart */}
      <div className="h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlySummary} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="rounded-lg border bg-card p-2 shadow-lg text-xs">
                    <p className="font-semibold">{d.month}</p>
                    <p className="text-muted-foreground">{d.volume.toLocaleString()} units · {d.demandLevel} demand</p>
                  </div>
                );
              }}
              cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
            />
            <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
              {monthlySummary.map((entry, index) => (
                <Cell key={index} fill={DEMAND_COLORS[entry.demandLevel]} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="py-1.5 text-left font-medium">Month</th>
            <th className="py-1.5 text-right font-medium">Sales Volume</th>
            <th className="py-1.5 text-right font-medium">Demand</th>
          </tr>
        </thead>
        <tbody>
          {monthlySummary.map((row) => {
            const Icon = DemandIcon[row.demandLevel];
            return (
              <tr key={row.month} className="border-b border-border/50 last:border-0">
                <td className="py-1.5 font-medium">{row.month}</td>
                <td className="py-1.5 text-right tabular-nums">{row.volume.toLocaleString()}</td>
                <td className="py-1.5 text-right">
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border", DEMAND_BG[row.demandLevel])}>
                    <Icon className="h-3 w-3" />
                    {row.demandLevel.charAt(0).toUpperCase() + row.demandLevel.slice(1)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <p className="text-[11px] text-muted-foreground italic border-t pt-2">
        Higher demand this month may require earlier reordering.
      </p>
    </div>
  );
}