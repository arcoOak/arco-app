import express from 'express';

import productoController from '../controllers/producto.controller.js'; // Importa el controlador de producto

const router = express.Router();

router.get('/', productoController.getAllProductos); // Trae todos los productos
router.get('/individuales', productoController.getAllProductosIndividuales); // Trae todos los
router.get('/:id', productoController.getProductoById); // Trae un producto por ID
router.get('/comercio/:id_comercio', productoController.getProductosPorComercio); // Trae los productos de un comercio específico por su ID

export default router; // Exporta el router para usarlo en app.js