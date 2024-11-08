const express = require('express');
const router = express.Router();
const { addProveedor, getProveedor, updProveedor, delProveedor, getProveedorByIdController} = require('../controllers/proveedorController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");


//protecte routes
router.post('/proveedores',verificarTokenYRol([4]), addProveedor);
router.get('/proveedores',verificarTokenYRol([4]), getProveedor);
router.get('/proveedores/:id',verificarTokenYRol([4]), getProveedorByIdController);
router.put('/proveedores/:id',verificarTokenYRol([4]), updProveedor);
router.delete('/proveedores/:id',verificarTokenYRol([4]), delProveedor);

module.exports = router;