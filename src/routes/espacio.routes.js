import express from 'express';
import espacioController from '../controllers/espacio.controller.js'; // Importa el controlador de espacios

const router = express.Router();

router.get('/', espacioController.getAllEspaciosReservables); // Trae todos los espacios reservables
router.get('/categoria/:id_categoria_espacio', espacioController.getEspacioByCategoria); // Trae espacios por categoría

router.get('/unidades/:id', espacioController.getEspacioUnidadesById); // Trae unidades de un espacio por ID
router.get('/categorias-disponibles', espacioController.getCategoriasEspacioDisponible); // Trae categorías de espacios disponibles
router.get('/:id', espacioController.getEspacioById); // Trae un espacio por



export default router; // Exporta el router para usarlo en app.js