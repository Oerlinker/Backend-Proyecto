const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('x-auth-token');

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
