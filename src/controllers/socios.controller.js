// src/controllers/users.controller.js

import connectToDatabase from '../config/db.config.js'; // Importa la función de conexión a la base de datos

// Función para obtener todos los usuarios
async function getAllSocios(req, res) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
        'SELECT id_socio, id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, b.nombre_genero FROM socios LEFT JOIN data_genero b ON socios.id_genero = b.id_genero '
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener socios:', error);
    res.status(500).json({ message: 'Error interno del servidor al obtener socios' });
  } finally {
    if (connection) connection.end(); // Cierra la conexión
  }
}

// Función para obtener un usuario por ID
async function getSocioById(req, res) {
  const socioId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, b.nombre_genero FROM socios LEFT JOIN data_genero b ON socios.id_genero = b.id_genero WHERE id_socio = ?', [socioId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Socio no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener socio con ID ${socioId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener socio' });
  } finally {
    if (connection) connection.end();
  }
}




// Función para crear un nuevo usuario
async function createSocio(req, res) {
  const { id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero } = req.body;
  if (!id_usuario || !nombre || !apellido || !documento_identidad || !fecha_nacimiento || !telefono || !direccion || !id_genero) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    // En una aplicación real, deberías hashear la contraseña antes de guardarla
    const [result] = await connection.execute(
        'INSERT INTO socios (id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, id_genero) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
        [id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero]
    );
    res.status(201).json({ message: 'Socio creado exitosamente', userId: result.insertId });
  } catch (error) {
    console.error('Error al crear socio:', error);
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
async function updateSocio(req, res) {
  const socioId = req.params.id;
  const { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero } = req.body; 
  if (!nombre && !apellido && !documento_identidad && !fecha_nacimiento && !telefono && !direccion && !id_genero) {
    return res.status(400).json({ message: 'No hay datos para actualizar' });
  }

  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE socios SET nombre = ?, apellido = ?, documento_identidad = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?, id_genero = ? WHERE id_socio = ?',
        [nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero,  socioId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Socio no encontrado para actualizar' });
    }
    res.json({ message: 'Socio actualizado exitosamente' });
  } catch (error) {
    console.error(`Error al actualizar socio con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al actualizar socio' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para eliminar un usuario
async function deleteSocio(req, res) {
  const socioId = req.params.id;
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM socio WHERE id_socio = ?', [socioId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Socio no encontrado para eliminar' });
    }
    res.json({ message: 'Socio eliminado exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar socio con ID ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar socio' });
  } finally {
    if (connection) connection.end();
  }
}

// Función para obtener usuarios por rol
async function getSocioByUsuario(req, res) {
  const usuarioId = req.params.user;
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT id_socio, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, b.nombre_genero FROM socios LEFT JOIN data_genero b ON socios.id_genero = b.id_genero WHERE id_usuario = ?', [usuarioId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Socio no encontrados' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error al obtener socio con id usuario ${userId}:`, error);
    res.status(500).json({ message: 'Error interno del servidor al obtener usuario' });
  } finally {
    if (connection) connection.end();
  }
}

export default {
  getAllSocios,
  getSocioById,
  createSocio,
  updateSocio,
  deleteSocio,
  getSocioByUsuario,
};