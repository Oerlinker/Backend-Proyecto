const {
    createLibro,
    getLibros,
    getLibroByName,
    updateLibro,
    deleteLibro,
    getLibrosbyid,
    prestamo
} = require('../models/libroModel');

// Controlador para agregar un nuevo libro
const adLibro = async (req, res) => {
    const {Titulo, Genero, AutorID, EditorialID, CategoriaID} = req.body;
    try {
        const nuevoLibro = await createLibro({Titulo, Genero, AutorID, EditorialID, CategoriaID});
        res.status(201).json({
            message: 'Libro agregado con éxito',
            body: nuevoLibro
        });
    } catch (error) {
        console.error('Error agregando el libro', error);
        res.status(500).json({error: 'Error agregando el libro'});
    }
};

const obtenerDetallesLibro = async (req, res) => {
    const libro = await Libro.findById(req.params.id).populate('autor').populate('editorial').populate('categoria');
    res.json({
        titulo: libro.titulo,
        autor: libro.autor.nombre,
        editorial: libro.editorial.nombre,
        categoria: libro.categoria.nombre,
    });
};
const prestamosLibro = async (req, res) => {
    const {id} = req.params;
    const userId = req.user.id;
    try {
        const prestamoRealizado = await prestamo(userId, id);
        res.status(201).json(prestamoRealizado);
    } catch (error) {
        console.error('Error realizando el préstamo', error);
        res.status(500).json({error: 'Error realizando el préstamo'});
    }
}
const getLibroById = async (req, res) => {
    const libroId = req.params.id;
    try {
        const libro = await getLibrosbyid(libroId);
        if (libro.rows.length > 0) { // Asegúrate de usar 'length'
            res.json(libro.rows[0]);
        } else {
            res.status(404).json({error: 'Libro no encontrado'});
        }
    } catch (error) {
        console.error('Error obteniendo el libro', error); // Log más detallado
        res.status(500).json({error: 'Error obteniendo el libro'});
    }
};

// Controlador para obtener todos los libros
const getLibro = async (req, res) => {
    try {
        const libros = await getLibros();
        if (!libros) {
            return res.status(404).json({message: 'No se encontraron libros'});
        }
        res.status(200).json(libros);
    } catch (error) {
        console.error('Error obteniendo los libros', error);
        res.status(500).json({error: 'Error obteniendo los libros'});
    }
};

// Controlador para obtener un libro por nombre
const getbyName = async (req, res) => {
    const query = req.query.search || '';  // Obtener el término de búsqueda desde los parámetros de consulta
    try {
        const libros = await getLibroByName(query);  // Pasar el query al modelo
        res.json(libros);
    } catch (error) {
        console.error('Error buscando libros:', error);
        res.status(500).json({error: 'Error al buscar libros'});
    }
};

// Controlador para actualizar un libro
const updLibro = async (req, res) => {
    const {id} = req.params;
    const {Titulo, Genero, AutorID, EditorialID, CategoriaID} = req.body;
    try {
        const libroActualizado = await updateLibro(id, {Titulo, Genero, AutorID, EditorialID, CategoriaID});
        if (!libroActualizado) {
            return res.status(404).json({error: 'Libro no encontrado'});
        }
        res.status(200).json({
            message: 'Libro actualizado con éxito',
            body: libroActualizado
        });
    } catch (error) {
        console.error('Error actualizando el libro', error);
        res.status(500).json({error: 'Error actualizando el libro'});
    }
};

// Controlador para eliminar un libro
const delLibro = async (req, res) => {
    const {id} = req.params;
    try {
        const libroEliminado = await deleteLibro(id);
        if (!libroEliminado) {
            return res.status(404).json({error: 'Libro no encontrado'});
        }
        res.status(200).json({
            message: 'Libro eliminado con éxito',
            body: libroEliminado
        });
    } catch (error) {
        console.error('Error eliminando el libro', error);
        res.status(500).json({error: 'Error eliminando el libro'});
    }
};

module.exports = {
    adLibro,
    getLibro,
    getbyName,
    updLibro,
    delLibro,
    getLibroById
    , prestamosLibro,
    obtenerDetallesLibro
};
