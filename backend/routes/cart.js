import express from "express";
import db from "../db/db.js";

const router = express.Router();

// Validate Cart
// POST /api/cart/validate
router.post("/validate", (req, res) => {
  const { items } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const ids = items.map(i => i.product_id);
  const placeholders = ids.map(() => "?").join(",");
  
  db.all(`SELECT id, name, price, stock_quantity FROM products WHERE id IN (${placeholders})`, ids, (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let totalAmount = 0;
    const enrichedItems = [];
    const errors = [];

    items.forEach(item => {
      const product = products.find(p => p.id === item.product_id);
      if (!product) {
        errors.push(`Product ID ${item.product_id} not found`);
        return;
      }

      if (product.stock_quantity < item.quantity) {
        errors.push(`Insufficient stock for ${product.name}`);
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      enrichedItems.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
    });

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    res.json({
      items: enrichedItems,
      totalCartAmount: totalAmount
    });
  });
});

// Checkout (Create Order)
// POST /api/cart/checkout
router.post("/checkout", (req, res) => {
  const { customer_name, customer_email, customer_address, items } = req.body;
  
  if (!customer_name || !customer_email || !customer_address || !items || !items.length) {
    return res.status(400).json({ error: "Missing required fields or empty cart" });
  }

  const ids = items.map(i => i.product_id);
  const placeholders = ids.map(() => "?").join(",");

  db.all(`SELECT id, name, price, stock_quantity FROM products WHERE id IN (${placeholders})`, ids, (err, products) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    let totalAmount = 0;
    const enrichedItems = [];

    // Validation loop
    for (let item of items) {
      const product = products.find(p => p.id === item.product_id);
      if (!product || product.stock_quantity < item.quantity) {
        return res.status(400).json({ error: `Invalid product or insufficient stock for ID ${item.product_id}` });
      }
      totalAmount += product.price * item.quantity;
      enrichedItems.push({
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity
      });
    }

    const orderNumber = "ORD-" + Date.now() + "-" + Math.floor(Math.random() * 1000);

    db.serialize(() => {
      db.run("BEGIN TRANSACTION");

      db.run(`
        INSERT INTO orders (order_number, customer_name, customer_email, customer_address, total_amount)
        VALUES (?, ?, ?, ?, ?)
      `, [orderNumber, customer_name, customer_email, customer_address, totalAmount], function(err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).json({ error: err.message });
        }

        const orderId = this.lastID;
        let itemsProcessed = 0;
        let hasError = false;

        const stmt = db.prepare(`
          INSERT INTO order_items (order_id, product_name, product_price, quantity)
          VALUES (?, ?, ?, ?)
        `);

        enrichedItems.forEach(item => {
          stmt.run([orderId, item.name, item.price, item.quantity], (err) => {
            if (err) hasError = true;
            
            itemsProcessed++;
            if (itemsProcessed === enrichedItems.length) {
              stmt.finalize();
              
              if (hasError) {
                db.run("ROLLBACK");
                return res.status(500).json({ error: "Failed to create order items" });
              }

              // Decrease stock quantity
              const updateStockStmt = db.prepare(`UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?`);
              let stockProcessed = 0;
              let stockError = false;
              
              enrichedItems.forEach(stockItem => {
                updateStockStmt.run([stockItem.quantity, stockItem.product_id], (err) => {
                  if (err) stockError = true;
                  
                  stockProcessed++;
                  if (stockProcessed === enrichedItems.length) {
                     updateStockStmt.finalize();
                     
                     if (stockError) {
                        db.run("ROLLBACK");
                        return res.status(500).json({ error: "Failed to update stock" });
                     }
                     
                     db.run("COMMIT");
                     res.json({
                       message: "Order created successfully",
                       orderNumber: orderNumber,
                       totalAmount: totalAmount
                     });
                  }
                });
              });
            }
          });
        });
      });
    });
  });
});

export default router;
