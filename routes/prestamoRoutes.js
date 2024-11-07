const express = require('express');
const { solicitarPrestamo, isBookAvailable, obtenerEdiciones } = require('../controllers/prestamoController');
const verficarRol = require("../middleware/verificarRol");
const router = express.Router();


//protected routes

router.post('/prestamos',verficarRol([2,3,4]), solicitarPrestamo);
router.get('/prestamos/:id/disponibilidad',verficarRol([2,3,4]),isBookAvailable);
router.get('/libros/:libroid/ediciones',verficarRol([2,3,4]), obtenerEdiciones);


module.exports = router;