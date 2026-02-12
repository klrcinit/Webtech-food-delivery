const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Povezava na bazo (brez gesla, ker imamo 'trust')
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres", // Uporabljamo kar default bazo
  password: "root",
  port: 5432,
});

app.get("/api/restaurants/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // SQL: Najdi tisto, ki ima ta ID
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Restavracija ne obstaja" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// 1. Dobi vse restavracije
app.get("/api/restaurants", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// create new order
app.post("/api/orders", async (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  try {
    // create order
    const orderResult = await pool.query(
      "INSERT INTO orders (user_id) VALUES ($1) RETURNING id",
      [user_id]
    );

    const orderId = orderResult.rows[0].id;

    // insert order items
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, dish_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.dish_id, item.quantity]
      );
    }

    res.status(201).json({ message: "Order created", order_id: orderId });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});




