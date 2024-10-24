const { createUser, getUserByEmail, getUsers, updateUserRole, updatePassword, updateName, updateCorreo } = require('../models/userModel');
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

// Controlador para login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar el usuario por email
        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.usuarioid, miembroid: user.miembroid, nombre: user.nombre_usuario, correo: user.correo_electronico, rol: user.rolid }, 'secretKey', { expiresIn: '1h' });

        await logUserActivity(user.usuarioid, 'Inicio de sesión');

        res.status(200).json({ message: 'Login exitoso', token, nombre: user.nombre_usuario });
    } catch (error) {
        res.status(500).json({ message: 'Error en el login', error });
    }
};

const updateUserRoles = async (req, res) => {
    const { userId, newRole } = req.body;

    try {
        const updatedUser = await updateUserRole(userId, newRole);
        res.status(200).json({ message: 'Rol actualizado con éxito', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error actualizando el rol', error });
    }
};

const getUser = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los usuarios', error });
    }
};

const updateUserPassword = async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    try {
        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Llama a la función del modelo para actualizar la contraseña en la base de datos
        await updatePassword(id, hashedPassword);

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }
};

const updateUserName = async (req, res) => {
    const userId = req.params.id;
    const { nombre } = req.body;

    try {
        const updatedUser = await updateName(userId, nombre);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Nombre actualizado con éxito', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el nombre del usuario', error });
    }
};

const updateUserCorreo = async (req, res) => {
    const { id } = req.params;
    const { correo } = req.body;

    try {
        // Valida si el correo no está vacío
        if (!correo) {
            return res.status(400).json({ message: 'El correo es requerido' });
        }

        // Actualiza el correo en la base de datos
        const correoActualizado = await updateCorreo(id, correo);

        if (correoActualizado) {
            return res.status(200).json({ message: 'Correo actualizado exitosamente' });
        } else {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el correo del usuario', error });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUserRoles,
    updateUserPassword,
    updateUserName,
    updateUserCorreo
};