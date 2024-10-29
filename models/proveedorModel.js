const pool = require('../db');

// Crear un nuevo proveedor
const createProveedor = async ({ nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor }) => {
    try {
        const result = await pool.query(
            'INSERT INTO proveedores (nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creando el proveedor', error);
        throw error;
    }
};

// Obtener todos los proveedores
const getProveedores = async () => {
    try {
        const result = await pool.query('SELECT * FROM proveedores');
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo los proveedores', error);
        throw error;
    }
};

// Obtener un proveedor por ID
const getProveedorById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM proveedores WHERE proveedorid = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error obteniendo el proveedor por ID', error);
        throw error;
    }
};

// Actualizar un proveedor
const updateProveedor = async (id, { nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor }) => {
    try {
        const result = await pool.query(
            'UPDATE proveedores SET nombre_proveedor = $1, contacto_proveedor = $2, correo_proveedor = $3, telefono_proveedor = $4, direccion_proveedor = $5 WHERE proveedorid = $6 RETURNING *',
            [nombre_proveedor, contacto_proveedor, correo_proveedor, telefono_proveedor, direccion_proveedor, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el proveedor', error);
        throw error;
    }
};

// Eliminar un proveedor
const deleteProveedor = async (id) => {
    try {
        const result = await pool.query('DELETE FROM proveedores WHERE proveedorid = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error eliminando el proveedor', error);
        throw error;
    }
};

module.exports = {
    createProveedor,
    getProveedores,
    getProveedorById,
    updateProveedor,
    deleteProveedor
};