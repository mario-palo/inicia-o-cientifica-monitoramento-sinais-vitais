const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:8080/ws');

let pacienteIdAtual = 1;

ws.on('open', () => {
  console.log('Conectado ao servidor hospitalar - Simulador Ativo');

  setInterval(() => {
    const dados = {
      tipo: "sensor", 
      paciente_id: pacienteIdAtual,
      dispositivo_id: "ARDUINO-UTI-01",
      batimento_cardiaco: 60 + Math.floor(Math.random() * 40),
      oxigenacao: 95 + Math.floor(Math.random() * 5),
      temperatura: Number((36 + Math.random() * 2).toFixed(1)),
      ecg_valor: Math.floor(Math.random() * 100)
    };

    console.log(`Enviando dados do Paciente ID: ${pacienteIdAtual}`);
    ws.send(JSON.stringify(dados));
  }, 1000);
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data.toString());
    
    if (msg.paciente_id || msg.pacienteId) {
      const novoId = Number(msg.paciente_id || msg.pacienteId);
      if (novoId !== pacienteIdAtual) {
        pacienteIdAtual = novoId;
        console.log(`---> Simulador alternado para o Paciente: ${pacienteIdAtual}`);
      }
    }
  } catch (err) {
  }
});

ws.on('close', () => {
  console.log('Conexão encerrada. Tentando reconectar em 5s...');
});