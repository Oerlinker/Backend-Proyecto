const pool = require('../db');

const reportarReseña = async (reseñaid) => {
    try {
        const result = await pool.query(
            `UPDATE reseña SET reportada = TRUE WHERE reseñaid = $1 RETURNING *`,
            [reseñaid]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error reportando la reseña:', error);
        throw error;
    }
};

const obtenerReseñasReportadas = async () => {
    try {
        const result = await pool.query(
            `SELECT * FROM reseña WHERE reportada = TRUE`
        );
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo las reseñas reportadas:', error);
        throw error;
    }
};

const eliminarReseña = async (reseñaid) => {
    try {
        const result = await pool.query(
            `DELETE FROM reseña WHERE reseñaid = $1 RETURNING *`,
            [reseñaid]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error eliminando la reseña:', error);
        throw error;
    }
};

module.exports = {
    reportarReseña,
    obtenerReseñasReportadas,
    eliminarReseña
};