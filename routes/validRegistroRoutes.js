const express = require('express');
const router = express.Router();
const { createValidRegistroController,getValidRegistrosController } = require('../controllers/validRegistroController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");

router.post('/valid_registros',verificarTokenYRol[(4)], createValidRegistroController);
router.get('/valid_registros',verificarTokenYRol[(4)], getValidRegistrosController);

module.exports = router;