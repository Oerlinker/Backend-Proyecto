const {
    createLibro,
    getLibros,
    getLibroByName,
    updateLibro,
    deleteLibro,
    prestamo,
    getCategorias,
    getLibroxCategoria,
    getBookDetails,
    buscarLibrosAvanzado,
    getReseñasbyLibro
} = require('../models/libroModel');
const {logUserActivity} = require('../models/userActivityLogModel');

// buscador avanzado
const buscarLibros = async (req, res) => {
    try {
        const {search, categoriaid, autor, calificacion, isbn} = req.query;
        const libros = await buscarLibrosAvanzado(search, categoriaid, autor, calificacion, isbn);
        res.json(libros);
    } catch (error) {
        console.error("Error en la búsqueda de libros:", error);
        res.status(500).json({error: 'Error al buscar libros'});
    }
};

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
        const libro = await getBookDetails(libroId);
        if (libro) {
            res.json(libro);
        } else {
            res.status(404).json({error: 'Libro no encontrado'});
        }
    } catch (error) {
        console.error('Error obteniendo el libro', error);
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
    const {id} = req.params; // ID del libro a eliminar
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

//para sacar todas las categorias
const categorias = async (req, res) => {
    try {
        const categ = await getCategorias();
        console.log(categ.rows);
        res.json(categ.rows);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        res.status(500).json({error: 'Error al obtener las categorías'});
    }
};

//busqueda por nombre o categoria
const searchLibros = async (req, res) => {
    const {search, categoriaid} = req.query; // Obtenemos tanto el término de búsqueda como el ID de la categoría
    try {
        let libros = [];
        if (search) {
            libros = await getLibroByName(search); // Llama a la función que busca por nombre
        } else if (categoriaid) {
            libros = await getLibroxCategoria(categoriaid); // Llama a la función que busca por categoría
        } else {
            return res.status(400).json({error: 'Se debe proporcionar un término de búsqueda o un ID de categoría.'});
        }

        return res.json(libros);
    } catch (error) {
        console.error('Error buscando libros:', error);
        res.status(500).json({error: 'Error al buscar libros'});
    }
};

const getReseñas = async (req, res) => {
    const {id} = req.params;
    try {
        const reseñas = await getReseñasbyLibro(id);
        res.json(reseñas);
    } catch (error) {
        console.error('Error obteniendo las reseñas', error);
        res.status(500).json({error: 'Error obteniendo las reseñas'});
    }
};

const getLibrosDetallesController = async (req, res) => {
    try {
        const librosDetalles = await getLibrosDetalles();
        res.json(librosDetalles);
    } catch (error) {
        console.error('Error obteniendo los detalles de los libros:', error);
        res.status(500).json({ error: 'Error obteniendo los detalles de los libros' });
    }
};

const getBookDetailsController = async (req, res) => {
    const { id } = req.params;
    try {
        const bookDetails = await getBookDetails(id);
        if (bookDetails) {
            res.json(bookDetails);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        console.error('Error fetching book details:', error);
        res.status(500).json({ error: 'Error fetching book details' });
    }
};

module.exports = {
    adLibro,
    getLibro,
    updLibro,
    delLibro,
    getLibroById
    , prestamosLibro,
    categorias,
    searchLibros,
    buscarLibros,
    getReseñas,
    getLibrosDetallesController,
    getBookDetailsController
};