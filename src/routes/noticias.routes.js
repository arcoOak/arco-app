import express from 'express';

import noticiasController from '../controllers/noticias.controller.js'; // Importa el controlador de noticias

const router = express.Router();

router.get('/:id_club', noticiasController.getAllNoticias);
router.get('/:id_club/ultima', noticiasController.getUltimasNoticias);
router.get('/:id_club/:id_noticia', noticiasController.getNoticiaPorId);
router.get('/:id_club/categoria/activas', noticiasController.getCategoriasNoticias);
router.get('/:id_club/categoria/:id_categoria', noticiasController.getNoticiasPorCategoria);
router.get('/:id_club/mes/:mes/anho/:anho', noticiasController.getNoticiasPorMesAnho);


export default router;
