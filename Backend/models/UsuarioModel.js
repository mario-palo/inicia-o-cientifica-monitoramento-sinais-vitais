const db = require('../database/banco');

module.exports = {
  async criar({ nome, email, senha, tipo }) {
    const sql = `
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [nome, email, senha, tipo]);
    return result.insertId;
  },

  async buscarPorEmail(email) {
    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0];
  }
};
