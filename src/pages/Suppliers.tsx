import { useState, useMemo } from "react";
import { Building2, Mail, Phone, MapPin, Package, ChevronDown, ChevronUp } from "lucide-react";
import { suppliers } from "@/lib/supplier-data";
import { inventoryData } from "@/lib/inventory-data";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/AppHeader";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Suppliers = () => {
  const [expandedSupplier, setExpandedSupplier] = useState<string | null>(null);

  // Group inventory items by supplier
  const supplierProducts = useMemo(() => {
    const grouped: Record<string, { name: string; category: string; unit: string }[]> = {};
    
    inventoryData.forEach(item => {
      if (!grouped[item.supplier]) {
        grouped[item.supplier] = [];
      }
      // Avoid duplicates (same product across chains)
      const exists = grouped[item.supplier].some(p => p.name === item.name);
      if (!exists) {
        grouped[item.supplier].push({
          name: item.name,
          category: item.category,
          unit: item.unit,
        });
      }
    });
    
    return grouped;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Supplier Directory</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Contact information and products for all suppliers
          </p>
        </div>

        <div className="space-y-3">
          {suppliers.map(supplier => {
            const products = supplierProducts[supplier.name] || [];
            const isExpanded = expandedSupplier === supplier.id;
            
            return (
              <Collapsible
                key={supplier.id}
                open={isExpanded}
                onOpenChange={() => setExpandedSupplier(isExpanded ? null : supplier.id)}
              >
                <div className="rounded-lg border bg-card overflow-hidden">
                  <CollapsibleTrigger className="w-full">
                    <div className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold">{supplier.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {supplier.contactName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="hidden sm:flex gap-1.5">
                          {supplier.categories.map(cat => (
                            <Badge key={cat} variant="secondary" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {products.length} items
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="border-t px-4 py-4 space-y-4">
                      {/* Contact Info */}
                      <div className="grid gap-3 sm:grid-cols-3">
                        <a
                          href={`mailto:${supplier.email}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          {supplier.email}
                        </a>
                        <a
                          href={`tel:${supplier.phone}`}
                          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {supplier.phone}
                        </a>
                        <div className="flex items-start gap-2 text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                          <span>{supplier.address}</span>
                        </div>
                      </div>
                      
                      {/* Products */}
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 mb-3">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Products Ordered</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {products.map((product, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className={cn(
                                "text-xs",
                                product.category === "Protein" && "border-red-200 bg-red-50 text-red-700",
                                product.category === "Pasta" && "border-amber-200 bg-amber-50 text-amber-700",
                                product.category === "Dairy" && "border-blue-200 bg-blue-50 text-blue-700",
                                product.category === "Produce" && "border-green-200 bg-green-50 text-green-700",
                                product.category === "Pantry" && "border-purple-200 bg-purple-50 text-purple-700"
                              )}
                            >
                              {product.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Suppliers;
