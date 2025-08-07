import express from 'express';

import clubController from '../controllers/club.controller.js'; // Asegúrate de que la ruta al controlador sea correcta

const router = express.Router();

router.get('/:id_club', clubController.getDatosClub);

export default router;
