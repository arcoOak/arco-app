// src/routes/users.routes.js
import express from 'express'; // Importa express usando ES Modules
import reservasController from '../controllers/reservas.controller.js'; // Importa el controlador usando la extensión .js para módulos locales

const router = express.Router();

router.get('/:id_reserva', reservasController.getReservaById);
router.get('/unidad/:id_espacio', reservasController.getReservasByEspacioUnidad);
router.get('/usuario/:id_usuario', reservasController.getReservasPorUsuario);
router.get('/mensual/unidad/:id_espacio/:mes', reservasController.getReservasByEspacioUnidadMes);
router.get('/mensual/usuario/:id_usuario/:mes', reservasController.getReservaByUsuarioMes);
router.get('/horas/unidad/:id_unidad/:fecha', reservasController.getHorasReservadasPorUnidadFecha);
router.get('/horas/reserva/:id_reserva', reservasController.getHorasReservadasPorReserva);

router.post('/', reservasController.createReserva);

export default router; // Exporta el router para usarlo en app.js