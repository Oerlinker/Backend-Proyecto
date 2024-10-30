const { crearPrestamo, registrarLibroPrestamo, obtenerPrestamos, getEdiciones, verificarDisponibilidadLibro, verificarDisponibilidadEdicion } = require('../models/prestamoModel');
const { logUserActivity } = require('../models/userActivityLogModel');

//richiculo
// Crear un nuevo préstamo
const solicitarPrestamo = async (req, res) => {
    const { id, miembroid, edicionid, fechaDevolucion } = req.body;
    console.log('Datos recibidos en la solicitud:', req.body);
    try {
        const disponible = await verificarDisponibilidadEdicion(edicionid)

        if (!disponible) {
            return res.status(400).json({ message: 'El libro ya está prestado'});
        }
        const nuevoPrestamo = await crearPrestamo(miembroid, edicionid, fechaDevolucion);
        await logUserActivity(id, `Prestamo realizado de la edición: ${edicionid}`);
        return res.status(201).json({ message: 'Préstamo creado con éxito', prestamo: nuevoPrestamo });
    } catch (error) {
        console.error('Error al solicitar préstamo:', error);
        return res.status(500).json({ message: 'Error al solicitar el préstamo' });
    }  
};

const obtenerEdiciones = async (req, res) => {
    const { libroid } = req.params; // Obtener libroid desde los parámetros de la URL
    try {
        const ediciones = await getEdiciones(libroid);
        if (ediciones.length === 0) {
            return res.status(404).json({ message: 'No se encontraron ediciones para este libro.' });
        }
        return res.status(200).json(ediciones);
    } catch (error) {
        console.error('Error al obtener ediciones:', error);
        return res.status(500).json({ message: 'Error al obtener las ediciones del libro' });
    }
};

// Verifica la disponibilidad segun el libro que le pasen
const isBookAvailable = async (req, res) => {
    const { id } = req.params;

    try {
        const disponible = await verificarDisponibilidadLibro(id); // Llama a la función del modelo
        res.json({ disponible });
    } catch (error) {
        console.error('Error verificando la disponibilidad del libro:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

//andreculo
// Crear un nuevo préstamo
const crearNuevoPrestamo = async (req, res) => {
    try {
        const { miembroID, edicionID, fechaPrestamo, fechaDevolucion, estado } = req.body;
        const prestamo = await crearPrestamo(miembroID, edicionID, fechaPrestamo, fechaDevolucion, estado);
        res.status(201).json(prestamo);
    } catch (error) {
        console.error('Error creando préstamo en el controlador:', error);
        res.status(500).json({ error: 'Error creando préstamo' });
    }
};

// Registrar libro en préstamo
const registrarLibro = async (req, res) => {
    try {
        const { libroID, prestamoID } = req.body;
        const libroPrestamo = await registrarLibroPrestamo(libroID, prestamoID);
        res.status(201).json(libroPrestamo);
    } catch (error) {
        console.error('Error registrando libro en préstamo en el controlador:', error);
        res.status(500).json({ error: 'Error registrando libro en préstamo' });
    }
};

// Obtener todos los préstamos
const obtenerTodosPrestamos = async (req, res) => {
    try {
        const prestamos = await obtenerPrestamos();
        res.status(200).json(prestamos);
    } catch (error) {
        console.error('Error obteniendo préstamos en el controlador:', error);
        res.status(500).json({ error: 'Error obteniendo préstamos' });
    }
};

module.exports = {
    crearNuevoPrestamo,
    registrarLibro,
    obtenerTodosPrestamos,
    solicitarPrestamo,
    isBookAvailable,
    obtenerEdiciones
};
