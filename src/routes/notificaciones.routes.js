import express from 'express';

import notificacionesController from '../controllers/notificaciones.controller.js'; // Importa el controlador de notificaciones

const router = express.Router();

router.get('/:id_usuario', notificacionesController.getAllNotificaciones);
router.get('/:id_usuario/ultima', notificacionesController.getUltimasNotificaciones);
router.get('/:id_usuario/:id_notificacion', notificacionesController.getNotificacionPorId);
router.get('/:id_usuario/categoria/activas', notificacionesController.getCategoriasNotificaciones);
router.get('/:id_usuario/categoria/:id_categoria', notificacionesController.getNotificacionesPorCategoria);
router.get('/:id_usuario/mes/:mes/anho/:anho', notificacionesController.getNotificacionesPorMesAnho);


export default router;
