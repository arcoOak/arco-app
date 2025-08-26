

import {pool} from '../config/db.config.js';

import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10; // Número de rondas para el hash de la contraseña

// Función para obtener todos los usuarios
async function getAllUsuariosDB() {
  try {
    const [rows] = await pool.execute(
        'SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios'
    );
    return rows; // Devuelve los usuarios obtenidos
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

// Función para obtener un usuario por ID
async function getUsuarioByIdDB(userId) {
  try {
    const [rows] = await pool.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_usuario = ?', [userId]);
   
    return rows[0] || null; // Devuelve el usuario encontrado
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${userId}:`, error);
    throw error;
  } 
}




// Función para crear un nuevo usuario
async function createUsuarioDB(email, contrasena, id_rol) {
  try {
    // Hashear la contraseña antes de guardarla
    const contrasenaHash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const [result] = await pool.execute(
        'INSERT INTO usuarios (email, contrasena_hash, id_rol, fecha_creacion, activo) VALUES (?, ?, ?, NOW(), 1)',
        [email, contrasenaHash, id_rol]
    );

    if (result.affectedRows === 0) {
      return null; // No se creó el usuario
    }

    const newUser = await getUsuarioByIdDB(result.insertId);
    if (!newUser) {
      throw new Error('Usuario no encontrado después de la creación');
    }
    return newUser; // Devuelve el usuario recién creado
    
  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Manejo de errores específicos, ej. email duplicado
    throw error;
  }
}

// Función para actualizar un usuario
async function updateUsuarioDB(userId, email) {
  try {
    const [result] = await pool.execute(
      'UPDATE usuarios SET email = COALESCE(?, email) WHERE id_usuario = ?',
        [email, userId]
    );
    
    if (result.affectedRows === 0) {
      return null; // No se encontró el usuario para actualizar
    }

    const updatedUser = await getUsuarioByIdDB(userId);
    if (!updatedUser) {
      throw new Error('Usuario no encontrado después de la actualización');
    }
    return updatedUser; // Devuelve el usuario actualizado

  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${userId}:`, error);
    throw error;
  }
}

// Función para eliminar un usuario
async function deleteUsuarioDB(userId) {
  try {
    const [result] = await pool.execute('DELETE FROM usuarios WHERE id_usuario = ?', [userId]);

    return result.affectedRows;
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${userId}:`, error);
    throw error;
  } 
}

// Función para obtener usuarios por rol
async function getUsuariosByRoleDB(rolId) {
  try {
    const [rows] = await pool.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_rol = ?', [rolId]);
    return rows;
  } catch (error) {
    console.error(`Error al obtener usuarios en este rol ${rolId}:`, error);
    throw error;
  }
}

async function updateContrasenaUsuarioDB(userId, contrasena, contrasenaNueva) {
  try {
    // 1. Obtener el usuario y su hash de contraseña actual
    const [rows] = await pool.execute('SELECT contrasena_hash FROM usuarios WHERE id_usuario = ?', [userId]);

    if (rows.length === 0) {
      return null; // Usuario no encontrado
    }

    const user = rows[0];
    
    // 2. Comparar la contraseña proporcionada con el hash almacenado
    const contrasenaValida = await bcrypt.compare(contrasena, user.contrasena_hash);

    if (!contrasenaValida) {
      return null; // La contraseña actual no coincide
    }

    // 3. Hashear la nueva contraseña
    const nuevaContrasenaHash = await bcrypt.hash(contrasenaNueva, SALT_ROUNDS);

    // 4. Actualizar la contraseña en la base de datos
    const [result] = await pool.execute(
      'UPDATE usuarios SET contrasena_hash = ? WHERE id_usuario = ?',
      [nuevaContrasenaHash, userId]
    );

    if (result.affectedRows === 0) {
      // Esto no debería ocurrir si los pasos anteriores tuvieron éxito, pero es una buena práctica
      throw new Error('No se pudo actualizar la contraseña.');
    }

    return { message: 'Contraseña actualizada correctamente' };
  } catch (error) {
    console.error(`Error al actualizar contraseña del usuario con ID ${userId}:`, error);
    throw error;
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