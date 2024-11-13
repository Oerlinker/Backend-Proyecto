
const express = require('express');
const router = express.Router();
const { addAutor, getAutor, getAutorByIdController, updAutor, delAutor } = require('../controllers/autorController');

const verificarTokenYRol = require('../middleware/verificarTokenYRol');
//public routes
router.get('/autores', getAutor);
router.get('/autores/:id', getAutorByIdController);

//protected routes
router.post('/autores',verificarTokenYRol([4]), addAutor);
router.put('/autores/:id',verificarTokenYRol([4]), updAutor);
router.delete('/autores/:id',verificarTokenYRol([4]), delAutor);

module.exports = router;
