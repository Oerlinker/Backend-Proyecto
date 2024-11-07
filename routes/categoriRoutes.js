const express = require('express');
const router = express.Router();
const { addCategoria, getAllCategorias, getCategoriaByIdController, updCategoria, delCategoria } = require('../controllers/categoriaController');
const verficarRol = require("../middleware/verificarRol");


//protected routes
router.post('/categorias/',verficarRol([4]), addCategoria);
router.get('/categorias/',verficarRol([4]), getAllCategorias);
router.get('/categorias/:id',verficarRol([4]), getCategoriaByIdController);
router.put('/categorias/:id',verficarRol([4]), updCategoria);
router.delete('/categorias/:id',verficarRol([4]), delCategoria);

module.exports = router;