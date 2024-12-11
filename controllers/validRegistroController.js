
const { createValidRegistro } = require('../models/validRegistroModel');

const createValidRegistroController = async (req, res) => {
    const { registro_number } = req.body;
    try {
        const newRegistro = await createValidRegistro({ registro_number });
        res.status(201).json({ message: 'Valid registro created successfully', registro: newRegistro });
    } catch (error) {
        res.status(500).json({ message: 'Error creating valid registro', error });
    }
};

module.exports = {
    createValidRegistroController,
};

