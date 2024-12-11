const express = require('express');
const { reportarReseñaController, obtenerReseñasReportadasController, eliminarReseñaController } = require('../controllers/reseñaController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");

const router = express.Router();

router.post('/reseñas/reportar', verificarTokenYRol([2]), reportarReseñaController);
router.get('admin/reseñas/reportadas', verificarTokenYRol([3, 4]), obtenerReseñasReportadasController);
router.delete('admin/reseñas/:reseñaid/:edicionid/:libroid', verificarTokenYRol([3, 4]), eliminarReseñaController);

module.exports = router;
