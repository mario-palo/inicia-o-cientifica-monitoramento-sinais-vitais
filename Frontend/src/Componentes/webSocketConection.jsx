const webSocket = require('ws')
const socket = new webSocket('ws://localhost:8080/ws')
socket.onopen = () => { console.log("Conectado ao servidor") }
socket.send(JSON.stringify({ tipo: "frontend" }))

socket.onmessage = (event) => {
    const dados = JSON.parse(event.data)
    console.log(dados)
}

