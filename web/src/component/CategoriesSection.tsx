import { useNavigate } from "@tanstack/react-router";
import { categories } from "../data/categories";

export default function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="hidden sm:grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
          {categories.map((cat, index) => (
            <CategoryCard key={index} cat={cat} navigate={navigate} />
          ))}
        </div>

        <div className="sm:hidden flex gap-4 overflow-x-auto pb-2">
          {categories.map((cat, index) => (
            <div key={index} className="min-w-[85px]">
              <CategoryCard cat={cat} navigate={navigate} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

function CategoryCard({ cat, navigate }: any) {
  return (
    <div
      onClick={() =>
        navigate({
          to: "/categories/$category",
          params: { category: cat.slug },
        })
      }
      className="flex flex-col items-center cursor-pointer group"
    >
      <div className="bg-gradient-to-br from-cyan-100 to-yellow-50
        p-4 rounded-2xl shadow-sm
        group-hover:shadow-xl transition-all duration-300"
      >
        <img
          src={cat.image}
          alt={cat.name}
          className="w-16 h-16 md:w-20 md:h-20 object-contain"
        />
      </div>

      <p className="mt-2 text-xs md:text-sm font-medium text-gray-700 text-center">
        {cat.name}
      </p>
    </div>
  );
}