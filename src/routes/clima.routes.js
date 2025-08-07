import express from 'express';

import climaController from '../controllers/clima.controller.js'; // Importa el controlador de clima

const router = express.Router();

router.get('/:id_club', climaController.getClimaSemanal); // Trae el clima semanal
router.post('/:id_club/cargar-datos', climaController.cargarDatosClimaSemanal); // Carga datos climáticos semanales

export default router; // Exporta el router para usarlo en app.js