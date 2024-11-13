// middleware/verificarTokenYRol.js
const verificarToken = require('./verificarToken');
const verificarRol = require('./verificarRol');

const verificarTokenYRol = (rolesPermitidos) => {
    return (req, res, next) => {
        verificarToken(req, res, (err) => {
            if (err) {
                return res.status(401).json({ mensaje: 'Token no válido' });
            }
            verificarRol(rolesPermitidos)(req, res, next);
        });
    };
};

module.exports = verificarTokenYRol;