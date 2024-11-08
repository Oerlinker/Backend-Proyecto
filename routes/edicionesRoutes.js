const express = require('express');
const router = express.Router();
const { addEdicion,getEdicion,getEdicionByIdController,updEdicion,delEdicion} = require('../controllers/edicionController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");


//protected routes
router.post('/ediciones',verificarTokenYRol([4]), addEdicion);
router.get('/ediciones',verificarTokenYRol([4]), getEdicion);
router.get('/ediciones/:id',verificarTokenYRol([4]), getEdicionByIdController);
router.put('/ediciones/:id',verificarTokenYRol([4]), updEdicion);
router.delete('/ediciones/:id',verificarTokenYRol([4]), delEdicion);

module.exports = router;