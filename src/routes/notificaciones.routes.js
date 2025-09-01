import express from 'express';

import notificacionesController from '../controllers/notificaciones.controller.js'; // Importa el controlador de notificaciones

const router = express.Router();

router.get('/:id_usuario', notificacionesController.getAllNotificaciones);
router.post('/visualizar/:id_notificacion', notificacionesController.marcarNotificacionComoVista);
router.post('/:id_usuario', notificacionesController.crearNotificacion);

export default router;
