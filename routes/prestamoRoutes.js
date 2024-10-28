const express = require('express');
const { solicitarPrestamo, registrarLibro, obtenerTodosPrestamos, isBookAvailable, obtenerEdiciones } = require('../controllers/prestamoController');
const router = express.Router();



//ruta para crear un prestamo
router.post('/prestamos', solicitarPrestamo);

//ruta para verificar la disponibilidad de un libro
router.get('/prestamos/:id/disponibilidad',isBookAvailable);

//ruta para sacar las ediciones disponibles segun un libro
router.get('/libros/:libroid/ediciones', obtenerEdiciones);


module.exports = router;