const express = require('express');
const router = express.Router();

const PacienteController = require('../controllers/PacienteController');

/*router.post(
  '/',
  authSimples.auth,
  permissaoProfissional,
  PacienteController.criar
);*/

router.post('/', PacienteController.criar);

/*
router.put(
  '/:id',
  authSimples.auth,
  permissaoProfissional,
  PacienteController.atualizar
);*/

router.put('/:id', PacienteController.atualizar)

router.get('/:id', PacienteController.buscarPorId);

router.get('/', PacienteController.listarTodos);

router.delete('/:id', PacienteController.excluir);

module.exports = router;
