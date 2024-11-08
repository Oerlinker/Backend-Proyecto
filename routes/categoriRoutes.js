const express = require('express');
const router = express.Router();
const { addCategoria, getAllCategorias, getCategoriaByIdController, updCategoria, delCategoria } = require('../controllers/categoriaController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");


//protected routes
router.post('/categorias/',verificarTokenYRol([4]), addCategoria);
router.get('/categorias/',verificarTokenYRol([4]), getAllCategorias);
router.get('/categorias/:id',verificarTokenYRol([4]), getCategoriaByIdController);
router.put('/categorias/:id',verificarTokenYRol([4]), updCategoria);
router.delete('/categorias/:id',verificarTokenYRol([4]), delCategoria);

module.exports = router;