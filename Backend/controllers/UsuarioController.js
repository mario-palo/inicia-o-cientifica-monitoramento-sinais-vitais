const Usuario = require('../models/UsuarioModel');

module.exports = {
  async criar(req, res) {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ error: "Dados obrigatórios ausentes" });
    }

    if (!['MEDICO', 'ENFERMEIRO'].includes(tipo)) {
      return res.status(400).json({ error: "Tipo inválido" });
    }

    const id = await Usuario.criar({ nome, email, senha, tipo });
    return res.status(201).json({ id, message: "Usuário criado" });
  }
};
