import sqlite3Pkg from "sqlite3";
const sqlite3 = sqlite3Pkg.verbose();

const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("DB Error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

export default db;