import { motion } from "framer-motion";
import { Users, Package, Globe, Award } from "lucide-react";

export default function WaveStatsSection() {
  const stats = [
    { value: 500, label: "Happy Customers", icon: Users, color: "from-pink-400 via-purple-400 to-yellow-400" },
    { value: 120, label: "Premium Products", icon: Package, color: "from-green-300 via-teal-400 to-blue-400" },
    { value: 15, label: "Countries Served", icon: Globe, color: "from-yellow-300 via-orange-400 to-pink-400" },
    { value: 10, label: "Years of Excellence", icon: Award, color: "from-purple-400 via-pink-400 to-yellow-400" },
  ];

  return (
    <section className="relative bg-white pt-32 pb-20 overflow-hidden">
      {/* Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg className="relative block w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.29,22,103.64,29.43,158,17.92C275.42,45,330.16,0,412,0c97.64,0,154.63,49.18,243,52.69s171-37.27,263-45.29,193,26,282,29.29,151-19,211-41.67V0Z" fill="#fce8e8"></path>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Stats Line */}
        <div className="relative flex flex-col md:flex-row justify-center items-center gap-12 mb-20">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
  key={idx}
  className="flex items-center w-64 md:w-72 h-20 bg-white rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-transform cursor-pointer relative overflow-hidden"
  initial={{ opacity: 0, x: 50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ type: "spring", stiffness: 120, damping: 12, delay: idx * 0.2 }}
>
  {/* Vertical accent line */}
  <div className={`absolute left-0 top-0 w-1 h-full bg-gradient-to-b ${stat.color} rounded-r-full`}></div>

  {/* Icon circle */}
  <div className={`flex items-center justify-center w-12 h-12 ml-4 rounded-full bg-gradient-to-tr ${stat.color} text-white shadow-md`}>
    <Icon className="w-6 h-6" />
  </div>

  {/* Text content */}
  <div className="flex flex-col ml-4">
    <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}+</p>
    <p className="text-gray-500 text-sm md:text-base">{stat.label}</p>
  </div>
</motion.div>
            );
          })}
        </div>

        {/* Mission */}
        <motion.p
          className="max-w-3xl mx-auto text-gray-700 text-lg md:text-xl leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Our mission is to design <span className="text-pink-400 font-semibold">timeless collections</span> with <span className="text-purple-400 font-semibold">style</span>, <span className="text-yellow-400 font-semibold">quality</span>, and <span className="text-teal-400 font-semibold">sustainability</span> that delight customers worldwide.
        </motion.p>
      </div>

      {/* Wave Bottom */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
        <svg className="relative block w-full h-24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.29,22,103.64,29.43,158,17.92C275.42,45,330.16,0,412,0c97.64,0,154.63,49.18,243,52.69s171-37.27,263-45.29,193,26,282,29.29,151-19,211-41.67V0Z" fill="#fce8e8"></path>
        </svg>
      </div>
    </section>
  );
}