import express from "express";
import db from "../db/db.js";

const router = express.Router();

// GET all orders (Admin view)
// GET /api/orders
router.get("/", (req, res) => {
  db.all("SELECT * FROM orders ORDER BY created_at DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET customer orders by email
// GET /api/orders/email/:email
router.get("/email/:email", (req, res) => {
  const { email } = req.params;
  db.all("SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC", [email], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// GET single order details (with items)
// GET /api/orders/:id
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM orders WHERE id = ?", [id], (err, order) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Fetch associated order items
    db.all("SELECT * FROM order_items WHERE order_id = ?", [id], (err, items) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      
      order.items = items;
      res.json(order);
    });
  });
});

// PUT update order status
// PUT /api/orders/:id/status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
    });
  }

  db.run("UPDATE orders SET status = ? WHERE id = ?", [status, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: `Order status updated to ${status}` });
  });
});

export default router;
