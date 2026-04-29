import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import db from "./db/db.js"
import { initDb } from "./db/init.js"
import { seedProducts } from "./db/seed.js"
import productsRoutes from "./routes/products.js"
import cartRoutes from "./routes/cart.js"
import ordersRoutes from "./routes/orders.js"
import adminRoutes from "./routes/admin.js"
import chatRoutes from "./routes/chat.js"

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Initialize Database and Start Server
const startServer = async () => {
  try {
    console.log("Starting server initialization...");
    await initDb();
    await seedProducts();
    console.log("Database initialized and seeded.");
    
    // API Routes
    app.use("/api/products", productsRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/orders", ordersRoutes);
    app.use("/api/chat", chatRoutes);
    app.use("/api/admin", adminRoutes);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("CRITICAL ERROR during server initialization:", err);
    process.exit(1);
  }
};

startServer();
