const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require("jsonwebtoken");

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

app.get("/api/restaurants/:id", authenticateToken, async (req,res)=>{
  const id = parseInt(req.params.id);

  const restaurant = await pool.query(
    "SELECT * FROM restaurants WHERE id=$1",
    [id]
  );

  const dishes = await pool.query(
    `SELECT d.*,
          COUNT(r.id) AS review_count
   FROM dishes d
   LEFT JOIN reviews r ON r.dish_id = d.id
   WHERE d.restaurant_id = $1
   GROUP BY d.id
   ORDER BY d.id`,
    [id]
  );

  res.json({
    ...restaurant.rows[0],
    dishes: dishes.rows
  });
});

app.get("/api/restaurants", authenticateToken, async (req, res) => {

  const user_id = req.user.id;

  if (!user_id) {
    return res.status(400).json({ error: "user_id required" });
  }



  try {

    // get user location
    const userResult = await pool.query(
      "SELECT location_x, location_y FROM users WHERE id = $1",
      [user_id]
    );

    const user = userResult.rows[0];

    // get restaurants
    const result = await pool.query("SELECT * FROM restaurants");
    const restaurants = result.rows;

    // compute distance + delivery time
    const enrichedRestaurants = restaurants.map(r => {

      const distance =
        Math.abs(user.location_x - r.location_x) +
        Math.abs(user.location_y - r.location_y);

      let delivery_minutes;

      if (distance <= 3) {
        delivery_minutes = 20;
      } else if (distance <= 6) {
        delivery_minutes = 35;
      } else {
        delivery_minutes = 50;
      }

      return {
        ...r,
        distance_km: distance,
        delivery_minutes: delivery_minutes
      };

    });

    res.json(enrichedRestaurants);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }

});

// create new order
app.post("/api/orders", authenticateToken, async (req, res) => {
  const { user_id, items } = req.body;

  if (!user_id || !items || items.length === 0) {
    return res.status(400).json({ error: "Invalid order data" });
  }

  try {
    // 1. Get restaurant_id from first dish
    const firstDish = await pool.query(
      "SELECT restaurant_id FROM dishes WHERE id = $1",
      [items[0].dish_id]
    );

    const restaurant_id = firstDish.rows[0].restaurant_id;

// 2. Get user location
    const userResult = await pool.query(
      "SELECT location_x, location_y FROM users WHERE id = $1",
      [user_id]
    );

    const user = userResult.rows[0];

// 3. Get restaurant location
    const restaurantResult = await pool.query(
      "SELECT location_x, location_y FROM restaurants WHERE id = $1",
      [restaurant_id]
    );

    const restaurant = restaurantResult.rows[0];

// 4. Calculate Manhattan distance
    const distance =
      Math.abs(user.location_x - restaurant.location_x) +
      Math.abs(user.location_y - restaurant.location_y);

// 5. Convert distance to minutes
    let estimatedTime;

    if (distance <= 3) {
      estimatedTime = 20;
    } else if (distance <= 6) {
      estimatedTime = 35;
    } else {
      estimatedTime = 50;
    }

    // create order with restaurant + ETA
    const orderResult = await pool.query(
      "INSERT INTO orders (user_id, restaurant_id, estimated_delivery_minutes) VALUES ($1, $2, $3) RETURNING id",
      [user_id, restaurant_id, estimatedTime]
    );

    const orderId = orderResult.rows[0].id;


    // insert order items
    for (const item of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, dish_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.dish_id, item.quantity]
      );
    }

    res.status(201).json({ message: "Order created", order_id: orderId,   estimated_delivery_minutes: estimatedTime
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }

});

// get orders for a user
app.get("/api/orders/:user_id", authenticateToken, async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT o.id,
             o.restaurant_id,
             o.estimated_delivery_minutes,
             o.created_at,
             r.name AS restaurant_name
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/reviews", authenticateToken, async (req, res) => {

  const { user_id, restaurant_id, dish_id, rating, comment } = req.body;

  if (!user_id || !restaurant_id || !rating) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {

    await pool.query(
      `INSERT INTO reviews (user_id, restaurant_id, dish_id, rating, comment)
       VALUES ($1,$2,$3,$4,$5)`,
      [user_id, restaurant_id, dish_id || null, rating, comment]
    );

    // update restaurant average rating
    await pool.query(
      `UPDATE restaurants
       SET rating = (
         SELECT AVG(rating)
         FROM reviews
         WHERE restaurant_id = $1
       )
       WHERE id = $1`,
      [restaurant_id]
    );

    // update dish rating
    if (dish_id) {
      await pool.query(
        `UPDATE dishes
     SET rating = (
       SELECT AVG(rating)
       FROM reviews
       WHERE dish_id = $1
     )
     WHERE id = $1`,
        [dish_id]
      );
    }

    res.json({ message: "Review saved" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }

});

// GET reviews for a specific restaurant
app.get("/api/restaurants/:id/reviews", authenticateToken, async (req, res) => {

  const { id } = req.params;

  try {

    const result = await pool.query(
      `SELECT restaurant_id, dish_id, rating, comment, created_at
       FROM reviews
       WHERE restaurant_id = $1
       AND dish_id IS NULL
       ORDER BY created_at DESC`,
      [id]
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Database error" });

  }

});

app.get("/api/users/:userId/reviews", authenticateToken, async (req, res) => {

  const { userId } = req.params;

  try {

    const result = await pool.query(
      `SELECT restaurant_id, dish_id, rating, comment, created_at
       FROM reviews
       WHERE user_id = $1
       AND restaurant_id IS NOT NULL`,
      [userId]
    );

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }

});

app.get("/api/users/:userId/favorites", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT r.id,
               r.name,
               r.rating,
               r.location_x,
               r.location_y,
               AVG(rv.rating)::numeric(10,1) AS user_rating
        FROM restaurants r
               JOIN reviews rv ON rv.restaurant_id = r.id
        WHERE rv.user_id = $1
          AND rv.dish_id IS NULL
        GROUP BY r.id
        ORDER BY user_rating DESC
          LIMIT 3
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// ---------------- AUTH ----------------

// Register new user
app.post("/api/register", async (req, res) => {

  const { email, password, location_x, location_y } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password, location_x, location_y, role)
   VALUES ($1,$2,$3,$4,$5)
   RETURNING id,email,role`,
      [email, hashedPassword, location_x || 0, location_y || 0, 'customer']
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Registration failed" });

  }

});

// Login user
app.post("/api/login", async (req, res) => {

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {

    const result = await pool.query(
      `SELECT id, email, password, role
       FROM users
       WHERE email = $1`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id },
      "my_super_secret_key",
      { expiresIn: "2h" }
    );

    return res.status(200).json({
      id: user.id,
      email: user.email,
      role: user.role,
      token: token
    });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Login error" });

  }

});


app.put("/api/users/:id/password", authenticateToken, async (req,res)=>{

  const { id } = req.params;
  const { password } = req.body;

  if(!password){
    return res.status(400).json({error:"Password required"});
  }

  const hashedPassword = await bcrypt.hash(password,10);

  await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2",
    [hashedPassword,id]
  );

  res.json({message:"Password updated"});
});

app.put("/api/reset-password", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "UPDATE users SET password = $1 WHERE email = $2",
      [hashedPassword, email]
    );

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Password reset failed" });
  }
});

function authenticateToken(req, res, next) {

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, "my_super_secret_key", (err, user) => {

    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
    next();

  });
}

app.put("/api/users/:id", authenticateToken, async (req, res) => {

  const { id } = req.params;
  const { email, location_x, location_y } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  try {

    await pool.query(
      `UPDATE users
       SET email = $1,
           location_x = $2,
           location_y = $3
       WHERE id = $4`,
      [email, location_x || 0, location_y || 0, id]
    );

    res.json({ message: "Profile updated" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Database error" });

  }

});

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});




