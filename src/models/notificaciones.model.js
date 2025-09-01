import {pool} from '../config/db.config.js';

import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js';

const getNotificacionByIdDB = async (id_notificacion, connection) => {
    try {
        // Usar un alias (ntf) y seleccionar explícitamente `ntf.*` es una buena práctica para evitar ambigüedades.
        const [rows] = await connection.execute(`
            SELECT ntf.* FROM notificaciones ntf WHERE ntf.id_notificacion = ?
        `, [id_notificacion]);
        //console.log('getNotificacionByIdDB rows:', rows);
        return rows[0];
    } catch (error) {
        console.error('Error al obtener la Notificación por ID:', error);
        throw error;
    }
}

const getAllNotificacionesDB = async (id_usuario, connection) => {
    try {
        // Se ha refactorizado la consulta para mejorar la legibilidad y el rendimiento.
        // El uso de LEFT JOIN es más eficiente que múltiples subconsultas correlacionadas en el SELECT.
        // COALESCE se usa para obtener el primer valor no nulo de las columnas de estado y confirmación.
        const [rows] = await connection.execute(`
            SELECT 
                ntf.*,
                clu.nombre_club,
                dct.nombre_categoria_notificacion,
                dtt.nombre_transaccion,
                COALESCE(ms.estado, rs.estado, cc.estado, ps.estado, br.estado) as estado_transaccion,
                COALESCE(rs.confirmacion, 1) as estado_confirmacion,
                btt.id_billetera_transaccion
            FROM notificaciones ntf
            JOIN clubes clu ON ntf.id_club = clu.id_club
            JOIN data_categoria_notificacion dct ON ntf.id_categoria_notificacion = dct.id_categoria_notificacion
            JOIN data_tipo_transaccion dtt ON ntf.id_tipo_transaccion = dtt.id_tipo_transaccion
            JOIN billeteras_transacciones btt ON ntf.id_asociado = btt.id_pago_asociado AND ntf.id_tipo_transaccion = btt.id_tipo_transaccion
            LEFT JOIN mensualidades_socios ms ON ntf.id_asociado = ms.id_mensualidad_socio AND ntf.id_tipo_transaccion = ?
            LEFT JOIN reservaciones rs ON ntf.id_asociado = rs.id_reservacion AND ntf.id_tipo_transaccion = ?
            LEFT JOIN compras_comercio cc ON ntf.id_asociado = cc.id_compra_comercio AND ntf.id_tipo_transaccion = ?
            LEFT JOIN reservaciones_servicios ps ON ntf.id_asociado = ps.id_reservacion_servicio AND ntf.id_tipo_transaccion = ?
            LEFT JOIN billeteras_recargas br ON ntf.id_asociado = br.id_billetera_recarga AND ntf.id_tipo_transaccion = ?
            WHERE ntf.id_usuario = ? 
              AND ntf.fecha_activacion_notificacion <= NOW()
              AND (
                  ntf.estado_visualizacion = 0 OR
                  COALESCE(ms.estado, rs.estado, cc.estado, ps.estado, br.estado) = 0 OR
                  (
                   ntf.id_categoria_notificacion = ? AND COALESCE(rs.confirmacion, 1) = 0 
                )
              )
        `, [
            TIPOS_TRANSACCION.MENSUALIDAD,
            TIPOS_TRANSACCION.RESERVACION,
            TIPOS_TRANSACCION.COMPRA_COMERCIO,
            TIPOS_TRANSACCION.SERVICIO,
            TIPOS_TRANSACCION.RECARGA,
            id_usuario,
            TIPOS_TRANSACCION.RECARGA
        ]);
        return rows;
    } catch (error) {
        console.error('Error al obtener todas las Notificaciones:', error);
        throw error;
    }
}

const updateEstadoNotificacionVisualizacionDB = async (id_notificacion, connection) => {
    try {
        console.log('id_notificacion: ',id_notificacion);
        const [result] = await connection.execute(`
            UPDATE notificaciones
            SET estado_visualizacion = 1
            WHERE id_notificacion = ?
        `, [id_notificacion]);
        console.log('model result: ',result);
        return result;
    } catch (error) {
        console.error('Error al actualizar el estado de visualización de la Notificación:', error);
        throw error;
    }
}

const createNotificacionDB = async (notificationData, connection) =>{
    try {
        const { id_usuario, id_club, fecha_activacion_notificacion, estado_visualizacion, id_categoria_notificacion, id_tipo_transaccion, id_asociado } = notificationData;
        const [result] = await connection.execute(`
            INSERT INTO notificaciones (
                id_usuario, 
                id_club, 
                fecha_activacion_notificacion, 
                estado_visualizacion, 
                id_categoria_notificacion, 
                id_tipo_transaccion, 
                id_asociado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            id_usuario, 
            id_club, 
            fecha_activacion_notificacion, 
            estado_visualizacion, 
            id_categoria_notificacion, 
            id_tipo_transaccion, 
            id_asociado
        ]);
        return result.insertId;
    } catch (error) {
        console.error('Error al crear la Notificación:', error);
        throw error;
    }
}

export {
    getNotificacionByIdDB,
    getAllNotificacionesDB,
    updateEstadoNotificacionVisualizacionDB,
    createNotificacionDB
}