import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const VerifyOrderPage = () => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // email from checkout

  const handleVerify = async () => {
    if (!code) return alert("Please enter the code");

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/orders/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrder(data.order);
      } else {
        alert(data.message || "Invalid code");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const receipt = `
Order Receipt
=============
Order ID: ${order._id}
Email: ${order.email}
Address: ${order.address}
Phone: ${order.phone}
Date: ${new Date(order.orderDate).toLocaleString()}

Items:
${order.items
  .map(
    (i) => `- ${i.name} (${i.size}) x ${i.quantity} = $${i.price * i.quantity}`
  )
  .join("\n")}

Total: $${order.totalPrice}
`;
    const blob = new Blob([receipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt-${order._id}.txt`;
    a.click();
  };

  if (order) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Order Confirmed 🎉</h2>
        <div className="bg-white shadow p-4 rounded-lg">
          <p>
            <strong>Order ID:</strong> {order._id}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Total:</strong> ${order.totalPrice}
          </p>
          <hr className="my-3" />
          <button
            onClick={handleDownload}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Download Receipt
          </button>
          <button
            onClick={() => navigate("/")}
            className="ml-3 border px-4 py-2 rounded-lg"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Verify Your Order</h2>
      <p className="mb-3">A code was sent to {email}. Enter it below:</p>
      <input
        type="text"
        placeholder="Enter verification code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full border rounded-lg p-2 mb-4"
      />
      <button
        onClick={handleVerify}
        disabled={loading}
        className="bg-black text-white w-full py-3 rounded-xl hover:bg-gray-800 transition"
      >
        {loading ? "Verifying..." : "Confirm Order"}
      </button>
    </div>
  );
};

export default VerifyOrderPage;
