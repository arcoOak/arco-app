// src/controllers/users.controller.js

import connectToDatabase from '../config/db.config.js'; // Importa la función de conexión a la base de datos

// Función para obtener todos los usuarios
async function getAllFamiliares(req, res) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
        'SELECT a.id_familiar, a.id_usuario, a.nombre, a.apellido, a.documento_identidad, a.fecha_nacimiento, a.telefono, a.direccion, a.fecha_ingreso_club, b.nombre_genero, c.nombre_parentesco FROM familiares a LEFT JOIN data_genero b ON a.id_genero = b.id_genero LEFT JOIN data_parentesco c ON a.id_parentesco = c.id_parentesco AND a.id_genero = c.id_genero' 
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener familiares:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener familiares' });
  } finally {
    if (connection) connection.end(); // Cierra la conexión
  }
}

// Función para obtener un usuario por ID
async function getFamiliarById(req, res) {
  const familiarId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT a.id_usuario, a.nombre, a.apellido, a.documento_identidad, a.fecha_nacimiento, a.telefono, a.direccion, a.fecha_ingreso_club, b.nombre_genero, c.nombre_parentesco FROM familiares a LEFT JOIN data_genero b ON a.id_genero = b.id_genero LEFT JOIN data_parentesco c ON a.id_parentesco = c.id_parentesco AND a.id_genero = c.id_genero WHERE a.id_familiar = ?', [familiarId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Familiar no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener familiar con ID ${familiarId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener familiar' });
  } finally {
    if (connection) connection.end();
  }
}




// Función para crear un nuevo usuario
async function createFamiliar(req, res) {
  const { id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco } = req.body;
  if (!id_usuario || !nombre || !apellido || !documento_identidad || !fecha_nacimiento || !telefono || !direccion || !id_genero || !id_parentesco) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    // En una aplicación real, deberías hashear la contraseña antes de guardarla
    const [result] = await connection.execute(
        'INSERT INTO familiares (id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, id_genero, id_parentesco) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)',
        [id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco]
    );
    res.status(201).json({ message: 'Familiar creado exitosamente', userId: result.insertId });
  } catch (error) {
    console.error('Error al crear familiar:', error);
    // Manejo de errores específicos, ej. documento de identificacion duplicado
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Documento de identificación ya existe' });
    }
    res.status(500).json({ message: 'Error interno del servidor al crear socio' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para actualizar un usuario
async function updateFamiliar(req, res) {
  const usuarioId = req.params.id;
  const { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco } = req.body; 
  if (!nombre && !apellido && !documento_identidad && !fecha_nacimiento && !telefono && !direccion) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE familiares SET nombre = ?, apellido = ?, documento_identidad = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?, id_genero = ?, id_parentesco = ? WHERE id_usuario = ?',
        [nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco, usuarioId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Familiar no encontrado para actualizar' });
    }
    res.json({ message: 'Farmiliar actualizado exitosamente' });
  } catch (error) {
    console.error(`Error al actualizar Familiar con ID ${usuarioId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar socio' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para eliminar un usuario
async function deleteFamiliar(req, res) {
  const familiarId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM familiar WHERE id_familiar = ?', [familiarId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Familiar no encontrado para eliminar' });
    }
    res.json({ message: 'Familiar eliminado exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar Familiar con ID ${familiarId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar Familiar' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para obtener usuarios por rol
async function getFamiliaresByUsuario(req, res) {
  const usuarioId = req.params.user;
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT a.id_familiar, a.nombre, a.apellido, a.documento_identidad, a.fecha_nacimiento, a.telefono, a.direccion, a.fecha_ingreso_club, b.nombre_genero, c.nombre_parentesco FROM familiares a LEFT JOIN data_genero b ON a.id_genero = b.id_genero LEFT JOIN data_parentesco c ON a.id_parentesco = c.id_parentesco AND a.id_genero = c.id_genero WHERE a.id_usuario = ?', [usuarioId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Familiares no encontrados' });
    }
    res.json(rows);
  } catch (error) {
    console.error(`Error al obtener familiares con id usuario ${usuarioId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener familiares' });
  } finally {
    if (connection) connection.end();
  }
}

export default {
  getAllFamiliares,
  getFamiliarById,
  createFamiliar,
  updateFamiliar,
  deleteFamiliar,
  getFamiliaresByUsuario,
};