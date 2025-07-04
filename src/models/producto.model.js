// import {connectToDatabase, poolConection} from '../config/db.config.js';
import pool from '../config/db.config.js';

//Trae todos los archivos de comercios activos
const getAllProductosDB = async () => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT a.*, c.nombre_comercio FROM productos a JOIN producto_comercio b ON a.id_producto = b.id_producto JOIN comercios c ON b.id_comercio = c.id_comercio WHERE b.activo = 1 AND c.activo = 1`
        );
        return rows;
    } finally {
        //if (connection) connection.end();
    }
}

//Trae todos los productos individuales, es decir, aquellos que no están agrupados por comercio
const getAllProductosIndividualesDB = async () => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT a.* FROM productos a JOIN producto_comercio b ON a.id_producto = b.id_producto JOIN comercios c ON b.id_comercio = c.id_comercio WHERE b.activo = 1 AND c.activo = 1 GROUP BY a.id_producto`
        );
        return rows;
    } finally {
        //if (connection) connection.end();
    }
}

//Trae un producto por su ID
const getProductoByIdDB = async (id) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT * FROM productos WHERE id_producto = ?`, [id]
        );
        return rows[0]; // Retorna el primer comercio encontrado
    } finally {
        //if (connection) connection.end();
    }
}

//Trae los productos de un comercio específico por su ID
const getProductosPorComercioDB = async (id_comercio)=>{ 
  //let connection;
  try {
    //connection = await connectToDatabase();
    const [rows] = await pool.execute(
      `SELECT a.*, c.nombre_comercio FROM productos a JOIN producto_comercio b ON a.id_producto = b.id_producto JOIN comercios c ON b.id_comercio = c.id_comercio WHERE b.activo = 1 AND c.activo = 1 and c.id_comercio = ?`, [id_comercio]
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

export {
    getAllProductosDB,
    getAllProductosIndividualesDB,
    getProductoByIdDB,
    getProductosPorComercioDB
}