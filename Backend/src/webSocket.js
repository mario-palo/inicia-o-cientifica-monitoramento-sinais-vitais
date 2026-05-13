const WebSocket = require("ws");
const db = require('../database/banco');

module.exports = function (server) {

  const wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on('connection', (ws) => {
    console.log("Nova conexão estabelecida");
    ws.lastSensorTime = 0;
    ws.on('message', async (message) => {

      try {
        const dados = JSON.parse(message);

        // =====================================================
        // FRONTEND (dashboard)
        // =====================================================
        if (dados.tipo === "frontend") {
          ws.tipo = "frontend";

          console.log("Frontend conectado ao monitoramento");

          return;
        }

        // =====================================================
        // SENSOR BLE (PYTHON)
        // =====================================================
        if (
          dados.temp !== undefined &&
          dados.red !== undefined &&
          dados.ir !== undefined
        ) {

          const now = Date.now();

          // 🔥 bloqueia se passou menos de 1 segundo
          if (now - ws.lastSensorTime < 1000) {
            return;
          }

          ws.lastSensorTime = now;

          ws.tipo = "sensor_ble";

          const spo2 = calculateSpO2(dados.red, dados.ir);

          const payload = {
            tipo: "sensor",
            timestamp: dados.timestamp,
            temperatura: parseInt(dados.temp),
            red: dados.red, 
            ir: dados.ir,
            oxigenacao: parseInt(spo2),
            batimento_cardiaco: 1,
            dispositivo_id: "ESP32_TEMP"
          };

          console.log("📡 Sensor:", payload);

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.tipo === "frontend") {
              client.send(JSON.stringify(payload));
            }
          });

          const sql = `
    INSERT INTO sinais_vitais
    (paciente_id, dispositivo_id, batimento_cardiaco, oxigenacao, temperatura)
    VALUES (?, ?, ?, ?, ?)
  `;

          const values = [
            1,
            payload.dispositivo_id,
            payload.batimento_cardiaco,
            payload.oxigenacao,
            payload.temperatura
          ];

          await db.execute(sql, values);

          return;
        }

        console.log("⚠ Formato desconhecido:", dados);

      } catch (error) {
        console.log("Erro no processamento:", error.message);
      }
    });
  });
};

// =====================================================
// FUNÇÃO SPO2 (BÁSICA - ESTIMATIVA)
// =====================================================
function calculateSpO2(red, ir) {

  if (!red || !ir) return null;

  // Evita divisão inválida
  const ratio = red / ir;

  // Fórmula simplificada (não clínica)
  let spo2 = 110 - (25 * ratio);

  // Limites fisiológicos
  if (spo2 > 100) spo2 = 100;
  if (spo2 < 70) spo2 = 70;

  return parseFloat(spo2.toFixed(2));
}