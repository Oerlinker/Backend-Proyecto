const pool = require('../db');
const bcrypt = require('bcryptjs');

// Función para crear un nuevo usuario
const createUser = async ({ nombre, email, password, rol }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const result = await pool.query(
            'INSERT INTO Usuario (rolid, nombre_usuario, contraseña, correo_electronico) VALUES ($1, $2, $3, $4) RETURNING *',
            [1, nombre, hashedPassword, email]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creando el usuario', error);
        throw error;
    }
};

// Función para buscar usuario por email
const getUserByEmail = async (email) => {
    try {
        const result = await pool.query('SELECT u.*, m.miembroid FROM Usuario u LEFT JOIN miembros m ON u.usuarioid = m.usuarioid WHERE correo_electronico = $1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error buscando el usuario por email', error);
        throw error;
    }
};

const getUsers = async () => {
    try {
        const result = await pool.query('SELECT * FROM Usuario');
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo los usuarios', error);
        throw error;
    }
};

const updateUserRole = async (userId, newRole) => {
    try {
        const result = await pool.query(
            'UPDATE Usuario SET rolid = $1 WHERE usuarioid = $2 RETURNING *',
            [newRole, userId]
        );
        console.log('Resultado de la actualización:', result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el rol del usuario en la base de datos:', error);
        throw error;
    }
};

const updatePassword = async (id, hashedPassword) => {
    const query = 'UPDATE usuario SET contraseña = $1 WHERE usuarioid = $2';
    await pool.query(query, [hashedPassword, id]);
};

const updateName = async (userId, newName) => {
    try {
        const result = await pool.query(
            'UPDATE usuario SET nombre_usuario = $1 WHERE usuarioid = $2 RETURNING *',
            [newName, userId]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el nombre del usuario:', error);
        throw error;
    }
};

const updateCorreo = async (userId, newCorreo) => {
    try {
        const result = await pool.query(
            'UPDATE usuario SET correo_electronico = $1 WHERE usuarioid = $2',
            [newCorreo, userId]
        );
        return result.rowCount > 0;
    } catch (error) {
        console.error('Error actualizando el correo del usuario:', error);
        throw error;
    }
};

// Función para crear una suscripción
const createSubscription = async (subscriptionData) => {
    const { usuarioid, fecha_inicio, fecha_fin, estado } = subscriptionData;
    try {
        await pool.query(
            'INSERT INTO subscripciones (usuarioid, fecha_inicio, fecha_fin, estado) VALUES ($1, $2, $3, $4)',
            [usuarioid, fecha_inicio, fecha_fin, estado]
        );
    } catch (error) {
        console.error('Error creando la suscripción', error);
        throw error;
    }
};

// Función para insertar datos en la tabla miembros
const createMember = async (memberData) => {
    const { nombre, telefono, direccion, carrera, semestre, registro, usuarioid } = memberData;
    try {
        await pool.query(
            'INSERT INTO miembros (nombre, telefono, direccion, carrera, semestre, registro, usuarioid) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [nombre, telefono, direccion, carrera, semestre, registro, usuarioid]
        );
    } catch (error) {
        console.error('Error creando el miembro', error);
        throw error;
    }
};

module.exports = {
    createUser,
    createSubscription,
    createMember,
    getUserByEmail,
    getUsers,
    updateUserRole,
    updatePassword,
    updateName,
    updateCorreo
};