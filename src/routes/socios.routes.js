// src/routes/users.routes.js

import express from 'express'; // Importa express usando CommonJS
import socioController from '../controllers/socios.controller.js'; // Importa el controlador de socios

const router = express.Router();

// Rutas para usuarios
router.get('/', socioController.getAllSocios); // GET /api/usuarios
router.get('/:id', socioController.getSocioById); // GET /api/usuarios/:id
router.post('/', socioController.createSocio); // POST /api/usuarios
router.put('/:id', socioController.updateSocio); // PUT /api/usuarios/:id
router.delete('/:id', socioController.deleteSocio); // DELETE /api/usuarios/:id

router.get('/buscar/:user', socioController.getSocioByUsuario); // GET /api/usuarios/buscar/:user

export default router; // Exporta el router para usarlo en app.js