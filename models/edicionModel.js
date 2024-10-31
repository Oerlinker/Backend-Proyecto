const pool = require('../db');

const createEdicion = async ({ isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor }) => {
    try {
        const result = await pool.query(
            `INSERT INTO ediciones (isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor)
             VALUES (
                $1, 
                $2, 
                $3, 
                (SELECT libroid FROM libros WHERE titulo = $4), 
                (SELECT proveedorid FROM proveedores WHERE nombre_proveedor = $5)
             ) RETURNING *`,
            [isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creando la edición', error);
        throw error;
    }
};

const getEdiciones = async () => {
    try {
        const result = await pool.query(
            `SELECT e.edicionid, e.isbn, e.numero_edicion, e.fecha_publicacion,
                    l.titulo AS titulo_libro, 
                    p.nombre_proveedor AS proveedor
             FROM ediciones e
             JOIN libros l ON e.libroid = l.libroid
             JOIN proveedores p ON e.proveedorid = p.proveedorid`
        );
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo las ediciones', error);
        throw error;
    }
};

const getEdicionByISBN = async (isbn) => {
    try {
        const result = await pool.query(
            `SELECT e.edicionid, e.isbn, e.numero_edicion, e.fecha_publicacion,
                    l.titulo AS titulo_libro,
                    p.nombre_proveedor AS proveedor
             FROM ediciones e
             JOIN libros l ON e.libroid = l.libroid
             JOIN proveedores p ON e.proveedorid = p.proveedorid
             WHERE e.isbn = $1`,
            [isbn]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error obteniendo la edición por ISBN', error);
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
    getEdicionByISBN,
    updateEdicion,
    deleteEdicion
};