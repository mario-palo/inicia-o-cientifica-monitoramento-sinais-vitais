const db = require('../database/banco');

module.exports = {
    async listarTemperatura(id){
        try{
            const sql = `select temperatura, data_hora_coleta from sinais_vitais where paciente_id = ? order by data_hora_coleta desc`
        const [result] = await db.query(sql, [id])
        return result
        } catch(error){
            console.log(error)
        }
        
    },

    async listarBatimentos(id){
        try{
             const sql = `select batimento_cardiaco, data_hora_coleta from sinais_vitais where paciente_id = ?  order by data_hora_coleta desc`
        const [result] = await db.query(sql, [id])
        return result
        } catch(error){
            console.log(error)
        }
       

    },

    async listarOxigenacao(id){
        try{
        const sql = `select oxigenacao, data_hora_coleta from sinais_vitais where paciente_id = ?  order by data_hora_coleta desc`
        const [result] = await db.query(sql, [id])
        return result
    } catch(error){
        console.log(error)
    }
    }, 

    async listarGeral(id){

         try {

            const sql = `
                SELECT
                    temperatura, 
                    batimento_cardiaco AS batimentos, 
                    oxigenacao, 
                    data_hora_coleta AS hora 
                FROM sinais_vitais 
                WHERE paciente_id = ?
                ORDER BY data_hora_coleta ASC
            `;

            const [result] = await db.query(sql, [id]);
            return result

        } catch (error) {
            console.log(error);
        }
    }
}