
import express from 'express';
import compraController from '../controllers/compra.controller.js';

const router = express.Router();

router.get('/:id', compraController.getCompraById);
router.get('/mensual/:id_socio/:mes/:anho', compraController.getComprasByUsuarioMes);
router.post('/', compraController.crearCompra);

export default router;