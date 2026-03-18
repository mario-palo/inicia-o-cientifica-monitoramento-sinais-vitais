const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');
//http://localhost:8080/historico/temperatura/1?inicio=2026-03-17 22:40:21&fim=2026-03-17 22:40:50
//http://localhost:8080/historico/tempertaura/1
router.get('/temperatura/:idPaciente', historicoController.enviarTemperatura);

router.get('/batimentos_cardiacos/:idPaciente', historicoController.enviarBatimentos);

router.get('/oxigenacao/:idPaciente', historicoController.enviarOxigenacao);

router.get('/geral/:idPaciente', historicoController.enviarGeral);


module.exports = router;
