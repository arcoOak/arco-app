// import {connectToDatabase, poolConection} from '../config/db.config.js';
import {pool} from '../config/db.config.js';

//Trae todos los archivos de comercios activos
const getAllProductosDB = async (id_club) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT a.*, c.nombre_comercio 
            FROM productos a 
            JOIN producto_comercio b ON a.id_producto = b.id_producto 
            JOIN comercios c ON b.id_comercio = c.id_comercio 
            WHERE b.activo = 1 AND c.activo = 1 AND c.id_club = ?`, [id_club]
        );
        return rows;
    } finally {
        //if (connection) connection.end();
    }
}

//Trae todos los productos individuales, es decir, aquellos que no están agrupados por comercio
const getAllProductosIndividualesDB = async (id_club) => {
    try {
        //let connection = await connectToDatabase();
        const [rows] = await pool.execute(
            `SELECT a.* FROM productos a 
            JOIN producto_comercio b ON a.id_producto = b.id_producto 
            JOIN comercios c ON b.id_comercio = c.id_comercio 
            WHERE b.activo = 1 AND c.activo = 1 AND c.id_club = ?
            GROUP BY a.id_producto
            ORDER BY a.nombre_producto`, [id_club]
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
      `SELECT a.*, c.nombre_comercio 
      FROM productos a 
      JOIN producto_comercio b ON a.id_producto = b.id_producto 
      JOIN comercios c ON b.id_comercio = c.id_comercio 
      WHERE b.activo = 1 AND c.activo = 1 and c.id_comercio = ?`, [id_comercio]
    );
    return rows;
  } finally {
    //if (connection) connection.end();
  }
}

const getProductosByCompraComercioDB = async (id_compra_comercio, db_connection) => {

    const executor = db_connection || pool;
    try {
        const [rows] = await executor.query(`
        SELECT pcp.*, p.nombre_producto 
        FROM compras_comercio_productos pcp
        JOIN productos p ON pcp.id_producto = p.id_producto
        WHERE pcp.id_compra_comercio = ?`, [id_compra_comercio]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los productos por compra comercio:', error);
        throw error;
    }
    
}

const getCategoriasDeProductosPorComercioDB = async (id_comercio) =>{
    try {
        const [rows] = await pool.execute(
            `
            SELECT a.id_categoria_producto, b.nombre_categoria_producto
            FROM productos a 
            JOIN data_categoria_producto b ON a.id_categoria_producto = b.id_categoria_producto 
            JOIN producto_comercio c ON a.id_producto = c.id_producto 
            WHERE c.activo = 1 AND c.id_comercio = ?
            GROUP BY a.id_categoria_producto
            ORDER BY b.nombre_categoria_producto`, [id_comercio]
        );
        return rows;
    }catch (error){
        console.error('Error al obtener categorías de productos por comercio:', error);
        throw error;
    }
}

const verificarDisponibilidadDB = async (id_producto, id_comercio) =>{
    try{
        const [rows] = await pool.execute(
            `
            SELECT (pc.activo AND cmr.activo ) activo 
            FROM producto_comercio pc 
            JOIN comercios cmr ON pc.id_comercio = cmr.id_comercio 
            WHERE cmr.id_comercio = ? 
            AND pc.id_producto = ?
            `, 
            [id_comercio, id_producto]
        );
        return rows[0] ? rows[0].activo : false;
    } catch (error) {
        console.error('Error al verificar disponibilidad de producto:', error);
        throw error;
    }
}

export {
    getAllProductosDB,
    getAllProductosIndividualesDB,
    getProductoByIdDB,
    getProductosPorComercioDB,
    getProductosByCompraComercioDB,
    getCategoriasDeProductosPorComercioDB,
    verificarDisponibilidadDB
}