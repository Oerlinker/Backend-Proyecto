const pool = require('../db');
const bcrypt = require('bcryptjs');

//buscador avanzado
const buscarLibrosAvanzado = async (titulo, categoriaid, autor, calificacion, isbn) => {
    let query = `
        SELECT DISTINCT l.libroid, l.titulo, a.nombre AS autor, COALESCE(AVG(l.promedio_rating), 0) AS calificacion
        FROM libros l
        LEFT JOIN ediciones e ON l.libroid = e.libroid 
        LEFT JOIN reseña r ON e.edicionid = r.edicionid
        LEFT JOIN autor a ON l.autorid = a.autorid
    `;
    
    const conditions = [];
    const params = [];

    if (titulo) {
        conditions.push('l.titulo ILIKE $1'); 
        params.push(`%${titulo}%`);
    }
    if (categoriaid) {
        conditions.push('l.categoriaid = $' + (params.length + 1));
        params.push(parseInt(categoriaid, 10)); // Convertir a número
    }
    if (autor) {
        conditions.push('a.nombre ILIKE $' + (params.length + 1));
        params.push(`%${autor}%`);
    }
    if (isbn) {
        conditions.push('e.isbn = $' + (params.length + 1));
        params.push(isbn);
    }
    if (calificacion) {
        conditions.push('l.promedio_rating >= $' + (params.length + 1)); // Cambiar de r.calificacion a e.promedio_rating
        params.push(calificacion);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Agrupa solo por libroid
    query += ' GROUP BY l.libroid, l.titulo, a.nombre';
        // Debugging
        console.log('Consulta SQL:', query);
        console.log('Parámetros:', params);
    
    // Añadir DISTINCT para eliminar duplicados


    const result = await pool.query(query, params);
    return result.rows; 
};

//hacer reseña
const setReseña = async (miembroid, edicionid, libroid, calificacion, comentario) => {
    const query = `
        INSERT INTO reseña (miembroid, edicionid, libroid, calificacion, comentario, fecha_reseña)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *;
    `;
    const values = [miembroid, edicionid, libroid, calificacion, comentario];
    const result = await pool.query(query, values);
    return result.rows[0];
};

//adicion para gestion de prestamo
const getPrestamosActivos = async (id) => {
    try {
        const prestamos = await pool.query(`
            SELECT p.prestamoid, l.libroid, l.titulo, e.edicionid, e.numero_edicion, fecha_devolucion
            FROM prestamos p, ediciones e, libros l
            WHERE miembroid = $1 AND estado = 'activo' 
            and p.edicionid = e.edicionid and e.libroid = l.libroid

        `, [id]);
        return prestamos.rows;
    } catch (error) {
        console.error('Error obteniendo los prestamos', error);
        throw error;
    }
};

const devolverPrestamo = async (prestamoid) => {
    try {
        await pool.query(`UPDATE prestamos SET estado = 'devuelto' WHERE prestamoid = $1`, [prestamoid]);
    } catch (error) {
        throw error; // Lanza el error para que el controlador lo maneje.
    }
};

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

const getMembers = async () => {
    try {
        const result = await pool.query('SELECT * FROM miembros');
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo los miembros', error);
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
    updateCorreo,
    getPrestamosActivos,
    devolverPrestamo,
    setReseña,
    getMembers,
    buscarLibrosAvanzado
};