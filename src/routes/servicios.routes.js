import express from 'express'; // Importa express usando CommonJS
import servicioController from '../controllers/servicios.controller.js'; // Importa el controlador de servicios

const router = express.Router();

router.get('/todos/:id_club', servicioController.getTodosServicios); // GET /api/servicios/todos/:id_club
router.get('/home/:id_club', servicioController.getHomeServicios); // GET /api/servicios/home/:id_club
router.get('/ofertas/:id_club', servicioController.getTodasOfertasServiciosComercio); // GET /api/servicios/ofertas/:id_club
router.get('/categorias/:id_club', servicioController.getCategoriasServiciosActivos); // GET /api/servicios/categorias/:id_club
router.get('/servicio/:id_servicio', servicioController.getServicioPorId); // GET /api/servicios/servicio/:id_servicio
router.get('/empresas/:id_servicio', servicioController.getEmpresasReservadorasPorServicio); // GET /api/servicios/empresas/:id_servicio
router.get('/servicio/empresa/:id_empresa', servicioController.getServiciosPorEmpresaReservadora); // GET /api/servicios/empresa/:id_empresa
router.get('/categorias/empresa/:id_empresa', servicioController.getCategoriasServiciosActivosPorEmpresaReservadora); // GET /api/servicios/categorias/empresa/:id_empresa

export default router; // Exporta el router para usarlo en app.js