const express = require('express');
const router = express.Router();
const { addEdicion,getEdicion,getEdicionByIdController,updEdicion,delEdicion} = require('../controllers/edicionController');

router.post('/ediciones', addEdicion);
router.get('/ediciones', getEdicion);
router.get('/ediciones/:id', getEdicionByIdController);
router.put('/ediciones/:id', updEdicion);
router.delete('/ediciones/:id', delEdicion);

module.exports = router;