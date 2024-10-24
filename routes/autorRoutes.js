
const express = require('express');
const router = express.Router();
const { addAutor, getAutor, getAutorByIdController, updAutor, delAutor } = require('../controllers/autorController');

// Ruta para crear un nuevo autor
router.post('/autores', addAutor);

// Ruta para obtener todos los autores
router.get('/autores', getAutor);

// Ruta para obtener un autor por su ID
router.get('/autores/:id', getAutorByIdController);

// Ruta para actualizar un autor por su ID
router.put('/autores/:id', updAutor);

// Ruta para eliminar un autor por su ID
router.delete('/autores/:id', delAutor);

module.exports = router;
