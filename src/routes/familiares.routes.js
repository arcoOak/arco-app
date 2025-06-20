// src/routes/users.routes.js

import express from 'express'; // Importa express usando CommonJS
import familiaresController from '../controllers/familiares.controller.js'; // Importa el controlador de familiares

const router = express.Router();

// Rutas para usuarios
router.get('/', familiaresController.getAllFamiliares); // GET /api/familiares
router.get('/:id', familiaresController.getFamiliarById); // GET /api/familiares/:id
router.post('/', familiaresController.createFamiliar); // POST /api/familiares
router.put('/:id', familiaresController.updateFamiliar); // PUT /api/familiares/:id
router.delete('/:id', familiaresController.deleteFamiliar); // DELETE /api/familiares/:id

router.get('/buscar/:user', familiaresController.getFamiliaresByUsuario); // GET /api/familiares/buscar/:user




export default router; // Exporta el router para usarlo en app.js