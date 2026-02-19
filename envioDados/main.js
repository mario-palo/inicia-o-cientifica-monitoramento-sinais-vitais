const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080/ws');


ws.on('open', () => {
  console.log('Conectado ao servidor hospitalar');

  setInterval(() => {
    const dados = {
      paciente_id: 1,
      dispositivo_id: "ARDUINO-UTI-01",
      batimento_cardiaco: 60 + Math.floor(Math.random() * 40),
      oxigenacao: 95 + Math.floor(Math.random() * 5),
      temperatura: Number((36 + Math.random() * 2).toFixed(1)),
      data_hora_coleta: new Date().toISOString()
    };

    ws.send(JSON.stringify(dados));
  }, 1000);
});

ws.on('message', (data) => {
  console.log("Resposta do servidor:", data.toString());
});

ws.on('close', () => {
  console.log('Conexão encerrada');
});