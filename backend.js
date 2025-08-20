// backend.js
import express from "express";
import pkg from "pg";
import cors from "cors";

const { Pool } = pkg;
const app = express();
app.use(cors());
app.use(express.json());

// conexão com PostgreSQL
const pool = new Pool({
  user: "postgres",      // <-- troque para seu usuário
  host: "localhost",
  database: "caronas",   // <-- troque para seu banco
  password: "1234",      // <-- troque para sua senha
  port: 5432
});

// rota para listar usuários
app.get("/usuarios", async (req, res) => {
  const result = await pool.query("SELECT * FROM USUARIOS");
  res.json(result.rows);
});

// rota para listar viagens
app.get("/viagens", async (req, res) => {
  const result = await pool.query(`
    SELECT v.id, v.data, COUNT(r.usuario_id) as passageiros
    FROM VIAGENS v
    LEFT JOIN RESERVAS r ON v.id = r.viagem_id
    GROUP BY v.id, v.data
  `);
  res.json(result.rows);
});

// rota para listar reservas
app.get("/reservas", async (req, res) => {
  const result = await pool.query(`
    SELECT r.id, u.nome, u.tipo, v.data
    FROM RESERVAS r
    JOIN USUARIOS u ON r.usuario_id = u.id
    JOIN VIAGENS v ON r.viagem_id = v.id
  `);
  res.json(result.rows);
});

// start server
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});
