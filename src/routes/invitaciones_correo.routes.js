// En tu archivo de rutas del backend (ej. /routes/qr.js)

import express from 'express';

import qrController from '../controllers/qrtoken.controller.js'; // Importa el controlador de QR

const router = express.Router();


// Endpoint para enviar la invitación por correo
router.post('/enviar-invitacion', qrController.enviarInvitacionQr );

export default router; // Exporta el router para usarlo en tu aplicación principal
