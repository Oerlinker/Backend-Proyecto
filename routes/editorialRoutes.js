const express = require('express');
const router = express.Router();
const { addEditorial, getAllEditoriales, getEditorialByIdController, updEditorial, delEditorial } = require('../controllers/editorialController');
const verificarRol= require('../middleware/verificarRol');
router.post('/editoriales/add',verificarRol([3,4]), addEditorial);
router.get('/editoriales', getAllEditoriales);
router.get('/editoriales/:id', getEditorialByIdController);
router.put('/editoriales/:id',verificarRol([3,4]), updEditorial);
router.delete('/editoriales/:id',verificarRol([3,4]), delEditorial);

module.exports = router;
