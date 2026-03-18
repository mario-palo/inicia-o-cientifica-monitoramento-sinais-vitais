const express = require('express');
const router = express.Router();
const VerificacaoController = require('../controllers/VerificacaoController');

router.get('/', VerificacaoController.confirmarSenha);

module.exports = router;