import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// --- ROUTES ---

// Register User
app.post("/api/register", async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    // Check if user exists
    const [rows] = await db.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      "INSERT INTO users (full_name, email, phone, password) VALUES (?, ?, ?, ?)",
      [full_name, email, phone, hashedPassword]
    );

    // ✅ This is auto generated unique ID
    const userId = result.insertId;

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: userId,
        full_name,
        email,
      },
    });

  } catch (err) {
    console.error(err);

    // Handle duplicate email error from DB
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Server error" });
  }
});

// Login User
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(400).json({ message: "Invalid credentials" });

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
app.post("/api/add-to-cart", async (req, res) => {
  try {
    const { userId, productName, productImage, price } = req.body;

    // 🔎 Validate input
    if (!userId || !productName || !price || !productImage) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Received:", {
      userId,
      productName,
      productImage,
      price,
    });

    const [result] = await db.execute(
      "INSERT INTO cart (user_id, product_name, product_image, price) VALUES (?, ?, ?, ?)",
      [
        Number(userId),              // ensure number
        productName,
        productImage || null,        // if undefined send null
        Number(price),
      ]
    );
    await db.query("COMMIT");

    console.log("Inserted ID:", result.insertId);

    const [rows] = await db.execute(
      "SELECT * FROM cart WHERE id = ?",
      [result.insertId]
    );

   console.log("Inserted Row:", rows);

    res.status(201).json({
      message: "Product added successfully",
      data: rows[0],
    });

  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM cart WHERE user_id = ?",
      [userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

app.delete("/api/cart/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM cart WHERE id = ?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting" });
  }
});

app.post("/api/orders", async (req, res) => {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    const {
      userId,
      customerDetails,
      paymentMethod,
      deliveryType,
      cart,
      subtotal,
      shipping,
      gst,
      discount,
      total,
    } = req.body;

    // 1️⃣ Insert into orders table
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
      (user_id, full_name, email, phone, address, city, state, pincode, 
       payment_method, delivery_type, total_amount, shipping, gst, discount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        customerDetails.fullName,
        customerDetails.email,
        customerDetails.phone,
        customerDetails.address,
        customerDetails.city,
        customerDetails.state,
        customerDetails.pincode,
        paymentMethod,
        deliveryType,
        total,
        shipping,
        gst,
        discount,
      ]
    );

    const orderId = orderResult.insertId;

    // 2️⃣ Insert Order Items
    for (let item of cart) {
      await connection.query(
        `INSERT INTO order_items 
        (order_id, product_name, price, quantity, product_image)
        VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.name,
          item.price,
          item.quantity || 1,
          item.image,
        ]
      );
    }

    // 3️⃣ Clear cart
    await connection.query("DELETE FROM cart WHERE user_id = ?", [userId]);

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: "Order placed successfully",
      orderId,
    });

  } catch (error) {
    await connection.rollback();
    connection.release();
    console.error("Order Error:", error);
    res.status(500).json({ message: "Order failed" });
  }
});


// ------------------ WISHLIST ROUTES ------------------

// Add to Wishlist
app.post("/api/wishlist", async (req, res) => {
  try {
    const { userId, productName, productImage, price, action } = req.body;
    if (!userId || !productName) return res.status(400).json({ message: "Missing fields" });

    if (action === "add") {
      const [exists] = await db.query(
        "SELECT id FROM wishlist WHERE user_id = ? AND product_name = ?",
        [userId, productName]
      );
      if (exists.length > 0) return res.status(400).json({ message: "Already in wishlist" });

      const [result] = await db.query(
        "INSERT INTO wishlist (user_id, product_name, product_image, price) VALUES (?, ?, ?, ?)",
        [userId, productName, productImage || null, price || null]
      );
      return res.status(201).json({ message: "Added to wishlist", id: result.insertId });
    } else if (action === "remove") {
      const [result] = await db.query(
        "DELETE FROM wishlist WHERE user_id = ? AND product_name = ?",
        [userId, productName]
      );
      if (result.affectedRows === 0) return res.status(404).json({ message: "Not in wishlist" });
      return res.json({ message: "Removed from wishlist" });
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from Wishlist
// DELETE /api/wishlist?userId=1&productName=Pixel10
app.delete("/api/wishlist", async (req, res) => {
  try {
    const { userId, productName } = req.query;

    if (!userId || !productName) return res.status(400).json({ message: "Missing fields" });

    const [result] = await db.query(
      "DELETE FROM wishlist WHERE user_id = ? AND product_name = ?",
      [userId, productName]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Not in wishlist" });

    res.json({ message: "Removed from wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get User Wishlist
app.get("/api/wishlist/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      "SELECT id, product_name, product_image, price FROM wishlist WHERE user_id = ?",
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Wishlist GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get latest 5 cart items for a user
app.get("/api/cart/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const [rows] = await db.query(
      `SELECT id, user_id, product_name, product_image, price, quantity, created_at
       FROM cart
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Cart GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= MY ORDERS =================
// ================= MY ORDERS =================
app.get("/api/my-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Get all orders of user
    const [orders] = await db.query(
      `SELECT * FROM orders 
       WHERE user_id = ?
       ORDER BY id DESC`,
      [userId]
    );

    if (orders.length === 0) {
      return res.json([]);
    }

    // 2️⃣ Extract order IDs
    const orderIds = orders.map(order => order.id);

    // 3️⃣ Generate placeholders (?, ?, ?)
    const placeholders = orderIds.map(() => "?").join(",");

    // 4️⃣ Fetch order items
    const [items] = await db.query(
      `SELECT * FROM order_items 
       WHERE order_id IN (${placeholders})`,
      orderIds
    );

    // 5️⃣ Group items by order_id
    const itemsMap = {};

    items.forEach(item => {
      if (!itemsMap[item.order_id]) {
        itemsMap[item.order_id] = [];
      }
      itemsMap[item.order_id].push(item);
    });

    // 6️⃣ Merge orders + items
    const finalOrders = orders.map(order => ({
      ...order,
      items: itemsMap[order.id] || [],
    }));

    res.json(finalOrders);

  } catch (err) {
    console.error("My Orders Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});