const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, updateUserRoles, updateUserCorreo, updateUserName, updateUserPassword, createSubscriptionAndMember, prestamosActivos, prestamosDevolver, hacerReseña,
    getMember,
    getByidController
} = require('../controllers/userController');

// Ruta para registrar un usuario
router.post('/register', registerUser);

// Ruta para login
router.post('/login', loginUser);

router.post('/create-subscription', createSubscriptionAndMember);

router.put('/users/name/:id', updateUserName);

router.put('/users/email/:id', updateUserCorreo);

// Ruta protegida: obtener lista de usuarios (solo administradores)
router.get('/users', getUser);

// Ruta protegida: actualizar rol de usuario (solo administradores)
router.put('/users/update', updateUserRoles);

router.put('/users/password/:id', updateUserPassword);

//ruta gestion de prestamos
router.get('/users/prestamos/activos/:miembroid', prestamosActivos);

//ruta de devolver prestamo
router.post('/users/prestamos/devolver/:prestamoid', prestamosDevolver);

//ruta de reseña
router.post('/users/review', hacerReseña);

router.get('/users/members/', getMember);

router.get('/users/:id', getByidController);


module.exports = router;