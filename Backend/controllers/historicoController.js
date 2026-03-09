const historico = require('../models/HistoricoModel');

module.exports = {

    async enviarBatimentos(req, res) {
        const dados = await historico.listarBatimentos(req.params.idPaciente)
        res.status(200).json(dados)
    }, 

    async enviarOxigenacao(req, res) {
        const dados = await historico.listarOxigenacao(req.params.idPaciente)
        res.status(200).json(dados)
    },

    async enviarGeral(req, res) {
       const dados = await historico.listarGeral(req.params.idPaciente)
       res.status(200).json(dados)
    },

    async enviarTemperatura(req, res) {
        const dados = await historico.listarTemperatura(req.params.idPaciente)
        res.status(200).json(dados)
    },
}