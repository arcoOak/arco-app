import {pool} from '../config/db.config.js';

const crearMensualidadDB = async (id_socio, db_connection) => {

  console.log('Log para socio: ', id_socio);

  const execute = db_connection;
  try {

    const [data] = await execute.query(`
        SELECT soc.fecha_ingreso_club, dts.tarifa, MAX(ms.fecha) as ultima_fecha_mensualidad
        FROM socios soc
        JOIN data_tipo_socio dts ON soc.id_tipo_socio = dts.id_tipo_socio
        LEFT JOIN mensualidades_socios ms ON soc.id_socio = ms.id_socio
        WHERE soc.id_socio = ?
      `,[id_socio])

    if (!data[0]) {
      return {id: null, monto: null, result: false, error: 'Socio no encontrado'};
    }

    const fechaNuevaMensualidad = data[0].ultima_fecha_mensualidad ? new Date(data[0].ultima_fecha_mensualidad.setMonth(data[0].ultima_fecha_mensualidad.getMonth() + 1)) : new Date(data[0].fecha_ingreso_club.setMonth(data[0].fecha_ingreso_club.getMonth() + 1));

    // Verifica si la nueva fecha de mensualidad es mayor a un mes
    if(fechaNuevaMensualidad.getMonth() > new Date().getMonth() + 1) { 
      return {id: null, monto: null, result: false};
    }

    const [result] = await execute.query(
      'INSERT INTO mensualidades_socios (id_socio, fecha, estado) VALUES (?, ?, 0)',
        [id_socio, fechaNuevaMensualidad]
    );
    return {id: result.insertId, monto: data[0].tarifa, result: true};
  } catch (error) {
    console.error('Error al crear la mensualidad:', error);
    throw error;
  }
};


export {
    crearMensualidadDB
}