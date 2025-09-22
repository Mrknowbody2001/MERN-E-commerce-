import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );
      setProduct(data);
    } catch (err) {
      console.error("Error fetching product", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setMessage("Please select a size");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/cart/create",
        {
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          size: selectedSize,
          quantity: 1,
        }
      );

      setMessage("Added to cart!");
    } catch (err) {
      console.error(err);
      setMessage("Failed to add to cart");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!product) return <p className="p-6">Product not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Product Image */}
      <div>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-[500px] object-cover rounded-lg shadow"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-2xl font-semibold text-black">Rs. {product.price}</p>

        {/* Selectable Sizes */}
        <div>
          <h3 className="font-semibold mb-2">Choose Size</h3>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(s.size)}
                className={`px-3 py-1 border rounded text-sm ${
                  selectedSize === s.size
                    ? "bg-black text-white"
                    : "bg-gray-100 text-black"
                }`}
              >
                {s.size} ({s.quantity})
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <button
          className="bg-black text-white px-4 py-2 rounded mt-4"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

        {message && <p className="text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default ProductDetails;
