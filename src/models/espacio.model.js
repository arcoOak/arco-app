import pool from '../config/db.config.js';

const getAllEspaciosReservablesDB = async () => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT * FROM espacios_reservables`
        );
        return rows; // Retorna todos los espacios reservables
    } finally {
        //if (connection) connection.end();
    }
}

const getEspacioByCategoriaDB = async (id_categoria_espacio) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT * FROM espacios_reservables WHERE id_categoria_espacio = ?`, [id_categoria_espacio]
        );
        return rows;
    } finally {
        //if (connection) connection.end();
    }
}



const getEspacioByIdDB = async (id_espacio_reservable) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT * FROM espacios_reservables WHERE id_espacio_reservable = ?`, [id_espacio_reservable]
        );
        return rows; // Retorna el primer comercio encontrado
    } finally {
        //if (connection) connection.end();
    }
}

const getEspacioUnidadesByIdDB = async (id_espacio_reservable) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT a.*, b.hora_apertura, b.hora_cierre FROM espacios_reservables_unidad a JOIN espacios_reservables b ON a.id_espacio_reservable = b.id_espacio_reservable WHERE a.id_espacio_reservable = ?`, [id_espacio_reservable]
        );
        return rows;
    } finally {
        //if (connection) connection.end();
    }
}

const getCategoriasEspacioDisponibleDB = async ()=>{ 
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT a.id_categoria_espacio, b.nombre_categoria_espacio, b.icon_fa FROM espacios_reservables a JOIN data_categoria_espacio b ON a.id_categoria_espacio = b.id_categoria_espacio GROUP BY a.id_categoria_espacio`
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

export {
    getAllEspaciosReservablesDB,
    getEspacioByCategoriaDB,
    getEspacioByIdDB,
    getEspacioUnidadesByIdDB,
    getCategoriasEspacioDisponibleDB
}