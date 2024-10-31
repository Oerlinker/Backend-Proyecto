const{createEdicion,getEdiciones,getEdicionISBN,updateEdicion,deleteEdicion}=require('../models/edicionModel');

const addEdicion = async(req,res) =>{
    const{ isbn,numero_edicion,fecha_publicacion,libroid,proveedorid,total_prestamos,promedio_rating}=req.body;
    try {
        const nuevaEdicion = await createEdicion({
            isbn,
            numero_edicion,
            fecha_publicacion,
            libroid,
            proveedorid,
            total_prestamos,
            promedio_rating
        });
        res.status(201).json({
            message: 'Edicion creada con exito',
            body: nuevaEdicion
        });
    }
    catch (error) {
        console.error('Error creando la edicion', error);
        res.status(500).json({ error: 'Error creando la edicion' });
    }
};

const getEdicion=async(req,res)=>{
    try {
        const ediciones = await getEdiciones();
        if (!ediciones) {
            return res.status(404).json({ message: 'No se encontraron ediciones' });
        }
        res.status(200).json(ediciones);
    } catch (error) {
        console.error('Error obteniendo las ediciones', error);
        res.status(500).json({ error: 'Error obteniendo las ediciones' });
    }
};

const getEdicionISBN=async(req,res)=>{
    const{id}=req.params;
    try {
        const edicion = await getEdicionById(isbn);
        if (!edicion) {
            return res.status(404).json({ error: 'Edicion no encontrada' });
        }
        res.status(200).json(edicion);
    } catch (error) {
        console.error('Error obteniendo la edicion por ID', error);
        res.status(500).json({ error: 'Error obteniendo la edicion por ID' });
    }
};

const updEdicion=async(req,res)=>{
    const{id}=req.params;
    const{isbn,numero_edicion,fecha_publicacion,libroid,proveedorid,total_prestamos,promedio_rating}=req.body;
    try {
        const edicionActualizada = await updateEdicion(id, { isbn, numero_edicion, fecha_publicacion, libroid, proveedorid, total_prestamos, promedio_rating });
        if (!edicionActualizada) {
            return res.status(404).json({ error: 'Edicion no encontrada' });
        }
        res.status(200).json({
            message: 'Edicion actualizada con exito',
            body: edicionActualizada
        });
    } catch (error) {
        console.error('Error actualizando la edicion', error);
        res.status(500).json({ error: 'Error actualizando la edicion' });
    }
};

const delEdicion=async(req,res)=>{
    const{id}=req.params;
    try {
        const edicionEliminada = await deleteEdicion(id);
        if (!edicionEliminada) {
            return res.status(404).json({ error: 'Edicion no encontrada' });
        }
        res.status(200).json({
            message: 'Edicion eliminada con exito',
            body: edicionEliminada
        });
    } catch (error) {
        console.error('Error eliminando la edicion', error);
        res.status(500).json({ error: 'Error eliminando la edicion' });
    }
};

module.exports={
    addEdicion,
    getEdicion,
    getEdicionISBN,
    updEdicion,
    delEdicion
};

