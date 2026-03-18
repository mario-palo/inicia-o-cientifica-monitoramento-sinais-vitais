require('dotenv').config()
const express = require("express");
const cors = require("cors");
const http = require("http");

const authRoutes = require('../routes/authRoutes');
const pacienteRoutes = require('../routes/pacientesRoutes');
const historicoRoutes = require('../routes/historicoRoutes')
const verificacaoRoutes = require('../routes/verificacaoRoutes')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/historico', historicoRoutes);
app.use('/verificacao', verificacaoRoutes)
app.use('/pacientes', pacienteRoutes);

// 🔹 Criar servidor HTTP
const server = http.createServer(app);

// 🔹 Importar função que inicia WebSocket
require("../src/webSocket")(server);

server.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta " + process.env.PORT);
});