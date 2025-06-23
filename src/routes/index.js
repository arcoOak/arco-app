// src/routes/index.js
const express = require('express');
const usuarioRoutes = require('./usuario.routes'); // Importa las rutas de usuarios
const reservasRoutes = require('./reservas.routes'); // Importa las rutas de reservas

const router = express.Router();

router.use('/users', userRoutes); // Monta las rutas de usuarios en /api/users
router.use('/reservas', reservasRoutes); // Monta las rutas de reservas en /api/reservas
// Agrega aquí más rutas para otros módulos, ej:
// router.use('/products', productRoutes);
// router.use('/auth', authRoutes);

module.exports = router;