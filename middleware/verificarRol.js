const jwt = require('jsonwebtoken');
const {verifyToken} = require('../helpers/generateToken');
const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: 'Acceso denegado: No se proporcionó token' });
        }

        try {
            const decoded = verifyToken(token, process.env.JWT_SECRET);
            req.user = decoded;

            const userRoleId = req.user.rol;
            if (!rolesPermitidos.includes(userRoleId)) {
                return res.status(403).json({ mensaje: 'Acceso denegado: No tiene el rol adecuado' });
            }

            next();
        } catch (error) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
    };
};

module.exports = verificarRol;