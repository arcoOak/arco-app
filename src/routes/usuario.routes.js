// src/routes/users.routes.js

import express from 'express'; // Importa express usando CommonJS
import usuarioController from '../controllers/usuarios.controller.js'; // Importa el controlador de usuarios

const router = express.Router();

// Rutas para usuarios
router.get('/', usuarioController.getAllUsuarios); // GET /api/usuarios
router.get('/:id', usuarioController.getUsuarioById); // GET /api/usuarios/:id
router.post('/', usuarioController.createUsuario); // POST /api/ususuariosers
router.put('/:id', usuarioController.updateUsuario); // PUT /api/usuarios/:id
router.delete('/:id', usuarioController.deleteUsuario); // DELETE /api/usuarios/:id


router.get('/role/:role', usuarioController.getUsuariosByRole); // GET /api/usuarios/role/:role

export default router; // Exporta el router para usarlo en app.js