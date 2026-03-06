import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

type OrderItem = {
  id: number;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
};

type Order = {
  id: number;
  created_at: string;
  total_amount: number;
  shipping: number;
  gst: number;
  payment_method: string;
  delivery_type: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItem[];
};

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!user?.id) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/my-orders/${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading)
    return (
      <div className="p-16 text-center text-xl font-semibold">
        Loading your orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="p-16 text-center text-gray-500 text-lg">
        You have not placed any orders yet.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md mb-8 border hover:shadow-lg transition"
          >

            {/* ORDER HEADER */}
            <div className="flex flex-wrap justify-between items-center bg-gray-50 p-5 border-b">

              <div className="grid md:grid-cols-4 gap-6 text-sm">

                <div>
                  <p className="text-gray-500">Order ID</p>
                  <p className="font-semibold">#{order.id}</p>
                </div>

                <div>
                  <p className="text-gray-500">Order Date</p>
                  <p className="font-semibold">
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Payment</p>
                  <p className="font-semibold uppercase">
                    {order.payment_method}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500">Delivery</p>
                  <p className="font-semibold capitalize">
                    {order.delivery_type}
                  </p>
                </div>

              </div>

              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium">
                Delivered
              </span>

            </div>

            {/* ADDRESS */}
            <div className="p-5 border-b text-sm">

              <p className="font-semibold mb-2 text-gray-700">
                Shipping Address
              </p>

              <p>
                {order.full_name} • {order.phone}
              </p>

              <p className="text-gray-600">
                {order.address}, {order.city}, {order.state} - {order.pincode}
              </p>

            </div>

            {/* ITEMS */}
            <div className="p-6">

              <h3 className="font-semibold text-lg mb-4">
                Order Items
              </h3>

              <div className="space-y-4">

                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 border rounded-lg p-4 hover:bg-gray-50 transition"
                  >

                    {/* IMAGE */}
                    <div className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-lg overflow-hidden">
                      <img
                        src={
                          item.product_image
                            ? `http://localhost:5000${item.product_image}`
                            : "/no-image.png"
                        }
                        alt={item.product_name}
                        className="object-cover w-full h-full"
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex-1">

                      <h4 className="font-semibold text-gray-800">
                        {item.product_name}
                      </h4>

                      <p className="text-sm text-gray-500 mt-1">
                        Quantity: {item.quantity}
                      </p>

                      <p className="text-sm text-gray-500">
                        Price: ₹{item.price}
                      </p>

                    </div>

                    {/* TOTAL */}
                    <div className="text-right font-semibold text-lg">
                      ₹{item.price * item.quantity}
                    </div>

                  </div>
                ))}

              </div>
            </div>

            {/* TOTAL SECTION */}
            <div className="p-6 border-t bg-gray-50">

              <div className="flex justify-end">

                <div className="w-72 space-y-2 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{order.total_amount}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>₹{order.shipping}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">GST</span>
                    <span>₹{order.gst}</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>
                      ₹{order.total_amount + order.shipping + order.gst}
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}