import express from 'express'; // Importa express usando CommonJS
import loginController from '../controllers/login.controller.js'; // Importa el controlador de login

const router = express.Router();

// Rutas para usuarios
router.post('/', loginController.getLogin); 


export default router; // Exporta el router para usarlo en app.js