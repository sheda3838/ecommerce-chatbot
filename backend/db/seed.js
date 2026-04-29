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
      (name, description, price, category, color, style, stock_quantity, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const products = [
      ["Black Cotton Baseball Cap", "Classic black baseball cap", 24.99, "hat", "black", "casual", 50, "https://m.media-amazon.com/images/I/816vLoiLvRL._AC_UY1000_.jpg"],
      ["Dark Grey Beanie", "Warm knitted beanie", 19.99, "hat", "grey", "casual", 35, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpzIK4j6tyD3NmBi9Wh9CbrrKIqdy-YLIdAA&s"],
      ["Wide-Leg Linen Trousers", "Breathable beige linen trousers", 69.99, "trousers", "beige", "casual", 25, "https://static.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/5/6/568EI-08X-005-1-968198_2.jpg"],
      ["Olive Green Chino Pants", "Comfortable chino pants", 59.99, "trousers", "olive", "casual", 40, "https://img01.ztat.net/article/spp-media-p1/105c08c643b7453eb9fd6cc9a930a0c7/71beaf9971354b2dbb1057f9bbf3bd11.jpg?imwidth=1800"],
      ["Silver Chain Necklace", "Elegant silver chain", 49.99, "jewelry", "silver", "classic", 100, "https://flaireaccessories.com/cdn/shop/files/thin-curb-silver-chain-unisex-n102-891762.png?v=1734887401&width=1200"],
      ["Gold Plated Earrings", "Stylish gold earrings", 59.99, "jewelry", "gold", "elegant", 75, "https://perfectstranger.com.au/cdn/shop/files/401307_PS_002.jpg?v=1764231603"],
      ["Floral Summer Dress", "Light summer dress", 49.99, "dress", "red", "casual", 30, "https://cdn.shopify.com/s/files/1/1921/6755/products/viviana-maxi-dress-pre-order-item-40019351240984.jpg?v=1669270641"],
      ["Classic White T-Shirt", "Cotton white tee", 19.99, "tshirt", "white", "casual", 200, "https://i5.walmartimages.com/seo/White-Tshirt-for-Men-Gildan-2000-Men-T-Shirt-Cotton-Men-Shirt-Original-Men-s-Shirts-Best-Mens-Classic-Short-Sleeve-Tee_c9ecef4f-8e1e-4f24-8786-e88f1846255c.a79d87519fef1e4e9d626ff3b446742c.jpeg"]
    ];

    products.forEach(p => stmt.run(p));

    stmt.finalize();

    console.log("Products seeded successfully");
  });
}

seedProducts();

export default seedProducts;