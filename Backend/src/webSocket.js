const WebSocket = require("ws");
const db = require('../database/banco');

module.exports = function (server) {

  const wss = new WebSocket.Server({
    server,
    path: "/ws"
  });

  wss.on('connection', (ws) => {
    console.log("Dispositivo conectado via WebSocket");

    ws.on('message', async (message) => {
      const dados = JSON.parse(message)
      if (dados.tipo) {
        ws.tipo = dados.tipo
        console.log("tipo conectado: ", ws.tipo)
        return
      }
    })

    ws.on('message', async (message) => {

      try {
        const dados = JSON.parse(message);

        const [rows] = await db.query(
          "SELECT id FROM pacientes WHERE id = ?",
          [dados.paciente_id]
        );

        if (rows.length === 0) {
          ws.send(JSON.stringify({ status: "Paciente não encontrado" }));
          console.log("Paciente não encontrado")
          return;
        }

        const sql = `
          INSERT INTO sinais_vitais 
          (paciente_id, dispositivo_id, batimento_cardiaco, oxigenacao, temperatura) 
          VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
          dados.paciente_id,
          dados.dispositivo_id,
          dados.batimento_cardiaco,
          dados.oxigenacao,
          dados.temperatura
        ];

        await db.execute(sql, values);

        ws.send(JSON.stringify({ status: "recebido" }));
        console.log("cadastrado com sucesso")

        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN && client.tipo == "frontend") {
            client.send(JSON.stringify(dados));
          }
        });

      } catch (error) {
        console.log("Erro ao processar mensagem:", error.message);
        ws.send(JSON.stringify({ status: "erro interno" }));
      }
    });

    ws.on('close', () => {
      console.log("Dispositivo desconectado");
    });
  });

};