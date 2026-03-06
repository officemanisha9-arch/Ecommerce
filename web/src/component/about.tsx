import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Leaf, Sparkles } from "lucide-react";

export default function AboutSection() {
  const features = [
    { icon: Star, title: "Premium Quality" },
    { icon: Leaf, title: "Eco-Friendly" },
    { icon: Sparkles, title: "Handcrafted" },
  ];

  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Left Diagonal Colored Section */}
        <div
  className="relative md:w-1/2 h-86 md:h-auto flex items-center justify-center p-12 
             bg-gradient-to-tr from-orange-400 via-purple-500 to-yellow-400 
             bg-cover bg-center"
  style={{ backgroundImage: "url('/home1.jpg')" }} // replace with your image
>
  {/* Overlay for readability */}
  <div className="absolute inset-0 bg-gradient-to-tr from-black/70 via-purple-500/50 to-yellow-500/50 
             bg-cover bg-center rounded-2xl"></div>

  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 1 }}
    className="relative max-w-md text-center md:text-left text-white"
  >
    <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
      About <span className="underline decoration-white/50">Us</span>
    </h2>
    <p className="text-lg md:text-xl mb-6 leading-relaxed">
      We combine <strong>artistry</strong> and <strong>innovation</strong> to craft collections that are timeless, sustainable, and elegant.
    </p>
    <Link
      to="/about"
      className="inline-block bg-white text-pink-500 px-8 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition"
    >
      Learn More
    </Link>
  </motion.div>
</div>

        {/* Right Image Section */}
        <div className="relative md:w-1/2 h-96 md:h-auto">
          <motion.img
            src="/perfume.webp" // replace with your image
            alt="About Us"
            className="w-full h-full object-cover"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* Floating Feature Cards */}
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-4 md:items-start md:pl-12">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: idx * 0.3 }}
                >
                  <Icon className="w-6 h-6 text-pink-500" />
                  <span className="font-semibold text-gray-800">{feature.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Diagonal separator */}
      <div className="relative -mt-12">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-24"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,100 L0,0 Z"
            className="fill-gray-50"
          />
        </svg>
      </div>
    </section>
  );
}