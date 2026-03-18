const CriarModel = require('../models/CriarModel')


// CADASTRO
async function registrar(req, res) {
  const { nome, email, senha, tipo } = req.body;

  if (!nome || !email || !senha || !tipo) {
    return res.status(400).json({ erro: "Campos obrigatórios faltando" });
  }

      const user = await CriarModel.BuscarCadastro(email)

      if (user[0]) {
        return res.status(400).json({ erro: "Email já cadastrado" });
      }


      await CriarModel.criar(nome, email, senha, tipo)

          res.status(201).json({
            mensagem: "Usuário criado com sucesso",
          });
        }

module.exports = { registrar };