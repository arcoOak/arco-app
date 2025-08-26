import express from 'express';

import mensualidadesController from '../controllers/mensualidad.controller.js'; // Importa el controlador de mensualidades

const router = express.Router();

router.post('/', mensualidadesController.crearMensualidad);
router.post('/pagar', mensualidadesController.pagarMensualidad);

export default router;
