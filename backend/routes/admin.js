import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Admin statistics and management routes
// All routes below are protected by role-based access on the frontend and should be protected by middleware on the backend (optional, but good for security).

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

// 3. Dashboard Statistics
// GET /api/admin/stats
router.get("/stats", (req, res) => {
  const stats = {
    total_products: 0,
    total_orders: 0,
    total_revenue: 0,
    pending_orders: 0,
    recent_orders: []
  };

  db.serialize(() => {
    // 1. Total Products
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (row) stats.total_products = row.count;
    });

    // 2. Total Orders & Pending
    db.get("SELECT COUNT(*) as count, SUM(total_amount) as revenue FROM orders", (err, row) => {
      if (row) {
        stats.total_orders = row.count;
        stats.total_revenue = row.revenue || 0;
      }
    });

    // 3. Pending Orders
    db.get("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'", (err, row) => {
      if (row) stats.pending_orders = row.count;
    });

    // 4. Recent Orders
    db.all("SELECT * FROM orders ORDER BY created_at DESC LIMIT 5", (err, rows) => {
      stats.recent_orders = rows || [];
      res.json(stats);
    });
  });
});

// 4. Sales Insights (Legacy/Specific)
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

// GET /api/admin/chats
router.get("/chats", (req, res) => {
  const query = `
    SELECT m.id, s.session_token as session, m.role, m.content, m.created_at as timestamp 
    FROM chat_messages m
    JOIN chat_sessions s ON m.session_id = s.id
    ORDER BY m.created_at DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

export default router;
