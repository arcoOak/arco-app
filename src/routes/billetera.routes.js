import express from 'express';

import billeteraController from '../controllers/billetera.controller.js'; // Importa el controlador de billetera

const router = express.Router();

router.get('/:id_socio', billeteraController.getBilletera); // Trae la billetera de un socio por ID
router.get('/:id_socio/transacciones/:mes', billeteraController.getTransaccionesBilleteraPorMes); // Trae transacciones de la billetera por mes
router.get('/:id_socio/transacciones-completas/:mes', billeteraController.getTransaccionesBilleteraCompletaPorMes); // Trae transacciones completas de la billetera por mes
router.get('/:id_socio/pagos-pendientes', billeteraController.getPagosPendientes); // Trae pagos pendientes
router.get('/:id_socio/ultimas-transacciones', billeteraController.getUltimasTransaccionesBilletera); // Trae las últimas transacciones de la billetera
router.get('/:transaccion/:id_billetera_transaccion', billeteraController.getTransaccionPorId); // Trae una transacción específica por ID

export default router; // Exporta el router para usarlo en app.js