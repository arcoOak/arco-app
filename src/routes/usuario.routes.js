// src/routes/users.routes.js
const express = require('express');
const usuarioController = require('../controllers/usuarios.controller'); // Importa el controlador

const router = express.Router();

// Rutas para usuarios
router.get('/', usuarioController.getAllUsuarios); // GET /api/users
router.get('/:id', usuarioController.getUsuarioById); // GET /api/users/:id
router.post('/', usuarioController.createUsuario); // POST /api/users
router.put('/:id', usuarioController.updateUsuario); // PUT /api/users/:id
router.delete('/:id', usuarioController.deleteUsuario); // DELETE /api/users/:id

module.exports = router;