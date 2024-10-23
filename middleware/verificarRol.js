const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const userRoleId = req.user.role;

        if (!rolesPermitidos.includes(userRoleId)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    };
};

module.exports = verificarRol;
