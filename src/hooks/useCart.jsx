import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("nicos_cart") || "[]");
    setItems(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("nicos_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (x) => x.uid === item.uid &&
        JSON.stringify(x.options) === JSON.stringify(item.options)
      );

      if (existing) {
        return prev.map((x) =>
          x === existing ? { ...x, qty: x.qty + (item.qty || 1) } : x
        );
      }

      return [...prev, { ...item, qty: item.qty || 1 }];
    });
  };

  const updateQty = (uid, qty) => {
    setItems((prev) =>
      prev.map((x) => (x.uid === uid ? { ...x, qty } : x))
    );
  };

  const removeItem = (uid) =>
    setItems((prev) => prev.filter((x) => x.uid !== uid));

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
