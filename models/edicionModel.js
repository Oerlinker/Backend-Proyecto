const pool = require('../db');
const fs = require('fs');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

const uploadPdf = async (pdfFile) => {
    const fileContent = fs.readFileSync(pdfFile.path);
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
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

const updateEdicion = async (id, { isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating, pdfFile }) => {
    try {
        const pdfData = pdfFile ? pdfFile.buffer : null;
        const result = await pool.query(
            `UPDATE ediciones SET isbn = $1, numero_edicion = $2, fecha_publicacion = $3, libroid = $4, proveedorid = $5, total_prestamos = $6, promedio_rating = $7, archivo_pdfbyte = COALESCE($8, archivo_pdfbyte)
             WHERE edicionid = $9 RETURNING *`,
            [isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating, pdfData, id]
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
    deleteEdicion,
    uploadPdf
};