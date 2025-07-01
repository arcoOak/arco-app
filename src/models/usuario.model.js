// src/controllers/users.controller.js

// import {connectToDatabase, poolConection} from '../config/db.config.js'; // Importa la función de conexión a la base de datos

import pool from '../config/db.config.js';

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; // Número de rondas para el hash de la contraseña

// Función para obtener todos los usuarios
async function getAllUsuariosDB() {
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
        'SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios'
    );
    return rows; // Devuelve los usuarios obtenidos
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  } finally {
    //if (connection) connection.end(); // Cierra la conexión
  }
}

// Función para obtener un usuario por ID
async function getUsuarioByIdDB(userId) {
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_usuario = ?', [userId]);
   
    return rows[0] || null; // Devuelve el usuario encontrado
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${userId}:`, error);
    throw error;
  } finally {
    //if (connection) connection.end();
    
  }
}




// Función para crear un nuevo usuario
async function createUsuarioDB(email, contrasena, id_rol) {
  //let connection;
  try {
    //connection = await connectToDatabase();
    // En una aplicación real, deberías hashear la contraseña antes de guardarla
    const [result] = await pool.execute(
        'INSERT INTO usuarios (email, contrasena_hash, id_rol, fecha_creacion, activo) VALUES (?, ?, ?, NOW(), 1)',
        [email, contrasena, id_rol]
    );

    if (result.affectedRows === 0) {
      return null; // No se creó el usuario
    }

    const [row] = await getUsuarioByIdDB(result.insertId);
    if (row.length === 0) {
      throw new Error('Usuario no encontrado después de la creación');
    }
    return row; // Devuelve el usuario recién creado
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Manejo de errores específicos, ej. email duplicado
    throw error;
  } finally {
    //if (connection) connection.end();
  }
}

// Función para actualizar un usuario
async function updateUsuarioDB(userId, nombre, email) {
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [result] = await pool.execute(
      'UPDATE usuarios SET email = COALESCE(?, email), nombre = COALESCE(?, nombre) WHERE id_usuario = ?',
        [email, nombre, userId]
    );
    
    if (result.affectedRows === 0) {
      return null; // No se encontró el usuario para actualizar
    }

    const row = await getUsuarioByIdDB(userId);
    if (!row) {
      throw new Error('Usuario no encontrado después de la actualización');
    }
    return row; // Devuelve el usuario actualizado

  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${userId}:`, error);
    throw error;
} finally {
    //if (connection) connection.end();
  }
}

// Función para eliminar un usuario
async function deleteUsuarioDB(userId) {
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [result] = await pool.execute('DELETE FROM usuarios WHERE id_usuario = ?', [userId]);

    return result.affectedRows;
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${userId}:`, error);
    throw error;
  } finally {
    //if (connection) connection.end();
  }
}

// Función para obtener usuarios por rol
async function getUsuariosByRoleDB(rolId) {
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_rol = ?', [rolId]);
    return rows;
  } catch (error) {
    console.error(`Error al obtener usuario en este rol ${userId}:`, error);
    throw error;
  } finally {
    //if (connection) connection.end();
  }
}

async function updateContrasenaUsuarioDB(userId, contrasena, contrasenaNueva) {
  //let connection;
  try {

    const contrasenaIntroducidaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);
    const nuevaContrasenaHash = await bcrypt.hash(contrasenaNueva, SALT_ROUNDS);

    //connection = await connectToDatabase();
    // Aquí deberías verificar la contraseña actual antes de actualizarla
    const [result] = await pool.execute(
      'UPDATE usuarios SET contrasena_hash = ? WHERE id_usuario = ? AND contrasena_hash = ?',
      [nuevaContrasenaHash, userId, contrasenaIntroducidaHash]
    );

    if (result.affectedRows === 0) {
      return null; // No se encontró el usuario o la contraseña no coincide
    }

    return { message: 'Contraseña actualizada correctamente' };
  } catch (error) {
    console.error(`Error al actualizar contraseña del usuario con ID ${userId}:`, error);
    throw error;
  } finally {
    //if (connection) connection.end();
  }
}

export {
  getAllUsuariosDB,
  getUsuarioByIdDB,
  createUsuarioDB,
  updateUsuarioDB,
  deleteUsuarioDB,
  getUsuariosByRoleDB,
  updateContrasenaUsuarioDB,
};