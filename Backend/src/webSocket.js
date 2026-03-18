const WebSocket = require("ws");
const db = require('../database/banco');

module.exports = function (server) {
  const wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on('connection', (ws) => {
    console.log("Nova conexão estabelecida");

    ws.on('message', async (message) => {
      try {
        const dados = JSON.parse(message);

        if (dados.tipo === "frontend") {
          ws.tipo = "frontend";
          console.log("Monitorando paciente:", dados.paciente_id);

          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({ paciente_id: dados.paciente_id }));
            }
          });
          return; 
        }

        if (dados.paciente_id && dados.batimento_cardiaco) {
          
          const [rows] = await db.query("SELECT id FROM pacientes WHERE id = ?", [dados.paciente_id]);

          if (rows.length === 0) {
            console.log("Erro: Paciente", dados.paciente_id, "não existe no banco.");
            return;
          }

          const sql = `INSERT INTO sinais_vitais (paciente_id, dispositivo_id, batimento_cardiaco, oxigenacao, temperatura) VALUES (?, ?, ?, ?, ?)`;
          const values = [dados.paciente_id, dados.dispositivo_id, dados.batimento_cardiaco, dados.oxigenacao, dados.temperatura];
          await db.execute(sql, values);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.tipo === "frontend") {
              client.send(JSON.stringify(dados));
            }
          });
        }
      } catch (error) {
        console.log("Erro no processamento:", error.message);
      }
    });
  });
};