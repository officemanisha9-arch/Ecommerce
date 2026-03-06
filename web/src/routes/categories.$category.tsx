import { createFileRoute, Link } from "@tanstack/react-router";
import { categories } from "../data/categories";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";

export const Route = createFileRoute("/categories/$category")({
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const [sort, setSort] = useState("popular");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const categoryData = categories.find(
    (cat) => cat.slug === category
  );

  // Simulated loading (replace with real API later)
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, [category]);

  if (!categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-xl font-semibold">
        Category not found
      </div>
    );
  }

  const products = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `${categoryData.name} Product ${i + 1}`,
        price: (i + 1) * 599,
        oldPrice: (i + 1) * 799,
        rating: 4 + (i % 2) * 0.5,
      })),
    [categoryData.name]
  );

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (search.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sort === "low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  }, [products, search, sort]);

  return (
    <div className="relative min-h-screen bg-gray-50 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-150px] left-[-100px] w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-96 h-96 bg-pink-400 rounded-full blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <>
            {/* Breadcrumb Skeleton */}
            <div className="h-4 w-40 bg-gray-200 rounded mb-8 animate-pulse"></div>

            {/* Hero Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10 animate-pulse">
              <div className="w-56 h-56 bg-gray-200 rounded-xl"></div>

              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="flex gap-4 mt-4">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>

            {/* Search + Filter Skeleton */}
            <div className="mt-12 flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="h-12 w-full md:w-96 bg-gray-200 rounded-xl"></div>
              <div className="h-12 w-40 bg-gray-200 rounded-xl"></div>
            </div>

            {/* Products Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-md p-5 animate-pulse"
                >
                  <div className="h-36 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/3 mt-3"></div>
                </div>
              ))}
            </div>

            {/* Back Button Skeleton */}
            <div className="mt-16 flex justify-center">
              <div className="h-12 w-48 bg-gray-200 rounded-xl"></div>
            </div>
          </>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="mb-6 text-sm text-gray-500">
              <Link to="/" className="hover:text-indigo-600 transition">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-800 font-medium">
                {categoryData.name}
              </span>
            </div>

            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-10 flex flex-col md:flex-row items-center gap-10"
            >
              <img
                src={categoryData.image}
                alt={categoryData.name}
                className="w-56 h-56 object-contain drop-shadow-xl"
              />

              <div>
                <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
                  {categoryData.name}
                </h1>

                <p className="text-gray-600 text-lg mb-6">
                  {categoryData.description}
                </p>

                <div className="flex gap-6 text-sm text-gray-500">
                  <span>🔥 {filteredProducts.length} Products</span>
                  <span>⭐ 4.5 Avg Rating</span>
                  <span>🚚 Free Shipping</span>
                </div>
              </div>
            </motion.div>

            {/* Search + Filter */}
            <div className="mt-12 flex flex-col md:flex-row gap-4 justify-between items-center">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-96 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none"
              >
                <option value="popular">Sort by Popular</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mt-10">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 p-5 relative group"
                >
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {Math.round(
                      ((product.oldPrice - product.price) /
                        product.oldPrice) *
                        100
                    )}
                    % OFF
                  </span>

                  <div className="h-36 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4"></div>

                  <p className="font-semibold group-hover:text-indigo-600 transition">
                    {product.name}
                  </p>

                  <div className="text-yellow-400 text-sm mt-1">
                    {"★".repeat(Math.floor(product.rating))}
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-indigo-600 font-bold text-lg">
                      ₹{product.price}
                    </span>
                    <span className="text-gray-400 line-through text-sm">
                      ₹{product.oldPrice}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Back Button */}
            <div className="mt-16 text-center">
              <Link
                to="/"
                className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow"
              >
                ← Back to Categories
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}