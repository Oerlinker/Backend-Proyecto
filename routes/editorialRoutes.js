const express = require('express');
const router = express.Router();
const { addEditorial, getAllEditoriales, getEditorialByIdController, updEditorial, delEditorial } = require('../controllers/editorialController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");


//public routes
router.get('/editoriales', getAllEditoriales);
router.get('/editoriales/:id', getEditorialByIdController);

//protected routes
router.post('/editoriales',verificarTokenYRol([4]), addEditorial);
router.put('/editoriales/:id',verificarTokenYRol([4]), updEditorial);
router.delete('/editoriales/:id',verificarTokenYRol([4]), delEditorial);

module.exports = router;