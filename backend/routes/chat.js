import express from "express";
import { getAIResponse } from "../services/aiService.js";
import db from "../db/db.js";

const router = express.Router();

// Helper to log chat to database
const logChatToDB = (sessionToken, role, content) => {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM chat_sessions WHERE session_token = ?", [sessionToken], (err, row) => {
      if (err) return reject(err);
      
      const insertMessage = (sessionId) => {
        db.run("INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)", 
          [sessionId, role, content], (err) => err ? reject(err) : resolve());
      };

      if (row) {
        insertMessage(row.id);
      } else {
        db.run("INSERT INTO chat_sessions (session_token) VALUES (?)", [sessionToken], function(err) {
          if (err) return reject(err);
          insertMessage(this.lastID);
        });
      }
    });
  });
};

router.post("/", async (req, res) => {
  try {
    const { message, sessionToken } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Log user message asynchronously
    logChatToDB(sessionToken, "user", message).catch(e => console.error("DB Log error:", e));

    let response = await getAIResponse(message, sessionToken);
    let products = undefined;
    let orders = undefined;
    let cancellation = undefined;

    // Detect [ORDER_LOOKUP: email="..."]
    const orderRegex = /\[ORDER_LOOKUP:\s*email="(.*?)"\]/;
    const orderMatch = response.match(orderRegex);
    if (orderMatch) {
      response = response.replace(orderRegex, "").trim();
      const email = orderMatch[1];
      
      orders = await new Promise((resolve) => {
        db.all("SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC", [email], (err, rows) => {
          resolve(rows || []);
        });
      });
      
      if (orders.length > 0) {
        response = `I found ${orders.length} order${orders.length > 1 ? 's' : ''} for ${email}. Take a look at them below 😊`;
      } else {
        response = `I couldn't find any orders matching the email ${email}. Are you sure that's the one you used?`;
      }
    }

    // Detect [CANCEL_ORDER: id="..."]
    const cancelRegex = /\[CANCEL_ORDER:\s*id="(.*?)"\]/;
    const cancelMatch = response.match(cancelRegex);
    if (cancelMatch) {
      response = response.replace(cancelRegex, "").trim();
      const orderNum = cancelMatch[1];
      
      const order = await new Promise((resolve) => {
        db.get("SELECT * FROM orders WHERE order_number = ?", [orderNum], (err, row) => resolve(row));
      });
      
      if (!order) {
        response = `I couldn't find order #${orderNum}. Please check the number and try again.`;
      } else if (order.status !== 'pending') {
        response = `Order #${orderNum} is currently ${order.status}. Only pending orders can be cancelled.`;
      } else {
        response = `I've located your order #${orderNum}. It's still pending, so I can cancel it for you. Click the button below to confirm!`;
        cancellation = order;
      }
    }

    // Detect [STOCK_CHECK: name="..."]
    const stockRegex = /\[STOCK_CHECK:\s*name="(.*?)"\]/;
    const stockMatch = response.match(stockRegex);
    if (stockMatch) {
      response = response.replace(stockRegex, "").trim();
      const productName = stockMatch[1];
      
      const product = await new Promise((resolve) => {
        db.get("SELECT * FROM products WHERE name LIKE ?", [`%${productName}%`], (err, row) => resolve(row));
      });
      
      if (!product) {
        response = `I couldn't find a product named "${productName}". Could you please double check the name?`;
      } else {
        const qty = product.stock_quantity;
        if (qty > 0) {
          response = `Yes! The ${product.name} is available. We have ${qty} in stock. Would you like me to add it to your cart?`;
        } else {
          response = `I'm sorry, but the ${product.name} is currently out of stock. 😔`;
        }
      }
    }

    // Detect [SEARCH: ...]
    const searchRegex = /\[SEARCH:\s*(.*?)\]/;
    const match = response.match(searchRegex);

    if (match) {
      // Remove SEARCH block from response
      response = response.replace(searchRegex, "").trim();

      // Extract parameters
      const paramsStr = match[1];
      const params = {};
      const paramRegex = /([a-zA-Z_]+)\s*=\s*(?:"([^"]*)"|(\d+))/g;
      
      let pMatch;
      while ((pMatch = paramRegex.exec(paramsStr)) !== null) {
        params[pMatch[1]] = pMatch[2] !== undefined ? pMatch[2] : Number(pMatch[3]);
      }

      // Helper to query database
      const runSearchQuery = (searchParams) => {
        return new Promise((resolve, reject) => {
          let query = "SELECT * FROM products WHERE 1=1";
          let queryParams = [];

          if (searchParams.category) {
            const cleanCat = searchParams.category.replace(/[^a-zA-Z0-9]/g, '');
            query += " AND REPLACE(REPLACE(category, '-', ''), ' ', '') LIKE ?";
            queryParams.push(`%${cleanCat}%`);
          }

          if (searchParams.color) {
            query += " AND (color LIKE ? OR name LIKE ? OR description LIKE ?)";
            queryParams.push(`%${searchParams.color}%`, `%${searchParams.color}%`, `%${searchParams.color}%`);
          }

          if (searchParams.max_price) {
            query += " AND price <= ?";
            queryParams.push(searchParams.max_price);
          }

          if (searchParams.min_price) {
            query += " AND price >= ?";
            queryParams.push(searchParams.min_price);
          }

          if (searchParams.style) {
            query += " AND (style LIKE ? OR name LIKE ? OR description LIKE ?)";
            queryParams.push(`%${searchParams.style}%`, `%${searchParams.style}%`, `%${searchParams.style}%`);
          }

          if (searchParams.occasion) {
            query += " AND (name LIKE ? OR description LIKE ?)";
            queryParams.push(`%${searchParams.occasion}%`, `%${searchParams.occasion}%`);
          }

          query += " LIMIT 10";

          db.all(query, queryParams, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
          });
        });
      };

      // 1. Initial Strict Search
      products = await runSearchQuery(params);

      if (products.length > 0) {
        response = "Perfect! I found some products matching your needs. Take a look below 😊";
      }

      // 2. Fallback 1: Remove Color
      if (products.length === 0 && params.color) {
        const fallbackParams = { ...params, color: undefined };
        products = await runSearchQuery(fallbackParams);
        if (products.length > 0) {
          response = "I couldn't find exact matches, but here are some similar options 😊";
        }
      }

      // 3. Fallback 2: Category Only
      if (products.length === 0 && (params.max_price || params.style)) {
        const fallbackParams = { category: params.category };
        products = await runSearchQuery(fallbackParams);
        if (products.length > 0) {
          response = "I couldn't find exact matches, but here are some similar options 😊";
        }
      }

      // 4. All Fallbacks Failed
      if (products.length === 0) {
        response = "I'm sorry, but I couldn't find any products matching your search right now. 😔";
      }
    }

    // Log AI response asynchronously
    logChatToDB(sessionToken, "assistant", response).catch(e => console.error("DB Log error:", e));

    const jsonRes = { response };
    if (products && products.length > 0) jsonRes.products = products;
    if (orders) jsonRes.orders = orders;
    if (cancellation) jsonRes.cancellation = cancellation;

    res.json(jsonRes);
  } catch (error) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Failed to get AI response" });
  }
});

export default router;
