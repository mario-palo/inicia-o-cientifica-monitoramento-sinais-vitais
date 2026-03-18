const VerificacaoModel = require('../models/VerificacaoModel')

async function confirmarSenha(req, res) {
  const { senha, id } = req.body;

  const result = await VerificacaoModel.VerificarSenha(id)

  console.log(result)
  if (!result[0]) {
    res.status(404).send({ error: "Usuario nao encontrado" })
  }

  if(senha == result[0].senha){
    return res.json({ confirmado: true });

  } else{
     return res.status(401).json({ erro: "Senha incorreta" });
  }


  
}


module.exports = { confirmarSenha }
