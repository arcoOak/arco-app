require('dotenv').config();

const serverConfig = {
    port: process.env.PORT || 3000, // Puerto por defecto si no está en .env
};

module.exports = serverConfig;