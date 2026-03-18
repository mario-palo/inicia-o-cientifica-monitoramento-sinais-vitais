const db = require('../database/banco');

module.exports = {
  async VerificarSenha(id) {
    const sql ="SELECT senha FROM usuarios WHERE id = ?"

    const result = await db.query(sql, [id])
    return result[0]
  },
};
