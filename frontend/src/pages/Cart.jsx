import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, cartTotal } =
    useContext(CartContext);

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    const prescriptionItems = cartItems.filter((i) => i.requiresPrescription);
    if (prescriptionItems.length > 0) {
      toast.info(
        "Some items require a prescription. Please upload during checkout."
      );
    }
    toast.success("Order placed successfully! 🎉");
    clearCart();
    navigate("/medicines");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-6xl">🛒</p>
        <h2 className="text-2xl font-semibold text-gray-700">
          Your cart is empty
        </h2>
        <p className="text-gray-500">
          Browse our medicines and add items to your cart.
        </p>
        <button
          onClick={() => navigate("/medicines")}
          className="mt-4 bg-fuchsia-600 text-white px-8 py-3 rounded-full hover:bg-fuchsia-700 transition-all"
        >
          Browse Medicines
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Shopping Cart
          </h1>
          <p className="text-gray-500 mt-1">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your
            cart
          </p>
        </div>
        <button
          onClick={() => {
            clearCart();
            toast.info("Cart cleared");
          }}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all"
            >
              {/* Image / Emoji */}
              <div
                onClick={() => navigate(`/medicine/${item._id}`)}
                className="w-20 h-20 bg-fuchsia-50 rounded-xl flex items-center justify-center text-4xl cursor-pointer flex-shrink-0"
              >
                {item.image}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3
                  onClick={() => navigate(`/medicine/${item._id}`)}
                  className="font-semibold text-gray-800 cursor-pointer hover:text-fuchsia-600 transition-colors truncate"
                >
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  {item.category} • {item.dosage}
                </p>
                {item.requiresPrescription && (
                  <span className="inline-block mt-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    Rx Required
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
                >
                  −
                </button>
                <span className="w-8 text-center font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors text-lg"
                >
                  +
                </button>
              </div>

              {/* Price */}
              <div className="text-right min-w-[80px]">
                <p className="font-semibold text-gray-800">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-xs text-gray-400">
                    ${item.price.toFixed(2)} each
                  </p>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => {
                  removeFromCart(item._id);
                  toast.info(`${item.name} removed`);
                }}
                className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                title="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-80">
          <div className="border border-gray-200 rounded-xl p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Order Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (8%)</span>
                <span>${(cartTotal * 0.08).toFixed(2)}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between text-gray-800 font-semibold text-base">
                <span>Total</span>
                <span>${(cartTotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-fuchsia-600 text-white py-3 rounded-full hover:bg-fuchsia-700 transition-all font-medium"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => navigate("/medicines")}
              className="w-full mt-3 border border-fuchsia-600 text-fuchsia-600 py-3 rounded-full hover:bg-fuchsia-50 transition-all font-medium"
            >
              Continue Shopping
            </button>

            {cartItems.some((i) => i.requiresPrescription) && (
              <p className="mt-4 text-xs text-amber-600 bg-amber-50 p-3 rounded-lg">
                ⚠️ Some items in your cart require a valid prescription. You may
                be asked to provide one during delivery.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
