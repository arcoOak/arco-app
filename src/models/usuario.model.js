// src/controllers/users.controller.js

import connectToDatabase from '../config/db.config.js'; // Importa la función de conexión a la base de datos

// Función para obtener todos los usuarios
async function getAllUsuariosDB() {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
        'SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios'
    );
    return rows; // Devuelve los usuarios obtenidos
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  } finally {
    if (connection) connection.end(); // Cierra la conexión
  }
}

// Función para obtener un usuario por ID
async function getUsuarioByIdDB(userId) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_usuario = ?', [userId]);
   
    return rows[0] || null; // Devuelve el usuario encontrado
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${userId}:`, error);
    throw error;
  } finally {
    if (connection) connection.end();
    
  }
}




// Función para crear un nuevo usuario
async function createUsuarioDB(email, contrasena, id_rol) {
  let connection;
  try {
    connection = await connectToDatabase();
    // En una aplicación real, deberías hashear la contraseña antes de guardarla
    const [result] = await connection.execute(
        'INSERT INTO usuarios (email, contrasena_hash, id_rol, fecha_creacion, activo) VALUES (?, ?, ?, NOW(), 1)',
        [email, contrasena, id_rol]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Manejo de errores específicos, ej. email duplicado
    throw error;
  } finally {
    if (connection) connection.end();
  }
}

// Función para actualizar un usuario
async function updateUsuarioDB(userId, nombre, email) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE usuarios SET email = COALESCE(?, email), nombre = COALESCE(?, nombre) WHERE id_usuario = ?',
        [email, nombre, userId]
    );
    return result.affectedRows;

  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${userId}:`, error);
    throw error;
} finally {
    if (connection) connection.end();
  }
}

// Función para eliminar un usuario
async function deleteUsuarioDB(userId) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM usuarios WHERE id_usuario = ?', [userId]);

    return result.affectedRows;
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${userId}:`, error);
    throw error;
  } finally {
    if (connection) connection.end();
  }
}

// Función para obtener usuarios por rol
async function getUsuariosByRoleDB(rolId) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_rol = ?', [rolId]);
    return rows;
  } catch (error) {
    console.error(`Error al obtener usuario en este rol ${userId}:`, error);
    throw error;
  } finally {
    if (connection) connection.end();
  }
}

export {
  getAllUsuariosDB,
  getUsuarioByIdDB,
  createUsuarioDB,
  updateUsuarioDB,
  deleteUsuarioDB,
  getUsuariosByRoleDB,
};