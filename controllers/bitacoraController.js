const { getBitacora } = require('../models/bitacoraModel');

// Controlador para obtener la bitácora
const fetchBitacora = async (req, res) => {
    try {
        const bitacora = await getBitacora();
        res.status(200).json(bitacora);
    } catch (error) {
        console.error('Error fetching activity log', error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    fetchBitacora
};