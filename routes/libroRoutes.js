const express = require('express');
const {
    adLibro,
    getLibro,
    updLibro,
    delLibro,
    buscarLibros

} = require('../controllers/libroController');
const libroController = require('../controllers/libroController');

const verificarTokenYRol = require("../middleware/verificarTokenYRol");
const router = express.Router();
//public routes
router.get('/libros', getLibro);
router.get('/libros/:id', libroController.getLibroById);
router.get('/api/api/categorias', libroController.categorias);
router.get('/search', buscarLibros);


//protected routes
router.post('/libros',verificarTokenYRol([4]), adLibro);
router.get('api/review/libro:id',verificarTokenYRol([4]), libroController.getReseñas);
router.put('/libros/:id',verificarTokenYRol([4]),updLibro);
router.delete('/libros/:id',verificarTokenYRol([4]), delLibro);



module.exports = router;
