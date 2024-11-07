
const express = require('express');
const router = express.Router();
const { addAutor, getAutor, getAutorByIdController, updAutor, delAutor } = require('../controllers/autorController');
const verficarRol = require("../middleware/verificarRol");


//protected routes
router.post('/autores',verficarRol([4]), addAutor);
router.get('/autores',verficarRol([4]), getAutor);
router.get('/autores/:id',verficarRol([4]), getAutorByIdController);
router.put('/autores/:id',verficarRol([4]), updAutor);
router.delete('/autores/:id',verficarRol([4]), delAutor);

module.exports = router;
