
const express = require('express');
const router = express.Router();
const { addAutor, getAutor, getAutorByIdController, updAutor, delAutor } = require('../controllers/autorController');

const verificarTokenYRol = require('../middleware/verificarTokenYRol');


//protected routes
router.post('/autores',verificarTokenYRol([4]), addAutor);
router.get('/autores',verificarTokenYRol([4]), getAutor);
router.get('/autores/:id',verificarTokenYRol([4]), getAutorByIdController);
router.put('/autores/:id',verificarTokenYRol([4]), updAutor);
router.delete('/autores/:id',verificarTokenYRol([4]), delAutor);

module.exports = router;
