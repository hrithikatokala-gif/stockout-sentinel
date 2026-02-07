import { createContext, useContext, useState, ReactNode } from "react";
import { InventoryItem } from "@/lib/inventory-data";

export interface CartItem {
  item: InventoryItem;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: InventoryItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isInCart: (itemId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: InventoryItem, quantity?: number) => {
    setItems(prev => {
      const existing = prev.find(c => c.item.id === item.id);
      if (existing) {
        return prev.map(c =>
          c.item.id === item.id
            ? { ...c, quantity: c.quantity + (quantity ?? item.suggestedOrderQty) }
            : c
        );
      }
      return [...prev, { item, quantity: quantity ?? item.suggestedOrderQty }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(c => c.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems(prev =>
      prev.map(c => (c.item.id === itemId ? { ...c, quantity } : c))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotal = () => {
    return items.reduce((sum, c) => sum + c.item.pricePerUnit * c.quantity, 0);
  };

  const getItemCount = () => {
    return items.length;
  };

  const isInCart = (itemId: string) => {
    return items.some(c => c.item.id === itemId);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
