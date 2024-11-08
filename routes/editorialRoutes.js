const express = require('express');
const router = express.Router();
const { addEditorial, getAllEditoriales, getEditorialByIdController, updEditorial, delEditorial } = require('../controllers/editorialController');
const verificarTokenYRol = require("../middleware/verificarTokenYRol");


//protected routes
router.post('/editoriales',verificarTokenYRol([4]), addEditorial);
router.get('/editoriales',verificarTokenYRol([4]), getAllEditoriales);
router.get('/editoriales/:id',verificarTokenYRol([4]), getEditorialByIdController);
router.put('/editoriales/:id',verificarTokenYRol([4]), updEditorial);
router.delete('/editoriales/:id',verificarTokenYRol([4]), delEditorial);

module.exports = router;