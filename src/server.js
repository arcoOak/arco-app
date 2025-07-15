

import app from './app.js'; // Importa la aplicación Express configurada
import serverConfig from './config/server.config.js'; // Importa la configuración del servidor
 //import {connectToDatabase, poolConection} from './config/db.config.js'; // Solo si lo usas para iniciar el servidor

import pool from './config/db.config.js'; // Importa el pool de conexiones a la base de datos

const PORT = serverConfig.port;

// Iniciar el servidor
// async function startServer() {
//     try {
//         // Opcional: Asegúrate de que la conexión a la DB se pueda establecer antes de iniciar el servidor
//         await connectToDatabase(); // Puedes llamar a esto aquí si quieres que el servidor no inicie si no hay DB
//         app.listen(PORT, () => {
//             console.log(`Servidor escuchando en http://localhost:${PORT}`);
//         });
//     } catch (error) {
//         console.error('Error al iniciar el servidor:', error);
//         process.exit(1);
//     }
// }

// startServer();

function startServer() {
    try {
        // Iniciar el pool de conexiones a la base de datos
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1); // Terminar el proceso si hay un error
    }
}
startServer(); // Llamar a la función para iniciar el servidor