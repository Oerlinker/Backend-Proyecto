const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    };
};

module.exports = verificarRol;
