const express = require('express');
const router = express.Router();
const { addEdicion,getEdicion,getEdicionByIdController,updEdicion,delEdicion,getPdf} = require('../controllers/edicionController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");




//protected routes
router.post('/ediciones', verificarTokenYRol([4]), upload.single('pdf'), addEdicion);
router.get('/ediciones',verificarTokenYRol([2,3,4]), getEdicion);
router.get('/ediciones/:id',verificarTokenYRol([2,3,4]), getEdicionByIdController);
router.put('/ediciones/:id',verificarTokenYRol([4]), updEdicion);
router.delete('/ediciones/:id',verificarTokenYRol([4]), delEdicion);
router.get('/ediciones/download-pdf/:id', verificarTokenYRol([2,3,4]), getPdf);


// Ruta para subir el archivo PDF de una edición
/*router.post('/ediciones/upload-pdf/:id', verificarTokenYRol([4]), upload.single('pdf'), (req, res) => {
    try {
        // Aquí puedes agregar la lógica para guardar la URL del archivo en la base de datos
        const pdfFile = req.file;
        if (!pdfFile) {
            return res.status(400).json({ error: 'No se ha subido ningún archivo PDF' });
        }

        // Por ejemplo, podrías almacenar la URL en tu base de datos relacionada con la edición
        const pdfUrl = `/uploads/${pdfFile.filename}`; // URL del archivo guardado
        // Llama a la función para actualizar la edición con la URL del PDF (debes implementarlo)
        // await updateEdicionWithPdfUrl(req.params.id, pdfUrl);

        res.status(200).json({ message: 'PDF subido con éxito', pdfUrl });
    } catch (error) {
        console.error('Error subiendo el archivo PDF', error);
        res.status(500).json({ error: 'Error al subir el archivo PDF' });
    }
}); */

module.exports = router;