import connectToDatabase from '../config/db.config.js';

// Obtener todos los socios
async function getAllSociosDB() {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT id_socio, id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, b.nombre_genero FROM socios LEFT JOIN data_genero b ON socios.id_genero = b.id_genero'
    );
    return rows;
  } finally {
    if (connection) connection.end();
  }
}

// Obtener socio por ID
async function getSocioByIdDB(socioId) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, b.nombre_genero FROM socios LEFT JOIN data_genero b ON socios.id_genero = b.id_genero WHERE id_socio = ?',
      [socioId]
    );
    return rows[0] || null;
  } finally {
    if (connection) connection.end();
  }
}

// Crear socio
async function createSocioDB({ id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero }) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'INSERT INTO socios (id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, id_genero) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
      [id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero]
    );

    if (result.affectedRows === 0) {
      return null; // No se creó el socio
    }

    const row = await getSocioByIdDB(result.insertId);
    if(!row) {
      throw new Error('Socio no encontrado después de la creación');
    }
    return row; // Devuelve el socio recién creado
    
  } finally {
    if (connection) connection.end();
  }
}

// Actualizar socio
async function updateSocioDB(socioId, { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero }) {
  let connection;
  console.log(`Actualizando socio con ID: ${socioId}`, { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero });
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'UPDATE socios SET nombre = ?, apellido = ?, documento_identidad = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?, id_genero = ? WHERE id_socio = ?',
      [nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, socioId]
    );

    if (result.affectedRows === 0) {
      return null; // No se encontró el socio para actualizar
    }
    const row = await getSocioByIdDB(socioId);
    if (!row) {
      throw new Error('Socio no encontrado después de la actualización');
    }
    return row; // Devuelve el socio actualizado

  } finally {
    if (connection) connection.end();
  }
}

// Eliminar socio
async function deleteSocioDB(socioId) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await connection.execute(
      'DELETE FROM socios WHERE id_socio = ?', [socioId]
    );
    return result.affectedRows;
  } finally {
    if (connection) connection.end();
  }
}

// Obtener socio por id_usuario
async function getSocioByUsuarioDB(usuarioId) {
  let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      'SELECT id_socio, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, b.nombre_genero FROM socios LEFT JOIN data_genero b ON socios.id_genero = b.id_genero WHERE id_usuario = ?',
      [usuarioId]
    );
    return rows[0] || null;
  } finally {
    if (connection) connection.end();
  }
}

export {
  getAllSociosDB,
  getSocioByIdDB,
    createSocioDB,
    updateSocioDB,
    deleteSocioDB,
    getSocioByUsuarioDB
    };