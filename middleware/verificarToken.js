// verificarToken.js
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token después de "Bearer"

    if (!token) {
        return res.status(401).json({ mensaje: 'No se encontró el token, acceso denegado' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(400).json({ mensaje: 'Token no válido' });
    }
};

module.exports = verificarToken;
