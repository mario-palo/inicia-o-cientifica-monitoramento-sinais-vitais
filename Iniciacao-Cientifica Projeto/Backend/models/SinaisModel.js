const db = require('../database/banco');

function isoToMySQLDatetime6(iso) {
  return iso.replace('T', ' ').replace('Z', '');
}

module.exports = {
  async inserir(dados) {
    const sql = `
      INSERT INTO sinais_vitais 
      (ambient, objectTemp, timestamp)
      VALUES (?, ?, ?)
    `;

    const values = [
      dados.ambient,
      dados.object,
      isoToMySQLDatetime6(dados.timestamp)
    ];

    const [result] = await db.execute(sql, values);
    return result.insertId;
  },

  async listar() {
    const [rows] = await db.query(`
      SELECT * FROM sinais_vitais
    `);
    return rows;
  }
};