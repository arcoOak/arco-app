import express from 'express';

import qrtokenController from '../controllers/qrtoken.controller.js';

const router = express.Router();

router.get('/:id_usuario/:id_rol', qrtokenController.getQrTokenByUsuario); // Trae todos los productos
router.post('/', qrtokenController.createQrToken); 
router.put('/:id_usuario/', qrtokenController.updateQrToken); // Trae un producto por ID
router.post('/validar/', qrtokenController.validarQrToken); // Trae los productos de un comercio específico por su ID

router.get('/familiar/:id_usuario/:id_rol/:id_familiar', qrtokenController.getQrTokenByUsuarioFamiliar); // Trae el token QR de un usuario y su familiar
router.post('/familiar/', qrtokenController.createQrTokenFamiliar); // Trae el token QR de un usuario y su familiar
router.put('/familiar/:id_usuario/', qrtokenController.updateQrTokenFamiliar); // Actualiza el token QR de un usuario y su familiar

router.post('/generate', qrtokenController.generateOrUpdateQrToken); // Genera o actualiza el token QR de un usuario
router.post('/familiar/generate', qrtokenController.generateOrUpdateQrTokenFamiliar); // Genera o actualiza el token QR de un usuario y su familiar

export default router; // Exporta el router para usarlo en app.js