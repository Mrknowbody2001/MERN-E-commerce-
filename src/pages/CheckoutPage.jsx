import React, { useContext, useState } from "react";
import { CartContext } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const { cartItems, setCartItems } = useContext(CartContext);
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  // Calculate total
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!email || !address || !phone) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          address,
          phone,
          items: cartItems,
          totalPrice: total,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Order placed successfully! Check your email.");
        setCartItems([]); // clear cart
       navigate("/verify-order", { state: { email } }); // redirect to verify page
      } else {
        alert(data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Try again!");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="bg-white rounded-xl shadow p-4 mb-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <span>
              {item.name} ({item.size}) x {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <hr className="my-3" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
        required
      />
      <input
        type="text"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
        required
      />
      <input
        type="text"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
        required
      />

      <button
        onClick={handleCheckout}
        className="bg-black text-white w-full py-3 rounded-xl hover:bg-gray-800 transition"
      >
        Confirm Checkout
      </button>
    </div>
  );
};

export default CheckoutPage;
