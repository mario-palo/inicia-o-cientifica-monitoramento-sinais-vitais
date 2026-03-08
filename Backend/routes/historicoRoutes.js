const express = require('express');
const router = express.Router();
const historicoController = require('../controllers/historicoController');

router.get('/temperatura', historicoController.enviarTemperatura);
router.get('/batimentos_cardiacos', historicoController.enviarBatimentos);
router.get('/oxigenacao', historicoController.enviarOxigenacao);
router.get('/geral', historicoController.enviarGeral);


module.exports = router;
