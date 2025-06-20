
import express from 'express'; // Importa express usando ES Modules
import usuarioRoutes from './usuario.routes.js'; // Importa las rutas de usuarios
import reservasRoutes from './reservas.routes.js'; // Importa las rutas de reservas
import sociosRoutes from './socios.routes.js'; // Importa las rutas de socios
import familiaresRoutes from './familiares.routes.js'; // Importa las rutas de familiares

const router = express.Router();
router.use('/usuarios', usuarioRoutes); // Monta las rutas de usuarios en /api/usuarios
router.use('/reservas', reservasRoutes); // Monta las rutas de reservas en /api
router.use('/socios', sociosRoutes); // Monta las rutas de socios en /api/socios
router.use('/familiares', familiaresRoutes); // Monta las rutas de familiares en /api/familiares

export default router;