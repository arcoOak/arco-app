import express from 'express'; // Importa express usando ES Modules

import transaccionesReservaController from '../controllers/transaccionesReserva.controller.js'; // Importa el controlador usando la extensión .js para módulos locales
import transaccionesReservaServicioController from '../controllers/transaccionesReservaServicio.controller.js'; // Importa el controlador de reservas de servicios

const router = express.Router();

router.post('/reservas', transaccionesReservaController.crearReservaTransaccion);
router.post('/servicios', transaccionesReservaServicioController.crearReservaServicioTransaccion);

export default router;