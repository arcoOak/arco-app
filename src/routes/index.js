
import express from 'express'; // Importa express usando ES Modules
import usuarioRoutes from './usuario.routes.js'; // Importa las rutas de usuarios
import reservasRoutes from './reservas.routes.js'; // Importa las rutas de reservas
import sociosRoutes from './socios.routes.js'; // Importa las rutas de socios
import familiaresRoutes from './familiares.routes.js'; // Importa las rutas de familiares
import dataRoutes from './data.routes.js'; // Importa las rutas de datos

const router = express.Router();
router.use('/usuarios', usuarioRoutes); // Monta las rutas de usuarios en /api/usuarios
router.use('/reservas', reservasRoutes); // Monta las rutas de reservas en /api
router.use('/socios', sociosRoutes); // Monta las rutas de socios en /api/socios
router.use('/familiares', familiaresRoutes); // Monta las rutas de familiares en /api/familiares
router.use('/data', dataRoutes); // Monta las rutas de datos en /api/data


export default router;