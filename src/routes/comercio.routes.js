import express from 'express';
import comercioController from '../controllers/comercio.controller.js'; // Importa el controlador de comercio

const router = express.Router();

router.get('/:id_club', comercioController.getAllComercios); // Trae todos los comercios
router.get('/:id_club/activos/:id_tipo_comercio', comercioController.getAllComerciosActivos); // Trae todos los comercios activos
router.get('/:id_club/categorias-activos/:id_tipo_comercio', comercioController.getCategoriasComercioDisponible); //Traerá las categorías de comercio de comercios activos
router.get('/individual/:id', comercioController.getComercioById); // Trae un comercio por ID  



export default router; // Exporta el router para usarlo en app.js