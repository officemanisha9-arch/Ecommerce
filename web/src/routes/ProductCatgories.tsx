import { createFileRoute } from "@tanstack/react-router";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/ProductCatgories")({
  component: CategoriesPage,
});

/* ------------------ DATA ------------------ */
const categories = [
  "All",
  "Grocery",
  "Fashion",
  "Appliances",
  "Mobiles",
  "Electronics",
  "Smart Gadgets",
  "Home",
  "Beauty",
];

const products = [
  { name: "Pixel 10a", category: "Mobiles", image: "/pixel.webp", price: 1400 },
  { name: "Classic Hoodie", category: "Fashion", image: "/ClassicHoodie.webp", price: 1100 },
  { name: "Galaxy S24", category: "Mobiles", image: "/glaxy.webp", price: 2200 },
  { name: "Smart Ring X", category: "Smart Gadgets", image: "/SmartRingX.webp", price: 850 },
  { name: "iPhone 15 Lite", category: "Mobiles", image: "/iphone.webp", price: 2800 },
  { name: "NovaWatch", category: "Smart Gadgets", image: "/novawatch.png", price: 700 },
  { name: "Gaming Headset", category: "Electronics", image: "/GamingHeadset.png", price: 950 },
  { name: "FitBand Pro", category: "Smart Gadgets", image: "/FitBand.png", price: 600 },
  { name: "NovaPods", category: "Electronics", image: "/NovaPods.png", price: 500 },
  { name: "Smart TV", category: "Electronics", image: "/SmartTV.webp", price: 2000 },
  { name: "Bluetooth Speaker", category: "Electronics", image: "/BluetoothSpeaker.png", price: 750 },
  { name: "Organic Rice", category: "Grocery", image: "/OrganicRice.webp", price: 350 },
  { name: "Premium Olive Oil", category: "Grocery", image: "/PremiumOliveOil.png", price: 420 },
  { name: "Almond Pack", category: "Grocery", image: "/AlmondPack.webp", price: 550 },
  { name: "Green Tea Box", category: "Grocery", image: "/GreenTeaBox.png", price: 300 },
  { name: "Running Shoes", category: "Fashion", image: "/RunningShoes.webp", price: 900 },
  { name: "Denim Jacket", category: "Fashion", image: "/DenimJacket.png", price: 1500 },
  { name: "Leather Belt", category: "Fashion", image: "/LeatherBelt.png", price: 450 },
  { name: "Air Fryer", category: "Appliances", image: "/AirFryer.png", price: 1800 },
  { name: "Mixer Grinder", category: "Appliances", image: "/MixerGrinder.png", price: 1300 },
  { name: "Makeup Kit", category: "Beauty", image: "/MakeupKit.webp", price: 1700 },
  { name: "Sofa Set", category: "Home", image: "/SofaSet.png", price: 3200 },
  { name: "Study Lamp", category: "Home", image: "/StudyLamp.webp", price: 600 },
  { name: "Wall Clock", category: "Home", image: "/WallClock.webp", price: 400 },
  { name: "Microwave Oven", category: "Appliances", image: "/MicrowaveOven.png", price: 2500 },
  { name: "Face Serum", category: "Beauty", image: "/FaceSerum.png", price: 650 },
  { name: "Hair Dryer", category: "Beauty", image: "/HairDryer.png", price: 1200 },
];

/* ------------------ COMPONENT ------------------ */
function CategoriesPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [maxPrice, setMaxPrice] = useState(4000);
  const [cart, setCart] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<{ name: string; image: string; category?: string; price?: number }[]>([]);

  /* Fake loading */
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [active]);

  /* Filtering Logic */
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(
      (p) =>
        (active === "All" || p.category === active) &&
        p.price <= maxPrice &&
        p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (sort === "high") filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }, [active, search, sort, maxPrice]);

  /* ------------------ CART ------------------ */
  const addToCart = async (item: any) => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first 🔐");
      setTimeout(() => navigate({ to: "/login" }), 1000);
      return;
    }
    const user = JSON.parse(storedUser);
    const payload = { userId: Number(user.id), productName: item.name, productImage: item.image, price: Number(item.price) };
    try {
      const response = await fetch("http://localhost:5000/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Server error");
      toast.success("Product added to cart 🛒");
      setTimeout(() => navigate({ to: "/cart" }), 800);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  /* ------------------ WISHLIST ------------------ */
const toggleWishlist = async (item: any) => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    toast.error("Login to manage wishlist 🔐");
    setTimeout(() => navigate({ to: "/login" }), 1000);
    return;
  }

  const user = JSON.parse(storedUser);
  const exists = wishlist.some((i) => i.name === item.name);

  try {
    const response = await fetch("http://localhost:5000/api/wishlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        productName: item.name,
        productImage: item.image,
        price: item.price,
        action: exists ? "remove" : "add",
      }),
    });

    if (!response.ok) throw new Error("Wishlist API failed");

    setWishlist((prev) =>
      exists ? prev.filter((i) => i.name !== item.name) : [...prev, item]
    );

    toast.success(exists ? "Removed from wishlist ❤️" : "Added to wishlist ❤️");
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Something went wrong");
  }
};

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-pink-50">

        {/* HEADER */}
        <div className="relative top-0 z-10 bg-black text-white px-6 py-4 shadow-lg flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-wide">NovaMart</h1>
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-full text-white focus:outline-none"
            />
          </div>
        </div>

        {/* CATEGORY BAR */}
        <div className="flex gap-3 overflow-x-auto px-4 py-4 bg-white shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
                ${active === cat
                  ? "bg-linear-to-r from-yellow-500 to-yellow-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SORT + FILTER */}
        <div className=" mx-auto px-4 py-4 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <label className="text-sm font-medium">
              Max Price: ₹{maxPrice}
            </label>
            <input
              type="range"
              min="200"
              max="3000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full md:w-60"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-gray-100 px-4 py-2 rounded-xl">
            <option value="default">Sort By</option>
            <option value="low">Price: Low → High</option>
            <option value="high">Price: High → Low</option>
          </select>
        </div>

        {/* PRODUCTS */}
        <div className="mx-auto px-4 pb-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 27 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-white p-4 rounded-2xl shadow">
                <div className="h-28 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))
            : filteredProducts.length === 0
              ? (<div className="col-span-full text-center py-16 text-gray-500">No products found.</div>)
              : filteredProducts.map((item) => (
                <motion.div
                  key={item.name}
                  whileHover={{ y: -6 }}
                  className="cursor-pointer relative bg-white rounded-2xl p-4 shadow hover:shadow-xl transition"
                >
                  {/* WISHLIST */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleWishlist(item); }}
                    className="absolute top-4 right-4"
                  >
                    <Heart
  size={18}
  className={wishlist.some((i) => i.name === item.name)
    ? "fill-red-500 text-red-500"
    : "text-gray-400"}
/>
                  </button>

                  <img src={item.image} alt={item.name} className="h-28 w-full object-contain mb-4" />
                  <p className="text-sm font-semibold text-center">{item.name}</p>
                  <p className="text-center text-gray-600 mb-3">₹{item.price}</p>

                  <button
                    onClick={(e) => { e.stopPropagation(); addToCart(item); }}
                    className="w-full bg-black text-white py-2 rounded-lg text-sm hover:opacity-90 transition flex justify-center align-center"
                  >
                    <ShoppingCart />
                    Add to Cart
                  </button>
                </motion.div>
              ))
          }
        </div>
      </div>
    </>
  );
}