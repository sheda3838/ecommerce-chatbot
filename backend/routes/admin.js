import express from "express";
import db from "../db/db.js";

const router = express.Router();

// 1. Admin Authentication
// POST /api/admin/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "password") {
    // Return a dummy token for frontend validation
    return res.json({ token: "admin-secret-token-123", message: "Login successful" });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

// 2. Dashboard Stats
// GET /api/admin/stats
router.get("/stats", (req, res) => {
  db.serialize(() => {
    let stats = {};

    db.get("SELECT COUNT(*) as total_products FROM products", (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      stats.total_products = row ? row.total_products : 0;
      
      db.get("SELECT COUNT(*) as total_orders FROM orders", (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.total_orders = row ? row.total_orders : 0;

        db.get("SELECT SUM(total_amount) as total_revenue FROM orders", (err, row) => {
          if (err) return res.status(500).json({ error: err.message });
          stats.total_revenue = row && row.total_revenue ? row.total_revenue : 0;

          db.get("SELECT COUNT(*) as pending_orders FROM orders WHERE status = 'pending'", (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.pending_orders = row ? row.pending_orders : 0;

            db.all("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5", (err, rows) => {
              if (err) return res.status(500).json({ error: err.message });
              stats.recent_orders = rows || [];
              
              res.json(stats);
            });
          });
        });
      });
    });
  });
});

// 3. Sales Insights
// GET /api/admin/revenue
router.get("/revenue", (req, res) => {
  db.serialize(() => {
    let revenueData = {};

    db.get("SELECT SUM(total_amount) as total_revenue FROM orders", (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      revenueData.total_revenue = row && row.total_revenue ? row.total_revenue : 0;

      // Group revenue by date
      const query = `
        SELECT date(created_at) as date, SUM(total_amount) as daily_revenue 
        FROM orders 
        GROUP BY date(created_at) 
        ORDER BY date(created_at) ASC
      `;
      
      db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        revenueData.revenue_by_date = rows || [];
        
        res.json(revenueData);
      });
    });
  });
});

export default router;
