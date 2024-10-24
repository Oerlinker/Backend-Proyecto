const express = require('express');
const router = express.Router();
const { addEditorial, getAllEditoriales, getEditorialByIdController, updEditorial, delEditorial } = require('../controllers/editorialController');

router.post('/editoriales/add', addEditorial);
router.get('/editoriales', getAllEditoriales);
router.get('/editoriales/:id', getEditorialByIdController);
router.put('/editoriales/:id', updEditorial);
router.delete('/editoriales/:id', delEditorial);

module.exports = router;