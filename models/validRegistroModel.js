const pool = require('../db');

const createValidRegistro = async ({ registro_number }) => {
    try {
        const result = await pool.query(
            'INSERT INTO valid_registros (registro_number) VALUES ($1) RETURNING *',
            [registro_number]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating the valid registro', error);
        throw error;
    }
};

module.exports = {
    createValidRegistro
}