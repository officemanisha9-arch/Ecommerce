import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";

const slides = [
  {
    title: "LUXURY REDEFINED",
    subtitle: "Step into timeless elegance.",
    bg: "/lx.jpg",
  },
  {
    title: "PREMIUM COLLECTION",
    subtitle: "Crafted for modern icons.",
    bg: "/perfume.webp",
  },
  {
    title: "MODERN ELEGANCE",
    subtitle: "Confidence in every detail.",
    bg: "/c.jfif",
  },
   {
    title: "HOME COLLECTION",
    subtitle: "accessories in every detail.",
    bg: "/home1.jpg",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[90vh] w-full perspective-1000 overflow-hidden text-white">

      <div className="relative h-full w-full">
        {slides.map((slide, index) => {
          // calculate rotation
          const rotationY = (index - current) * 60;
          const scale = index === current ? 1 : 0.8;
          const opacity = index === current ? 1 : 0.1;

          return (
            <div
              key={index}
              className="absolute inset-0 w-full h-full transition-transform duration-1000 ease-in-out"
              style={{
                transform: `rotateY(${rotationY}deg) translateZ(300px) scale(${scale})`,
                opacity,
                backfaceVisibility: "hidden",
              }}
            >
              {/* Background */}
              <img
                src={slide.bg}
                alt={slide.title}
                className="w-full h-full object-cover brightness-75"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center md:items-start px-6 md:px-20 z-30 text-center md:text-left">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-wider">
                  {slide.title}
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-6 max-w-lg">
                  {slide.subtitle}
                </p>
                <Link className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold rounded-full hover:scale-105 transition">
                  Explore Collection
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4 z-40">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition ${
              current === i ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}