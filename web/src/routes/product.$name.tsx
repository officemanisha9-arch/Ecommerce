import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/product/$name")({
  component: ProductDetailPage,
});

const products = [
 // Mobiles
  { name: "Pixel 10a", category: "Mobiles", image: "/pixel.webp", price: 1400 },
  { name: "Classic Hoodie", category: "Fashion", image: "/ClassicHoodie.webp", price: 1100 },
  { name: "Galaxy S24", category: "Mobiles", image: "/glaxy.webp", price: 2200 },
  { name: "Smart Ring X", category: "Smart Gadgets", image: "/SmartRingX.webp", price: 850 },
  { name: "iPhone 15 Lite", category: "Mobiles", image: "/iphone.webp", price: 2800 },

  // Smart Gadgets
  { name: "NovaWatch", category: "Smart Gadgets", image: "/novawatch.png", price: 700 },
  { name: "Gaming Headset", category: "Electronics", image: "/GamingHeadset.png", price: 950 },
  { name: "FitBand Pro", category: "Smart Gadgets", image: "/FitBand.png", price: 600 },

  // Electronics
  { name: "NovaPods", category: "Electronics", image: "/NovaPods.png", price: 500 },
  { name: "Smart TV", category: "Electronics", image: "/SmartTV.webp", price: 2000 },
  { name: "Bluetooth Speaker", category: "Electronics", image: "/BluetoothSpeaker.png", price: 750 },

  // Grocery
  { name: "Organic Rice", category: "Grocery", image: "/OrganicRice.webp", price: 350 },
  { name: "Premium Olive Oil", category: "Grocery", image: "/PremiumOliveOil.png", price: 420 },
  { name: "Almond Pack", category: "Grocery", image: "/AlmondPack.webp", price: 550 },
  { name: "Green Tea Box", category: "Grocery", image: "/GreenTeaBox.png", price: 300 },

  // Fashion
  { name: "Running Shoes", category: "Fashion", image: "/RunningShoes.webp", price: 900 },
  { name: "Denim Jacket", category: "Fashion", image: "/DenimJacket.png", price: 1500 },
  { name: "Leather Belt", category: "Fashion", image: "/LeatherBelt.png", price: 450 },

  // Appliances
  { name: "Air Fryer", category: "Appliances", image: "/AirFryer.png", price: 1800 },
  { name: "Mixer Grinder", category: "Appliances", image: "/MixerGrinder.png", price: 1300 },
  { name: "Makeup Kit", category: "Beauty", image: "/MakeupKit.webp", price: 1700 },
  
  // Home
  { name: "Sofa Set", category: "Home", image: "/SofaSet.png", price: 3200 },
  { name: "Study Lamp", category: "Home", image: "/StudyLamp.webp", price: 600 },
  { name: "Wall Clock", category: "Home", image: "/WallClock.webp", price: 400 },
  
  // Beauty
  { name: "Microwave Oven", category: "Appliances", image: "/MicrowaveOven.png", price: 2500 },
  { name: "Face Serum", category: "Beauty", image: "/FaceSerum.png", price: 650 },
  { name: "Hair Dryer", category: "Beauty", image: "/HairDryer.png", price: 1200 },
];

function ProductDetailPage() {
  const { name } = useParams({ from: "/product/$name" });
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const product = products.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

  {/* Back Button */}
  <button
    onClick={() => navigate({ to: "/ProductCatgories" })}
    className="flex items-center gap-2 text-gray-600 mb-10 hover:text-black transition"
  >
    <ArrowLeft size={18} /> Back
  </button>

  {/* MAIN PRODUCT SECTION */}
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 bg-white rounded-3xl shadow-lg p-4">

    {/* IMAGE */}
    <div className="flex justify-center items-center bg-gray-100 rounded-2xl p-2">
      <motion.img
        src={product.image}
        alt={product.name}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.4 }}
        className="sm:h-[420px] h-[200px] object-contain"
      />
    </div>

    {/* DETAILS */}
    <div className="flex flex-col justify-center">

      <p className="text-sm text-gray-500 uppercase tracking-wider mb-3">
        {product.category}
      </p>

      <h1 className="text-4xl font-bold text-gray-900 mb-5">
        {product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-500 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={18} fill="currentColor" />
        ))}
        <span className="text-gray-500 text-sm ml-2">(124 Reviews)</span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4 mb-8">
        <span className="text-3xl font-semibold text-gray-900">
          ₹{product.price}
        </span>
        <span className="text-gray-400 line-through">
          ₹{product.price + 1500}
        </span>
        <span className="text-green-600 text-sm font-semibold">
          15% OFF
        </span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-6 mb-8">
        <button
          onClick={() => setQty((prev) => Math.max(1, prev - 1))}
          className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          -
        </button>

        <span className="text-lg font-medium">{qty}</span>

        <button
          onClick={() => setQty((prev) => prev + 1)}
          className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          +
        </button>
      </div>

      {/* Buttons */}
      <div className="flex gap-5">
        <button className="flex-1 bg-black text-white py-3 rounded-xl hover:opacity-90 transition">
          Add to Cart
        </button>

        <button className="flex-1 border border-black py-3 rounded-xl hover:bg-black hover:text-white transition">
          Buy Now
        </button>
      </div>

      {/* Description */}
      <div className="mt-10 text-gray-600 leading-relaxed">
        <h3 className="font-semibold mb-2 text-gray-900">
          Product Description
        </h3>
        <p>
          {product.name} is crafted with premium materials and modern design
          to deliver top-tier performance and style. A perfect blend of
          comfort, durability, and elegance.
        </p>
      </div>

    </div>
  </div>

  {/* RELATED PRODUCTS */}
  <div className="max-w-7xl mx-auto mt-20">
    <h2 className="text-2xl font-bold text-gray-900 mb-10">
      Related Products
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {products
        .filter(
          (p) =>
            p.category === product.category &&
            p.name !== product.name
        )
        .slice(0, 4)
        .map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ y: -8 }}
            onClick={() =>
              navigate({
                to: "/product/$name",
                params: { name: item.name },
              })
            }
            className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-xl transition-all duration-300"
          >
            <div className="bg-gray-100 rounded-xl p-2 mb-4 flex justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="sm:h-28 h-30 object-contain"
              />
            </div>

            <p className="text-sm font-semibold text-gray-900 text-center">
              {item.name}
            </p>

            <p className="text-center text-gray-600 mt-2">
              ₹{item.price}
            </p>
          </motion.div>
        ))}
    </div>
  </div>

</div>
  );
}