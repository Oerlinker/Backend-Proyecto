const jwt = require('jsonwebtoken'); // Importación de jsonwebtoken

const verificarTokenYRol = (rolesPermitidos) => (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Token no proporcionado");
        return res.status(401).json({ mensaje: 'No se encontró el token, acceso denegado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token decodificado:", decoded);

        if (!rolesPermitidos.includes(decoded.rol)) {
            console.log("Rol no permitido:", decoded.rol);
            return res.status(403).json({ mensaje: 'Acceso denegado por rol insuficiente' });
        }

        req.user = decoded;
        next();
    } catch (err) {
        console.log("Error en la verificación del token:", err);
        res.status(400).json({ mensaje: 'Token no válido' });
    }
};

module.exports = verificarTokenYRol;