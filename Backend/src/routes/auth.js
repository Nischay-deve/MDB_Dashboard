import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email & password required" });
  const [rows] = await pool.execute(
    "SELECT id, email, password_hash, role FROM users WHERE email=? LIMIT 1",
    [email]
  );
  const user = rows[0];
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});


function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // check if email exists
  const [rows] = await pool.execute("SELECT id FROM users WHERE email=?", [
    email,
  ]);
  if (rows.length > 0) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.execute(
    "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
    [email, hash, "user"]
  );

  res.status(201).json({ message: "User registered successfully" });
});

router.get("/list", authRequired, async (req, res) => {
  try {
    console.log(req.user.role);
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const search = req.query.search || ""; // from query string
    let query = "SELECT id, email, role, created_at FROM users";
    let values = [];

    if (search) {
      query += " WHERE email LIKE ? OR role LIKE ?";
      values.push(`%${search}%`, `%${search}%`);
    }

    const [rows] = await pool.execute(query, values);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
