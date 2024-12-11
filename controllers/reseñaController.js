const { reportarReseña, eliminarReseña, obtenerReseñasReportadas } = require('../models/reseñaModel');

const reportarReseñaController = async (req, res) => {
    const { reseñaid, edicionid, libroid } = req.body;

    try {
        const reporte = await reportarReseña(reseñaid, edicionid, libroid);
        res.status(200).json({ message: 'Reseña reportada con éxito', data: reporte });
    } catch (error) {
        console.error('Error reportando la reseña:', error);
        res.status(500).json({ message: 'Error reportando la reseña' });
    }
};

const obtenerReseñasReportadasController = async (req, res) => {
    try {
        const reseñas = await obtenerReseñasReportadas();
        res.status(200).json(reseñas);
    } catch (error) {
        console.error('Error obteniendo las reseñas reportadas:', error);
        res.status(500).json({ message: 'Error obteniendo las reseñas reportadas' });
    }
};

const eliminarReseñaController = async (req, res) => {
    const { reseñaid, edicionid, libroid } = req.params;

    try {
        const reseñaEliminada = await eliminarReseña(reseñaid, edicionid, libroid);
        if (!reseñaEliminada) {
            return res.status(404).json({ message: 'Reseña no encontrada' });
        }
        res.status(200).json({ message: 'Reseña eliminada con éxito', data: reseñaEliminada });
    } catch (error) {
        console.error('Error eliminando la reseña:', error);
        res.status(500).json({ message: 'Error eliminando la reseña' });
    }
};

module.exports = {
    reportarReseñaController,
    obtenerReseñasReportadasController,
    eliminarReseñaController
};
