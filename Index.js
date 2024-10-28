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
const logRoutes = require('./routes/logRoutes');

dotenv.config(); // Load .env variables

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes with logging middleware
app.use('/api/ediciones', logActivity('viewed ediciones'), edicionesRoutes);
app.use('/api/libros', logActivity('viewed libros'), libroRoutes);
app.use('/api/autores', logActivity('viewed autores'), autorRoutes);
app.use('/api/usuarios', logActivity('viewed usuarios'), userRoutes);
app.use('/api/editoriales', logActivity('viewed editoriales'), editorialRoutes);
app.use('/api/categorias', logActivity('viewed categorias'), categoriaRoutes);
app.use('/api/activity-log', logRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.send('juany ta gozu!');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});