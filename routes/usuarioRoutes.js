const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, updateUserRoles } = require('../controllers/userController');
const  verificarRol= require('../middleware/verificarRol');

// Ruta para registrar un usuario
router.post('/register', registerUser);

// Ruta para login
router.post('/login', loginUser);

router.put('/users/name/:id', updateUserName);

router.put('/users/correo/:id', updateUserCorreo);

// Ruta protegida: obtener lista de usuarios (solo administradores)
router.get('/users',verificarRol([3,4]), getUser);

// Ruta protegida: actualizar rol de usuario (solo administradores)
router.put('/users/update',verificarRol([3,4]),updateUserRoles);

module.exports = router;
