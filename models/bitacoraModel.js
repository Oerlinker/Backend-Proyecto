const pool = require('../db');

// Función para obtener la bitácora
const getBitacora = async () => {
    try {
        const result = await pool.query('SELECT * FROM useractivitylog ORDER BY timestamp DESC');
        return result.rows;
    } catch (error) {
        console.error('Error fetching activity log', error);
        throw error;
    }
};

module.exports = {
    getBitacora
};