import dotenv from 'dotenv';
dotenv.config(); // Cargar variables de entorno desde .env


const serverConfig = {
    port: process.env.PORT || 3000, // Puerto por defecto si no está en .env
};

export default serverConfig;
