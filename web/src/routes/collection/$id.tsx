import { createFileRoute } from '@tanstack/react-router';
import { collections } from '../../component/feature';
import { useParams } from '@tanstack/react-router'
import { useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter,FaLinkedinIn } from 'react-icons/fa';
export const Route = createFileRoute('/collection/$id')({
  component: CollectionDetail,
});

export default function CollectionDetail() {
  const params = useParams<{ id: string }>({}); // <-- fixed
  const collection = collections.find((c) => c.id === Number(params.id));

  if (!collection) return <p className="text-center mt-20">Collection not found.</p>;
 const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q: number) => q + 1);
  const decrement = () => setQuantity((q: number) => (q > 1 ? q - 1 : 1));

  const addToWishlist = () => {
    alert(`${collection.title} added to wishlist!`);
  };

  const placeOrder = () => {
    alert(`Order placed for ${quantity} x ${collection.title}`);
  };
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 bg-white rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
  {/* Product Image */}
  <div className="relative group overflow-hidden rounded-2xl shadow-lg">
    <img
      src={collection.image}
      alt={collection.title}
      className="w-full h-64 sm:h-96 md:h-[500px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
    />
    {collection.stock === 0 && (
      <span className="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1 rounded-full text-sm shadow">
        Out of Stock
      </span>
    )}
  </div>

  {/* Product Info */}
  <div className="flex flex-col justify-between mt-6 md:mt-0">
    <div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 text-gray-900">
        {collection.title}
      </h1>
      <p className="text-gray-500 text-base sm:text-lg mb-4 sm:mb-6">{collection.subtitle}</p>

      {/* Features */}
      <ul className="mb-4 sm:mb-6 space-y-2">
        {collection.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-gray-700 text-sm sm:text-base">
            <span className="text-yellow-400">★</span> {f}
          </li>
        ))}
      </ul>

      {/* Rating & Category */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4 sm:mb-6 text-gray-600 text-sm sm:text-base">
        <p>Rating: {collection.rating} ⭐</p>
        <p>Category: {collection.category}</p>
      </div>

      {/* Price */}
      <p className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">{collection.price}</p>

      {/* Quantity selector */}
      <div className="flex flex-wrap items-center gap-4 mb-4 sm:mb-6">
        <span className="font-semibold text-gray-700 text-sm sm:text-base">Quantity:</span>
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            onClick={decrement}
            className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-12 sm:w-16 text-center border-l border-r border-gray-300 text-sm sm:text-base"
          />
          <button
            onClick={increment}
            className="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Social Share */}
      <div className="flex flex-wrap items-center gap-3 mb-4 sm:mb-6 text-sm sm:text-base">
  <span className="font-semibold text-gray-700">Share:</span>
  <button className="text-blue-600 hover:text-blue-800 transition p-2 rounded-full bg-gray-100 hover:bg-gray-200">
    <FaFacebookF size={16} />
  </button>
  <button className="text-pink-500 hover:text-pink-700 transition p-2 rounded-full bg-gray-100 hover:bg-gray-200">
    <FaInstagram size={16} />
  </button>
  <button className="text-blue-400 hover:text-blue-600 transition p-2 rounded-full bg-gray-100 hover:bg-gray-200">
    <FaTwitter size={16} />
  </button>
  <button className="text-blue-700 hover:text-blue-900 transition p-2 rounded-full bg-gray-100 hover:bg-gray-200">
    <FaLinkedinIn size={16} />
  </button>
</div>
    </div>

    {/* Actions */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-0">
      <button
        onClick={addToWishlist}
        className="flex-1 bg-gray-900 text-white font-semibold px-4 sm:px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition transform hover:scale-105 text-sm sm:text-base"
      >
        Add to Wishlist 💖
      </button>
      <button
        onClick={placeOrder}
        className="flex-1 bg-yellow-400 text-white font-semibold px-4 sm:px-6 py-3 rounded-lg shadow hover:bg-yellow-500 transition transform hover:scale-105 text-sm sm:text-base"
      >
        Place Order 🛒
      </button>
    </div>
  </div>

  {/* Related Products */}
  <div className="col-span-1 md:col-span-2 mt-12 sm:mt-16">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-900">Related Products</h2>
    <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-visible">
      {collections
        .filter((c) => c.id !== collection.id)
        .slice(0, 6)
        .map((related) => (
          <div
            key={related.id}
            className="min-w-[180px] sm:min-w-[220px] bg-white rounded-2xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300 snap-start"
          >
            <img
              src={related.image}
              alt={related.title}
              className="w-full h-36 sm:h-44 object-cover transition-transform duration-500 hover:scale-110"
            />
            <div className="p-3 sm:p-4">
              <h3 className="font-semibold text-gray-900 text-sm sm:text-lg mb-1">{related.title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm mb-1">{related.subtitle}</p>
              <p className="text-yellow-500 font-bold text-sm sm:text-base">{related.price}</p>
            </div>
          </div>
        ))}
    </div>
  </div>
</div>
  );
}