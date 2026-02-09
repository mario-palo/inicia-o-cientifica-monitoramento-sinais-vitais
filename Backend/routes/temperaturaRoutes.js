const express = require("express");
const routes = express.Router();
const controller = require('../controllers/TemperaturaController')

routes.post("/sinais", controller.receber);

/*exemplo json post {
  "raw": "Ambient = 25.32*C Object = 36.78*C",
  "timestamp": "2026-02-08T12:34:56Z"
}*/

routes.get("/sinais", controller.listar);

module.exports = routes;