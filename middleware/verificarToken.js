const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ mensaje: 'No se encontró el token, acceso denegado' });
    }

    try {
        const decoded = jwt.verify(token, 'secretKey'); // Debe ser la misma clave secreta que usaste para firmar el token
        req.user = decoded; // Adjunta el usuario decodificado a req.user
        next();
    } catch (err) {
        res.status(400).json({ mensaje: 'Token no válido' });
    }
};

module.exports = verificarToken;
