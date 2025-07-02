import express from 'express';
import comercioController from '../controllers/comercio.controller.js'; // Importa el controlador de comercio

const router = express.Router();

router.get('/', comercioController.getAllComercios); // Trae todos los comercios
router.get('/activos', comercioController.getAllComerciosActivos); // Trae todos los comercios activos
router.get('/categorias-activos', comercioController.getCategoriasComercioDisponible); //Traerá las categorías de comercio de comercios activos
router.get('/:id', comercioController.getComercioById); // Trae un comercio por ID  



export default router; // Exporta el router para usarlo en app.js