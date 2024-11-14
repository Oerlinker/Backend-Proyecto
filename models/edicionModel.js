const pool = require('../db');

// add PDF
const createEdicion = async ({ isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor, pdfFile }) => {
    try {
        const pdfData = pdfFile ? pdfFile.buffer : null; // Guardar el archivo en formato binario
        const result = await pool.query(
            `INSERT INTO ediciones (isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, archivo_pdfbyte)
             VALUES (
                $1, 
                $2, 
                $3, 
                (SELECT libroid FROM libros WHERE titulo = $4), 
                (SELECT proveedorid FROM proveedores WHERE nombre_proveedor = $5),
                $6
             ) RETURNING *`,
            [isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor, pdfData]
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

const updateEdicion = async (id, { isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor, pdfFile }) => {
    try {
        const pdfData = pdfFile ? pdfFile.buffer : null; // Guardar el archivo en formato binario
        const result = await pool.query(
            `UPDATE ediciones
             SET isbn = $1,
                 numero_edicion = $2,
                 fecha_publicacion = $3,
                 libroid = (SELECT libroid FROM libros WHERE titulo = $4),
                 proveedorid = (SELECT proveedorid FROM proveedores WHERE nombre_proveedor = $5),
                 archivo_pdfbyte = $6
             WHERE edicionid = $7
             RETURNING *`,
            [isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor, pdfData, id]
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
    deleteEdicion,
    updateEdicion
};