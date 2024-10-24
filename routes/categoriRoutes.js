const express = require('express');
const router = express.Router();
const { addCategoria, getAllCategorias, getCategoriaByIdController, updCategoria, delCategoria } = require('../controllers/categoriaController');

router.post('/categorias/add', addCategoria);
router.get('/categorias/', getAllCategorias);
router.get('/categorias/:id', getCategoriaByIdController);
router.put('/categorias/:id', updCategoria);
router.delete('/categorias/:id', delCategoria);

module.exports = router;