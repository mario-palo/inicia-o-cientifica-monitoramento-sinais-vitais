const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  timezone: "Z",
  dateStrings: true
});

module.exports = pool;

pool.getConnection()
    .then(conn => {
        console.log("✅ Conexão com o banco MySQL estabelecida com sucesso!");
        conn.release();
    })
    .catch(err => {
        console.error("❌ Erro ao conectar no banco:", err.message);
    });