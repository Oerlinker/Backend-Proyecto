const verificarRol = (rolesPermitidos) => {
    return (req, res, next) => {
        // Verificar si req.user existe y si tiene la propiedad 'rol'
        if (!req.user || !req.user.rol) {
            return res.status(401).json({ mensaje: 'Usuario no autenticado o rol no asignado' });
        }

        // Verificar si el rol del usuario está permitido
        if (!rolesPermitidos.includes(req.user.rol)) {
            return res.status(403).json({ mensaje: 'Acceso denegado' });
        }
        next();
    };
};

