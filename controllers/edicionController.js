const pool = require('../db');
const { createEdicion, getEdiciones, getEdicionByISBN, updateEdicion, deleteEdicion } = require('../models/edicionModel');

const addEdicion = async (req, res) => {
    const { isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor } = req.body;
    const pdfFile = req.file;

    try {
        const nuevaEdicion = await createEdicion({
            isbn,
            numero_edicion,
            fecha_publicacion,
            titulo_libro,
            nombre_proveedor,
            pdfFile
        });
        res.status(201).json({
            message: 'Edición agregada con éxito',
            body: nuevaEdicion
        });
    } catch (error) {
        console.error('Error agregando la edición', error);
        res.status(500).json({ error: 'Error agregando la edición' });
    }
};

const getPdf = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(
            `SELECT archivo_pdfbyte FROM ediciones WHERE edicionid = $1`,
            [id]
        );
        const edicion = result.rows[0];

        if (!edicion || !edicion.archivo_pdfbyte) {
            return res.status(404).json({ message: 'PDF no encontrado' });
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="archivo.pdf"');
        res.send(edicion.archivo_pdfbyte);
    } catch (error) {
        console.error('Error obteniendo PDF:', error);
        res.status(500).json({ error: 'Error obteniendo PDF' });
    }
};

const getEdicion = async (req, res) => {
    try {
        const ediciones = await getEdiciones();
        if (!ediciones) {
            return res.status(404).json({ message: 'No se encontraron ediciones' });
        }
        res.status(200).json(ediciones);
    } catch (error) {
        console.error('Error obteniendo las ediciones', error);
        res.status(500).json({ error: 'Error obteniendo las ediciones' });
    }
};

const getEdicionByIdController = async (req, res) => {
    const { isbn } = req.params;
    try {
        const edicion = await getEdicionByISBN(isbn);
        if (!edicion) {
            return res.status(404).json({ message: 'No se encontró la edición' });
        }
        res.status(200).json(edicion);
    } catch (error) {
        console.error('Error obteniendo la edición por ISBN', error);
        res.status(500).json({ error: 'Error obteniendo la edición por ISBN' });
    }
};

const updEdicion = async (req, res) => {
    const { id } = req.params;
    const { isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor } = req.body;
    const pdfFile = req.file;

    try {
        const edicionActualizada = await updateEdicion(id, { isbn, numero_edicion, fecha_publicacion, titulo_libro, nombre_proveedor, pdfFile });
        if (!edicionActualizada) {
            return res.status(404).json({ error: 'Edicion no encontrada' });
        }
        res.status(200).json({
            message: 'Edicion actualizada con exito',
            body: edicionActualizada
        });
    } catch (error) {
        console.error('Error actualizando la edicion', error);
        res.status(500).json({ error: 'Error actualizando la edicion' });
    }
};
const delEdicion = async (req, res) => {
    const { id } = req.params;
    try {
        const edicionEliminada = await deleteEdicion(id);
        if (!edicionEliminada) {
            return res.status(404).json({ error: 'Edicion no encontrada' });
        }
        res.status(200).json({
            message: 'Edicion eliminada con exito',
            body: edicionEliminada
        });
    } catch (error) {
        console.error('Error eliminando la edicion', error);
        res.status(500).json({ error: 'Error eliminando la edicion' });
    }
};

module.exports = {
    addEdicion,
    getEdicion,
    getEdicionByIdController,
    updEdicion,
    delEdicion,
    getPdf
};

