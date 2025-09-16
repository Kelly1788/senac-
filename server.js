import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

// === Banco de Dados ===
let db;
(async () => {
  db = await open({
    filename: "./ecommerce.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      cpf TEXT UNIQUE,
      email TEXT UNIQUE,
      senha TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      price REAL,
      category TEXT,
      image TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER,
      name TEXT,
      price REAL,
      image TEXT,
      quantity INTEGER
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER,
      total REAL,
      paymentMethod TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
})();

// === Rotas ===

// Produtos
app.get("/products", async (req, res) => {
  const { category, q } = req.query;
  let query = "SELECT * FROM products";
  let params = [];

  if (category && category !== "all") {
    query += " WHERE category = ?";
    params.push(category);
  }

  if (q) {
    query += params.length ? " AND" : " WHERE";
    query += " name LIKE ?";
    params.push(`%${q}%`);
  }

  const products = await db.all(query, params);
  res.json(products);
});

// Carrinho
app.get("/cart", async (req, res) => {
  const items = await db.all("SELECT * FROM cart");
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  res.json({ items, totalItems, totalPrice });
});

app.post("/cart", async (req, res) => {
  const { id, name, price, image, quantity } = req.body;
  await db.run(
    "INSERT INTO cart (productId, name, price, image, quantity) VALUES (?, ?, ?, ?, ?)",
    [id, name, price, image, quantity]
  );
  res.json({ success: true });
});

app.delete("/cart", async (req, res) => {
  await db.run("DELETE FROM cart");
  res.json({ success: true });
});

// Usuários
app.post("/users", async (req, res) => {
  const { name, cpf, email, senha } = req.body;
  try {
    await db.run(
      "INSERT INTO users (name, cpf, email, senha) VALUES (?, ?, ?, ?)",
      [name, cpf, email, senha]
    );
    res.json({ success: true, message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const user = await db.get(
    "SELECT * FROM users WHERE email = ? AND senha = ?",
    [email, senha]
  );
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: "Credenciais inválidas" });
  }
});

// Pedidos
app.post("/orders", async (req, res) => {
  const { userId, items, total, paymentMethod } = req.body;
  const result = await db.run(
    "INSERT INTO orders (userId, total, paymentMethod) VALUES (?, ?, ?)",
    [userId, total, paymentMethod]
  );
  res.json({ success: true, orderId: result.lastID });
});

// Inicialização
app.listen(port, () => {
  console.log(`🚀 API rodando em http://localhost:${port}`);
});
