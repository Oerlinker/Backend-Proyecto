const pool = require('../db');

const createEdicion = async ({ edicionid, isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating }) => {
    try {
        const result = await pool.query(
            'INSERT INTO ediciones (edicionid, isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [edicionid, isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creando la edición', error);
        throw error;
    }
};

const getEdiciones = async () => {
    try {
        const result = await pool.query('SELECT * FROM ediciones');
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo las ediciones', error);
        throw error;
    }
};

const getEdicionById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM ediciones WHERE edicionid = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error obteniendo la edición por ID', error);
        throw error;
    }
};

const updateEdicion = async (id, { isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating }) => {
    try {
        const result = await pool.query(
            `UPDATE ediciones SET isbn = $1, numero_edicion = $2, fecha_publicacion = $3, libroid = $4, proveedorid = $5, total_prestamos = $6, promedio_rating = $7
             WHERE edicionid = $8 RETURNING *`,
            [isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando la edición', error);
        throw error;
    }
};

const deleteEdicion = async (id) => {
    try {
        const result = await pool.query('DELETE FROM ediciones WHERE edicionid = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error eliminando la edición', error);
        throw error;
    }
};

module.exports = {
    createEdicion,
    getEdiciones,
    getEdicionById,
    updateEdicion,
    deleteEdicion
};