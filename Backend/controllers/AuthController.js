const CriarModel = require('../models/CriarModel')

module.exports = {
  async registrar(req, res) {
    const { nome, email, senha, tipo } = req.body;

    if (!nome || !email || !senha || !tipo) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" });
    }

    const user = await CriarModel.BuscarCadastro(email)

    if (user[0]) {
      return res.json({ erro: "Email já cadastrado" });
    }


    await CriarModel.criar(nome, email, senha, tipo)

    res.status(201).json({
      mensagem: "Usuário criado com sucesso",
    });
  },

  async login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Campos obrigatórios faltando" })
    }

    const result = await CriarModel.login(email, senha)

    if(result[0].length == 0){
      return res.json({ autorizacao: false })
    }

    res.status(200).json({
      autorizacao: true
    });
  }
}