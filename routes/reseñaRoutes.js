const express = require('express');
const { reportarReseñaController, obtenerReseñasReportadasController, eliminarReseñaController } = require('../controllers/reseñaController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");

const router = express.Router();

router.post('/reseñas/reportar', verificarTokenYRol([2, 3, 4]), reportarReseñaController);
router.get('/reseñas/reportadas', verificarTokenYRol([3, 4]), obtenerReseñasReportadasController);
router.delete('/reseñas/:id', verificarTokenYRol([3, 4]), eliminarReseñaController);

module.exports = router;