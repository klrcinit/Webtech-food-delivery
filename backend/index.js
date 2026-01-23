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
  password: "",         // Pustimo prazno
  port: 5432,
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

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});
