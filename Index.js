const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const libroRoutes = require('./routes/libroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const userRoutes = require('./routes/usuarioRoutes');
const editorialRoutes = require('./routes/editorialRoutes');
const categoriaRoutes = require('./routes/categoriRoutes');
const logActivity = require('./middleware/logUserActivity');
const edicionesRoutes = require('./routes/edicionesRoutes');
const prestamoRoutes = require('./routes/prestamoRoutes');
const proveedorRoutes = require('./routes/proveedorRoutes');
const logRoutes = require('./routes/logRoutes');
const multer = require('multer');
const resenaRoutes = require('./routes/resenaRoutes');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


const upload = multer({
    limits: { fileSize: 50 * 1024 * 1024 }, // Limitar el tamaño del archivo a 50MB
    dest: 'uploads/', // Carpeta donde se guardan los archivos temporalmente
}).single('pdf');  // Usamos 'single' para aceptar un solo archivo, puedes cambiarlo si es necesario


// Middleware
app.use(cors({
    origin: '*', // Permitir solicitudes de cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE','OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api', logActivity('viewed ediciones'), edicionesRoutes);
app.use('/api', logActivity('viewed libros'), libroRoutes);
app.use('/api', logActivity('viewed autores'), autorRoutes);
app.use('/api', logActivity('viewed usuarios'), userRoutes);
app.use('/api', logActivity('viewed editoriales'), editorialRoutes);
app.use('/api', logActivity('viewed categorias'), categoriaRoutes);
app.use('/api', logActivity('viewed proveedores'), proveedorRoutes);
app.use('/api', logActivity('viewed prestamos'), prestamoRoutes);
app.use('/api',logRoutes);
app.use('/api', prestamoRoutes);
app.use('/api', userRoutes);
app.use('/api',edicionesRoutes);
app.use('/api', resenaRoutes);



// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('juany ta gozu!');
});

// Ruta para subir PDF, usando el middleware de multer
app.post('/api/subir-pdf', upload, (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }
    // Aquí puedes hacer lo que necesites con el archivo subido
    console.log('Archivo subido:', req.file);
    res.send('Archivo PDF subido correctamente');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});