
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const libroRoutes = require('./routes/libroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const userRoutes = require('./routes/usuarioRoutes');
const editorialRoutes = require('./routes/editorialRoutes');
const categoriaRoutes = require('./routes/categoriRoutes');
const logActivity = require('./middleware/logUserActivity');
const bitacoraRoutes = require('./routes/bitacoraRoutes');
//const prestamoRoutes = require('./routes/prestamoRoutes');


dotenv.config(); // Cargar variables del archivo .env

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Permitir solicitudes de cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Rutas
app.use('/api', logActivity('viewed libros'), libroRoutes);
app.use('/api', logActivity('viewed autores'), autorRoutes);
app.use('/api', logActivity('viewed usuarios'), userRoutes);
app.use('/api', logActivity('viewed editoriales'), editorialRoutes);
app.use('/api', logActivity('viewed categorias'), categoriaRoutes);
//app.use('/api', logActivity('viewed prestamos'), prestamoRoutes);
app.use('/api', bitacoraRoutes);

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.send('juany ta gozu!');
});

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`);
});