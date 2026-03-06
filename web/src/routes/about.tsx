import { createFileRoute } from '@tanstack/react-router'
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
   return (
    <section className="relative w-full">
      {/* Background Image */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-b-4xl shadow-2xl">
        <motion.img
          src="/c.jfif" // replace with your background image
          alt="About Background"
          className="w-full h-full object-cover"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6 md:px-12">
          <motion.h2
            className="text-4xl md:text-5xl font-extrabold text-white mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            About <span className="text-pink-400">Our Brand</span>
          </motion.h2>

          <motion.p
            className="text-white text-lg md:text-xl max-w-2xl mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            We create timeless collections that combine <strong>artistry</strong> and <strong>modern design</strong>. Each piece reflects our commitment to quality, sustainability, and elegance.
          </motion.p>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/about"
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:opacity-90 transition"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Curved Separator */}
      <div className="relative -mt-12">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-24"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C480,100 960,0 1440,100 L1440,0 L0,0 Z"
            className="fill-white"
          ></path>
        </svg>
      </div>
    </section>
  );
}
