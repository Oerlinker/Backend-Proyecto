const pool = require('../db');

const addFavorito = async ({usuarioid, libroid}) => {
    try {
        const result = await pool.query(
            'INSERT INTO favoritos (usuarioid, libroid) VALUES ($1, $2) RETURNING *',
            [usuarioid, libroid]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error adding favorito', error);
        throw error;
    }
};

const getFavoritosByUsuario = async (usuarioid) => {
    try {
        const result = await pool.query(
            `SELECT DISTINCT ON (f.libroid) f.favoritoid, f.libroid, l.titulo, f.fecha_agregado
            FROM favoritos f
            JOIN libros l ON f.libroid = l.libroid
            WHERE f.usuarioid = $1
            ORDER BY f.libroid, f.fecha_agregado DESC;`
            ,[usuarioid]);
        return result.rows;
    } catch (error) {
        console.error('Error getting favoritos', error);
        throw error;
    }
};

module.exports = {
    addFavorito,
    getFavoritosByUsuario
};