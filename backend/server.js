import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import db from "./db/db.js"
import initDb from "./db/init.js"
import seedProducts from "./db/seed.js"
import productsRoutes from "./routes/products.js"
import cartRoutes from "./routes/cart.js"
import ordersRoutes from "./routes/orders.js"
import adminRoutes from "./routes/admin.js"

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", ordersRoutes);

// Admin Routes & Aliases
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", productsRoutes);
app.use("/api/admin/orders", ordersRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

