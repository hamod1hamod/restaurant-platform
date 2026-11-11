import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, ProductSize, CartItem, CartExtraItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, size?: ProductSize, extras?: CartExtraItem[], quantity?: number, instructions?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItemsCount: number;
  subtotal: number;
  deliveryFee: number;
  setDeliveryFee: (fee: number) => void;
  discountAmount: number;
  appliedCoupon: string | null;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('restaurant_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deliveryFee, setDeliveryFee] = useState<number>(3.50);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem('restaurant_cart', JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [items]);

  const addToCart = (
    product: Product,
    size?: ProductSize,
    extras: CartExtraItem[] = [],
    quantity: number = 1,
    instructions: string = ''
  ) => {
    const basePrice = size ? size.price : (product.discount_price ?? product.base_price);
    const extrasPrice = extras.reduce((sum, extra) => sum + (extra.extra_price * extra.quantity), 0);
    const unitPrice = basePrice + extrasPrice;
    const totalPrice = unitPrice * quantity;

    // Unique cart item identifier based on product ID, size, extras, and instructions
    const extrasKey = extras.map(e => `${e.extra_name}x${e.quantity}`).sort().join('-');
    const cartItemId = `${product.id}-${size?.name || 'def'}-${extrasKey}-${instructions || ''}`;

    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.id === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          totalPrice: updated[existingIndex].unitPrice * newQty
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          product,
          selectedSize: size,
          selectedExtras: extras,
          quantity,
          unitPrice,
          totalPrice,
          specialInstructions: instructions
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity,
            totalPrice: item.unitPrice * quantity
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const applyCoupon = (code: string, discount: number) => {
    setAppliedCoupon(code);
    setDiscountAmount(discount);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItemsCount,
        subtotal,
        deliveryFee,
        setDeliveryFee,
        discountAmount,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        total,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
