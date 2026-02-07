export type RiskLevel = "critical" | "warning" | "healthy";

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  dailyUsage: number;
  daysUntilStockout: number;
  reorderPoint: number;
  suggestedOrderQty: number;
  suggestedOrderDate: string;
  lastOrdered: string;
  risk: RiskLevel;
  supplier: string;
  leadTimeDays: number;
  pricePerUnit: number;
}

export interface MonthlyUsage {
  month: string;
  usage: number;
  cost: number;
}

export const inventoryData: InventoryItem[] = [
  { id: "1", name: "Chicken Breast", category: "Protein", currentStock: 18, unit: "kg", dailyUsage: 12, daysUntilStockout: 1, reorderPoint: 30, suggestedOrderQty: 80, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "FreshMeats Co.", leadTimeDays: 2, pricePerUnit: 8.50 },
  { id: "2", name: "Olive Oil", category: "Pantry", currentStock: 5, unit: "L", dailyUsage: 2.5, daysUntilStockout: 2, reorderPoint: 10, suggestedOrderQty: 24, suggestedOrderDate: "Today", lastOrdered: "1 week ago", risk: "critical", supplier: "Mediterranean Imports", leadTimeDays: 3, pricePerUnit: 12.00 },
  { id: "3", name: "Salmon Fillet", category: "Protein", currentStock: 22, unit: "kg", dailyUsage: 8, daysUntilStockout: 3, reorderPoint: 20, suggestedOrderQty: 50, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Ocean Fresh", leadTimeDays: 1, pricePerUnit: 18.00 },
  { id: "4", name: "Roma Tomatoes", category: "Produce", currentStock: 15, unit: "kg", dailyUsage: 6, daysUntilStockout: 3, reorderPoint: 15, suggestedOrderQty: 40, suggestedOrderDate: "Tomorrow", lastOrdered: "Yesterday", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 3.20 },
  { id: "5", name: "Heavy Cream", category: "Dairy", currentStock: 8, unit: "L", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Dairy Direct", leadTimeDays: 1, pricePerUnit: 5.50 },
  { id: "6", name: "Arborio Rice", category: "Pantry", currentStock: 25, unit: "kg", dailyUsage: 4, daysUntilStockout: 6, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "In 3 days", lastOrdered: "5 days ago", risk: "healthy", supplier: "Italian Grains Ltd.", leadTimeDays: 4, pricePerUnit: 4.80 },
  { id: "7", name: "Fresh Basil", category: "Produce", currentStock: 3, unit: "kg", dailyUsage: 1.5, daysUntilStockout: 2, reorderPoint: 4, suggestedOrderQty: 8, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "Herb Garden Co.", leadTimeDays: 1, pricePerUnit: 22.00 },
  { id: "8", name: "Parmesan Cheese", category: "Dairy", currentStock: 12, unit: "kg", dailyUsage: 2, daysUntilStockout: 6, reorderPoint: 5, suggestedOrderQty: 15, suggestedOrderDate: "In 3 days", lastOrdered: "4 days ago", risk: "healthy", supplier: "Cheese Masters", leadTimeDays: 3, pricePerUnit: 28.00 },
  { id: "9", name: "All-Purpose Flour", category: "Pantry", currentStock: 40, unit: "kg", dailyUsage: 5, daysUntilStockout: 8, reorderPoint: 15, suggestedOrderQty: 50, suggestedOrderDate: "In 5 days", lastOrdered: "1 week ago", risk: "healthy", supplier: "Mill Fresh", leadTimeDays: 2, pricePerUnit: 1.20 },
  { id: "10", name: "Butter", category: "Dairy", currentStock: 6, unit: "kg", dailyUsage: 2.5, daysUntilStockout: 2, reorderPoint: 8, suggestedOrderQty: 16, suggestedOrderDate: "Today", lastOrdered: "4 days ago", risk: "critical", supplier: "Dairy Direct", leadTimeDays: 1, pricePerUnit: 9.00 },
  { id: "11", name: "Shrimp", category: "Protein", currentStock: 14, unit: "kg", dailyUsage: 5, daysUntilStockout: 3, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Ocean Fresh", leadTimeDays: 1, pricePerUnit: 24.00 },
  { id: "12", name: "Yellow Onions", category: "Produce", currentStock: 30, unit: "kg", dailyUsage: 4, daysUntilStockout: 8, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "In 5 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 1.80 },
];

export const categories = ["All", "Protein", "Produce", "Dairy", "Pantry"] as const;

export const summaryStats = {
  totalItems: inventoryData.length,
  criticalItems: inventoryData.filter(i => i.risk === "critical").length,
  warningItems: inventoryData.filter(i => i.risk === "warning").length,
  healthyItems: inventoryData.filter(i => i.risk === "healthy").length,
  ordersNeededToday: inventoryData.filter(i => i.suggestedOrderDate === "Today").length,
};

// Historic monthly usage data (aggregated across all items)
const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

export const monthlyUsageByCategory: Record<string, MonthlyUsage[]> = {
  Protein: months.map((m, i) => ({ month: m, usage: [750, 810, 780, 830, 790, 760][i], cost: [12800, 13900, 13400, 14200, 13600, 13100][i] })),
  Produce: months.map((m, i) => ({ month: m, usage: [300, 320, 290, 340, 310, 300][i], cost: [840, 900, 810, 950, 870, 840][i] })),
  Dairy: months.map((m, i) => ({ month: m, usage: [220, 240, 230, 260, 250, 225][i], cost: [2860, 3120, 2990, 3380, 3250, 2925][i] })),
  Pantry: months.map((m, i) => ({ month: m, usage: [280, 300, 310, 350, 330, 290][i], cost: [1400, 1500, 1550, 1750, 1650, 1450][i] })),
};

export const totalMonthlyUsage: MonthlyUsage[] = months.map((m, i) => ({
  month: m,
  usage: [1550, 1670, 1610, 1780, 1680, 1575][i],
  cost: [17900, 19420, 18750, 20280, 19370, 18315][i],
}));
