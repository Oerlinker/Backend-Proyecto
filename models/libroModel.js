const pool = require('../db');

//buscador avanzado
const buscarLibrosAvanzado = async (titulo, categoriaid, autor, calificacion, isbn) => {
    let query = `
        SELECT DISTINCT l.libroid, l.titulo, a.nombre AS autor, COALESCE(AVG(l.promedio_rating), 0) AS calificacion
        FROM libros l
        LEFT JOIN ediciones e ON l.libroid = e.libroid 
        LEFT JOIN reseña r ON e.edicionid = r.edicionid
        LEFT JOIN autor a ON l.autorid = a.autorid
    `;
    
    const conditions = [];
    const params = [];

    if (titulo) {
        conditions.push('l.titulo ILIKE $1'); 
        params.push(`%${titulo}%`);
    }
    if (categoriaid) {
        conditions.push('l.categoriaid = $' + (params.length + 1));
        params.push(parseInt(categoriaid, 10)); // Convertir a número
    }
    if (autor) {
        conditions.push('a.nombre ILIKE $' + (params.length + 1));
        params.push(`%${autor}%`);
    }
    if (isbn) {
        conditions.push('e.isbn = $' + (params.length + 1));
        params.push(isbn);
    }
    if (calificacion) {
        conditions.push('l.promedio_rating >= $' + (params.length + 1)); // Cambiar de r.calificacion a e.promedio_rating
        params.push(calificacion);
    }

    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    // Agrupa solo por libroid
    query += ' GROUP BY l.libroid, l.titulo, a.nombre';
        // Debugging
        console.log('Consulta SQL:', query);
        console.log('Parámetros:', params);
    
    // Añadir DISTINCT para eliminar duplicados


    const result = await pool.query(query, params);
    return result.rows; 
};

// Función para crear un nuevo libro
const createLibro = async ({ Titulo, Genero, AutorID, EditorialID, CategoriaID,prestamo }) => {
    try {
        const result = await pool.query(
            'INSERT INTO libros (Titulo, Genero, AutorID, EditorialID, CategoriaID) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [Titulo, Genero, AutorID, EditorialID, CategoriaID]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creando el libro', error);
        throw error;
    }
};
const prestamo = async (userId, libroId) => {
    try {
        const result = await pool.query(
            'INSERT INTO prestamos (UsuarioID, LibroID) VALUES ($1, $2) RETURNING *',
            [userId, libroId]
        );
        return result.rows[0]; // Retornamos el libro recién creado
    } catch (error) {
        console.error('Error creando el libro', error);
        throw error;
    }
}
// Función para obtener todos los libros
const getLibros = async () => {
    try {
        const result = await pool.query('SELECT * FROM libros');
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo los libros', error);
        throw error;
    }
};

const getLibrosbyid = async (id) => {
    const query = 'SELECT * FROM libros WHERE libroid = $1'; // Asegúrate de usar la sintaxis correcta para tu base de datos
    const values = [id];

    try {
        const result = await pool.query(query, values); // 'pool' es tu cliente de base de datos
        return result; // Deberías devolver el resultado completo si necesitas acceder a rows
    } catch (error) {
        console.error('Error en la consulta a la base de datos', error);
        throw error; // Lanza el error para que pueda ser manejado en el controlador
    }
};


// Función para obtener un libro por nombre
const getLibroByName = async (query) => {
    try {
        //para dividir en palabras clave
        const keywords = query.split(' ').map(word => `%${word}%`);
        //consulta para conicidencias con cualquier palabra
        const conditions = keywords.map((_, index) => `Titulo ILIKE $${index +1}`).join(' OR ');

        const result = await pool.query(
            `SELECT * FROM libros WHERE ${conditions}`,
            keywords
        );

        return result.rows;
    } catch (error) {
        console.error('Error obteniendo libros por criterio:', error);
        throw error;
    }
};

// Función para actualizar un libro
const updateLibro = async (id, { Titulo, Genero, AutorID, EditorialID, CategoriaID }) => {
    try {
        const result = await pool.query(
            `UPDATE Libros SET Titulo = $1, Genero = $2, AutorID = $3, EditorialID = $4, CategoriaID = $5
             WHERE LibroID = $6 RETURNING *`,
            [Titulo, Genero, AutorID, EditorialID, CategoriaID, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error actualizando el libro', error);
        throw error;
    }
};

// Función para eliminar un libro
const deleteLibro = async (id) => {
    try {
        const result = await pool.query('DELETE FROM libros WHERE LibroID = $1', [id]);
        return result.rowCount;
    } catch (error) {
        console.error('Error eliminando el libro', error);
        throw error;
    }
};
//todas las categorias
const getCategorias  = async () => {
    try {
        const result = await pool.query('SELECT * FROM categorias')
        return result;
    } catch (error) {
        console.error('No se encontró ninguna categoria', error);
        throw error;
    }
}
//todos los libros por categoria
const getLibroxCategoria  = async (id) => {
    try {
        const result = await pool.query('SELECT * FROM libros WHERE categoriaid = $1', [id]);
        return result.rows;
    } catch (error) {
        console.error('No se encontró ninguna libro', error);
        throw error;
    }
}

//Consulta para que devuelva los detalles del libro (nombre de autor, nombre editorial etc...)
const getBookDetails = async (id) => {
    const query = `
        SELECT libros.*, autor.nombre AS autor, editoriales.nombre_editorial AS editorial, categorias.nombre_categoria AS categoria, 
        json_agg(json_build_object('edicionid', ediciones.edicionid, 'fecha_publicacion', ediciones.fecha_publicacion)) AS ediciones
        FROM libros
        JOIN autor ON libros.autorid = autor.autorid
        JOIN editoriales ON libros.editorialid = editoriales.editorialid
        JOIN categorias ON libros.categoriaid = categorias.categoriaid
        LEFT JOIN ediciones ON libros.libroid = ediciones.libroid  -- LEFT JOIN para incluir libros sin ediciones
        WHERE libros.libroid = $1
        GROUP BY libros.libroid, autor.nombre, editoriales.nombre_editorial, categorias.nombre_categoria`;

    const result = await pool.query(query, [id]);
    return result.rows[0];
};

const getReseñasbyLibro = async (libroid) => {
    try {
        const result = await pool.query('SELECT * FROM reseña WHERE libroid = $1', [libroid]);
        return result.rows;
    } catch (error) {
        console.error('Error obteniendo las reseñas', error);
        throw error;
    }
};

module.exports = {
    createLibro,
    getLibros,
    getLibroByName,
    updateLibro,
    deleteLibro,
    getLibrosbyid,
    prestamo,
    getCategorias,
    getLibroxCategoria,
    getBookDetails,
    buscarLibrosAvanzado,
    getReseñasbyLibro
};


