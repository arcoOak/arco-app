import express from 'express';

import billeteraController from '../controllers/billetera.controller.js'; // Importa el controlador de billetera

const router = express.Router();

router.get('/:id_billetera', billeteraController.getBilleteraById); // Trae la billetera por ID
router.get('/socio/:id_socio', billeteraController.getBilleteraBySocio); // Trae la billetera de un socio por ID
router.get('/:id_billetera/saldo', billeteraController.getSaldoBilletera); // Trae el saldo de la billetera
router.post('/recargar', billeteraController.recargarSaldo); // Nueva ruta para recarga de saldo

export default router; // Exporta el router para usarlo en app.js