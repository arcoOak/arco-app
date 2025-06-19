// src/controllers/users.controller.js
const connectToDatabase = require('../config/db.config'); // Importa la función de conexión

// Función para obtener todos los usuarios
async function getAllUsuarios(req, res) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id, name, email FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuarios' });
  } finally {
    if (connection) connection.end(); // Cierra la conexión
  }
}

// Función para obtener un usuario por ID
async function getUserById(req, res) {
  const userId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id, name, email FROM users WHERE id = ?', [userId]);
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
async function createUser(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Faltan campos obligatorios: name, email, password' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    // En una aplicación real, deberías hashear la contraseña antes de guardarla
    const [result] = await connection.execute(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
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
async function updateUser(req, res) {
  const userId = req.params.id;
  const { name, email } = req.body; // No permitas actualizar la contraseña directamente desde aquí en una app real sin validación
  if (!name && !email) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email) WHERE id = ?',
      [name, email, userId]
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
async function deleteUser(req, res) {
  const userId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM users WHERE id = ?', [userId]);

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

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};