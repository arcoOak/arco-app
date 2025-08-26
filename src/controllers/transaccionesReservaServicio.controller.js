// import {pool} from '../config/db.config.js';

// import {
//     createReservaServicioDB,
//     createReservaServicioHorasDB
// } from '../models/reservaServicio.model.js';

// import {
//     createTransaccionDB,
//     pagarMensualidadDB,
//     pagarReservacionDB,
//     pagarCompraDB,
//     pagarServicioDB,
//     actualizarBilleteraDB
// } from '../models/billetera.model.js';

// const crearReservaServicioTransaccion = async (req, res) => {
//   const { reservaServicioData, transaccionData, listaHoras } = req.body;

//   const connection = await pool.getConnection(); 

//   try {

//     await connection.beginTransaction();

//     const nuevaReserva = await createReservaServicio({reservaServicioData, listaHoras}, connection);

//     transaccionData.id_pago_asociado = nuevaReserva;;

//     console.log(transaccionData)

//     await createTransaccion(transaccionData, connection);

//     await pagarTransaccion(transaccionData, connection);

//     await connection.commit();

//     res.status(200).json({ message: 'Reserva del servicio creada exitosamente' });

//   } catch (error) {

//     await connection.rollback();
//     console.error('Error al crear la reserva del servicio:', error);
//     res.status(500).json({ error: 'Error al crear la reserva del servicio' });

//   } finally{
//     if (connection) {
//       connection.release();
//     }
//   }
// };


// const createReservaServicio = async (data, connection) => {
//     const { reservaServicioData, listaHoras } = data;

//     try {
//         if (!reservaServicioData || !listaHoras || listaHoras.length === 0 || !reservaServicioData.id_socio ) {
//             return { message: 'Los datos de la reservación y la lista de horas son requeridos.' };
//         }

//         const nuevaReserva = await createReservaServicioDB(reservaServicioData, connection);

//         const id_nueva_reserva = nuevaReserva;

//         if (listaHoras.length > 0) {
//             await createReservaServicioHorasDB(id_nueva_reserva, listaHoras, connection);
//         }


//         return nuevaReserva;
//     } catch (error) {
//         console.error('Error al crear la reservación de servicio:', error);
//         throw new Error('Error interno del servidor al crear la reservación de servicio');
//     }
// }

// const createTransaccion = async (data, connection) => {
//     const { id_billetera, id_tipo_transaccion, id_pago_asociado, monto } = data;
//     try {
//         const transaccion = await createTransaccionDB(id_billetera, id_tipo_transaccion, id_pago_asociado, monto, connection);
//         console.log('Transaccion nueva: ')
        
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

//         response = await pagarServicioDB(id_pago_asociado, connection);
        

//         if(response.affectedRows === 0){
//             await connection.rollback();
//         }

//         await actualizarBilleteraDB(id_billetera, monto, connection);

//         console.log('Transaccion pagada: ', response);

//         return response

//     }catch(error){
//         console.error('Error al pagar la transacción:', error);
//         await connection.rollback();
//         throw error;
//     }
// }

// export default {
//   crearReservaServicioTransaccion,
// };