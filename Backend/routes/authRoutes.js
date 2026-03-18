const express = require('express');
const router = express.Router();

const { registrar } = require('../controllers/authController');

// cadastro
router.post('/registrar', registrar);

module.exports = router;