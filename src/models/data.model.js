import connectToDatabase from '../config/db.config.js';

const getGenerosDB = async () => {
    let connection;
    try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      `SELECT id_genero, nombre_genero FROM data_genero`
    );
    return rows;
  } finally {
    if (connection) connection.end();
  }
}

const getParentescos = async () => {
    let connection;
    try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      `SELECT id, nombre_parentesco, id_parentesco, id_genero FROM data_parentesco`
    );
    return rows;
  } finally {
    if (connection) connection.end();
  }
}

const getParentescosByGenero = async () => {
    let connection;
    try {
    connection = await connectToDatabase();
    const [rows] = await connection.execute(
      `SELECT
          CONCAT (a.nombre_parentesco, "/", b.nombre_parentesco ) AS nombre_parentesco, a.id_parentesco AS id_parentesco
        FROM
          data_parentesco  a
        JOIN
          data_parentesco b
          ON a.id_parentesco = b.id_parentesco
          WHERE a.id_genero = 1 AND b.id_genero = 2 
 `
    );
    return rows;
  } finally {
    if (connection) connection.end();
  }
}

export { getGenerosDB, getParentescos, getParentescosByGenero };