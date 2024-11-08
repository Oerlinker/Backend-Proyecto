const express = require('express');
const { solicitarPrestamo, isBookAvailable, obtenerEdiciones } = require('../controllers/prestamoController');

const verificarTokenYRol = require("../middleware/verificarTokenYRol");
const router = express.Router();


//protected routes

router.post('/prestamos',verificarTokenYRol([2,3,4]), solicitarPrestamo);
router.get('/prestamos/:id/disponibilidad',verificarTokenYRol([2,3,4]),isBookAvailable);
router.get('/libros/:libroid/ediciones',verificarTokenYRol([2,3,4]), obtenerEdiciones);


module.exports = router;