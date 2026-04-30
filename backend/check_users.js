import db from './db/db.js';

db.all("SELECT id, name, email, role FROM users", (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log(JSON.stringify(rows, null, 2));
  }
  process.exit(0);
});
