// src/config/db.config.js

import mysql from 'mysql2/promise'; // Usamos la versión con promesas para async/await
import dotenv from 'dotenv'; // Importar dotenv para manejar variables de entorno

dotenv.config(); // Cargar variables de entorno desde .env
// require('dotenv').config(); // Cargar variables de entorno

const dbConfigPool = {
  queueLimit: 0, // Sin límite de cola
  connectionLimit: 100, // Número máximo de conexiones en el pool
  waitForConnections: true, // Esperar conexiones si el pool está lleno
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
};

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

const HEARTBEAT_INTERVAL = 60000; // 50 segundos, debe ser menor que el wait_timeout de MySQL
let heartbeatIntervalId = null;

/**
 * Inicia un "heartbeat" para mantener las conexiones del pool activas.
 * Ejecuta un ping a la base de datos a intervalos regulares.
 */
const startHeartbeat = () => {
  if (heartbeatIntervalId) return; // Evitar iniciar múltiples intervalos

  console.log('Iniciando heartbeats para el pool de conexiones...');
  heartbeatIntervalId = setInterval(async () => {
    try {
      const connection = await pool.getConnection();
      await connection.ping();
      connection.release();
      // console.log('Heartbeat: Ping a la base de datos exitoso.'); // Descomentar para depuración
    } catch (error) {
      console.error('Heartbeat: Error en el ping a la base de datos:', error);
      // El pool manejará la reconexión de esta conexión la próxima vez que se use.
    }
  }, HEARTBEAT_INTERVAL);
};

const stopHeartbeat = () => {
  if (heartbeatIntervalId) {
    clearInterval(heartbeatIntervalId);
    heartbeatIntervalId = null;
    console.log('Heartbeats detenidos.');
  }
};

const gracefulShutdown = async () => {
  console.log('Cerrando el pool de conexiones de la base de datos...');
  stopHeartbeat();
  await pool.end();
  console.log('Pool de conexiones cerrado.');
};

startHeartbeat(); // Inicia el heartbeat cuando se carga el módulo

export { pool, gracefulShutdown };
