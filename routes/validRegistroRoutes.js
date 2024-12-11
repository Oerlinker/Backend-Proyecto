const express = require('express');
const router = express.Router();
const { createValidRegistroController } = require('../controllers/validRegistroController');


router.post('/valid_registros', createValidRegistroController);

module.exports = router;