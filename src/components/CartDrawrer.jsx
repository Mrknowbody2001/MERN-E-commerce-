import React, { useContext } from "react";

import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleRemove = async (productId, size) => {
    try {
      await fetch(`http://localhost:5000/api/cart/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, size }),
      });
      setCartItems(
        cartItems.filter(
          (item) => !(item.productId === productId && item.size === size)
        )
      );
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
        <button onClick={onClose}>
          <FiX size={22} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-center mt-6">
            No products in the cart
          </p>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex items-center justify-between mb-4"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              {/* Info */}
              <div className="flex-1 ml-3">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">Size: {item.size}</p>
                <p className="text-sm font-semibold">Rs. {item.price}</p>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    className="px-2 border rounded"
                    onClick={() =>
                      setCartItems((prev) =>
                        prev.map((i) =>
                          i.productId === item.productId &&
                          i.size === item.size &&
                          i.quantity > 1
                            ? { ...i, quantity: i.quantity - 1 }
                            : i
                        )
                      )
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 border rounded"
                    onClick={() =>
                      setCartItems((prev) =>
                        prev.map((i) =>
                          i.productId === item.productId && i.size === item.size
                            ? { ...i, quantity: i.quantity + 1 }
                            : i
                        )
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <button
                className="text-red-500 ml-2"
                onClick={() => handleRemove(item.productId, item.size)}
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between text-lg font-semibold mb-3">
            <span>Subtotal</span>
            <span>Rs. {subtotal}</span>
          </div>
          <button
            className="w-full bg-gray-200 text-black py-2 rounded mb-2"
            onClick={onClose}
          >
            Continue Shopping
          </button>
          <button
            className="w-full bg-black text-white py-2 rounded"
            onClick={() => {
              onClose();
              navigate("/checkoutPage");
            }}
          >
            Go to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;
