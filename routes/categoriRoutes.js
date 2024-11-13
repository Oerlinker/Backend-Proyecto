const express = require('express');
const router = express.Router();
const { addCategoria, getAllCategorias, getCategoriaByIdController, updCategoria, delCategoria } = require('../controllers/categoriaController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");
//public routes
router.get('/categorias/', getAllCategorias);
router.get('/categorias/:id', getCategoriaByIdController);

//protected routes
router.post('/categorias/',verificarTokenYRol([4]), addCategoria);
router.put('/categorias/:id',verificarTokenYRol([4]), updCategoria);
router.delete('/categorias/:id',verificarTokenYRol([4]), delCategoria);

module.exports = router;