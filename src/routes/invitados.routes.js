import express from 'express'; // Importa express usando ES Modules
import invitadosController from '../controllers/invitados.controller.js'; // Importa el controlador usando la extensión .js para módulos locales

const router = express.Router();


router.get('/cantidad/:id_usuario/:mes', invitadosController.getCantidadInvitadosPorUsuarioMes);
router.delete('/:id_reserva/:id_invitado', invitadosController.removeInvitado);
router.post('/crear/:id_reserva', invitadosController.createInvitadoParaReserva);
router.post('/crear', invitadosController.createInvitado); // Ruta para crear invitados sin reserva específica

export default router; // Exporta el router para usarlo en app.js