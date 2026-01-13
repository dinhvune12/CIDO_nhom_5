import mysql from "mysql2/promise";

console.log("DB CONFIG USED:", {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ? "***" : "",
  database: process.env.DB_NAME,
});

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  database: process.env.DB_NAME || "foodfinder",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
