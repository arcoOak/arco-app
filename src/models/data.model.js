
// import {connectToDatabase, poolConection} from '../config/db.config.js';
import pool from '../config/db.config.js';

const getGenerosDB = async () => {
    //let connection;
    try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT id_genero, nombre_genero FROM data_genero`
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

const getParentescosDB = async () => {
    //let connection;
    try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT id, nombre_parentesco, id_parentesco, id_genero FROM data_parentesco`
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

const getParentescosByGeneroDB = async () => {
    //let connection;
    try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
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
    //if (connection) connection.end();
  }
}

const getCategoriasComercioDisponibleDB = async ()=>{
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT a.id_categoria_comercio, b.nombre_categoria_comercio FROM comercios a JOIN data_categoria_comercio b ON a.id_categoria_comercio = b.id_categoria_comercio WHERE a.activo = 1 GROUP BY a.id_categoria_comercio`
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

const getCategoriasComercioDB = async ()=>{
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT * FROM data_categoria_comercio`
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

export { getGenerosDB, getParentescosDB, getParentescosByGeneroDB, getCategoriasComercioDisponibleDB, getCategoriasComercioDB };