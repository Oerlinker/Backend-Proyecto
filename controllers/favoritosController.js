const { addFavorito, getFavoritosByUsuario } = require('../models/favoritosModel');

const addFavoritoController = async (req, res) => {
    const { usuarioid, libroid } = req.body;
    try {
        const newFavorito = await addFavorito({ usuarioid, libroid });
        res.status(201).json({ message: 'Favorito added successfully', favorito: newFavorito });
    } catch (error) {
        res.status(500).json({ message: 'Error adding favorito', error });
    }
};

const getFavoritosByUsuarioController = async (req, res) => {
    const { usuarioid } = req.params;
    try {
        const favoritos = await getFavoritosByUsuario(usuarioid);
        res.status(200).json({ favoritos });
    } catch (error) {
        res.status(500).json({ message: 'Error getting favoritos', error });
    }
};

module.exports = {
    addFavoritoController,
    getFavoritosByUsuarioController
};