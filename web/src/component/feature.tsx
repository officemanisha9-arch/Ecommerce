import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart } from "lucide-react";
// src/components/FeaturedCollections.tsx
export const collections = [
  {
    id: 1,
    title: "Luxury Watches",
    subtitle: "Precision and style in every tick.",
    description:
      "Our luxury watches are crafted with precision, elegance, and timeless design. Perfect for any occasion.",
    price: "$1,200",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    rating: 4.8,
    category: "Accessories",
    stock: 5,
    features: [
      "Swiss movement for unparalleled accuracy",
      "Sapphire crystal glass for scratch resistance",
      "Water-resistant up to 100 meters",
      "Elegant design with a variety of styles",
    ],
  },
  {
    id: 2,
    title: "Designer Bags",
    subtitle: "Carry elegance everywhere.",
    description:
      "Designer bags made with premium leather and exquisite craftsmanship. Carry your essentials in style.",
    price: "$850",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f",
    rating: 4.5,
    category: "Fashion",
    stock: 0,
    features: [
      "Crafted from premium leather",
      "Spacious interior with multiple compartments",
      "Signature designer hardware",
      "Available in various colors and styles",
    ],
  },
  {
    id: 3,
    title: "Home Decor",
    subtitle: "Make your space iconic.",
    description:
      "Iconic home decor pieces that elevate your living space with style and elegance.",
    price: "$450",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    rating: 4.7,
    category: "Home",
    stock: 3,
    features: [
      "Unique designs to suit any aesthetic",
      "Made from high-quality materials",
      "Perfect for gifting or personal use",
      "Adds a touch of elegance to any room",
    ],
  },
  {
    id: 4,
    title: "Premium Sunglasses",
    subtitle: "Shade your world in style.",
    description:
      "High-end sunglasses offering UV protection and a sophisticated look. Perfect for sunny days and luxury outings.",
    price: "$320",
    image: "/sunglass.jpg",
    rating: 4.6,
    category: "Accessories",
    stock: 12,
    features: [
      "UV400 protection for your eyes",
      "Polarized lenses to reduce glare",
      "Lightweight and durable frames",
      "Available in multiple colors and shapes",
    ],
  },
  {
    id: 5,
    title: "Luxury Perfume",
    subtitle: "A scent that defines you.",
    description:
      "Experience the essence of sophistication with our exclusive collection of luxury perfumes.",
    price: "$150",
    image: "/perfume.webp",
    rating: 4.9,
    category: "Beauty",
    stock: 20,
    features: [
      "Long-lasting fragrance",
      "Crafted with premium ingredients",
      "Elegant bottle design",
      "Available in multiple signature scents",
    ],
  },
  {
    id: 6,
    title: "Designer Shoes",
    subtitle: "Step into luxury.",
    description:
      "Exquisite designer shoes crafted for comfort, style, and durability. Make every step memorable.",
    price: "$780",
    image: "/shoes.webp",
    rating: 4.7,
    category: "Fashion",
    stock: 8,
    features: [
      "Premium leather construction",
      "Cushioned insoles for comfort",
      "Classic and modern designs",
      "Available in multiple sizes and colors",
    ],
  },
  {
    id: 7,
    title: "Smart Home Gadgets",
    subtitle: "Modernize your living.",
    description:
      "Advanced smart home devices that bring convenience, security, and style to your home.",
    price: "$599",
    image: "/gadgets.jpg",
    rating: 4.5,
    category: "Home",
    stock: 15,
    features: [
      "Voice control compatible with Alexa and Google Assistant",
      "Energy-efficient devices",
      "Sleek, modern design",
      "Easy installation and setup",
    ],
  },
];

export default function FeaturedCollections() {
 
  const [cart, setCart] = useState<typeof collections>([]);
  const [wishlist, setWishlist] = useState<typeof collections>([]);

  const addToCart = (item: typeof collections[0]) => setCart((prev) => [...prev, item]);
  const toggleWishlist = (item: typeof collections[0]) =>
    wishlist.includes(item)
      ? setWishlist((prev) => prev.filter((i) => i !== item))
      : setWishlist((prev) => [...prev, item]);


  const [showGrid, setShowGrid] = useState(false);

  // After 3 seconds, switch from fan layout to grid
  useEffect(() => {
    const timer = setTimeout(() => setShowGrid(true), 3000);
    return () => clearTimeout(timer);
  }, []);

 return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Section Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold mb-16 bg-gradient-to-r from-pink-500 via-yellow-400 to-purple-500 bg-clip-text text-transparent">
          Featured Collections
        </h2>

        {/* Card Container */}
        <div
          className={`relative w-full ${
            showGrid
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-center items-center"
              : "h-90 flex justify-center items-center"
          }`}
        >
          {collections.slice(0, 8).map((col, idx) => {
            const total = Math.min(8, collections.length);
            const angle = -45 + (idx * 90) / (total - 1); // fan spread

            return (
              <div
                key={col.id}
                className={`rounded-3xl overflow-hidden shadow-2xl cursor-pointer group transition-transform duration-500 hover:scale-105 w-64 h-75  ${
                  !showGrid ? "absolute" : ""
                }`}
                style={{
                  transform: showGrid
                    ? "translate(0px, 0px) rotate(0deg)"
                     : `rotate(${angle}deg) translateY(-50px)`,
                  zIndex: showGrid ? undefined : total - idx,
                        }}
              >
                <Link to={`/collection/${col.id}` as any}>
                  <img
                    src={col.image}
                    alt={col.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 rounded-3xl"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl">
                    <h3 className="text-lg font-bold">{col.title}</h3>
                    <p className="text-sm">{col.subtitle}</p>
                    <p className="text-yellow-400 font-semibold">{col.price}</p>
                  </div>
                </Link>

                {/* Top Icons */}
                <div className="absolute top-4 right-4 flex gap-2 z-20">
                  <button
                    onClick={() => toggleWishlist(col)}
                    className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition transform hover:-translate-y-1"
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        wishlist.includes(col)
                          ? "text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => addToCart(col)}
                    className="bg-yellow-500 p-2 rounded-full shadow-md hover:scale-110 transition transform hover:-translate-y-1"
                  >
                    <ShoppingCart className="h-5 w-5 text-black" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}