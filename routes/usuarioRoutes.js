const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUser, updateUserRoles, updateUserCorreo, updateUserName, updateUserPassword, createSubscriptionAndMember, prestamosActivos, prestamosDevolver, hacerReseña,
    getMember
} = require('../controllers/userController');
const verficarRol = require('../middleware/verificarRol');
//public routes
router.post('/register', registerUser);
router.post('/login', loginUser);


//protected routes
router.get('/users',verficarRol([4]), getUser);
router.post('/create-subscription',verficarRol([1]), createSubscriptionAndMember);
router.put('/users/name/:id',verficarRol([1,2,3,4]), updateUserName);
router.put('/users/email/:id',verficarRol([1,2,3,4]), updateUserCorreo);
router.put('/users/password/:id',verficarRol([1,2,3,4]), updateUserPassword);
router.put('/users/update',verficarRol([4]), updateUserRoles);
router.get('/users/prestamos/activos/:miembroid',verficarRol([2,3,4]), prestamosActivos);
router.post('/users/prestamos/devolver/:prestamoid',verficarRol([2,3,4]), prestamosDevolver);
router.post('/users/review',verficarRol([2,3,4]), hacerReseña);
router.get('/users/members/',verficarRol([3,4]), getMember);



module.exports = router;