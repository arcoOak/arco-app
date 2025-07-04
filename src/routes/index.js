
import express from 'express'; // Importa express usando ES Modules
import usuarioRoutes from './usuario.routes.js'; // Importa las rutas de usuarios
import reservasRoutes from './reservas.routes.js'; // Importa las rutas de reservas
import comercioRoutes from './comercio.routes.js'; // Importa las rutas de comercio
import productoRoutes from './producto.routes.js'; // Importa las rutas de productos
import sociosRoutes from './socios.routes.js'; // Importa las rutas de socios
import familiaresRoutes from './familiares.routes.js'; // Importa las rutas de familiares
import dataRoutes from './data.routes.js'; // Importa las rutas de datos
import loginRoutes from './login.routes.js'; // Importa las rutas de login

const router = express.Router();
router.use('/usuarios', usuarioRoutes); // Monta las rutas de usuarios en /api/usuarios
router.use('/reservas', reservasRoutes); // Monta las rutas de reservas en /api
router.use('/comercios', comercioRoutes); // Monta las rutas de comercio en /api/comercios
router.use('/productos', productoRoutes); // Monta las rutas de productos en /api/productos
router.use('/socios', sociosRoutes); // Monta las rutas de socios en /api/socios
router.use('/familiares', familiaresRoutes); // Monta las rutas de familiares en /api/familiares
router.use('/data', dataRoutes); // Monta las rutas de datos en /api/data
router.use('/login', loginRoutes); // Monta las rutas de login en /api/login

export default router;