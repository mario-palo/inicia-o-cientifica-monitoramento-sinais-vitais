const db = require('../database/banco');
const authSimples = require('../middlewares/authSimples');

module.exports = {
  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha obrigatórios" });
    }

    const [rows] = await db.execute(
      'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
      [email, senha]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    authSimples.login(rows[0]);

    return res.json({
      message: "Login realizado",
      usuario: {
        id: rows[0].id,
        nome: rows[0].nome,
        tipo: rows[0].tipo
      }
    });
  },

  logout(req, res) {
    authSimples.logout();
    return res.json({ message: "Logout realizado" });
  }
};