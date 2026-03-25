const historico = require('../models/HistoricoModel');

module.exports = {

    async enviarBatimentos(req, res) {
        const {inicio, fim} = req.query
        if(inicio && fim){
            const dados = await historico.listarBatimentosIntervalo(req.params.idPaciente, inicio, fim)
            return res.status(200).json(dados)
        } else{
            const dados = await historico.listarBatimentos(req.params.idPaciente)
            return res.status(200).json(dados)
        }
        
    }, 


    async enviarOxigenacao(req, res) {
        const {inicio, fim} = req.query
        if (inicio && fim){
            const dados = await historico.listarOxigenacaoIntervalo(req.params.idPaciente, inicio, fim)
            return res.status(200).json(dados)
        } else{
            const dados = await historico.listarOxigenacao(req.params.idPaciente)
            return res.status(200).json(dados)
        }
        
    },

    async enviarECG(req, res){
        const {inicio, fim} = req.query
        if (inicio && fim){
            const dados = await historico.listarECGIntervalo(req.params.idPaciente, inicio, fim)
            return res.status(200).json(dados)
        } else{
            const dados = await historico.listarECG(req.params.idPaciente)
            return res.status(200).json(dados)
        }
    },

    async enviarGeral(req, res) {
       const dados = await historico.listarGeral(req.params.idPaciente)
       res.status(200).json(dados)
    },

    async enviarTemperatura(req, res) {
        const {inicio, fim} = req.query
        if (inicio && fim){
            const dados = await historico.listarTempIntervalo(req.params.idPaciente, inicio, fim)
            return res.status(200).json(dados)
        } else {
            const dados = await historico.listarTemperatura(req.params.idPaciente)
            return res.status(200).json(dados)
        }
        
        
    },
}