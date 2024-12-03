const {
    createUser,
    getUserByEmail,
    getUsers,
    updateUserRole,
    updatePassword,
    updateName,
    updateCorreo,
    createMember,
    createSubscription,
    getPrestamosActivos,
    devolverPrestamo,
    setReseña,
    getMembers,
    getMembersbyID,
    updateMemberName,
    updateMemberTelefono,
    updateMemberDireccion,
    updateMemberCarrera,
    updateMemberSemestre,
    extensionPrestamo
} = require('../models/userModel');
const {logUserActivity} = require('../models/userActivityLogModel');
const bcrypt = require('bcryptjs');
const {tokenSing} = require('../helpers/generateToken');
const pool = require('../db');
const { prestamoPorId } = require('../models/prestamoModel');
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const extenderPrestamo = async (req, res) => {
    const { prestamoid } = req.params;
    try {
        const prestamo = await prestamoPorId(prestamoid);
        console.log("Fecha de devolución original:", prestamo.fecha_devolucion);

        // Verifica si la fecha de devolución es válida
        const fechaDevolucion = new Date(prestamo.fecha_devolucion);
        
        if (isNaN(fechaDevolucion.getTime())) {
            return res.status(400).json({ message: 'Fecha de devolución inválida.' });
        }

        const nuevaFecha = new Date(fechaDevolucion);
        nuevaFecha.setDate(nuevaFecha.getDate() + 7); // Extiende 7 días la fecha

        // Si la nueva fecha es posterior a la fecha de devolución permitida, retorna error
        const fechaMaxima = new Date(fechaDevolucion);
        fechaMaxima.setDate(fechaMaxima.getDate() + 7); // Límite de extensión a 7 días

        if (nuevaFecha > fechaMaxima) {
            return res.status(400).json({ message: 'La extensión excede el límite permitido.' });
        }

        // Convertir la fecha a formato YYYY-MM-DD
        const nuevaFechaFormatted = nuevaFecha.toISOString().split('T')[0];

        const prestamoNuevaFecha = await extensionPrestamo(prestamoid, nuevaFechaFormatted);
        res.status(200).json(prestamoNuevaFecha);

    } catch (error) {
        console.error('Error al extender el préstamo:', error);
        res.status(500).json({ message: 'Error al extender el préstamo.' });
    }
};
//hacer una reseña
const hacerReseña = async (req, res) => {
    const {id, miembroid, edicionid, libroid, calificacion, comentario} = req.body;

    try {
        const newReseña = await setReseña(miembroid, edicionid, libroid, calificacion, comentario);
        res.status(201).json({message: 'Reseña creada con éxito.', data: newReseña});
    } catch (error) {
        console.error('Error al crear la reseña:', error);
        res.status(500).json({message: 'Error al crear la reseña.'});
    }
};

//adiciones para la nube (gestion de prestamo)

const prestamosActivos = async (req, res) => {
    const {miembroid} = req.params;
    try {
        const prestamos = await getPrestamosActivos(miembroid);
        console.log('prestamos', prestamos);
        if (!prestamos || prestamos.length === 0) {
            return res.status(404).json({message: 'No tienes préstamos activos.'});
        }

        res.status(200).json(prestamos);
    } catch (error) {
        console.error('Error al obtener préstamos activos:', error);
        res.status(500).json({message: 'Error al obtener los préstamos activos'});
    }
};

//devolver prestamo manual
const prestamosDevolver = async (req, res) => {
    const {prestamoid, id, edicionid} = req.params;

    try {
        await devolverPrestamo(prestamoid); // Llama a la función del modelo
        res.status(200).json({message: 'Préstamo devuelto con éxito.'});
    } catch (error) {
        console.error('Error al devolver el préstamo:', error);
        res.status(500).json({message: 'Error al devolver el préstamo.'});
    }
};

// Controlador para registrar un nuevo usuario
const registerUser = async (req, res) => {
    const {nombre, email, password} = req.body;
    const rolid = req.body.rol || 1;
    try {

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({message: 'El usuario ya existe'});
        }

        const newUser = await createUser({nombre, email, password, rolid});
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await logUserActivity(newUser.usuarioid, `Registro de nuevo usuario`, userIp);
        res.status(201).json({message: 'Usuario registrado con éxito', user: newUser});
    } catch (error) {
        res.status(500).json({message: 'Error en el registro', error});
    }
};

// Controlador para login
const loginUser = async (req, res) => {
    const {email, password} = req.body;

    console.log("Email recibido:", email);

    try {
        // Buscar el usuario por email
        const user = await getUserByEmail(email);
        console.log("Usuario encontrado:", user);

        if (!user) {
            return res.status(400).json({message: 'Credenciales incorrectas'});
        }

        // Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.contraseña);
        console.log("¿Contraseña coincide?", isMatch);

        if (!isMatch) {
            return res.status(400).json({message: 'Credenciales incorrectas'});
        }

        // Generar el token JWT
        const token = tokenSing({
            id: user.usuarioid,
            miembroid: user.miembroid,
            nombre: user.nombre_usuario,
            correo: user.correo_electronico,
            rol: user.rolid
        }, '1h');
        console.log("Token generado:", token);

        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await logUserActivity(user.usuarioid, 'Inicio de sesión', userIp);

        res.status(200).json({message: 'Login exitoso', token, nombre: user.nombre_usuario});
    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({message: 'Error en el login', error});
    }
};

const updateUserRoles = async (req, res) => {
    const {userId, newRole} = req.body;

    console.log('Datos recibidos para actualizar rol:', {userId, newRole});

    try {
        const updatedUser = await updateUserRole(userId, newRole);
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await logUserActivity(userId, `Actualización de rol a ${newRole}`, userIp);
        console.log('Usuario actualizado:', updatedUser);
        res.status(200).json({message: 'Rol actualizado con éxito', user: updatedUser});
    } catch (error) {
        console.error('Error actualizando el rol del usuario:', error);
        res.status(500).json({message: 'Error actualizando el rol', error});
    }
};

const getUser = async (req, res) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: 'Error obteniendo los usuarios', error});
    }
};

const updateUserPassword = async (req, res) => {
    const {id} = req.params;
    const {password} = req.body;

    try {
        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Llama a la función del modelo para actualizar la contraseña en la base de datos
        await updatePassword(id, hashedPassword);
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await logUserActivity(id, 'Cambio de contraseña de usuario', userIp);
        res.status(200).json({message: 'Contraseña actualizada con éxito'});
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({error: 'Error al actualizar la contraseña'});
    }
};

const updateUserName = async (req, res) => {
    const userId = req.params.id;
    const {nombre} = req.body; // Asegúrate de que el nombre esté en el cuerpo de la solicitud

    try {
        const updatedUser = await updateName(userId, nombre);

        if (!updatedUser) {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await logUserActivity(userId, `Cambio de nombre de usuario a: ${nombre}`, userIp);
        res.status(200).json({message: 'Nombre actualizado con éxito', user: updatedUser});
    } catch (error) {
        console.error('Error al actualizar el nombre del usuario:', error);
        res.status(500).json({message: 'Error al actualizar el nombre del usuario', error});
    }
};

const updateUserCorreo = async (req, res) => {
    const {id} = req.params;
    const {correo} = req.body;

    try {
        // Valida si el correo no está vacío
        if (!correo) {
            return res.status(400).json({message: 'El correo es requerido'});
        }

        // Actualiza el correo en la base de datos
        const correoActualizado = await updateCorreo(id, correo);

        if (correoActualizado) {
            const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            await logUserActivity(id, `Cambio de correo a: ${correo}`, userIp);
            return res.status(200).json({message: 'Correo actualizado exitosamente'});
        } else {
            return res.status(404).json({message: 'Usuario no encontrado'});
        }
    } catch (error) {
        console.error('Error al actualizar el correo del usuario:', error);
        return res.status(500).json({message: 'Error al actualizar el correo del usuario', error});
    }
};

const createSubscriptionAndMember = async (req, res) => {
    const {usuarioid, nombre, telefono, direccion, carrera, semestre, registro} = req.body;

    console.log('Request payload:', req.body); // Log the entire request payload

    try {
        if (!usuarioid) {
            return res.status(400).json({message: 'Usuario ID es requerido.'});
        }

        const validRegistro = await pool.query(
            'SELECT registro_id FROM valid_registros WHERE registro_number = $1 AND is_used = FALSE',
            [registro]
        );

        if (validRegistro.rowCount === 0) {
            return res.status(400).json({message: 'Registro inválido o en uso.'});
        }

        const registro_id = validRegistro.rows[0].registro_id;

        const memberData = {nombre, telefono, direccion, carrera, semestre, registro, usuarioid};
        await createMember(memberData);

        const subscriptionData = {
            usuarioid,
            fecha_inicio: new Date(),
            fecha_fin: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            estado: 'Activa',
            registro_id,
        };
        await createSubscription(subscriptionData);

        await pool.query('UPDATE valid_registros SET is_used = TRUE WHERE registro_id = $1', [registro_id]);

        const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        await logUserActivity(usuarioid, 'Nuevo suscriptor/miembro', userIp);

        res.status(201).json({message: 'Suscripción y miembro creados con éxito'});
    } catch (error) {
        console.error('Error creando la suscripción y miembro:', error);
        res.status(500).json({message: 'Error creando la suscripción y miembro', error});
    }
};

const getMember = async (req, res) => {
    try {
        const members = await getMembers();
        res.status(200).json(members);
    } catch (error) {
        res.status(500).json({message: 'Error obteniendo los miembros', error});
    }
};
const getMemberbyID = async (req, res) => {
    try {
        const memberID = req.params.id || req.user.miembroid;
        const member = await getMembersbyID(memberID);
        if (!member) {
            return res.status(404).json({ message: 'Miembro no encontrado' });
        }
        res.status(200).json(member);
    } catch (error) {
        console.error('Error obteniendo el miembro:', error);
        res.status(500).json({ message: 'Error obteniendo el miembro', error });
    }
};


const updateMemberNameByID = async (req, res) => {
    const {id} = req.params;
    const {nombre} = req.body;

    try {
        const updatedMember = await updateMemberName(id, nombre);

        if (!updatedMember) {
            return res.status(404).json({message: 'Miembro no encontrado'});
        }

        res.status(200).json({message: 'Nombre actualizado con éxito', member: updatedMember});
    } catch (error) {
        console.error('Error al actualizar el nombre del miembro:', error);
        res.status(500).json({message: 'Error al actualizar el nombre del miembro', error});
    }
};

const updateMemberTelefonoByID = async (req, res) => {
    const {id} = req.params;
    const {telefono} = req.body;

    try {
        const updatedMember = await updateMemberTelefono(id, telefono);

        if (!updatedMember) {
            return res.status(404).json({message: 'Miembro no encontrado'});
        }

        res.status(200).json({message: 'Teléfono actualizado con éxito', member: updatedMember});
    } catch (error) {
        console.error('Error al actualizar el teléfono del miembro:', error);
        res.status(500).json({message: 'Error al actualizar el teléfono del miembro', error});
    }
};

const updateMemberDireccionByID = async (req, res) => {
    const {id} = req.params;
    const {direccion} = req.body;

    try {
        const updatedMember = await updateMemberDireccion(id, direccion);

        if (!updatedMember) {
            return res.status(404).json({message: 'Miembro no encontrado'});
        }

        res.status(200).json({message: 'Dirección actualizada con éxito', member: updatedMember});
    } catch (error) {
        console.error('Error al actualizar la dirección del miembro:', error);
        res.status(500).json({message: 'Error al actualizar la dirección del miembro', error});
    }
};

const updateMemberCarreraByID = async (req, res) => {
    const {id} = req.params;
    const {carrera} = req.body;

    try {
        const updatedMember = await updateMemberCarrera(id, carrera);

        if (!updatedMember) {
            return res.status(404).json({message: 'Miembro no encontrado'});
        }

        res.status(200).json({message: 'Carrera actualizada con éxito', member: updatedMember});
    } catch (error) {
        console.error('Error al actualizar la carrera del miembro:', error);
        res.status(500).json({message: 'Error al actualizar la carrera del miembro', error});
    }
};

const updateMemberSemestreByID = async (req, res) => {
    const {id} = req.params;
    const {semestre} = req.body;

    try {
        const updatedMember = await updateMemberSemestre(id, semestre);

        if (!updatedMember) {
            return res.status(404).json({message: 'Miembro no encontrado'});
        }

        res.status(200).json({message: 'Semestre actualizado con éxito', member: updatedMember});
    } catch (error) {
        console.error('Error al actualizar el semestre del miembro:', error);
        res.status(500).json({message: 'Error al actualizar el semestre del miembro', error});
    }
};


const forgotPassword = async (req, res) => {
    console.log('Request body:', req.body); // Log the entire request body

    const { email } = req.body;
    if (!email) {
        console.log('Email is missing in the request body');
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const resetPasswordUrl = `https://biblioteca-frontend-production.up.railway.app/reset-password?email=${encodeURIComponent(email)}`;

        const { data, error } = await resend.emails.send({
            from: `noreply.bibliotecaalejandria.com`,
            to: [email],
            subject: 'Solicitud de cambio de contraseña',
            html: `<p>Recibiste este correo porque tú (o alguien más) solicitó cambiar la contraseña de tu cuenta.</p>
                   <p>Por favor, haz clic en el siguiente enlace o pégalo en tu navegador para completar el proceso:</p>
                   <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
                   <p>Si no solicitaste este cambio, por favor ignora este correo y tu contraseña permanecerá igual.</p>`
        });

        if (error) {
            console.log('Error sending email:', error);
            return res.status(400).json({ error });
        }

        res.status(200).json({ message: 'Correo de cambio de contraseña enviado con éxito', data });
    } catch (error) {
        console.error('Error en forgotPassword:', error);
        res.status(500).json({ message: 'Error en forgotPassword', error });
    }
};

const resetPassword = async (req, res) => {
    const { email } = req.query;
    const { password } = req.body;

    try {
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await updatePassword(user.usuarioid, hashedPassword);

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        console.error('Error en resetPassword:', error);
        res.status(500).json({ message: 'Error en resetPassword', error });
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
    extenderPrestamo,
    forgotPassword,
    resetPassword
};


