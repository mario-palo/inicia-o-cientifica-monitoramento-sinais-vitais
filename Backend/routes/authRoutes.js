const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

// cadastro
router.post('/register', authController.registrar);
router.get('/login', authController.login)

module.exports = router;