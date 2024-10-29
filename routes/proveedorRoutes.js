const express = require('express');
const router = express.Router();
const { addProveedor, getProveedor, getProveedorById, updProveedor, delProveedor } = require('../controllers/proveedorController');

router.post('/proveedores', addProveedor);
router.get('/proveedores', getProveedor);
router.get('/proveedores/:id', getProveedorById);
router.put('/proveedores/:id', updProveedor);
router.delete('/proveedores/:id', delProveedor);

module.exports = router;