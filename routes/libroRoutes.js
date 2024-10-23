const express = require('express');
const {
    adLibro,
    getLibro,
    getbyName,
    updLibro,
    delLibro,
    getLibroById
} = require('../controllers/libroController');
const verificarToken=require('../middleware/verificarToken');
const verificarRol= require('../middleware/verificarRol');
const {crearNuevoPrestamo} = require("../controllers/prestamoController");


const router = express.Router();

router.get('/libros', getLibro);
router.get('/libros/:id',getLibroById);
router.get('/search', getbyName);
router.post('/libros',verificarToken,verificarRol([3,4]), adLibro);
router.post('/prestamo/:id', crearNuevoPrestamo);

router.put('/libros/:id', updLibro);
router.delete('/libros/:id', delLibro);

module.exports = router;

