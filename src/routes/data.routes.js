import express from 'express'; // Importa express usando CommonJS
import dataController from '../controllers/data.controller.js'; // Importa el controlador de familiares

const router = express.Router();

// Rutas para usuarios
router.get('/generos', dataController.getGeneros); //Traerá los géneros
router.get('/parentesco', dataController.getParentescos); //Traerá los parentescos
router.get('/parentesco/genero', dataController.getParentescosByGenero); //Traerá los parentescos sin distinguir género
router.get('/categorias-comercio', dataController.getCategoriasComercio); //Traerá las categorías de comercio
router.get('/categorias-comercio/activos', dataController.getCategoriasComercioDisponible); //Traerá las categorías de comercio de comercios activos




export default router; // Exporta el router para usarlo en app.js