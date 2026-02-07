import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell,
} from "recharts";
import { useState, useMemo } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { inventoryData } from "@/lib/inventory-data";

const CATEGORIES = ["Protein", "Produce", "Dairy", "Pantry", "Pasta"] as const;
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const CATEGORY_COLORS: Record<string, string> = {
  Protein: "hsl(var(--primary))",
  Produce: "hsl(142 71% 45%)",
  Dairy: "hsl(47 100% 50%)",
  Pantry: "hsl(25 95% 53%)",
  Pasta: "hsl(262 83% 58%)",
};

// Current date: Feb 2026
const CURRENT_MONTH = 1; // 0-indexed, Feb = 1
const CURRENT_YEAR = 2026;

// Deterministic pseudo-random from seed
function seeded(seed: number): number {
  return ((Math.sin(seed * 9301 + 49297) % 1) + 1) % 1;
}

interface IngredientDetail {
  name: string;
  usage: number;
  cost: number;
  unit: string;
}

interface CategoryBar {
  category: string;
  usage: number;
  cost: number;
  ingredients: IngredientDetail[];
}

function getMonthData(chainId: string, monthIndex: number): CategoryBar[] {
  const chainItems = inventoryData.filter(i => i.chainId === chainId);
  const isHistorical = monthIndex > CURRENT_MONTH;
  const yearLabel = isHistorical ? CURRENT_YEAR - 1 : CURRENT_YEAR;
  const baseSeed = monthIndex * 31 + (yearLabel % 100);

  return CATEGORIES.map((cat) => {
    const items = chainItems.filter(i => i.category === cat);
    const ingredients: IngredientDetail[] = items.map((item, idx) => {
      const seed = baseSeed + idx * 7 + item.name.length;
      const variation = 0.6 + seeded(seed) * 0.8;
      // Scale daily usage to monthly (~30 days) with variation
      const monthlyUsage = Math.round(item.dailyUsage * 30 * variation);
      const monthlyCost = Math.round(monthlyUsage * item.pricePerUnit * 100) / 100;
      return { name: item.name, usage: monthlyUsage, cost: monthlyCost, unit: item.unit };
    });

    const totalUsage = ingredients.reduce((s, i) => s + i.usage, 0);
    const totalCost = ingredients.reduce((s, i) => s + i.cost, 0);

    return { category: cat, usage: totalUsage, cost: Math.round(totalCost), ingredients };
  });
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload as CategoryBar;
  if (!data) return null;

  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg text-xs max-w-[260px]">
      <p className="font-semibold text-sm mb-1.5" style={{ color: CATEGORY_COLORS[data.category] }}>
        {data.category}
      </p>
      <div className="space-y-1 mb-2">
        {data.ingredients.map((ing) => (
          <div key={ing.name} className="flex justify-between gap-3">
            <span className="text-muted-foreground truncate">{ing.name}</span>
            <span className="tabular-nums whitespace-nowrap">
              {ing.usage} {ing.unit} · ${ing.cost.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t pt-1.5 flex justify-between font-medium">
        <span>Total</span>
        <span className="tabular-nums">{data.usage} units · ${data.cost.toLocaleString()}</span>
      </div>
    </div>
  );
}

interface UsageChartProps {
  chainId: string;
}

export function UsageChart({ chainId }: UsageChartProps) {
  // Default to current month
  const [activeMonth, setActiveMonth] = useState(MONTHS[CURRENT_MONTH]);

  const monthIndex = MONTHS.indexOf(activeMonth);
  const isHistorical = monthIndex > CURRENT_MONTH;
  const yearLabel = isHistorical ? CURRENT_YEAR - 1 : CURRENT_YEAR;

  const data = useMemo(() => getMonthData(chainId, monthIndex), [chainId, monthIndex]);

  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-1">
        <div>
          <h2 className="text-base font-semibold">Monthly Stock Usage & Cost</h2>
          <p className="text-xs text-muted-foreground">
            {activeMonth} {yearLabel} — by ingredient category
            {isHistorical && <span className="ml-1 text-amber-500">(prior year)</span>}
          </p>
        </div>
      </div>

      <Tabs value={activeMonth} onValueChange={setActiveMonth}>
        <TabsList className="w-full flex-wrap h-auto gap-0.5 bg-muted/50 p-1">
          {MONTHS.map((m, i) => (
            <TabsTrigger
              key={m}
              value={m}
              className="text-xs px-2 py-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {m}
              {i > CURRENT_MONTH && (
                <span className="ml-0.5 text-[9px] opacity-60">'{String(CURRENT_YEAR - 1).slice(-2)}</span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {MONTHS.map((m) => (
          <TabsContent key={m} value={m} className="mt-3">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} label={{ value: "Units", angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} label={{ value: "Cost", angle: 90, position: "insideRight", style: { fontSize: 11, fill: "hsl(var(--muted-foreground))" } }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar yAxisId="left" dataKey="usage" name="Usage (units)" radius={[4, 4, 0, 0]}>
                    {data.map((entry) => (
                      <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category]} />
                    ))}
                  </Bar>
                  <Bar yAxisId="right" dataKey="cost" name="Cost ($)" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} fillOpacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
