
import express from 'express'; // Importa express usando ES Modules
import usuarioRoutes from './usuario.routes.js'; // Importa las rutas de usuarios
import clubRoutes from './club.routes.js'; // Importa las rutas de club
import climaRoutes from './clima.routes.js'; // Importa las rutas de clima
import billeteraRoutes from './billetera.routes.js'; // Importa las rutas de billetera
import noticiasRoutes from './noticias.routes.js'; // Importa las rutas de noticias
import espacioRoutes from './espacio.routes.js'; // Importa las rutas de espacios
import reservasRoutes from './reservas.routes.js'; // Importa las rutas de reservas
import reservaServicioRoutes from './reservaServicio.routes.js'; // Importa las rutas de reservas de servicios
import serviciosRoutes from './servicios.routes.js'; // Importa las rutas de servicios
import qrtokenRoutes from './qrtoken.routes.js'; // Importa las rutas de token QR
import invitacionesQrRoutes from './invitaciones_correo.routes.js'; // Importa las rutas de invitaciones QR
import comercioRoutes from './comercio.routes.js'; // Importa las rutas de comercio
import productoRoutes from './producto.routes.js'; // Importa las rutas de productos
import sociosRoutes from './socios.routes.js'; // Importa las rutas de socios
import familiaresRoutes from './familiares.routes.js'; // Importa las rutas de familiares
import invitadosRoutes from './invitados.routes.js'; // Importa las rutas de invitados
import dataRoutes from './data.routes.js'; // Importa las rutas de datos
import loginRoutes from './login.routes.js'; // Importa las rutas de login


const router = express.Router();
router.use('/usuarios', usuarioRoutes); // Monta las rutas de usuarios en /api/usuarios
router.use('/club', clubRoutes); // Monta las rutas de club en /api/club
router.use('/clima', climaRoutes); // Monta las rutas de clima en /api/clima
router.use('/billetera', billeteraRoutes); // Monta las rutas de billetera en /api/billetera
router.use('/noticias', noticiasRoutes); // Monta las rutas de noticias en /api/noticias
router.use('/espacios', espacioRoutes); // Monta las rutas de espacios en /api/espacios
router.use('/reservas', reservasRoutes); // Monta las rutas de reservas en /api
router.use('/reservas-servicios', reservaServicioRoutes); // Monta las rutas de reservas de servicios en /api/reservas-servicios
router.use('/servicios', serviciosRoutes); // Monta las rutas de servicios en /api/servicios
router.use('/qrtoken', qrtokenRoutes); // Monta las rutas de token QR en /api/qrtoken
router.use('/invitaciones', invitacionesQrRoutes); // Monta las rutas de invitaciones QR en /api/invitaciones
router.use('/comercios', comercioRoutes); // Monta las rutas de comercio en /api/comercios
router.use('/productos', productoRoutes); // Monta las rutas de productos en /api/productos
router.use('/socios', sociosRoutes); // Monta las rutas de socios en /api/socios
router.use('/familiares', familiaresRoutes); // Monta las rutas de familiares en /api/familiares.
router.use('/invitados', invitadosRoutes); // Monta las rutas de invitados en /api/invitados
router.use('/data', dataRoutes); // Monta las rutas de datos en /api/data
router.use('/login', loginRoutes); // Monta las rutas de login en /api/login

export default router;