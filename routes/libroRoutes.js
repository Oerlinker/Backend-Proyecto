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
const router = express.Router();

router.get('/libros', getLibro);
//ruta para el detalle del libro(bookDetaill.js)
router.get('/libros/:id', libroController.getLibroById);
//ruta para el busqueda de libro (books.js)
router.get('/search', searchLibros);
router.post('/libros', adLibro);

router.get('api/review/libro:id', libroController.getReseñas);

router.put('/libros/:id',updLibro);
router.delete('/libros/:id', delLibro);
//ruta para sacar todas la categorias (books.js)
router.get('/api/categorias', libroController.categorias);

//ruta de busqueda avanzada
//router.get('/search', buscarLibros);


module.exports = router;
