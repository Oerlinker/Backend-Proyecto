const express = require('express');
const router = express.Router();
const { addEdicion,getEdicion,getEdicionByIdController,updEdicion,delEdicion} = require('../controllers/edicionController');
const verficarRol = require("../middleware/verificarRol");

//protected routes
router.post('/ediciones',verficarRol([4]), addEdicion);
router.get('/ediciones',verficarRol([4]), getEdicion);
router.get('/ediciones/:id',verficarRol([4]), getEdicionByIdController);
router.put('/ediciones/:id',verficarRol([4]), updEdicion);
router.delete('/ediciones/:id',verficarRol([4]), delEdicion);

module.exports = router;