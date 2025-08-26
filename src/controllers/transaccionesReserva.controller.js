// import {pool} from '../config/db.config.js';



// import jwt from 'jsonwebtoken';
// import { randomBytes } from 'crypto';
// // import nodemailer from 'nodemailer';
// // import qrcode from 'qrcode';

// import {
//     createReservaDB,
//     createReservaHorasDB,
//     createInvitadoDB,
//     createInvitadosEnReservaDB,
//     createReservaFamiliaresDB
// } from '../models/reservas.model.js';

// import {
//     getQrTokenByUsuarioFamiliarDB,
//     createQrTokenFamiliarDB,
//     createQrTokenInvitadoDB,
//     updateQrTokenFamiliarDB,
// } from '../models/qrtoken.model.js';

// import {
//     createTransaccionDB,
//     pagarMensualidadDB,
//     pagarReservacionDB,
//     pagarCompraDB,
//     pagarServicioDB,
//     actualizarBilleteraDB
// } from '../models/billetera.model.js';

// import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js'; 

// const crearReservaTransaccion = async (req, res) => {
//   const { reservaData, transaccionData, listaInvitados, listaFamiliares, listaHoras, id_usuario } = req.body;

//   const connection = await pool.getConnection(); 

//   try {

//     await connection.beginTransaction();

//     const idReserva = await createReserva({ reservaData, listaInvitados, listaFamiliares, listaHoras, id_usuario }, connection);

//     if(listaFamiliares && listaFamiliares.length > 0) {
//         await Promise.all(listaFamiliares.map(familiar => generateOrUpdateQrTokenFamiliar(familiar, id_usuario, connection)));
//     }

//     if(listaInvitados && listaInvitados.length > 0) {
//         await Promise.all(listaInvitados.map(invitado => generateQrTokenInvitado(invitado, id_usuario, connection)));
//     }

//     transaccionData.id_pago_asociado = idReserva;

//     await createTransaccion(transaccionData, connection);

//     await pagarTransaccion(transaccionData, connection);

//     await connection.commit();

//     res.status(200).json({ message: 'Reserva creada exitosamente' });

//   } catch (error) {

//     await connection.rollback();
//     console.error('Error al crear la reserva:', error);
//     res.status(500).json({ error: 'Error al crear la reserva' });
    
//   } finally{
//     if (connection) {
//       connection.release();
//     }
//   }
// };






// const createReserva = async (data, connection) => {
//     try {
//         const { reservaData, listaInvitados, listaFamiliares, listaHoras, id_usuario } = data;

//         const newReserva = await createReservaDB(reservaData, connection);

//         const idReserva = newReserva;

//         if (listaHoras && listaHoras.length > 0) {
//             await createReservaHorasDB(idReserva, listaHoras, connection);
//         }

//         if( listaInvitados && listaInvitados.length > 0) {
//             const listaIdInvitados = await Promise.all(listaInvitados.map(invitado => createInvitadoDB(id_usuario, invitado, connection)));
            
//             const listaInvitadosMapeada = listaIdInvitados.map(id_invitado => ({
//                 id_rol: 4, 
//                 id_invitado: id_invitado
//             }));
//             await createInvitadosEnReservaDB(idReserva, listaInvitadosMapeada, connection);
//         }

//         if (listaFamiliares && listaFamiliares.length > 0) {
//             await createReservaFamiliaresDB(idReserva, listaFamiliares, connection);
//         }
        
//         return newReserva;

//     } catch (error) {
//         await connection.rollback(); 

//         console.error('Error al crear la reserva (transacción revertida):', error);
//         throw error;
//     } 
// }

// const generateOrUpdateQrTokenFamiliar = async (dataToken, id_usuario, connection) => {
    
//     const { id_rol, id_familiar } = dataToken;
//     try {
//         const jti = randomBytes(16).toString('hex');
//         const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, id_familiar: id_familiar};

//         const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti }); // Genera un token JWT con una expiración de 24h

//         const {success, data} = await getQrTokenByUsuarioFamiliarDB(id_usuario, id_rol, id_familiar, connection);

//         let result;
//         if (!success) {
//             // Si no existe el token, lo creamos
//             result = await createQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar, connection);
//         } else {
//             // Si existe el token, lo actualizamos
//             result = await updateQrTokenFamiliarDB(id_usuario, token, id_rol, id_familiar, connection);
//         }
//         return {token: result.data.token};
//     } catch (error) {
//         await connection.rollback();
//         console.error('Error al generar o actualizar el token QR familiar:', error);
//         throw error;
//     }
// }

// const generateQrTokenInvitado = async (dataToken, id_usuario, connection) => {
//     try {
//         const dataInvitado = dataToken;
//         const id_rol = 4;
//         const jti = randomBytes(16).toString('hex');
//         const datosACodificar = {id_usuario: id_usuario, id_rol: id_rol, dataInvitado: dataInvitado};

//         const token = jwt.sign(datosACodificar, process.env.JWT_SECRET, { expiresIn: '24h', jwtid: jti }); // Genera un token JWT con una expiración de 24h

//         let result = await createQrTokenInvitadoDB(id_usuario, token, id_rol, dataInvitado, connection);

//         return {token: result.data.token};
//     } catch (error) {
//         await connection.rollback();
//         console.error('Error al generar o actualizar el token QR invitado:', error);
//         throw error;
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
//   crearReservaTransaccion,
//   generateOrUpdateQrTokenFamiliar,
//   generateQrTokenInvitado
  
// };