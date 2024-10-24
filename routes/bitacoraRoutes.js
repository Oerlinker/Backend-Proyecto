const express = require('express');
const router = express.Router();
const { fetchBitacora } = require('../controllers/bitacoraController');

router.get('/bitacora', fetchBitacora);

module.exports = router;