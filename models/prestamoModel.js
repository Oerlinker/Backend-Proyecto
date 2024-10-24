const pool = require('../db');

//se usa para obtener las ediciones disponibles segun el libro mandado
const verificarDisponibilidadLibro = async (libroid) => {
    try {
        // Consulta para obtener las ediciones disponibles del libro
        const ediciones = await pool.query(`
            SELECT e.edicionid 
            FROM ediciones e
            LEFT JOIN prestamos p ON e.edicionid = p.edicionid
            WHERE e.libroid = $1 AND p.prestamoid IS NULL OR p.estado != 'activo'`,
            [libroid]
        );

        // Devuelve true si hay al menos una edición disponible, false en caso contrario
        return ediciones.rows.length > 0;
    } catch (error) {
        console.error('Error al verificar disponibilidad del libro:', error);
        throw error;
    }
};

//se usa para saber si una edicion está disponible segun su edicion id
const verificarDisponibilidadEdicion = async (edicionid) => {
    try {
        // Consulta para obtener las ediciones disponibles del libro
        const ediciones = await pool.query(`
            SELECT e.edicionid 
            FROM ediciones e
            LEFT JOIN prestamos p ON e.edicionid = p.edicionid 
            WHERE e.edicionid = $1 AND (p.prestamoid IS NULL OR p.estado != 'activo')`,
            [edicionid]
        );

        // Devuelve true si hay al menos una edición disponible, false en caso contrario
        return ediciones.rows.length > 0;
    } catch (error) {
        console.error('Error al verificar disponibilidad del libro:', error);
        throw error;
    }
};

//obtiene todas las ediciones que están disponibles segun un libro
const getEdiciones = async (libroid) => {
    const result = await pool.query(`SELECT e.* 
                                    from ediciones e
                                    left join prestamos p on e.edicionid = p.edicionid
                                    WHERE e.libroid = $1 AND (p.estado IS NULL OR p.estado <> 'activo')`, [libroid]);
    return result.rows;
}

// Crear nuevo préstamo
const crearPrestamo = async (miembroid, edicionid, fechaDevolucion) => {
    console.log('Datos para crear préstamo:', { miembroid, edicionid, fechaDevolucion });
    const query = `
        INSERT INTO prestamos (miembroid, edicionid, fecha_prestamo, fecha_devolucion, estado)
        VALUES ($1, $2, NOW(), $3, 'activo') RETURNING *;
    `;
    const result = await pool.query(query, [miembroid, edicionid, fechaDevolucion]);
    return result.rows[0];  // Retorna el préstamo creado
};



module.exports = {
    crearPrestamo,
    verificarDisponibilidadLibro,
    getEdiciones,
    verificarDisponibilidadEdicion
};