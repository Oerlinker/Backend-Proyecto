
const express = require('express');
const router = express.Router();
const { addAutor, getAutor, getAutorByIdController, updAutor, delAutor } = require('../controllers/autorController');
const verificarRol=require('../middleware/verificarRol')
// Ruta para crear un nuevo autor
router.post('/autores',verificarRol([3,4]), addAutor);

// Ruta para obtener todos los autores
router.get('/autores', getAutor);

// Ruta para obtener un autor por su ID
router.get('/autores/:id', getAutorByIdController);

// Ruta para actualizar un autor por su ID
router.put('/autores/:id',verificarRol([3,4]), updAutor);

// Ruta para eliminar un autor por su ID
router.delete('/autores/:id',verificarRol([3,4]), delAutor);

module.exports = router;
