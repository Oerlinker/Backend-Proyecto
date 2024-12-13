const pool = require('../db');
const bcrypt = require('bcryptjs');

//ivan
// Función para conservar un libro
const conservarComen = async (reseñaid) => {
    try {
        // Realiza la consulta para actualizar el comentario
        const result = await pool.query(
            `UPDATE reseña SET reportada = false WHERE reseñaid = $1 RETURNING *;`,
            [reseñaid]
        );

        if (result.rowCount === 0) {
            return null;  // Si no se encontró ningún comentario con ese ID
        }

        // Si se encuentra el comentario, devuelve la fila actualizada
        return result.rows[0];
    } catch (error) {
        console.error('Error conservando el comentario', error);
        throw error;
    }
};

// Función para eliminar un libro
const deleteReseña = async (reseñaid) => {
    try {
        const result = await pool.query('DELETE FROM reseña WHERE reseñaid = $1', [reseñaid]);
        return result.rowCount;
    } catch (error) {
        console.error('Error eliminando el libro', error);
        throw error;
    }
};

//ivan
const reportarComentario = async (reseñaid) => {
    try {
        const result = await pool.query(`update reseña set reportada = TRUE where reseñaid = $1;`, [reseñaid]);
        return result.rows[0];
    } catch (error) {
        throw error; // Lanza el error para que el controlador lo maneje.
    }
};
const getReseñas = async () => {
    const query = `SELECT reseña.*, miembros.nombre
                    FROM reseña
                    JOIN miembros
                    ON reseña.miembroid = miembros.miembroid
                    where reseña.reportada = true;`;
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error; // Lanza el error para que el controlador lo maneje.
    }
};

const extensionPrestamo = async (prestamoid, nuevaFecha) => {
    try {
        const result = await pool.query(
            `UPDATE prestamos
             SET fecha_devolucion = $1
             WHERE prestamoid = $2
             RETURNING prestamoid, fecha_devolucion`,
            [nuevaFecha, prestamoid]
        );
        return result.rows[0]; // Retorna el prestamo actualizado
    } catch (error) {
        console.error('Error al actualizar la fecha de devolución:', error);
        throw new Error('Error al actualizar la fecha de devolución.');
    }
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
           SELECT p.prestamoid, l.libroid, l.titulo, e.edicionid, e.numero_edicion, p.fecha_devolucion
            FROM prestamos p
             JOIN ediciones e ON p.edicionid = e.edicionid
               JOIN libros l ON e.libroid = l.libroid
                WHERE p.miembroid = $1 AND p.estado = 'activo';
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
const createUser = async ({nombre, email, password, rol}) => {
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
    const {usuarioid, fecha_inicio, fecha_fin, estado, registro_id} = subscriptionData;
    try {
        await pool.query(
            'INSERT INTO subscripciones (usuarioid, fecha_inicio, fecha_fin, estado, registro_id) VALUES ($1, $2, $3, $4, $5)',
            [usuarioid, fecha_inicio, fecha_fin, estado, registro_id]
        );
    } catch (error) {
        console.error('Error creando la suscripción', error);
        throw error;
    }
};

const createMember = async (memberData) => {
    const {nombre, telefono, direccion, carrera, semestre, registro, usuarioid} = memberData;
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
        const result = await pool.query(`
            SELECT m.miembroid, m.nombre, m.registro, u.correo_electronico AS correo
            FROM Miembros m
            JOIN Usuario u ON m.usuarioid = u.usuarioid
        `);
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo los miembros', error);
        throw error;
    }
};

const getMembersbyID = async (id) => {
    try {
        const result = await pool.query(`
            SELECT m.miembroid, m.nombre, m.telefono, m.direccion, m.carrera, m.semestre, m.registro, u.correo_electronico as correo
            FROM Miembros m
            JOIN Usuario u ON m.usuarioid = u.usuarioid
            WHERE m.miembroid = $1
        `, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error obteniendo el miembro por ID:', error);
        throw error;
    }
};

const updateMemberName = async (id, nombre) => {
    try {
        const result = await pool.query(
            'UPDATE miembros SET nombre = $1 WHERE miembroid = $2 RETURNING *;',
            [nombre, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el nombre del miembro', error);
        throw error;
    }
};

const updateMemberTelefono = async (id, telefono) => {
    try {
        const result = await pool.query(
            'UPDATE miembros SET telefono = $1 WHERE miembroid = $2 RETURNING *;',
            [telefono, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el teléfono del miembro', error);
        throw error;
    }
};

const updateMemberDireccion = async (id, direccion) => {
    try {
        const result = await pool.query(
            'UPDATE miembros SET direccion = $1 WHERE miembroid = $2 RETURNING *;',
            [direccion, id]
        );
        return result.row[0];
    } catch (error){
        console.error('Error actualizando la dirección del miembro', error);
        throw error;
    }
};

const updateMemberCarrera = async (id, carrera) => {
    try {
        const result = await pool.query(
            'UPDATE miembros SET carrera = $1 WHERE miembroid = $2 RETURNING *;',
            [carrera, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando la carrera del miembro', error);
        throw error;
    }
};

const updateMemberSemestre = async (id, semestre) => {
    try {
        const result = await pool.query(
            'UPDATE miembros SET semestre = $1 WHERE miembroid = $2 RETURNING *;',
            [semestre, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el semestre del miembro', error);
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
    getMembersbyID,
    updateMemberName,
    updateMemberTelefono,
    updateMemberDireccion,
    updateMemberCarrera,
    updateMemberSemestre,
    extensionPrestamo,
    reportarComentario,
    getReseñas,
    conservarComen,
    deleteReseña
};