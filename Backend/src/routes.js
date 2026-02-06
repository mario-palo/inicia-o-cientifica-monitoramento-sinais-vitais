const express = require("express");
const routes = express.Router();
const controller = require('../controllers/sinaisController')

routes.post("/sinais", controller.receber);
routes.get("/sinais", controller.listar);

module.exports = routes;