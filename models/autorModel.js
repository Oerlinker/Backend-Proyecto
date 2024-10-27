
const pool = require('../db');

// Función para crear un nuevo autor
const createAutor = async ({ Nombre, Biografia, Nacionalidad }) => {
    try {
        const result = await pool.query(
            'INSERT INTO Autor (Nombre, Biografia, Nacionalidad) VALUES ($1, $2, $3) RETURNING *',
            [Nombre, Biografia, Nacionalidad]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creando el autor', error);
        throw error;
    }
};

// Función para obtener todos los autores
const getAutores = async () => {
    try {
        const result = await pool.query('SELECT * FROM Autor');
        return result.rows; // Devolvemos todos los autores encontrados
    } catch (error) {
        console.error('Error obteniendo los autores', error);
        throw error;
    }
};

// Función para obtener un autor por su ID
const getAutorById = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM Autor WHERE AutorID = $1', [id]);
        return result.rows[0]; // Devolvemos el autor encontrado
    } catch (error) {
        console.error('Error obteniendo el autor por ID', error);
        throw error;
    }
};

// Función para actualizar un autor
const updateAutor = async (id, { Nombre, Biografia, Nacionalidad }) => {
    try {
        const result = await pool.query(
            `UPDATE Autor SET Nombre = $1, Biografia = $2, Nacionalidad = $3
             WHERE AutorID = $4 RETURNING *`,
            [Nombre, Biografia, Nacionalidad, id]
        );
        return result.rows[0]; // Devolvemos el autor actualizado
    } catch (error) {
        console.error('Error actualizando el autor', error);
        throw error;
    }
};

// Función para eliminar un autor
const deleteAutor = async (id) => {
    try {
        const result = await pool.query('DELETE FROM Autor WHERE AutorID = $1 RETURNING *', [id]);
        return result.rows[0]; // Devolvemos el autor eliminado
    } catch (error) {
        console.error('Error eliminando el autor', error);
        throw error;
    }
};

module.exports = {
    createAutor,
    getAutores,
    getAutorById,
    updateAutor,
    deleteAutor
};
