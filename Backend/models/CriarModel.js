const db = require('../database/banco');

module.exports = {
     async BuscarCadastro(email){
        const sql = "SELECT id FROM usuarios WHERE email = ?"
        const result = await db.query(sql,[email])
        return result[0]
     }, 
      async criar(nome, email, senha, tipo) {
    const sql = `
      INSERT INTO usuarios (nome, email, senha, tipo)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [nome, email, senha, tipo]);
    return result.insertId;
  }
    
    
}