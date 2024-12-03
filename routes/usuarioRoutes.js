const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUser,
    updateUserRoles,
    updateUserCorreo,
    updateUserName,
    updateUserPassword,
    createSubscriptionAndMember,
    prestamosActivos,
    prestamosDevolver,
    hacerReseña,
    getMember,
    getMemberbyID,
    updateMemberNameByID,
    updateMemberTelefonoByID,
    updateMemberDireccionByID,
    updateMemberCarreraByID,
    updateMemberSemestreByID,
    extenderPrestamo
} = require('../controllers/userController');

const verificarTokenYRol = require("../middleware/verificarTokenYRol");
//public routes
router.post('/register', registerUser);
router.post('/create-subscription', createSubscriptionAndMember);
router.get('/users/prestamos/activos/:miembroid', prestamosActivos);
//protected routes
router.post('/login', loginUser);
router.get('/users', verificarTokenYRol([4]), getUser);
router.put('/users/name/:id', verificarTokenYRol([1, 2, 3, 4]), updateUserName);
router.put('/users/email/:id', verificarTokenYRol([1, 2, 3, 4]), updateUserCorreo);
router.put('/users/password/:id', verificarTokenYRol([1, 2, 3, 4]), updateUserPassword);
router.put('/users/update', verificarTokenYRol([4]), updateUserRoles);
router.get('/users/prestamos/activos/:miembroid', verificarTokenYRol([2, 3, 4]), prestamosActivos);
router.post('/users/prestamos/devolver/:prestamoid', verificarTokenYRol([2, 3, 4]), prestamosDevolver);
router.post('/users/review', verificarTokenYRol([2, 3, 4]), hacerReseña);
router.get('/users/members/', verificarTokenYRol([3, 4]), getMember);
router.get('/users/members/:id', verificarTokenYRol([2, 4]), getMemberbyID);

//routes for updating members
router.put('/users/members/name/:id', verificarTokenYRol([2]), updateMemberNameByID);
router.put('/users/members/telefono/:id', verificarTokenYRol([2]), updateMemberTelefonoByID);
router.put('/users/members/direccion/:id', verificarTokenYRol([2]), updateMemberDireccionByID);
router.put('/users/members/carrera/:id', verificarTokenYRol([2]), updateMemberCarreraByID);
router.put('/users/members/semestre/:id', verificarTokenYRol([2]), updateMemberSemestreByID);

router.post('/users/prestamos/solicitar-extension/:prestamoid', verificarTokenYRol([2,3,4]), extenderPrestamo);

module.exports = router;