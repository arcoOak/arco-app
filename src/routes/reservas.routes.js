// src/routes/users.routes.js
const express = require('express');
const reservasController = require('../controllers/reservas.controller'); // Importa el controlador

const router = express.Router();

// Rutas para usuarios
router.get('/', reservasController.getAllReservas); // GET /api/users
router.get('/:id', reservasController.getReservaById); // GET /api/users/:id
router.post('/', reservasController.createReserva); // POST /api/users
router.put('/:id', reservasController.updateReserva); // PUT /api/users/:id
router.delete('/:id', reservasController.deleteReserva); // DELETE /api/users/:id

module.exports = router;