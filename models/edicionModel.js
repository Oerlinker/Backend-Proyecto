const pool = require('../db');
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();


const uploadPdf = async (pdfFile) => {
    const fileContent = fs.readFileSync(pdfFile.path);
    const params = {
        Bucket: 'biblioteca-virtual-pdfs', // El nombre de tu bucket de S3
        Key: `ediciones/${Date.now()}_${pdfFile.name}`, // El nombre del archivo PDF
        Body: fileContent,
        ContentType: pdfFile.mimetype,
        ACL: 'public-read', // Hacer el archivo accesible públicamente
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // URL pública del archivo en S3
    } catch (error) {
        console.error('Error subiendo el archivo PDF a S3', error);
        throw error;
    }
};


// add PDF
const createEdicion = async ({ isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor, pdfFile }) => {
    try {
        const pdfUrl = pdfFile ? await uploadPdf(pdfFile) : null;
        const result = await pool.query(
            `INSERT INTO ediciones (isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, archivo_pdf)
             VALUES (
                $1, 
                $2, 
                $3, 
                (SELECT libroid FROM libros WHERE titulo = $4), 
                (SELECT proveedorid FROM proveedores WHERE nombre_proveedor = $5),
                $6
             ) RETURNING *`,
            [isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor, pdfUrl]
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