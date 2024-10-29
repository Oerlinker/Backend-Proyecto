const express = require('express');
const router = express.Router();
const { addProveedor, getProveedor, updProveedor, delProveedor, getProveedorByIdController} = require('../controllers/proveedorController');

router.post('/proveedores', addProveedor);
router.get('/proveedores', getProveedor);
router.get('/proveedores/:id', getProveedorByIdController);
router.put('/proveedores/:id', updProveedor);
router.delete('/proveedores/:id', delProveedor);

module.exports = router;