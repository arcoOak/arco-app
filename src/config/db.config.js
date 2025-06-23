// src/config/db.config.js
const mysql = require('mysql2/promise'); // Usamos la versión con promesas para async/await
require('dotenv').config(); // Cargar variables de entorno

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Conexión a MySQL establecida con éxito!');
    return connection;
  } catch (error) {
    console.error('Error al conectar a MySQL:', error);
    process.exit(1); // Terminar el proceso si no se puede conectar a la DB
  }
}

module.exports = connectToDatabase;