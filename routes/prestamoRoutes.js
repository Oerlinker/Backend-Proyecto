const express = require('express');
const { crearNuevoPrestamo, registrarLibro, obtenerTodosPrestamos } = require('../controllers/prestamoController');
const router = express.Router();
const verificarRol= require('../middleware/verificarRol')
const {validationResult} = require("express-validator");
// Ruta para crear un nuevo préstamo
router.post('/prestamos',verificarRol([2,3]), crearNuevoPrestamo);

// Ruta para registrar un libro en un préstamo
router.post('/libroprestamo',verificarRol([3,4]), registrarLibro);

// Ruta para obtener todos los préstamos
router.get('/prestamos',verificarRol([3,4]), obtenerTodosPrestamos);

module.exports = router;
