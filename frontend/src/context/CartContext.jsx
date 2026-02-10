import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

const CartContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (medicine, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === medicine._id);
      if (existing) {
        toast.success(`Updated ${medicine.name} quantity`);
        return prev.map((item) =>
          item._id === medicine._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      toast.success(`${medicine.name} added to cart`);
      return [...prev, { ...medicine, quantity }];
    });
  };

  const removeFromCart = (medicineId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== medicineId));
  };

  const updateQuantity = (medicineId, quantity) => {
    if (quantity < 1) {
      removeFromCart(medicineId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === medicineId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};

export default CartContextProvider;
