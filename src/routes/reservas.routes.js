// src/routes/users.routes.js
import express from 'express'; // Importa express usando ES Modules
import reservasController from '../controllers/reservas.controller.js'; // Importa el controlador usando la extensión .js para módulos locales

const router = express.Router();

// Rutas para usuarios
// router.get('/', reservasController.getAllReservas); // GET /api/users
// router.get('/:id', reservasController.getReservaById); // GET /api/users/:id
// router.post('/', reservasController.createReserva); // POST /api/users
// router.put('/:id', reservasController.updateReserva); // PUT /api/users/:id
// router.delete('/:id', reservasController.deleteReserva); // DELETE /api/users/:id

export default router; // Exporta el router para usarlo en app.js