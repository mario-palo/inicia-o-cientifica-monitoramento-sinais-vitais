const historico = require('../models/HistoricoModel');

module.exports = {
    async enviarTemperatura(req, res) {
        const dados = historico.listarTemperatura()
        console.log(dados)
        res.status(200).json(dados)
    }, 
    async enviarBatimentos(req, res) {
        const dados = historico.listarBatimentos()
        console.log(dados)
        res.status(200).json(dados)
    }, 

    async enviarOxigenacao(req, res) {
        const dados = historico.listarOxigenacao()
        console.log(dados)
        res.status(200).json(dados)
    }
}