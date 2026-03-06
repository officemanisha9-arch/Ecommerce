import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import toast, { Toaster } from "react-hot-toast";

/* ------------------ PROTECTED ROUTE ------------------ */
export const Route = createFileRoute("/cart")({
  beforeLoad: () => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      // Redirect if not logged in
      throw redirect({
        to: "/login",
      });
    }
  },
  component: CartPage,
});

/* ------------------ TYPES ------------------ */
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

/* ------------------ COMPONENT ------------------ */
function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  /* Detect Screen Size */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Load Cart for logged-in user */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return; // already protected by route

        const user = JSON.parse(storedUser);

        const response = await fetch(`http://localhost:5000/api/cart/${user.id}`);
        if (!response.ok) throw new Error("Failed to fetch cart");

        const data = await response.json();

        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.product_name,
          price: item.price,
          image: item.product_image,
          quantity: item.quantity || 1,
        }));

        setCart(formatted);
      } catch (error) {
        console.error("Cart fetch error:", error);
        toast.error("Failed to load cart");
      }
    };

    fetchCart();
  }, []);

  /* Update Cart in state + localStorage */
  const updateCart = (updatedCart: CartItem[]) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQty = (id: number) => {
    updateCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    updateCart(
      cart.map((item) =>
        item.id === id && (item.quantity || 1) > 1
          ? { ...item, quantity: (item.quantity || 1) - 1 }
          : item
      )
    );
  };

  const removeItem = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/cart/${id}`, { method: "DELETE" });
      setCart(cart.filter((item) => item.id !== id));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove item");
    }
  };

  /* Calculations */
  const subtotal = cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const shipping = subtotal > 5000 ? 0 : 199;
  const gst = subtotal * 0.18;
  const grandTotal = subtotal + shipping + gst;

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    navigate({ to: "/checkout" });
  };

  /* ------------------ RENDER ------------------ */
  return (
    <div style={styles.container}>
      <Toaster position="top-right" reverseOrder={false} />
      <h1 style={styles.heading}>My Shopping Cart 🛒</h1>

      <div style={{ ...styles.wrapper, gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr" }}>
        {/* CART ITEMS */}
        <div style={styles.items}>
          {cart.length === 0 ? (
            <div style={styles.emptyCart}>
              <h2>Your Cart is Empty 🛒</h2>
              <p>Add some products to continue shopping.</p>
              <Link to="/">
                <button style={styles.shopBtn}>Go to Shop</button>
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                style={{ ...styles.card, flexDirection: isMobile ? "column" : "row" }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    ...styles.image,
                    width: isMobile ? "100%" : "120px",
                    height: isMobile ? "180px" : "120px",
                  }}
                />

                <div style={styles.info}>
                  <h3>{item.name}</h3>
                  <p style={styles.price}>₹{item.price}</p>

                  <div style={styles.qty}>
                    <button style={styles.qtyBtn} onClick={() => decreaseQty(item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button style={styles.qtyBtn} onClick={() => increaseQty(item.id)}>+</button>
                  </div>
                </div>

                <div style={{ ...styles.side, textAlign: isMobile ? "left" : "right" }}>
                  <p style={styles.itemTotal}>₹{item.price * (item.quantity || 1)}</p>
                  <button style={styles.remove} onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SUMMARY */}
        {cart.length > 0 && (
          <div style={{ ...styles.summary, position: isMobile ? "static" : "sticky" }}>
            <h2>Order Summary</h2>
            <div style={styles.row}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={styles.row}>
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div style={styles.row}>
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <hr style={{ margin: "20px 0" }} />
            <div style={styles.totalRow}>
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            <button onClick={handlePlaceOrder} style={styles.buyBtn}>Proceed to Buy</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------ STYLES ------------------ */
const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: "40px 20px", background: "#f8fafc", minHeight: "100vh" },
  heading: { fontSize: "32px", fontWeight: 700, marginBottom: "30px", textAlign: "center" },
  wrapper: { display: "grid", gap: "40px" },
  items: { display: "flex", flexDirection: "column", gap: "20px" },
  card: { display: "flex", gap: "20px", background: "#ffffff", padding: "20px", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)" },
  image: { borderRadius: "12px", objectFit: "cover" },
  info: { flex: 1 },
  price: { fontWeight: 600, margin: "10px 0" },
  qty: { display: "flex", alignItems: "center", gap: "10px" },
  qtyBtn: { width: "32px", height: "32px", borderRadius: "6px", border: "1px solid #ddd", background: "#f1f5f9", cursor: "pointer" },
  side: {},
  itemTotal: { fontWeight: 700, marginBottom: "8px" },
  remove: { background: "none", border: "none", color: "#ef4444", cursor: "pointer" },
  summary: { background: "#ffffff", padding: "25px", borderRadius: "16px", boxShadow: "0 10px 30px rgba(0,0,0,0.06)", top: "20px", height: "fit-content" },
  row: { display: "flex", justifyContent: "space-between", marginBottom: "12px" },
  totalRow: { display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: 700 },
  buyBtn: { marginTop: "20px", width: "100%", padding: "12px", borderRadius: "10px", border: "none", background: "#2563eb", color: "#fff", fontWeight: 600, cursor: "pointer" },
  emptyCart: { textAlign: "center", padding: "60px 20px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 8px 25px rgba(0,0,0,0.05)" },
  shopBtn: { marginTop: "20px", padding: "12px 20px", borderRadius: "8px", border: "none", background: "#2563eb", color: "#fff", cursor: "pointer" },
};