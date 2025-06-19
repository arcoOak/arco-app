const express = require('express');
const cors = require('cors');
const appRoutes = require('./routes'); // Importa el archivo principal de rutas

const app = express();

// Middlewares
app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend React
app.use(express.json()); // Permite a Express parsear JSON en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Permite a Express parsear datos de formularios URL-encoded

// Rutas
app.use('/api', appRoutes); // Prefijo para todas tus rutas API, ej: /api/users, /api/products

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Error interno del servidor', error: err.message });
});

module.exports = app;