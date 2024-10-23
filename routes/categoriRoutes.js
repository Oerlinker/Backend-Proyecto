const express = require('express');
const router = express.Router();
const { addCategoria, getAllCategorias, getCategoriaByIdController, updCategoria, delCategoria } = require('../controllers/categoriaController');
const verificarRol= require('../middleware/verificarRol');
router.post('/categorias/add',verificarRol([3,4]), addCategoria);
router.get('/categorias/', getAllCategorias);
router.get('/categorias/:id', getCategoriaByIdController);
router.put('/categorias/:id',verificarRol([3,4]), updCategoria);
router.delete('/categorias/:id',verificarRol([3,4]), delCategoria);

module.exports = router;
