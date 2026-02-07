export type RiskLevel = "critical" | "warning" | "healthy";

export interface InventoryItem {
  id: string;
  chainId: string;
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
  // Chain CH-001 - Downtown Main
  // Proteins
  { id: "1", chainId: "CH-001", name: "Chicken Breast", category: "Protein", currentStock: 18, unit: "kg", dailyUsage: 12, daysUntilStockout: 1, reorderPoint: 30, suggestedOrderQty: 80, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "FreshMeats Co.", leadTimeDays: 2, pricePerUnit: 8.50 },
  { id: "2", chainId: "CH-001", name: "Italian Sausage", category: "Protein", currentStock: 14, unit: "kg", dailyUsage: 6, daysUntilStockout: 2, reorderPoint: 15, suggestedOrderQty: 40, suggestedOrderDate: "Today", lastOrdered: "2 days ago", risk: "critical", supplier: "FreshMeats Co.", leadTimeDays: 2, pricePerUnit: 9.80 },
  { id: "3", chainId: "CH-001", name: "Ground Beef", category: "Protein", currentStock: 25, unit: "kg", dailyUsage: 8, daysUntilStockout: 3, reorderPoint: 20, suggestedOrderQty: 50, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "FreshMeats Co.", leadTimeDays: 2, pricePerUnit: 11.00 },
  { id: "4", chainId: "CH-001", name: "Shrimp (16/20)", category: "Protein", currentStock: 10, unit: "kg", dailyUsage: 5, daysUntilStockout: 2, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "Ocean Fresh", leadTimeDays: 1, pricePerUnit: 24.00 },
  
  // Pasta & Grains
  { id: "5", chainId: "CH-001", name: "Spaghetti", category: "Pasta", currentStock: 45, unit: "kg", dailyUsage: 8, daysUntilStockout: 6, reorderPoint: 25, suggestedOrderQty: 60, suggestedOrderDate: "In 3 days", lastOrdered: "1 week ago", risk: "healthy", supplier: "Italian Grains Ltd.", leadTimeDays: 3, pricePerUnit: 2.40 },
  { id: "6", chainId: "CH-001", name: "Fettuccine", category: "Pasta", currentStock: 35, unit: "kg", dailyUsage: 7, daysUntilStockout: 5, reorderPoint: 20, suggestedOrderQty: 50, suggestedOrderDate: "In 2 days", lastOrdered: "5 days ago", risk: "healthy", supplier: "Italian Grains Ltd.", leadTimeDays: 3, pricePerUnit: 2.60 },
  { id: "7", chainId: "CH-001", name: "Rigatoni", category: "Pasta", currentStock: 28, unit: "kg", dailyUsage: 4, daysUntilStockout: 7, reorderPoint: 15, suggestedOrderQty: 40, suggestedOrderDate: "In 4 days", lastOrdered: "4 days ago", risk: "healthy", supplier: "Italian Grains Ltd.", leadTimeDays: 3, pricePerUnit: 2.50 },
  
  // Dairy & Cheese
  { id: "8", chainId: "CH-001", name: "Parmesan Cheese", category: "Dairy", currentStock: 8, unit: "kg", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "Tomorrow", lastOrdered: "4 days ago", risk: "warning", supplier: "Cheese Masters", leadTimeDays: 3, pricePerUnit: 28.00 },
  { id: "9", chainId: "CH-001", name: "Mozzarella", category: "Dairy", currentStock: 12, unit: "kg", dailyUsage: 5, daysUntilStockout: 2, reorderPoint: 15, suggestedOrderQty: 35, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "Cheese Masters", leadTimeDays: 2, pricePerUnit: 14.00 },
  { id: "10", chainId: "CH-001", name: "Heavy Cream", category: "Dairy", currentStock: 20, unit: "L", dailyUsage: 6, daysUntilStockout: 3, reorderPoint: 18, suggestedOrderQty: 40, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Dairy Direct", leadTimeDays: 1, pricePerUnit: 5.50 },
  { id: "11", chainId: "CH-001", name: "Ricotta Cheese", category: "Dairy", currentStock: 15, unit: "kg", dailyUsage: 3, daysUntilStockout: 5, reorderPoint: 10, suggestedOrderQty: 20, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Cheese Masters", leadTimeDays: 2, pricePerUnit: 12.00 },

  // Produce - CH-001
  { id: "39", chainId: "CH-001", name: "Roma Tomatoes", category: "Produce", currentStock: 12, unit: "kg", dailyUsage: 5, daysUntilStockout: 2, reorderPoint: 15, suggestedOrderQty: 35, suggestedOrderDate: "Today", lastOrdered: "2 days ago", risk: "critical", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 3.20 },
  { id: "40", chainId: "CH-001", name: "Fresh Basil", category: "Produce", currentStock: 2, unit: "kg", dailyUsage: 1.5, daysUntilStockout: 1, reorderPoint: 4, suggestedOrderQty: 8, suggestedOrderDate: "Today", lastOrdered: "4 days ago", risk: "critical", supplier: "Herb Garden Co.", leadTimeDays: 1, pricePerUnit: 22.00 },
  { id: "41", chainId: "CH-001", name: "Garlic", category: "Produce", currentStock: 6, unit: "kg", dailyUsage: 1.5, daysUntilStockout: 4, reorderPoint: 5, suggestedOrderQty: 12, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 6.00 },
  { id: "42", chainId: "CH-001", name: "Red Onions", category: "Produce", currentStock: 18, unit: "kg", dailyUsage: 3, daysUntilStockout: 6, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "In 3 days", lastOrdered: "2 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 2.20 },
  { id: "43", chainId: "CH-001", name: "Mushrooms", category: "Produce", currentStock: 7, unit: "kg", dailyUsage: 3, daysUntilStockout: 2, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 8.00 },
  { id: "44", chainId: "CH-001", name: "Bell Peppers", category: "Produce", currentStock: 10, unit: "kg", dailyUsage: 2.5, daysUntilStockout: 4, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "In 2 days", lastOrdered: "2 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 4.20 },

  // Pantry - CH-001
  { id: "45", chainId: "CH-001", name: "Olive Oil", category: "Pantry", currentStock: 8, unit: "L", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 10, suggestedOrderQty: 24, suggestedOrderDate: "Tomorrow", lastOrdered: "5 days ago", risk: "warning", supplier: "Mediterranean Imports", leadTimeDays: 3, pricePerUnit: 12.00 },
  { id: "46", chainId: "CH-001", name: "Marinara Sauce Base", category: "Pantry", currentStock: 22, unit: "L", dailyUsage: 7, daysUntilStockout: 3, reorderPoint: 25, suggestedOrderQty: 50, suggestedOrderDate: "Tomorrow", lastOrdered: "3 days ago", risk: "warning", supplier: "Italian Imports", leadTimeDays: 2, pricePerUnit: 4.50 },
  { id: "47", chainId: "CH-001", name: "Breadcrumbs (Italian)", category: "Pantry", currentStock: 14, unit: "kg", dailyUsage: 2, daysUntilStockout: 7, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "In 4 days", lastOrdered: "4 days ago", risk: "healthy", supplier: "Italian Grains Ltd.", leadTimeDays: 3, pricePerUnit: 3.20 },
  { id: "48", chainId: "CH-001", name: "Alfredo Sauce Base", category: "Pantry", currentStock: 15, unit: "L", dailyUsage: 4, daysUntilStockout: 4, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "In 2 days", lastOrdered: "2 days ago", risk: "healthy", supplier: "Italian Imports", leadTimeDays: 2, pricePerUnit: 6.80 },
  { id: "49", chainId: "CH-001", name: "Marsala Wine", category: "Pantry", currentStock: 4, unit: "L", dailyUsage: 1.5, daysUntilStockout: 3, reorderPoint: 6, suggestedOrderQty: 12, suggestedOrderDate: "Tomorrow", lastOrdered: "6 days ago", risk: "warning", supplier: "Wine Imports", leadTimeDays: 4, pricePerUnit: 15.00 },

  // Chain CH-002 - Westside Plaza
  // Produce
  { id: "12", chainId: "CH-002", name: "Roma Tomatoes", category: "Produce", currentStock: 15, unit: "kg", dailyUsage: 6, daysUntilStockout: 3, reorderPoint: 15, suggestedOrderQty: 40, suggestedOrderDate: "Tomorrow", lastOrdered: "Yesterday", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 3.20 },
  { id: "13", chainId: "CH-002", name: "Fresh Basil", category: "Produce", currentStock: 3, unit: "kg", dailyUsage: 1.5, daysUntilStockout: 2, reorderPoint: 4, suggestedOrderQty: 8, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "Herb Garden Co.", leadTimeDays: 1, pricePerUnit: 22.00 },
  { id: "14", chainId: "CH-002", name: "Spinach", category: "Produce", currentStock: 8, unit: "kg", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 6.50 },
  { id: "15", chainId: "CH-002", name: "Kale", category: "Produce", currentStock: 6, unit: "kg", dailyUsage: 2, daysUntilStockout: 3, reorderPoint: 6, suggestedOrderQty: 15, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 5.80 },
  { id: "16", chainId: "CH-002", name: "Bell Peppers", category: "Produce", currentStock: 12, unit: "kg", dailyUsage: 3, daysUntilStockout: 4, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 4.20 },
  { id: "17", chainId: "CH-002", name: "Asparagus", category: "Produce", currentStock: 5, unit: "kg", dailyUsage: 2, daysUntilStockout: 3, reorderPoint: 6, suggestedOrderQty: 15, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 8.50 },
  
  // Pantry
  { id: "18", chainId: "CH-002", name: "Olive Oil", category: "Pantry", currentStock: 5, unit: "L", dailyUsage: 2.5, daysUntilStockout: 2, reorderPoint: 10, suggestedOrderQty: 24, suggestedOrderDate: "Today", lastOrdered: "1 week ago", risk: "critical", supplier: "Mediterranean Imports", leadTimeDays: 3, pricePerUnit: 12.00 },
  { id: "19", chainId: "CH-002", name: "Marinara Sauce Base", category: "Pantry", currentStock: 30, unit: "L", dailyUsage: 8, daysUntilStockout: 4, reorderPoint: 25, suggestedOrderQty: 50, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Italian Imports", leadTimeDays: 2, pricePerUnit: 4.50 },
  { id: "20", chainId: "CH-002", name: "Breadcrumbs (Italian)", category: "Pantry", currentStock: 15, unit: "kg", dailyUsage: 2, daysUntilStockout: 8, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "In 5 days", lastOrdered: "4 days ago", risk: "healthy", supplier: "Italian Grains Ltd.", leadTimeDays: 3, pricePerUnit: 3.20 },

  // Chain CH-003 - Harbor District
  // Seafood
  { id: "21", chainId: "CH-003", name: "Salmon Fillet", category: "Protein", currentStock: 12, unit: "kg", dailyUsage: 4, daysUntilStockout: 3, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Ocean Fresh", leadTimeDays: 1, pricePerUnit: 18.00 },
  { id: "22", chainId: "CH-003", name: "Calamari", category: "Protein", currentStock: 8, unit: "kg", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Ocean Fresh", leadTimeDays: 1, pricePerUnit: 16.00 },
  { id: "23", chainId: "CH-003", name: "Scallops", category: "Protein", currentStock: 5, unit: "kg", dailyUsage: 2, daysUntilStockout: 3, reorderPoint: 6, suggestedOrderQty: 15, suggestedOrderDate: "Tomorrow", lastOrdered: "3 days ago", risk: "warning", supplier: "Ocean Fresh", leadTimeDays: 1, pricePerUnit: 32.00 },
  
  // Specialty Items
  { id: "24", chainId: "CH-003", name: "Cheese Ravioli", category: "Pasta", currentStock: 20, unit: "kg", dailyUsage: 4, daysUntilStockout: 5, reorderPoint: 15, suggestedOrderQty: 30, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Fresh Pasta Co.", leadTimeDays: 2, pricePerUnit: 8.50 },
  { id: "25", chainId: "CH-003", name: "Lasagna Sheets", category: "Pasta", currentStock: 18, unit: "kg", dailyUsage: 5, daysUntilStockout: 4, reorderPoint: 15, suggestedOrderQty: 35, suggestedOrderDate: "In 2 days", lastOrdered: "4 days ago", risk: "healthy", supplier: "Fresh Pasta Co.", leadTimeDays: 2, pricePerUnit: 6.00 },
  { id: "26", chainId: "CH-003", name: "Tortelloni", category: "Pasta", currentStock: 12, unit: "kg", dailyUsage: 3, daysUntilStockout: 4, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Fresh Pasta Co.", leadTimeDays: 2, pricePerUnit: 10.00 },
  { id: "27", chainId: "CH-003", name: "Gnocchi", category: "Pasta", currentStock: 10, unit: "kg", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "Tomorrow", lastOrdered: "4 days ago", risk: "warning", supplier: "Fresh Pasta Co.", leadTimeDays: 2, pricePerUnit: 7.50 },

  // Produce - CH-003
  { id: "50", chainId: "CH-003", name: "Roma Tomatoes", category: "Produce", currentStock: 10, unit: "kg", dailyUsage: 4, daysUntilStockout: 3, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 3.20 },
  { id: "51", chainId: "CH-003", name: "Fresh Basil", category: "Produce", currentStock: 1.5, unit: "kg", dailyUsage: 1, daysUntilStockout: 2, reorderPoint: 3, suggestedOrderQty: 6, suggestedOrderDate: "Today", lastOrdered: "4 days ago", risk: "critical", supplier: "Herb Garden Co.", leadTimeDays: 1, pricePerUnit: 22.00 },
  { id: "52", chainId: "CH-003", name: "Spinach", category: "Produce", currentStock: 6, unit: "kg", dailyUsage: 2.5, daysUntilStockout: 2, reorderPoint: 8, suggestedOrderQty: 18, suggestedOrderDate: "Today", lastOrdered: "3 days ago", risk: "critical", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 6.50 },
  { id: "53", chainId: "CH-003", name: "Garlic", category: "Produce", currentStock: 5, unit: "kg", dailyUsage: 1, daysUntilStockout: 5, reorderPoint: 4, suggestedOrderQty: 10, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 6.00 },
  { id: "54", chainId: "CH-003", name: "Asparagus", category: "Produce", currentStock: 4, unit: "kg", dailyUsage: 1.5, daysUntilStockout: 3, reorderPoint: 5, suggestedOrderQty: 12, suggestedOrderDate: "Tomorrow", lastOrdered: "3 days ago", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 8.50 },

  // Pantry - CH-003
  { id: "55", chainId: "CH-003", name: "Olive Oil", category: "Pantry", currentStock: 6, unit: "L", dailyUsage: 2, daysUntilStockout: 3, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "Tomorrow", lastOrdered: "5 days ago", risk: "warning", supplier: "Mediterranean Imports", leadTimeDays: 3, pricePerUnit: 12.00 },
  { id: "56", chainId: "CH-003", name: "Marinara Sauce Base", category: "Pantry", currentStock: 25, unit: "L", dailyUsage: 6, daysUntilStockout: 4, reorderPoint: 20, suggestedOrderQty: 40, suggestedOrderDate: "In 2 days", lastOrdered: "2 days ago", risk: "healthy", supplier: "Italian Imports", leadTimeDays: 2, pricePerUnit: 4.50 },
  { id: "57", chainId: "CH-003", name: "Breadcrumbs (Italian)", category: "Pantry", currentStock: 12, unit: "kg", dailyUsage: 1.5, daysUntilStockout: 8, reorderPoint: 6, suggestedOrderQty: 15, suggestedOrderDate: "In 5 days", lastOrdered: "5 days ago", risk: "healthy", supplier: "Italian Grains Ltd.", leadTimeDays: 3, pricePerUnit: 3.20 },
  { id: "58", chainId: "CH-003", name: "Marsala Wine", category: "Pantry", currentStock: 3, unit: "L", dailyUsage: 1, daysUntilStockout: 3, reorderPoint: 5, suggestedOrderQty: 10, suggestedOrderDate: "Tomorrow", lastOrdered: "1 week ago", risk: "warning", supplier: "Wine Imports", leadTimeDays: 4, pricePerUnit: 15.00 },

  // Chain CH-004 - Northgate Mall
  // Proteins
  { id: "28", chainId: "CH-004", name: "Sirloin Steak", category: "Protein", currentStock: 15, unit: "kg", dailyUsage: 5, daysUntilStockout: 3, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "FreshMeats Co.", leadTimeDays: 2, pricePerUnit: 22.00 },
  { id: "29", chainId: "CH-004", name: "Bacon", category: "Protein", currentStock: 8, unit: "kg", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 8, suggestedOrderQty: 20, suggestedOrderDate: "Tomorrow", lastOrdered: "3 days ago", risk: "warning", supplier: "FreshMeats Co.", leadTimeDays: 2, pricePerUnit: 14.00 },
  { id: "30", chainId: "CH-004", name: "Meatballs (Prepared)", category: "Protein", currentStock: 12, unit: "kg", dailyUsage: 4, daysUntilStockout: 3, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "FreshMeats Co.", leadTimeDays: 2, pricePerUnit: 12.00 },
  
  // Dairy & Sauces
  { id: "31", chainId: "CH-004", name: "Butter", category: "Dairy", currentStock: 6, unit: "kg", dailyUsage: 2.5, daysUntilStockout: 2, reorderPoint: 8, suggestedOrderQty: 16, suggestedOrderDate: "Today", lastOrdered: "4 days ago", risk: "critical", supplier: "Dairy Direct", leadTimeDays: 1, pricePerUnit: 9.00 },
  { id: "32", chainId: "CH-004", name: "Alfredo Sauce Base", category: "Pantry", currentStock: 18, unit: "L", dailyUsage: 5, daysUntilStockout: 4, reorderPoint: 15, suggestedOrderQty: 35, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Italian Imports", leadTimeDays: 2, pricePerUnit: 6.80 },
  { id: "33", chainId: "CH-004", name: "Marsala Wine", category: "Pantry", currentStock: 8, unit: "L", dailyUsage: 1.5, daysUntilStockout: 5, reorderPoint: 6, suggestedOrderQty: 12, suggestedOrderDate: "In 3 days", lastOrdered: "5 days ago", risk: "healthy", supplier: "Wine Imports", leadTimeDays: 4, pricePerUnit: 15.00 },
  
  // Produce
  { id: "34", chainId: "CH-004", name: "Mushrooms", category: "Produce", currentStock: 10, unit: "kg", dailyUsage: 3, daysUntilStockout: 3, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 8.00 },
  { id: "35", chainId: "CH-004", name: "Red Onions", category: "Produce", currentStock: 20, unit: "kg", dailyUsage: 3, daysUntilStockout: 7, reorderPoint: 10, suggestedOrderQty: 25, suggestedOrderDate: "In 4 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 2.20 },
  { id: "36", chainId: "CH-004", name: "Broccoli", category: "Produce", currentStock: 12, unit: "kg", dailyUsage: 4, daysUntilStockout: 3, reorderPoint: 12, suggestedOrderQty: 30, suggestedOrderDate: "Tomorrow", lastOrdered: "2 days ago", risk: "warning", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 4.50 },
  { id: "37", chainId: "CH-004", name: "Garlic", category: "Produce", currentStock: 8, unit: "kg", dailyUsage: 1.5, daysUntilStockout: 5, reorderPoint: 5, suggestedOrderQty: 12, suggestedOrderDate: "In 3 days", lastOrdered: "4 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 6.00 },
  { id: "38", chainId: "CH-004", name: "Eggplant", category: "Produce", currentStock: 7, unit: "kg", dailyUsage: 2, daysUntilStockout: 4, reorderPoint: 6, suggestedOrderQty: 15, suggestedOrderDate: "In 2 days", lastOrdered: "3 days ago", risk: "healthy", supplier: "Valley Farms", leadTimeDays: 1, pricePerUnit: 3.80 },
];

export const categories = ["All", "Protein", "Produce", "Dairy", "Pantry", "Pasta"] as const;

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
  Protein: months.map((m, i) => ({ month: m, usage: [850, 920, 880, 940, 900, 870][i], cost: [14500, 15800, 15100, 16200, 15500, 14900][i] })),
  Produce: months.map((m, i) => ({ month: m, usage: [320, 350, 310, 380, 340, 330][i], cost: [1600, 1750, 1550, 1900, 1700, 1650][i] })),
  Dairy: months.map((m, i) => ({ month: m, usage: [280, 310, 290, 340, 320, 300][i], cost: [3920, 4340, 4060, 4760, 4480, 4200][i] })),
  Pantry: months.map((m, i) => ({ month: m, usage: [220, 250, 260, 300, 280, 240][i], cost: [1320, 1500, 1560, 1800, 1680, 1440][i] })),
  Pasta: months.map((m, i) => ({ month: m, usage: [380, 420, 400, 460, 430, 390][i], cost: [1520, 1680, 1600, 1840, 1720, 1560][i] })),
};

export const totalMonthlyUsage: MonthlyUsage[] = months.map((m, i) => ({
  month: m,
  usage: [2050, 2250, 2140, 2420, 2270, 2130][i],
  cost: [22860, 25070, 23870, 26500, 25080, 23750][i],
}));
