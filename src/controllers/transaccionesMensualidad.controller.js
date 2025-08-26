// import {pool} from '../config/db.config.js';

// import {
//     crearMensualidadDB
// } from '../models/mensualidad.model.js';

// import {
//     createTransaccionDB
// } from '../models/billetera.model.js';


// const crearMensualidad = async (req, res) => {

//     const connection = await pool.getConnection();

//     try{
//         await connection.beginTransaction();

//         const { id_socio, transaccionData } = req.body;

//         const {id, monto} = await crearMensualidadDB(id_socio, connection);

//         if(!id || !monto) {
//             throw new Error('Error al crear la mensualidad');
//         }

//         transaccionData.id_pago_asociado = id;
//         transaccionData.monto = monto * (-1);

//         await createTransaccion(transaccionData, connection);

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

// export default {
//     crearMensualidad
// }