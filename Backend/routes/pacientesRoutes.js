const express = require('express');
const router = express.Router();

const PacienteController = require('../controllers/PacienteController');

router.post('/', PacienteController.criar);


router.put('/:id', PacienteController.atualizar)

router.get('/:id', PacienteController.buscarPorId);

router.get('/', PacienteController.listarTodos);

router.delete('/:id', PacienteController.excluir);

module.exports = router;
