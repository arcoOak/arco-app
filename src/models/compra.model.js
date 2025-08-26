import {pool} from '../config/db.config.js';



const getCompraByIdDB = async (id) =>{

  try{

    const [row] = await pool.query(`
      SELECT coc.*, cmr.nombre_comercio
      FROM compras_comercio coc
      JOIN comercios cmr ON cmr.id_comercio = coc.id_comercio
      WHERE coc.id_compra_comercio = ?`, [id]);
    return row[0];

  } catch(error){
    console.error('Error al obtener la compra por ID:', error);
    throw error;
  }

}

const getComprasByUsuarioMesDB = async (id_socio, mes, anho)=>{

  try{

    const [rows] = await pool.query(`
      SELECT coc.*, cmr.nombre_comercio, SUM(ccp.cantidad) as cantidad_productos FROM compras_comercio coc
      JOIN comercios cmr ON cmr.id_comercio = coc.id_comercio
      LEFT JOIN compras_comercio_productos ccp ON ccp.id_compra_comercio = coc.id_compra_comercio
      WHERE coc.id_socio = ? 
      AND MONTH(coc.fecha_compra) = ? 
      AND YEAR(coc.fecha_compra) = ?
      GROUP BY coc.id_compra_comercio
      `, [id_socio, mes, anho]);
    return rows;

  }catch(error){
    console.error('Error al obtener las compras del usuario por mes:', error);
    throw error;
  }

}

const crearCompraComercioDB = async (datosCompraComercio, db_connection) => {
    console.log('Datos de compra comercio:', datosCompraComercio);
    const executor = db_connection || pool;
    const {fecha_compra, nota, precio_total, id_comercio, id_socio} = datosCompraComercio;
  try {
    const [rows] = await executor.query(`
        INSERT INTO compras_comercio (fecha_compra, nota, precio_total, id_comercio, id_socio, estado) 
        VALUES (?, ?, ?, ?, ?, 0)`, [fecha_compra, nota, precio_total, id_comercio, id_socio]);
    return rows.insertId;
  } catch (error) {
    console.error('Error al crear la compra por comercio:', error);
    throw error;
  }
};

const crearCompraProductosDB = async (datosCompraProductos, db_connection) => {
    const executor = db_connection || pool;
    const { id_compra_comercio, id_producto, precio_producto, cantidad } = datosCompraProductos;
  try {
    const [rows] = await executor.query(`
        INSERT INTO compras_comercio_productos (id_compra_comercio, id_producto, precio_producto, cantidad) 
        VALUES (?, ?, ?, ?)`, 
        [id_compra_comercio, id_producto, precio_producto, cantidad]);
    return rows.insertId;
  } catch (error) {
    console.error('Error al crear la compra de productos:', error);
    throw error;
  }
};


export {
  getCompraByIdDB,
  getComprasByUsuarioMesDB,
  crearCompraComercioDB,
  crearCompraProductosDB
}