import express from 'express';

import climaController from '../controllers/clima.controller.js'; // Importa el controlador de clima

const router = express.Router();

router.get('/:id_club', climaController.getClimaSemanal); // Trae el clima semanal

export default router; // Exporta el router para usarlo en app.js