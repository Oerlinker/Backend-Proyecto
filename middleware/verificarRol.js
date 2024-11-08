const {jwtDecode} = require("jwt-decode");
const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ mensaje: 'Acceso denegado: No se proporcionó token' });
        }

        try {
            const decoded = jwtDecode(token);
            if (!rolesPermitidos.includes(decoded.rol)) {
                return res.status(403).json({ mensaje: 'Acceso denegado: Rol no permitido' });
            }
            next();
        } catch (error) {
            return res.status(401).json({ mensaje: 'Token inválido' });
        }
    };
};

module.exports = verificarRol;