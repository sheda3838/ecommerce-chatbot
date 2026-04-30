import db from "./db.js";

export function seedProducts() {
  return new Promise((resolve, reject) => {
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
      if (err) {
        console.error("Seed error:", err.message);
        return reject(err);
      }

      // Seed default admin first
      const adminPromise = new Promise((resolveAdmin) => {
        db.run(`
          INSERT OR IGNORE INTO users (name, email, password, phone, address, role)
          VALUES ('Admin User', 'admin@gmail.com', 'admin123', '1234567890', 'Admin Office', 'admin')
        `, (err) => {
          if (err) console.error("Admin seed error:", err);
          else console.log("Admin seeding checked.");
          resolveAdmin();
        });
      });

      adminPromise.then(() => {
        if (row.count > 0) {
          console.log("Products already seeded, skipping product seed...");
          return resolve();
        }

        console.log("Seeding products...");

        const stmt = db.prepare(`
          INSERT INTO products 
          (name, description, price, category, color, style, stock_quantity, image_url)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const products = [
          ["Wide-Leg Linen Trousers", "Breathable beige linen trousers", 69.99, "trousers", "beige", "casual", 25, "https://static.reserved.com/media/catalog/product/cache/1200/a4e40ebdc3e371adff845072e1c73f37/5/6/568EI-08X-005-1-968198_2.jpg"],
          ["Olive Green Chino Pants", "Comfortable chino pants", 59.99, "trousers", "olive", "casual", 40, "https://img01.ztat.net/article/spp-media-p1/105c08c643b7453eb9fd6cc9a930a0c7/71beaf9971354b2dbb1057f9bbf3bd11.jpg?imwidth=1800"],
          ["Silver Chain Necklace", "Elegant silver chain", 49.99, "jewelry", "silver", "classic", 100, "https://flaireaccessories.com/cdn/shop/files/thin-curb-silver-chain-unisex-n102-891762.png?v=1734887401&width=1200"],
          ["Gold Plated Earrings", "Stylish gold earrings", 59.99, "jewelry", "gold", "elegant", 75, "https://createdbrilliance.co.uk/cdn/shop/files/BA0074511_test.jpg?v=1740487426&width=1920"],
          ["Floral Summer Dress", "Light summer dress", 49.99, "dress", "red", "casual", 30, "https://cdn.shopify.com/s/files/1/1921/6755/products/viviana-maxi-dress-pre-order-item-40019351240984.jpg?v=1669270641"],
          ["Classic White T-Shirt", "Cotton white tee", 19.99, "tshirt", "white", "casual", 200, "https://i5.walmartimages.com/seo/White-Tshirt-for-Men-Gildan-2000-Men-T-Shirt-Cotton-Men-Shirt-Original-Men-s-Shirts-Best-Mens-Classic-Short-Sleeve-Tee_c9ecef4f-8e1e-4f24-8786-e88f1846255c.a79d87519fef1e4e9d626ff3b446742c.jpeg"],
          ["Red Running Sneakers", "Lightweight athletic shoes", 89.99, "shoe", "red", "sporty", 60, "https://static.nike.com/a/images/t_web_pw_592_v2/f_auto/u_9ddf04c7-2a9a-4d76-add1-d15af8f0263d,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/e5fdf7a0-a71d-4b98-abef-1804c359879f/W+ZMX+VAPORFLY+NEXT%25+4+SE.png"],
          ["Brown Leather Boots", "Durable winter boots", 129.99, "shoe", "brown", "casual", 20, "https://duoboots.com/cdn/shop/files/Haltham_Brown_Leather_Regular_Front_64ba6433-3764-43fe-b735-f4c08c17eb70.jpg?v=1754319405&width=2048"],
          ["Formal Black Oxfords", "Classic dress shoes", 110.00, "shoe", "black", "formal", 40, "https://www.samuel-windsor.co.uk/cdn/shop/products/BV03_FEATURE_LR.jpg?v=1675938351&width=1000"],
          ["Vintage Denim Jacket", "Classic blue denim", 75.00, "jacket", "blue", "casual", 30, "https://m.media-amazon.com/images/I/81c9RipiB0L._AC_UY1000_.jpg"],
          ["Black Leather Motor Jacket", "Real leather biker jacket", 199.99, "jacket", "black", "edgy", 15, "https://m.media-amazon.com/images/I/91JFZBDAZxL.jpg"],
          ["Canvas Tote Bag", "Eco-friendly everyday bag", 15.99, "bag", "cream", "casual", 150, "https://www.vintplus.com/cdn/shop/files/161.jpg?v=1768815717&width=1080"],
          ["Elegant Evening Clutch", "Sparkling party clutch", 45.00, "bag", "silver", "formal", 25, "https://i.ebayimg.com/images/g/e2wAAeSwWABnz~FV/s-l1200.jpg"],
          ["Aviator Sunglasses", "Classic metal frame", 29.99, "accessories", "gold", "classic", 80, "https://www.williampainter.com/cdn/shop/products/Hughes-gold-45.jpg?v=1762525415"],
          ["Minimalist Wristwatch", "Leather strap watch", 150.00, "accessories", "black", "elegant", 10, "https://objectstorage.ap-mumbai-1.oraclecloud.com/n/softlogicbicloud/b/cdn/o/products/FS5308--1--1723714095.jpeg"],
          ["Black Cotton Baseball Cap", "Classic black baseball cap", 24.99, "hat", "black", "casual", 50, "https://m.media-amazon.com/images/I/816vLoiLvRL._AC_UY1000_.jpg"],
          ["Dark Grey Beanie", "Warm knitted beanie", 19.99, "hat", "grey", "casual", 35, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpzIK4j6tyD3NmBi9Wh9CbrrKIqdy-YLIdAA&s"]
        ];

        products.forEach(p => stmt.run(p));
        stmt.finalize();

        console.log("Products and Admin seeded successfully");
        resolve();
      });
    });
  });
}

export default seedProducts;
