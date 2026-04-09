const WebSocket = require('ws');

const socket = new WebSocket('ws://localhost:8080/ws');

socket.on('open', () => {
    console.log("Conectado ao servidor");
    
    const payload = JSON.stringify({ tipo: "frontend" });
    socket.send(payload);
});

socket.on('message', (data) => {
    try {
        const dados = JSON.parse(data);
        console.log("Dados recebidos:", dados);
    } catch (error) {
        console.error("Erro ao processar mensagem:", error.message);
    }
});

socket.on('error', (error) => {
    console.error("Erro na conexão WebSocket:", error.message);
});

socket.on('close', () => {
    console.log("Conexão encerrada");
});