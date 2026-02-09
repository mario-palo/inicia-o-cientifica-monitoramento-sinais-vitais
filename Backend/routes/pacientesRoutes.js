const express = require('express');
const router = express.Router();

const PacienteController = require('../controllers/PacienteController');
const authSimples = require('../middlewares/authSimples');
const permissaoProfissional = require('../middlewares/permissaoProfissional');

router.post(
  '/',
  authSimples.auth,
  permissaoProfissional,
  PacienteController.criar
);

router.put(
  '/:id',
  authSimples.auth,
  permissaoProfissional,
  PacienteController.atualizar
);

module.exports = router;
