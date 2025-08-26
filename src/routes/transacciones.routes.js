import express from 'express'; // Importa express usando ES Modules

import transaccionesController from '../controllers/transacciones.controller.js';

const router = express.Router();

router.post('/', transaccionesController.createTransaccion);
router.get('/ultimas/:id_socio', transaccionesController.getUltimasTransaccionesSocio);
router.get('/pendientes/:id_socio', transaccionesController.getTransaccionesPendientes)
router.get('/mes/:id_socio/:mes', transaccionesController.getTransaccionesSocioPorMes);
router.get('/mes/completo/:id_socio/:mes/:anho', transaccionesController.getTransaccionesSocioCompletoPorMes);
router.get('/:id_billetera_transaccion', transaccionesController.getTransaccionPorId);
router.post('/pagar', transaccionesController.pagarTransaccion);

export default router;