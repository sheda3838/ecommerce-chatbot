import db from "./db.js";

function seedProducts() {
  db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
    if (err) {
      console.error("Seed error:", err.message);
      return;
    }

    if (row.count > 0) {
      console.log("Products already seeded, skipping...");
      return;
    }

    console.log("Seeding products...");

    const stmt = db.prepare(`
      INSERT INTO products 
      (name, description, price, category, color, style, stock_quantity)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const products = [
      ["Black Cotton Baseball Cap", "Classic black baseball cap", 24.99, "hat", "black", "casual", 50],
      ["Dark Grey Beanie", "Warm knitted beanie", 19.99, "hat", "grey", "casual", 35],
      ["Wide-Leg Linen Trousers", "Breathable beige linen trousers", 69.99, "trousers", "beige", "casual", 25],
      ["Olive Green Chino Pants", "Comfortable chino pants", 59.99, "trousers", "olive", "casual", 40],
      ["Silver Chain Necklace", "Elegant silver chain", 49.99, "jewelry", "silver", "classic", 100],
      ["Gold Plated Earrings", "Stylish gold earrings", 59.99, "jewelry", "gold", "elegant", 75],
      ["Floral Summer Dress", "Light summer dress", 49.99, "dress", "red", "casual", 30],
      ["Classic White T-Shirt", "Cotton white tee", 19.99, "tshirt", "white", "casual", 200]
    ];

    products.forEach(p => stmt.run(p));

    stmt.finalize();

    console.log("Products seeded successfully");
  });
}

seedProducts();

export default seedProducts;