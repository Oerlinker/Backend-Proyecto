const { createProveedor, getProveedores, getProveedorById, updateProveedor, deleteProveedor } = require('../models/proveedorModel');

const addProveedor = async (req, res) => {
    const { nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor } = req.body;
    try {
        const nuevoProveedor = await createProveedor({ nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor });
        res.status(201).json({
            message: 'Proveedor agregado con éxito',
            body: nuevoProveedor
        });
    } catch (error) {
        console.error('Error agregando el proveedor', error);
        res.status(500).json({ error: 'Error agregando el proveedor' });
    }
};

const getProveedor = async (req, res) => {
    try {
        const proveedores = await getProveedores();
        if (!proveedores) {
            return res.status(404).json({ message: 'No se encontraron proveedores' });
        }
        res.status(200).json(proveedores);
    } catch (error) {
        console.error('Error obteniendo los proveedores', error);
        res.status(500).json({ error: 'Error obteniendo los proveedores' });
    }
};

const getProveedorById = async (req, res) => {
    const { id } = req.params;
    try {
        const proveedor = await getProveedorById(id);
        if (!proveedor) {
            return res.status(404).json({ message: 'No se encontró el proveedor' });
        }
        res.status(200).json(proveedor);
    } catch (error) {
        console.error('Error obteniendo el proveedor por ID', error);
        res.status(500).json({ error: 'Error obteniendo el proveedor por ID' });
    }
};

const updProveedor = async (req, res) => {
    const { id } = req.params;
    const { nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor } = req.body;
    try {
        const proveedorActualizado = await updateProveedor(id, { nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor });
        if (!proveedorActualizado) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json({
            message: 'Proveedor actualizado con éxito',
            body: proveedorActualizado
        });
    } catch (error) {
        console.error('Error actualizando el proveedor', error);
        res.status(500).json({ error: 'Error actualizando el proveedor' });
    }
};

const delProveedor = async (req, res) => {
    const { id } = req.params;
    try {
        const proveedorEliminado = await deleteProveedor(id);
        if (!proveedorEliminado) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.status(200).json({
            message: 'Proveedor eliminado con éxito',
            body: proveedorEliminado
        });
    } catch (error) {
        console.error('Error eliminando el proveedor', error);
        res.status(500).json({ error: 'Error eliminando el proveedor' });
    }
};

module.exports = {
    addProveedor,
    getProveedor,
    getProveedorById,
    updProveedor,
    delProveedor
};