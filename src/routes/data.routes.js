import express from 'express'; // Importa express usando CommonJS
import dataController from '../controllers/data.controller.js'; // Importa el controlador de familiares

const router = express.Router();

// Rutas para usuarios
router.get('/generos', dataController.getGeneros); 
router.get('/parentesco', dataController.getParentescosList);
router.get('/parentesco/genero', dataController.getParentescosByGeneroList); 




export default router; // Exporta el router para usarlo en app.js