require('dotenv').config()
const express = require("express");
const cors = require("cors");
const http = require("http");

const tempRoutes = require("../routes/temperaturaRoutes");
const authRoutes = require('../routes/authRoutes');
const usuarioRoutes = require('../routes/usuariosRoutes');
const pacienteRoutes = require('../routes/pacientesRoutes');
const historicoRoutes = require('../routes/historicoRoutes')

const app = express();

app.use(cors());
app.use(express.json());

app.use('/pacientes', pacienteRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/auth', authRoutes);
app.use('/temperatura', tempRoutes);
app.use('/historico', historicoRoutes);


// 🔹 Criar servidor HTTP
const server = http.createServer(app);

// 🔹 Importar função que inicia WebSocket
require("../src/webSocket")(server);

server.listen(process.env.PORT, () => {
  console.log("Servidor rodando na porta " + process.env.PORT);
});