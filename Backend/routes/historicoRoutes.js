const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

router.get('/temperatura/:idPaciente', historicoController.enviarTemperatura);
router.get('/batimentos_cardiacos/:idPaciente', historicoController.enviarBatimentos);
router.get('/oxigenacao/:idPaciente', historicoController.enviarOxigenacao);
router.get('/geral/:idPaciente', historicoController.enviarGeral);


module.exports = router;
