const { createUser, getUserByEmail, createSubscription, createMember } = require('../models/userModel');
const { logUserActivity } = require('../models/userActivityLogModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;
    const rolid = req.body.rol || 1;
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const newUser = await createUser({ nombre, email, password, rolid });
        await logUserActivity(newUser.usuarioid, 'Registro');
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error });
    }
};

// Controlador para crear un miembro
const createMemberForUser = async (req, res) => {
    const { nombre, telefono, direccion, carrera, semestre, registro, usuarioid } = req.body;
    try {
        const memberData = { nombre, telefono, direccion, carrera, semestre, registro, usuarioid };
        await createMember(memberData);
        await logUserActivity(usuarioid, 'Creación de miembro');
        res.status(201).json({ message: 'Miembro creado con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error creando el miembro', error });
    }
};

const updateUserCorreo = async (req, res) => {
    const { id } = req.params;
    const { correo } = req.body;

    try {
        if (!correo) {
            return res.status(400).json({ message: 'El correo es requerido' });
        }

        const correoActualizado = await updateCorreo(id, correo);

        if (correoActualizado) {
            return res.status(200).json({ message: 'Correo actualizado exitosamente' });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el correo del usuario:', error);
        return res.status(500).json({ message: 'Error al actualizar el correo del usuario', error });
    }
};

// Controlador para registrar un nuevo usuario y suscripción
const registerUserWithSubscription = async (req, res) => {
    const { nombre, email, password, telefono, direccion, carrera, semestre, registro } = req.body;
    const rolid = req.body.rol || 1;
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const newUser = await createUser({ nombre, email, password, rolid });
        await logUserActivity(newUser.usuarioid, 'Registro');

        const subscriptionData = {
            usuarioid: newUser.usuarioid,
            fecha_inicio: new Date(),
            fecha_fin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            estado: 'Activa'
        };
        await createSubscription(subscriptionData);

        const memberData = { nombre, telefono, direccion, carrera, semestre, registro, usuarioid: newUser.usuarioid };
        await createMember(memberData);

        res.status(201).json({ message: 'Usuario registrado con éxito y suscripción creada', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUserRoles,
    updateUserPassword,
    updateUserName,
    updateUserCorreo,
    registerUserWithSubscription,
    createMemberForUser
};