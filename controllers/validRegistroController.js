
const { createValidRegistro,getValidRegistros } = require('../models/validRegistroModel');

const createValidRegistroController = async (req, res) => {
    const { registro_number } = req.body;
    try {
        const newRegistro = await createValidRegistro({ registro_number });
        res.status(201).json({ message: 'Valid registro created successfully', registro: newRegistro });
    } catch (error) {
        res.status(500).json({ message: 'Error creating valid registro', error });
    }
};

const getValidRegistrosController = async (req, res) => {
    try {
        const registros = await getValidRegistros();
        res.status(200).json({ registros });
    } catch (error) {
        res.status(500).json({ message: 'Error getting valid registros', error });
    }
}

module.exports = {
    createValidRegistroController,
    getValidRegistrosController
};

