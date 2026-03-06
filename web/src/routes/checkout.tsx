import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

function CheckoutPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [delivery, setDelivery] = useState("standard");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );

  const shipping = delivery === "express" ? 299 : 99;
  const gst = subtotal * 0.18;
  const total = subtotal + shipping + gst - discount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const applyCoupon = () => {
    if (coupon === "SAVE10") {
      const discountAmount = subtotal * 0.1;
      setDiscount(discountAmount);
      toast.success("Coupon Applied 🎉");
    } else {
      toast.error("Invalid Coupon");
    }
  };

  const placeOrder = async () => {
    if (!form.fullName || !form.phone || !form.address) {
      toast.error("Please fill required fields.");
      return;
    }

    if (cart.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  userId: 12345,
  customerDetails: form,
  paymentMethod,
  deliveryType: delivery,
  cart,
  subtotal,
  shipping,
  gst,
  discount,
  total,
}),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Order placed successfully 🎉");
        localStorage.removeItem("cart");
        setCart([]);
        navigate({ to: "/" });
      } else {
        toast.error(data.message || "Order failed");
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8 px-4">
      
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            Secure Checkout
          </h1>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Complete your order securely and quickly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">

            {/* BILLING */}
            <div className="bg-white/80 backdrop-blur-md border p-6 sm:p-8 rounded-3xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Billing Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-5">
                <input name="fullName" placeholder="Full Name *"
                  onChange={handleChange} className="input-style" />
                <input name="email" placeholder="Email Address"
                  onChange={handleChange} className="input-style" />
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <input name="phone" placeholder="Phone Number *"
                  onChange={handleChange} className="input-style" />
                <input name="city" placeholder="City"
                  onChange={handleChange} className="input-style" />
              </div>

              <input name="address" placeholder="Full Address *"
                onChange={handleChange}
                className="input-style mt-5" />

              <div className="grid sm:grid-cols-2 gap-5 mt-5">
                <input name="state" placeholder="State"
                  onChange={handleChange} className="input-style" />
                <input name="pincode" placeholder="Pincode"
                  onChange={handleChange} className="input-style" />
              </div>
            </div>

            {/* PAYMENT */}
            <div className="bg-white/80 border p-6 sm:p-8 rounded-3xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Payment Method
              </h2>

              <div className="space-y-4">
                {[
                  { id: "cod", label: "Cash on Delivery" },
                  { id: "upi", label: "UPI Payment" },
                  { id: "card", label: "Credit / Debit Card" },
                ].map((method) => (
                  <label key={method.id}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer
                    ${paymentMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "hover:border-gray-400"
                      }`}
                  >
                    <span>{method.label}</span>
                    <input
                      type="radio"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* DELIVERY */}
            <div className="bg-white border p-6 sm:p-8 rounded-3xl shadow-lg">
              <h2 className="text-xl font-semibold mb-6 text-gray-800">
                Delivery Option
              </h2>

              <select
                className="w-full border rounded-2xl p-3"
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
              >
                <option value="standard">Standard Delivery (₹99)</option>
                <option value="express">Express Delivery (₹299)</option>
              </select>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-2xl h-fit sticky top-8">

            <h2 className="text-xl font-semibold mb-6 text-gray-800">
              Order Summary
            </h2>

           {cart.map((item) => (
  <div
    key={item.id}
    className="flex items-center gap-4 border-b pb-3"
  >
    <img
      src={item.image}
      alt={item.name}
      className="w-16 h-16 rounded-xl object-cover"
    />

    <div className="flex-1">
      <p className="font-medium text-sm">{item.name}</p>
      <p className="text-xs text-gray-500">
        ₹{item.price} × {item.quantity || 1}
      </p>
    </div>

    <div className="font-semibold text-sm">
      ₹{(item.price * (item.quantity || 1)).toFixed(2)}
    </div>
  </div>
))}

            <div className="border-t my-4"></div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{shipping}</span>
              </div>
              <div className="flex justify-between">
                <span>GST</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className="border-t my-4"></div>

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>

            <button
              onClick={placeOrder}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-2xl font-semibold shadow-lg"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>

      <style>
        {`
        .input-style {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 1rem;
          padding: 0.75rem;
          outline: none;
        }
        .input-style:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
        }
      `}
      </style>
    </div>
  );
}

export default CheckoutPage;