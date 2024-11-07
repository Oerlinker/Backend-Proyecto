const express = require('express');
const router = express.Router();
const { addProveedor, getProveedor, updProveedor, delProveedor, getProveedorByIdController} = require('../controllers/proveedorController');
const verificarRol = require('../middleware/verificarRol');
const {decodeToken} = require('../helpers/generateToken');
//protecte routes
router.post('/proveedores',verificarRol([4]), addProveedor);
router.get('/proveedores',verificarRol([4]), getProveedor);
router.get('/proveedores/:id',verificarRol([4]), getProveedorByIdController);
router.put('/proveedores/:id',verificarRol([4]), updProveedor);
router.delete('/proveedores/:id',verificarRol([4]), delProveedor);

module.exports = router;