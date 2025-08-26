// import {pool} from '../config/db.config.js';

// import {
//     createTransaccionDB,
//     pagarMensualidadDB,
//     pagarReservacionDB,
//     pagarCompraDB,
//     pagarServicioDB,
//     actualizarBilleteraDB
// } from '../models/billetera.model.js';

// import {
//     crearCompraComercioDB,
//     crearCompraProductosDB,
// } from '../models/compra.model.js';

// import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js'; 



// const crearCompra = async (req, res) => {

//     const listadoItemsCompra = req.body;

//     const connection = await pool.getConnection();

//     try{
//         await connection.beginTransaction();

//         await Promise.all(listadoItemsCompra.map(async(item) => {

//             const { compraData, transaccionData, listaItems } = item;

//             const id_compra_comercio = await crearCompraComercioDB(compraData, connection);

//             if(listaItems && listaItems.length > 0) {
//                 await Promise.all(listaItems.map(item => crearCompraProductosDB({ ...item, id_compra_comercio }, connection)));
//             }
//             transaccionData.id_pago_asociado = id_compra_comercio;

//             await createTransaccion(transaccionData, connection);
//             await pagarTransaccion(transaccionData, connection);
//         }))

//         await connection.commit();

//         return res.status(200).json(true);

//     }catch(e){
//         await connection.rollback();
//         console.error('Error al crear la compra:', e);
//         if (!res.headersSent) {
//             res.status(500).json({ error: 'Error al crear la compra' });
//         }
//     } finally {
//         if (connection) {
//             connection.release();
//         }
//     }
// }



// const createTransaccion = async (data, connection) => {
//     const { id_billetera, id_tipo_transaccion, id_pago_asociado, monto } = data;
//     try {
//         const transaccion = await createTransaccionDB(id_billetera, id_tipo_transaccion, id_pago_asociado, monto, connection);
//         return transaccion;
//     } catch (error) {
//         await connection.rollback();
//         console.error('Error al crear la transacción:', error);
//         throw new Error('Error interno del servidor al crear la transacción');
//     }
// }

// const pagarTransaccion = async (data, connection) =>{
//     const { id_billetera, id_tipo_transaccion, id_pago_asociado, monto} = data;
//     let response;
//     try{
//         if(id_tipo_transaccion === TIPOS_TRANSACCION.MENSUALIDAD){
//             response = await pagarMensualidadDB(id_pago_asociado, connection);
//         }else if(id_tipo_transaccion === TIPOS_TRANSACCION.RESERVACION){
//             response = await pagarReservacionDB(id_pago_asociado, connection);
//         }else if(id_tipo_transaccion === TIPOS_TRANSACCION.COMPRA_COMERCIO){
//             response = await pagarCompraDB(id_pago_asociado, connection);
//         }else if(id_tipo_transaccion === TIPOS_TRANSACCION.SERVICIO){
//             response = await pagarServicioDB(id_pago_asociado, connection);
//         }

//         if(response.affectedRows === 0){
//             await connection.rollback();
//         }

//         await actualizarBilleteraDB(id_billetera, monto, connection);
//         return response

//     }catch(error){
//         console.error('Error al pagar la transacción:', error);
//         await connection.rollback();
//         throw error;
//     }
// }

// export default {
//     crearCompra
// }