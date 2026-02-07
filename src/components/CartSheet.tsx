import { ShoppingCart, Trash2, Plus, Minus, X, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function CartSheet() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const itemCount = getItemCount();
  const total = getTotal();

  // Group cart items by supplier
  const itemsBySupplier = items.reduce<Record<string, typeof items>>((acc, cartItem) => {
    const supplier = cartItem.item.supplier;
    if (!acc[supplier]) acc[supplier] = [];
    acc[supplier].push(cartItem);
    return acc;
  }, {});

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative gap-2">
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase Order
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-muted p-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground">
                Add items from the inventory to place an order
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-4">
                {Object.entries(itemsBySupplier).map(([supplier, supplierItems]) => {
                  const supplierTotal = supplierItems.reduce(
                    (sum, c) => sum + c.item.pricePerUnit * c.quantity,
                    0
                  );
                  return (
                    <div key={supplier} className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <h4 className="font-semibold text-sm">{supplier}</h4>
                        <span className="text-xs text-muted-foreground ml-auto">
                          ${supplierTotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {supplierItems.map(({ item, quantity }) => (
                          <div
                            key={item.id}
                            className="flex items-center gap-3 rounded-lg border bg-card p-3"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ${item.pricePerUnit.toFixed(2)} / {item.unit}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, quantity - 1)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-12 text-center text-sm font-medium">
                                {quantity} {item.unit}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => updateQuantity(item.id, quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="w-20 text-right">
                              <p className="font-medium text-sm">
                                ${(item.pricePerUnit * quantity).toFixed(2)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="border-t pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold text-lg">${total.toFixed(2)}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={clearCart}>
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
                <Button className="flex-1 gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Place Order
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
