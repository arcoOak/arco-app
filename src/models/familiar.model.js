
// import {connectToDatabase, poolConection} from '../config/db.config.js';
import pool from '../config/db.config.js';

// Obtener todos los familiares
async function getAllFamiliaresDB() {
  //let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT a.*, b.nombre_genero, c.nombre_parentesco
       FROM familiares a
       LEFT JOIN data_genero b ON a.id_genero = b.id_genero
       LEFT JOIN data_parentesco c ON a.id_parentesco = c.id_parentesco AND a.id_genero = c.id_genero`
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

// Obtener familiar por ID
async function getFamiliarByIdDB(familiarId) {
  //let connection;
  try {
    connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT a.*, b.nombre_genero, c.nombre_parentesco
       FROM familiares a
       LEFT JOIN data_genero b ON a.id_genero = b.id_genero
       LEFT JOIN data_parentesco c ON a.id_parentesco = c.id_parentesco AND a.id_genero = c.id_genero
       WHERE a.id_familiar = ?`, [familiarId]
    );
    return rows[0] || null;
  } finally {
    //if (connection) connection.end();
  }
}

// Crear familiar
async function createFamiliarDB({ id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco }) {
  //let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await pool.execute(
      `INSERT INTO familiares (id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, fecha_ingreso_club, id_genero, id_parentesco)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [id_usuario, nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco]
    );

    if (result.affectedRows === 0) {
      return null; // No se creó el familiar
    }

    // Traer el familiar recién creado
    const row = await getFamiliarByIdDB(result.insertId);
    if (!row) {
      throw new Error('Familiar no encontrado después de la creación');
    }
    return row;

  } finally {
    //if (connection) connection.end();
  }
}

// Actualizar familiar
async function updateFamiliarDB(familiarId, { nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco }) {
  //let connection;
  try {
    connection = await connectToDatabase();
    const [result] = await pool.execute(
      `UPDATE familiares SET nombre = ?, apellido = ?, documento_identidad = ?, fecha_nacimiento = ?, telefono = ?, direccion = ?, id_genero = ?, id_parentesco = ?
       WHERE id_familiar = ?`,
      [nombre, apellido, documento_identidad, fecha_nacimiento, telefono, direccion, id_genero, id_parentesco, familiarId]
    );
    if( result.affectedRows === 0) {
        return null; // No se encontró el familiar para actualizar
    }

    const row = await getFamiliarByIdDB(familiarId);
    if (!row) {
      throw new Error('Familiar no encontrado después de la actualización');
    }
    return row;

  } finally {
    //if (connection) connection.end();
  }
}

// Eliminar familiar
async function deleteFamiliarDB(familiarId) {
  //let connection;
  try {
    const [result] = await pool.execute(
      'DELETE FROM familiares WHERE id_familiar = ?', [familiarId]
    );
    return result.affectedRows;
  } finally {
    //if (connection) connection.end();
  }
}

// Obtener familiares por usuario
async function getFamiliaresByUsuarioDB(usuarioId) {
  //let connection;
  try {
    const [rows] = await pool.execute(
      `SELECT a.*, b.nombre_genero, c.nombre_parentesco
       FROM familiares a
       LEFT JOIN data_genero b ON a.id_genero = b.id_genero
       LEFT JOIN data_parentesco c ON a.id_parentesco = c.id_parentesco AND a.id_genero = c.id_genero
       WHERE a.id_usuario = ?`, [usuarioId]
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

export{
    getAllFamiliaresDB,
    getFamiliarByIdDB,
    createFamiliarDB,
    updateFamiliarDB,
    deleteFamiliarDB,
    getFamiliaresByUsuarioDB
}