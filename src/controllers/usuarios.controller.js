// src/controllers/users.controller.js

import connectToDatabase from '../config/db.config.js'; // Importa la función de conexión a la base de datos

// Función para obtener todos los usuarios
async function getAllUsuarios(req, res) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
        'SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios'
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuarios' });
  } finally {
    if (connection) connection.end(); // Cierra la conexión
  }
}

// Función para obtener un usuario por ID
async function getUsuarioById(req, res) {
  const userId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_usuario = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener usuario con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuario' });
  } finally {
    if (connection) connection.end();
  }
}




// Función para crear un nuevo usuario
async function createUsuario(req, res) {
  const { email, contrasena, id_rol } = req.body;
  if (!email || !contrasena || !id_rol) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: email, contraseña, rol' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    // En una aplicación real, deberías hashear la contraseña antes de guardarla
    const [result] = await connection.execute(
        'INSERT INTO usuarios (email, contrasena_hash, id_rol, fecha_creacion, activo) VALUES (?, ?, ?, NOW(), 1)',
        [email, contrasena, id_rol]
    );
    res.status(201).json({ message: 'Usuario creado exitosamente', userId: result.insertId });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    // Manejo de errores específicos, ej. email duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }
    res.status(500).json({ message: 'Error interno del servidor al crear usuario' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para actualizar un usuario
async function updateUsuario(req, res) {
  const userId = req.params.id;
  const { nombre, email } = req.body; // No permitas actualizar la contraseña directamente desde aquí en una app real sin validación
  if (!nombre && !email) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE usuarios SET email = COALESCE(?, email), nombre = COALESCE(?, nombre) WHERE id_usuario = ?',
        [email, nombre, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
    }
    res.json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error(`Error al actualizar usuario con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar usuario' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para eliminar un usuario
async function deleteUsuario(req, res) {
  const userId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM usuarios WHERE id_usuario = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar usuario con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar usuario' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para obtener usuarios por rol
async function getUsuariosByRole(req, res) {
  const rolId = req.params.role;
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id_usuario, email, id_rol, fecha_creacion, activo FROM usuarios WHERE id_rol = ?', [rolId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuarios no encontrados' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener usuario en este rol ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuario' });
  } finally {
    if (connection) connection.end();
  }
}

export default {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getUsuariosByRole,
};