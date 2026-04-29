import express from "express";
import db from "../db/db.js";

const router = express.Router();

// GET all products or search products
router.get("/", (req, res) => {
  const { search } = req.query;

  if (search) {
    const searchTerm = `%${search}%`;
    const query = `
      SELECT * FROM products 
      WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
    `;
    db.all(query, [searchTerm, searchTerm, searchTerm], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  } else {
    db.all("SELECT * FROM products", [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  }
});

// GET product by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM products WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(row);
  });
});

// POST new product
router.post("/", (req, res) => {
  const { name, description, price, category, color, style, image_url, stock_quantity } = req.body;
  
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Name is required" });
  }
  if (!category || !category.trim()) {
    return res.status(400).json({ error: "Category is required for the AI to find this product" });
  }
  if (price === undefined || isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({ error: "A valid price greater than 0 is required" });
  }
  if (stock_quantity === undefined || isNaN(stock_quantity) || Number(stock_quantity) < 0) {
    return res.status(400).json({ error: "A valid stock quantity (0 or greater) is required" });
  }

  const query = `
    INSERT INTO products (name, description, price, category, color, style, image_url, stock_quantity)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    name, 
    description || null, 
    price, 
    category || null, 
    color || null, 
    style || null, 
    image_url || null, 
    stock_quantity || 0
  ];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ 
      id: this.lastID, 
      name, description, price, category, color, style, image_url, stock_quantity 
    });
  });
});

// PUT update product
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const { name, description, price, category, color, style, image_url, stock_quantity } = req.body;

  const query = `
    UPDATE products 
    SET name = COALESCE(?, name),
        description = COALESCE(?, description),
        price = COALESCE(?, price),
        category = COALESCE(?, category),
        color = COALESCE(?, color),
        style = COALESCE(?, style),
        image_url = COALESCE(?, image_url),
        stock_quantity = COALESCE(?, stock_quantity)
    WHERE id = ?
  `;
  const params = [name, description, price, category, color, style, image_url, stock_quantity, id];

  db.run(query, params, function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product updated successfully", changes: this.changes });
  });
});

// DELETE product
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  
  db.run("DELETE FROM products WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  });
});
// ========================
// SEARCH PRODUCTS (IMPORTANT FOR CHATBOT LATER)
// ========================
router.post("/search", (req, res) => {
  const { category, color, max_price, min_price, style, occasion } = req.body;

  let query = "SELECT * FROM products WHERE 1=1";
  let params = [];

  if (category) {
    query += " AND category = ?";
    params.push(category);
  }

  if (color) {
    query += " AND (name LIKE ? OR description LIKE ? OR color LIKE ?)";
    params.push(`%${color}%`, `%${color}%`, `%${color}%`);
  }

  if (max_price) {
    query += " AND price <= ?";
    params.push(max_price);
  }

  if (min_price) {
    query += " AND price >= ?";
    params.push(min_price);
  }

  if (style) {
    query += " AND (name LIKE ? OR description LIKE ? OR style LIKE ?)";
    params.push(`%${style}%`, `%${style}%`, `%${style}%`);
  }

  if (occasion) {
    query += " AND (name LIKE ? OR description LIKE ?)";
    params.push(`%${occasion}%`, `%${occasion}%`);
  }

  query += " LIMIT 10";

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

export default router;
