import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"; // import heart icons

export const Route = createFileRoute("/wishlist")({
  component: WishlistPage,
});

interface WishlistItem {
  id: number;          // wishlist table id
  product_name: string;
  price: number;
  product_image: string;
}

function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const navigate = useNavigate();
const [loading, setLoading] = useState(true);
 const fetchWishlist = async () => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first");
      setTimeout(() => navigate({ to: "/login" }), 1000);
      return;
    }

    const user = JSON.parse(storedUser);

    const res = await fetch(`http://localhost:5000/api/wishlist/${user.id}`);
    const data = await res.json();

    setWishlist(data);
    setLoading(false);
  } catch (err) {
    console.error(err);
    toast.error("Failed to fetch wishlist");
    setLoading(false);
  }
};

  useEffect(() => {
    fetchWishlist();
  }, []);

 const removeFromWishlist = async (id: number) => {
  try {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      toast.error("Please login first");
      setTimeout(() => navigate({ to: "/login" }), 1000);
      return;
    }
    const user = JSON.parse(storedUser);

    const item = wishlist.find((i) => i.id === id);
    if (!item) return;

    const res = await fetch(
      `http://localhost:5000/api/wishlist?userId=${user.id}&productName=${encodeURIComponent(item.product_name)}`,
      {
        method: "DELETE",
      }
    );

    if (!res.ok) throw new Error("Failed to remove item");

    setWishlist((prev) => prev.filter((i) => i.id !== id));
    toast.success("Removed from wishlist");
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Failed to remove item");
  }
};

  const moveToCart = async (item: WishlistItem) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        toast.error("Please login first");
        setTimeout(() => navigate({ to: "/login" }), 1000);
        return;
      }

      const user = JSON.parse(storedUser);

     const payload = {
  userId: Number(user.id),
  productName: item.product_name,
  productImage: item.product_image,
  price: item.price,
  action: "add",
};

      const res = await fetch("http://localhost:5000/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add to cart");

      removeFromWishlist(item.id);
      toast.success("Moved to cart");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Error moving to cart");
    }
  };

  return (
    <div style={styles.container}>
      <Toaster position="top-right" />
      <div style={styles.header}>
        <h1 style={styles.heading}>My Wishlist</h1>
        <span style={styles.count}>{wishlist.length} Items</span>
      </div>

      {loading ? (
  <div style={styles.grid}>
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} style={styles.skeletonCard}>
        <div style={styles.skeletonImage}></div>
        <div style={styles.skeletonText}></div>
        <div style={styles.skeletonTextSmall}></div>
        <div style={styles.skeletonButton}></div>
      </div>
    ))}
  </div>
) : wishlist.length === 0 ? (
  <div style={styles.emptyBox}>
    <h2>💔 Your wishlist is empty</h2>
    <p>Add products you love to your wishlist.</p>
  </div>
) : ( 
        <div style={styles.grid}>
          {wishlist.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img src={item.product_image} alt={item.product_name} style={styles.image} />
              </div>

              <div style={styles.cardContent}>
                <h3 style={styles.productName}>{item.product_name}</h3>
                <p style={styles.price}>₹{item.price}</p>

                <div style={styles.buttonGroup}>
                  <button
                    style={styles.cartBtn}
                    onClick={() => moveToCart(item)}
                  >
                    Move to Cart
                  </button>

                   <button
    style={styles.heartBtn}
    onClick={() => removeFromWishlist(item.id)}
  >
    <AiFillHeart color="red" size={22} />
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: "50px",
    background: "linear-gradient(to right, #f8fafc, #eef2ff)",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  heading: {
    fontSize: "34px",
    fontWeight: "700",
  },
  count: {
    background: "#4f46e5",
    color: "#fff",
    padding: "8px 18px",
    borderRadius: "20px",
    fontSize: "14px",
  },
  emptyBox: {
    textAlign: "center",
    marginTop: "80px",
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 15px 40px rgba(0,0,0,0.08)",
    transition: "all 0.3s ease",
  },
  imageWrapper: {
    height: "220px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.4s ease",
  },
  cardContent: {
    padding: "20px",
  },
  productName: {
    fontSize: "18px",
    marginBottom: "10px",
  },
  skeletonCard: {
  background: "#fff",
  borderRadius: "20px",
  padding: "20px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
},

skeletonImage: {
  height: "180px",
  background: "#e5e7eb",
  borderRadius: "10px",
  marginBottom: "15px",
  animation: "pulse 1.5s infinite",
},

skeletonText: {
  height: "18px",
  background: "#e5e7eb",
  borderRadius: "6px",
  marginBottom: "10px",
  width: "80%",
  animation: "pulse 1.5s infinite",
},

skeletonTextSmall: {
  height: "16px",
  background: "#e5e7eb",
  borderRadius: "6px",
  marginBottom: "15px",
  width: "40%",
  animation: "pulse 1.5s infinite",
},

skeletonButton: {
  height: "35px",
  background: "#e5e7eb",
  borderRadius: "8px",
  width: "100%",
  animation: "pulse 1.5s infinite",
},
  price: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#111827",
  },
  heartBtn: {
  background: "transparent",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
  buttonGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cartBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  removeBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "16px",
  },
};