const db = require('../database/banco');

module.exports = {
    async listarTemperatura(){
        const sql = "select temperatura from sinais_vitais order by data_hora_coleta asc"
        const [result] = await db.query(sql)
        return result[0]
    },

    async listarBatimentos(){
        const sql = "select batimento_cardiaco from sinais_vitais order by data_hora_coleta asc"
        const [result] = await db.query(sql)
        return result[0]

    },

    async listarOxigenacao(){
        const sql = "select oxigenacao from sinais_vitais order by data_hora_coleta asc"
        const [result] = await db.query(sql)
        return result[0]

    }
}