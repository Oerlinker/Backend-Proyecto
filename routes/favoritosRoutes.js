const { addFavoritoController, getFavoritosByUsuarioController } = require('../controllers/favoritosController');
const express = require('express');
const router = express.Router();
const verificarTokenYRol = require('../middleware/verificarTokenYRol');

router.post('/users/favoritos', verificarTokenYRol([2]), addFavoritoController);
router.get('/users/favoritos/:usuarioid', verificarTokenYRol([2]), getFavoritosByUsuarioController);

module.exports = router;