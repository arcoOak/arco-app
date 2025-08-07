

import express from 'express'; // Importa express usando ES Modules

import reservaServicioController from '../controllers/reservaServicio.controller.js'; // Importa el controlador usando la extensión .js para módulos locales

const router = express.Router();

router.get('/:id_reservacion_servicio', reservaServicioController.getReservaServicioById);
router.get('/servicio/:id_club/:id_servicio', reservaServicioController.getReservasServicioPorServicio);
router.get('/servicio/mensual/:id_club/:anho/:mes/:id_servicio', reservaServicioController.getReservasServicioPorServicioYMes);
router.get('/socio/:id_club/:id_socio', reservaServicioController.getReservasServicioPorSocio);
router.get('/socio/:id_club/mensual/:anho/:mes/:id_socio', reservaServicioController.getReservasServicioPorSocioYMes);
router.get('/horas/:id_reserva_servicio', reservaServicioController.getHorasReservadasPorReservaServicios);
router.get('/horas/:id_club/:id_servicio/:fecha', reservaServicioController.getHorasReservadasPorServicioPorFecha);
router.post('/', reservaServicioController.createReservaServicio);

export default router; // Exporta el router para usarlo en app.js