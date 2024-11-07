const express = require('express');
const {
    adLibro,
    getLibro,
    updLibro,
    delLibro,
    searchLibros,
    buscarLibros

} = require('../controllers/libroController');
const libroController = require('../controllers/libroController');
const verificarRol = require("../middleware/verificarRol");
const router = express.Router();
//public routes
router.get('/libros', getLibro);
router.get('/libros/:id', libroController.getLibroById);
router.get('/api/api/categorias', libroController.categorias);
router.get('/search', buscarLibros);


//protected routes
router.post('/libros',verificarRol([4]), adLibro);
router.get('api/review/libro:id',verificarRol([2,4]), libroController.getReseñas);
router.put('/libros/:id',verificarRol([4]),updLibro);
router.delete('/libros/:id',verificarRol([4]), delLibro);



module.exports = router;
