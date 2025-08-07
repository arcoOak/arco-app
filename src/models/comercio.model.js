// import {connectToDatabase, poolConection} from '../config/db.config.js';
import pool from '../config/db.config.js';

const getAllComerciosDB = async (id_club) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT * FROM comercios WHERE id_club = ?`, [id_club]
        );
        return rows;
    } finally {
        //if (connection) connection.end();
    }
}

const getAllComerciosActivosDB = async (id_club, id_tipo_comercio) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT * FROM comercios WHERE activo = 1 AND id_club = ? AND (id_tipo_comercio = ? OR id_tipo_comercio = 3)`, [id_club, id_tipo_comercio]
        );
        return rows;
    } finally {
        //if (connection) connection.end();
    }
}

const getComercioByIdDB = async (id) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT * FROM comercios WHERE id_comercio = ?`, [id]
        );
        return rows[0]; // Retorna el primer comercio encontrado
    } finally {
        //if (connection) connection.end();
    }
}

const getCategoriasComercioDisponibleDB = async (id_club, id_tipo_comercio)=>{ 
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT a.id_categoria_comercio, b.nombre_categoria_comercio, b.icon_fa FROM comercios a 
        JOIN data_categoria_comercio b ON a.id_categoria_comercio = b.id_categoria_comercio 
        WHERE a.activo = 1 
        AND a.id_club = ?
        AND (a.id_tipo_comercio = ? OR a.id_tipo_comercio = 3)
        GROUP BY a.id_categoria_comercio
        ORDER BY b.nombre_categoria_comercio
      `,
      [id_club, id_tipo_comercio]
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

export {
    getAllComerciosDB,
    getAllComerciosActivosDB,
    getComercioByIdDB,
    getCategoriasComercioDisponibleDB
}