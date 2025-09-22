import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1); // ✅ Add totalPages state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ✅ Fetch products with support for reset
  const fetchProducts = async (reset = false) => {
    try {
      setLoading(true);
      const params = { page, limit };
      if (search) params.search = search;
      if (category) params.category = category;
      if (size) params.size = size;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const { data } = await axios.get("http://localhost:5000/api/products", {
        params,
      });

      setProducts((prev) =>
        reset ? data.products : [...prev, ...data.products]
      );
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Refetch when filters change (reset to page 1)
  useEffect(() => {
    setPage(1);
    fetchProducts(true); // reset = true
  }, [search, category, size, minPrice, maxPrice, limit]);

  // ✅ Fetch more when page changes (but don't reset)
  useEffect(() => {
    if (page > 1) fetchProducts();
  }, [page]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r h-screen sticky top-0 bg-white">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        {/* Price Filter */}
        <h3 className="font-semibold mb-2">Filter by Price</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 p-1 border rounded"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 p-1 border rounded"
          />
        </div>

        {/* Size Filter */}
        <h3 className="font-semibold mt-4 mb-2">Filter by Size</h3>
        {["S", "M", "L", "XL", "28", "30", "32", "34"].map((s) => (
          <label key={s} className="block">
            <input
              type="radio"
              name="size"
              value={s}
              checked={size === s}
              onChange={(e) => setSize(e.target.value)}
              className="mr-2"
            />
            {s}
          </label>
        ))}

        {/* Category Filter */}
        <h3 className="font-semibold mt-4 mb-2">Product Category</h3>
        {["Men", "Women", "unisex", "Kids"].map((cat) => (
          <label key={cat} className="block">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={category === cat}
              onChange={(e) => setCategory(e.target.value)}
              className="mr-2"
            />
            {cat}
          </label>
        ))}

        <button
          className="mt-4 w-full bg-black text-white py-2 rounded"
          onClick={() => {
            setSearch("");
            setCategory("");
            setSize("");
            setMinPrice("");
            setMaxPrice("");
          }}
        >
          Clear Filters
        </button>
      </aside>

      {/* Product Grid */}
      <main className="flex-1 p-6">
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p>No products found</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-72 object-cover rounded-lg shadow"
                  />
                  <h3 className="mt-2 font-medium">{product.name}</h3>
                  <p className="text-gray-600">Rs.{product.price}</p>
                </div>
              ))}
            </div>

            {/* ✅ See More Button */}
            {page < totalPages && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                  See More
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Shop;
