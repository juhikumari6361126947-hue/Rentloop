import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("rentalCart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to load cart:", err);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("rentalCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item, days = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((cartItem) => cartItem._id === item._id);
      if (existing) {
        return prev.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, days: days > 0 ? days : 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, days: days > 0 ? days : 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
  };

  const updateDays = (itemId, days) => {
    if (days < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, days } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.days,
    0
  );

  const totalItems = cartItems.length;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateDays,
        clearCart,
        totalPrice,
        totalItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
