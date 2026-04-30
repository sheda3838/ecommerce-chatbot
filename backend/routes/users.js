import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Signup
router.post("/signup", (req, res) => {
  const { name, email, password, phone, address } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email and password are required" });
  }

  const query = `INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, 'user')`;
  db.run(query, [name, email, password, phone, address], function(err) {
    if (err) {
      if (err.message && err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ error: "Email already exists" });
      }
      return res.status(500).json({ error: err.message });
    }
    
    res.json({
      id: this.lastID,
      name,
      email,
      phone,
      address,
      role: 'user'
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.get(query, [email, password], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
});

export default router;
