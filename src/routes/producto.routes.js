import express from 'express';

import productoController from '../controllers/producto.controller.js'; // Importa el controlador de producto

const router = express.Router();

router.get('/:id_club', productoController.getAllProductos); // Trae todos los productos
router.get('/:id_club/individuales', productoController.getAllProductosIndividuales); // Trae todos los
router.get('/individual/:id', productoController.getProductoById); // Trae un producto por ID
router.get('/comercio/:id_comercio', productoController.getProductosPorComercio); // Trae los productos de un comercio específico por su ID
router.get('/categorias-comercio/:id_comercio', productoController.getCategoriasDeProductosPorComercio); // Trae las categorías de productos por comercio

export default router; // Exporta el router para usarlo en app.js