const historico = require('../models/HistoricoModel');
const db = require('../database/banco');

module.exports = {

    async enviarBatimentos(req, res) {
        const dados = await historico.listarBatimentos()
        console.log(dados)
        res.status(200).json(dados)
    }, 

    async enviarOxigenacao(req, res) {
        const dados = await historico.listarOxigenacao()
        console.log(dados)
        res.status(200).json(dados)
    },

    async enviarGeral(req, res) {
        try {
            const { userId } = req.query;

            const sql = `
                SELECT 
                    temperatura, 
                    batimento_cardiaco AS batimentos, 
                    oxigenacao, 
                    data_hora_coleta AS hora 
                FROM sinais_vitais 
                ORDER BY data_hora_coleta ASC
            `;

            const [result] = await db.query(sql);
            
            console.log("Dados encontrados:", result.length);
            
            res.status(200).json(result);
        } catch (error) {
            console.error("Erro interno no controller:", error);
            res.status(500).json({ error: error.message });
        }
    },

    async enviarTemperatura(req, res) {
        const [dados] = await db.query("SELECT temperatura, data_hora_coleta FROM sinais_vitais ORDER BY data_hora_coleta DESC");
        res.status(200).json(dados);
    },
}