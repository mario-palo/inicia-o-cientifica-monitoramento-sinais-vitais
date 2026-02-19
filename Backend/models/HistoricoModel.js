const db = require('../database/banco');

module.exports = {
    async listarTemperatura(){
        const sql = "select temperatura, data_hora_coleta from sinais_vitais order by data_hora_coleta desc"
        const [result] = await db.query(sql)
        return result
    },

    async listarBatimentos(){
        const sql = "select batimento_cardiaco, data_hora_coleta from sinais_vitais order by data_hora_coleta desc"
        const [result] = await db.query(sql)
        return result

    },

    async listarOxigenacao(){
        const sql = "select oxigenacao, data_hora_coleta from sinais_vitais order by data_hora_coleta desc"
        const [result] = await db.query(sql)
        return result
    }
}