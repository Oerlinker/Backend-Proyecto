const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        const userRoleId = req.user.rol;
        if(!req.user||!req.user.rol){
            return res.status(401).json({ mensaje: 'Acceso denegado' });
        }
        if (!rolesPermitidos.includes(userRoleId)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    };
};

module.exports = verificarRol;
