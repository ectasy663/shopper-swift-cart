import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/services/api';
import { toast } from "sonner";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on initial load
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const addToCart = (product: Product) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.product.id === product.id);

      if (existingItem) {
        toast.success(`Added another ${product.title} to cart`);
        return currentItems.map(item => 
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast.success(`${product.title} added to cart`);
        return [...currentItems, { product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast.success(`${itemToRemove.product.title} removed from cart`);
      }
      return currentItems.filter(item => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems(currentItems =>
      currentItems.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    toast.success('Cart cleared');
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
