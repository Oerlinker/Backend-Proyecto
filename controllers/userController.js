const { createUser, getUserByEmail,getUsers,updateUserRole, updatePassword, updateName, updateCorreo,createMember,createSubscription, getPrestamosActivos, devolverPrestamo, setReseña } = require('../models/userModel');
const { logUserActivity } = require('../models/userActivityLogModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//hacer una reseña
const hacerReseña = async (req, res) => {
    const { miembroid, edicionid, libroid, calificacion, comentario } = req.body;

    try {
        const newReseña = await setReseña(miembroid, edicionid, libroid, calificacion, comentario);
        res.status(201).json({ message: 'Reseña creada con éxito.', data: newReseña });
    } catch (error) {
        console.error('Error al crear la reseña:', error);
        res.status(500).json({ message: 'Error al crear la reseña.' });
    }
};

//adiciones para la nube (gestion de prestamo)

const prestamosActivos = async (req, res) => {
    const { miembroid } = req.params;
    try {
        const prestamos = await getPrestamosActivos(miembroid);
        console.log('prestamos', prestamos);
        if (!prestamos || prestamos.length === 0) {
            return res.status(404).json({ message: 'No tienes préstamos activos.' });
        }

        res.status(200).json(prestamos);
    } catch (error) {
        console.error('Error al obtener préstamos activos:', error);
        res.status(500).json({ message: 'Error al obtener los préstamos activos' });
    }
};

//devolver prestamo manual
const prestamosDevolver = async (req, res) => {
    const { prestamoid } = req.params; // Cambiar de req.body a req.params

    try {
        await devolverPrestamo(prestamoid); // Llama a la función del modelo
        res.status(200).json({ message: 'Préstamo devuelto con éxito.' });
    } catch (error) {
        console.error('Error al devolver el préstamo:', error);
        res.status(500).json({ message: 'Error al devolver el préstamo.' });
    }
};

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
    const { nombre, email, password } = req.body;
    const rolid = req.body.rol||1;
    try {

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const newUser = await createUser({ nombre, email, password,rolid });
        await logUserActivity(newUser.usuarioid, 'Registro');
        res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error en el registro', error });
    }
};

// Controlador para login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log("Email recibido:", email);

    try {
        // Buscar el usuario por email
        const user = await getUserByEmail(email);
        console.log("Usuario encontrado:", user);

        if (!user) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.contraseña);
        console.log("¿Contraseña coincide?", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: 'Credenciales incorrectas' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.usuarioid, miembroid: user.miembroid, nombre: user.nombre_usuario, correo: user.correo_electronico, rol: user.rolid }, 'secretKey', { expiresIn: '1h' });
        console.log("Token generado:", token);

        await logUserActivity(user.usuarioid, 'Inicio de sesión');

        res.status(200).json({ message: 'Login exitoso', token, nombre: user.nombre_usuario });
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ message: 'Error en el login', error });
    }
};

const updateUserRoles = async (req, res) => {
    const { userId, newRole } = req.body;

    console.log('Datos recibidos para actualizar rol:', { userId, newRole });

    try {
        const updatedUser = await updateUserRole(userId, newRole);
        await logUserActivity(userId, `Actualización de rol a ${newRole}`);
        console.log('Usuario actualizado:', updatedUser);
        res.status(200).json({ message: 'Rol actualizado con éxito', user: updatedUser });
    } catch (error) {
        console.error('Error actualizando el rol del usuario:', error);
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
        await logUserActivity(id, `Cambio de contraseña de usuario`);
        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }
};

const updateUserName = async (req, res) => {
    const userId = req.params.id;
    const { nombre } = req.body; // Asegúrate de que el nombre esté en el cuerpo de la solicitud

    try {
        const updatedUser = await updateName(userId, nombre);

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        await logUserActivity(userId, `Cambio de nombre de usuario a ${nombre}`);
        res.status(200).json({ message: 'Nombre actualizado con éxito', user: updatedUser });
    } catch (error) {
        console.error('Error al actualizar el nombre del usuario:', error);
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
        console.error('Error al actualizar el correo del usuario:', error);
        return res.status(500).json({ message: 'Error al actualizar el correo del usuario', error });
    }
};

const createSubscriptionAndMember = async (req, res) => {
    const {usuarioid, nombre, telefono, direccion, carrera, semestre, registro} = req.body;
    try {

        // Insertar datos en la tabla miembros
        const memberData = {nombre, telefono, direccion, carrera, semestre, registro, usuarioid};
        await createMember(memberData);



        // Crear suscripción
        const subscriptionData = {
            usuarioid,
            fecha_inicio: new Date(),
            fecha_fin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            estado: 'Activa'
        };
        await createSubscription(subscriptionData);

        res.status(201).json({message: 'Suscripción y miembro creados con éxito'});
    } catch (error) {
        console.error('Error creando la suscripción y miembro:', error);
        res.status(500).json({message: 'Error creando la suscripción y miembro', error});
    }
};

const getMemberController = async (req, res) => {
    try {
        const members = await getMembers();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo los miembros', error });
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUserRoles,
    updateUserPassword,
    updateUserName,
    updateUserCorreo,
   createSubscriptionAndMember,
    getMemberController,
    prestamosActivos,
    prestamosDevolver,
    hacerReseña
};


