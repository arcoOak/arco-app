// src/config/db.config.js

import mysql from 'mysql2/promise'; // Usamos la versión con promesas para async/await
import dotenv from 'dotenv'; // Importar dotenv para manejar variables de entorno

dotenv.config(); // Cargar variables de entorno desde .env
// require('dotenv').config(); // Cargar variables de entorno

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

const dbConfigPool = {
  queueLimit: 0, // Sin límite de cola
  connectionLimit: 100, // Número máximo de conexiones en el pool
  waitForConnections: true, // Esperar conexiones si el pool está lleno
  ...dbConfig, // Usar la misma configuración de conexión
}

// async function connectToDatabase() {
//   try {
//     const connection = await mysql.createConnection(dbConfig);
//     console.log('Conexión a MySQL establecida con éxito!');
//     return connection;
//   } catch (error) {
//     console.error('Error al conectar a MySQL:', error);
//     process.exit(1); // Terminar el proceso si no se puede conectar a la DB
//   }
// }

// async function poolConection() {
//   try {
//     const pool = mysql.createPool(dbConfigPool);
//     console.log('Conexión a Pool de conexiones MySQL creada con éxito!');
//     return pool;
//   } catch (error) {
//     console.error('Error al crear el pool de conexiones a MySQL:', error);
//     process.exit(1); // Terminar el proceso si no se puede crear el pool
//   }
// }

const pool = mysql.createPool(dbConfigPool);

export default pool;
