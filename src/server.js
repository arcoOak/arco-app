

import app from './app.js'; // Importa la aplicación Express configurada
import serverConfig from './config/server.config.js'; // Importa la configuración del servidor
 import connectToDatabase from './config/db.config.js'; // Solo si lo usas para iniciar el servidor

const PORT = serverConfig.port;

// Iniciar el servidor
async function startServer() {
    try {
        // Opcional: Asegúrate de que la conexión a la DB se pueda establecer antes de iniciar el servidor
        await connectToDatabase(); // Puedes llamar a esto aquí si quieres que el servidor no inicie si no hay DB
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

startServer();