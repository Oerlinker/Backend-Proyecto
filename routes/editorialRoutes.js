const express = require('express');
const router = express.Router();
const { addEditorial, getAllEditoriales, getEditorialByIdController, updEditorial, delEditorial } = require('../controllers/editorialController');
const verficarRol = require("../middleware/verificarRol");

//protected routes
router.post('/editoriales',verficarRol([4]), addEditorial);
router.get('/editoriales',verficarRol([4]), getAllEditoriales);
router.get('/editoriales/:id',verficarRol([4]), getEditorialByIdController);
router.put('/editoriales/:id',verficarRol([4]), updEditorial);
router.delete('/editoriales/:id',verficarRol([4]), delEditorial);

module.exports = router;