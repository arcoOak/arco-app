import {pool} from '../config/db.config.js';

import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js'; 

const getTransaccionesPendientesDB = async (id_socio, connection) => {
    const executor = connection || pool;
    try {
        const [rows] = await executor.execute(`
            
            SELECT * FROM (
            SELECT 
            bt.id_billetera_transaccion,
            bt.id_billetera,
            bt.id_tipo_transaccion,
            dtt.nombre_transaccion as descripcion_contenido,
            bt.fecha_transaccion,
            bt.monto as total_transaccion,
            bt.id_pago_asociado,
            CASE 
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD} THEN (SELECT ms.estado FROM mensualidades_socios ms WHERE ms.id_mensualidad_socio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RESERVACION} THEN (SELECT rs.estado FROM reservaciones rs WHERE rs.id_reservacion = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.COMPRA_COMERCIO} THEN (SELECT cc.estado FROM compras_comercio cc WHERE cc.id_compra_comercio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.SERVICIO} THEN (SELECT ps.estado FROM reservaciones_servicios ps WHERE ps.id_reservacion_servicio = bt.id_pago_asociado)
            END AS estado_transaccion,
            CASE 
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD} THEN (SELECT ms.fecha FROM mensualidades_socios ms WHERE ms.id_mensualidad_socio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RESERVACION} THEN (SELECT rs.fecha_creacion FROM reservaciones rs WHERE rs.id_reservacion = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.COMPRA_COMERCIO} THEN (SELECT cc.fecha_compra FROM compras_comercio cc WHERE cc.id_compra_comercio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.SERVICIO} THEN (SELECT ps.fecha_creacion FROM reservaciones_servicios ps WHERE ps.id_reservacion_servicio = bt.id_pago_asociado)
            END AS fecha_generacion
            FROM billeteras_transacciones bt
            JOIN data_tipo_transaccion dtt ON dtt.id_tipo_transaccion = bt.id_tipo_transaccion
            JOIN billeteras b ON b.id_billetera = bt.id_billetera
            WHERE b.id_socio = ? AND bt.id_tipo_transaccion != ${TIPOS_TRANSACCION.RECARGA} ) t HAVING t.estado_transaccion = 0
            `,
            [id_socio]);
        return rows;
    } catch (error) {
        console.error('Error consultando pagos pendientes:', error);
        throw error;
    }
}

const getUltimasTransaccionesSocioDB = async (id_socio, connection) => {
    const executor = connection || pool;

    const [rows] = await executor.execute(`
                        SELECT  bt.* , dtt.nombre_transaccion, 
                        CASE
                        WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD} THEN ( CONCAT(dtt.nombre_transaccion, ' ', dts.nombre_tipo_socio)  )
                        WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RESERVACION} THEN ( SELECT eru.nombre_unidad FROM reservaciones res JOIN espacios_reservables_unidad as eru ON res.id_espacio_reservable_unidad = eru.id_espacio_reservable_unidad WHERE res.id_reservacion =  bt.id_pago_asociado  )
                        WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.COMPRA_COMERCIO} THEN
                            ( SELECT com.nombre_comercio FROM compras_comercio coc JOIN comercios com ON coc.id_comercio = com.id_comercio WHERE coc.id_compra_comercio = bt.id_pago_asociado  )
                        WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.SERVICIO} THEN
                            ( SELECT srv.nombre_servicio_reservable FROM reservaciones_servicios AS rsv JOIN servicios_reservables srv ON rsv.id_servicio_reservable = srv.id_servicio_reservable JOIN servicios_reservables_empresa AS sre ON rsv.id_servicio_reservable_empresa = sre.id_servicio_reservable_empresa WHERE rsv.id_reservacion_servicio = bt.id_pago_asociado )
                        END as descripcion_transaccion
                        FROM billeteras_transacciones bt
                                JOIN billeteras b ON b.id_billetera = bt.id_billetera
                                            JOIN data_tipo_transaccion dtt ON bt.id_tipo_transaccion = dtt.id_tipo_transaccion
                                            JOIN socios s ON s.id_socio = b.id_socio
                                            JOIN data_tipo_socio dts ON dts.id_tipo_socio = s.id_tipo_socio
                                WHERE b.id_socio = ?
                                ORDER BY bt.id_billetera_transaccion DESC, bt.fecha_transaccion DESC
                                LIMIT 5
                `, [id_socio]);

    return rows;
}

const getTransaccionesSocioPorMesDB = async (id_socio, mes, connection) => {
    const executor = connection || pool;

    try {
        const [rows] = await executor.execute(`
            SELECT a.*, b.saldo_actual
            FROM billeteras_transacciones a 
            JOIN billeteras b ON a.id_billetera = b.id_billetera 
            WHERE b.id_socio = ? 
            AND MONTH(a.fecha_transaccion) = ?`, 
            [id_socio, mes]);
        return rows;
    } catch (error) {
        console.error('Error consultando transacciones por mes:', error);
        throw error;
    }
}

const getTransaccionesSocioCompletoPorMesDB = async (id_socio, mes, anho) => {
    try {
        const [rows] = await pool.execute(`
            SELECT
                t.id_tipo_transaccion,
                t.estado_transaccion,
                t.tipo_transaccion,
                t.total_transaccion,
                t.fecha_generacion,
                t.fecha_transaccion,
                t.descripcion_contenido,
                t.descripcion_cantidad,
                t.id_billetera_transaccion,
                t.id_pago_asociado
            FROM (
                -- Mensualidades
                SELECT
                    ${TIPOS_TRANSACCION.MENSUALIDAD} AS id_tipo_transaccion,
                    mens.estado AS estado_transaccion,
                    dtt.nombre_transaccion AS tipo_transaccion,
                    dts.tarifa AS total_transaccion,
                    mens.fecha AS fecha_generacion,
                    bt.fecha_transaccion,
                    CONCAT(dtt.nombre_transaccion, ' ', dts.nombre_tipo_socio) AS descripcion_contenido,
                    1 AS descripcion_cantidad,
                    bt.id_billetera_transaccion,
                    bt.id_pago_asociado
                FROM mensualidades_socios mens
                JOIN socios s ON mens.id_socio = s.id_socio
                JOIN data_tipo_socio dts ON s.id_tipo_socio = dts.id_tipo_socio
                JOIN data_tipo_transaccion dtt ON dtt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD}
                LEFT JOIN billeteras b ON mens.id_socio = b.id_socio
                LEFT JOIN billeteras_transacciones bt ON b.id_billetera = bt.id_billetera
                    AND bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD}
                    AND bt.id_pago_asociado = mens.id_mensualidad_socio
                WHERE mens.id_socio = ? 

                UNION ALL

                -- Reservaciones
                SELECT
                    ${TIPOS_TRANSACCION.RESERVACION} AS id_tipo_transaccion,
                    res.estado AS estado_transaccion,
                    dtt.nombre_transaccion AS tipo_transaccion,
                    res.costo_reserva AS total_transaccion,
                    res.fecha_creacion AS fecha_generacion,
                    bt.fecha_transaccion,
                    eru.nombre_unidad AS descripcion_contenido,
                    COUNT(rh.id_reservacion_hora) AS descripcion_cantidad,
                    bt.id_billetera_transaccion,
                    bt.id_pago_asociado
                FROM reservaciones res
                JOIN data_tipo_transaccion dtt ON dtt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RESERVACION}
                LEFT JOIN billeteras b ON res.id_socio = b.id_socio
                LEFT JOIN billeteras_transacciones bt ON b.id_billetera = bt.id_billetera
                    AND bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RESERVACION}
                    AND bt.id_pago_asociado = res.id_reservacion
                JOIN espacios_reservables_unidad eru ON eru.id_espacio_reservable_unidad = res.id_espacio_reservable_unidad
                LEFT JOIN reservaciones_horas rh ON rh.id_reservacion = res.id_reservacion
                WHERE res.id_socio = ?
                GROUP BY res.id_reservacion

                UNION ALL

                -- Compras en Comercio
                SELECT
                    ${TIPOS_TRANSACCION.COMPRA_COMERCIO} AS id_tipo_transaccion,
                    comp.estado AS estado_transaccion,
                    dtt.nombre_transaccion AS tipo_transaccion,
                    comp.precio_total AS total_transaccion,
                    comp.fecha_compra AS fecha_generacion,
                    bt.fecha_transaccion,
                    cmr.nombre_comercio AS descripcion_contenido,
                    SUM(ccp.cantidad) AS descripcion_cantidad,
                    bt.id_billetera_transaccion,
                    bt.id_pago_asociado
                FROM compras_comercio comp
                JOIN data_tipo_transaccion dtt ON dtt.id_tipo_transaccion = ${TIPOS_TRANSACCION.COMPRA_COMERCIO}
                LEFT JOIN billeteras b ON comp.id_socio = b.id_socio
                LEFT JOIN billeteras_transacciones bt ON b.id_billetera = bt.id_billetera
                    AND bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.COMPRA_COMERCIO}
                    AND bt.id_pago_asociado = comp.id_compra_comercio
                JOIN comercios cmr ON cmr.id_comercio = comp.id_comercio
                LEFT JOIN compras_comercio_productos ccp ON ccp.id_compra_comercio = comp.id_compra_comercio
                WHERE comp.id_socio = ? 
                GROUP BY comp.id_compra_comercio

                UNION ALL

                -- Pago de Servicios
                SELECT
                    ${TIPOS_TRANSACCION.SERVICIO} AS id_tipo_transaccion,
                    rsv.estado AS estado_transaccion,
                    dtt.nombre_transaccion AS tipo_transaccion,
                    rsv.costo_reserva AS total_transaccion,
                    rsv.fecha_reservacion AS fecha_generacion,
                    bt.fecha_transaccion,
                    cmr.nombre_comercio AS descripcion_contenido,
                    COUNT(rsh.id_reservacion_servicio_hora) AS descripcion_cantidad,
                    bt.id_billetera_transaccion,
                    bt.id_pago_asociado
                FROM reservaciones_servicios rsv
                JOIN data_tipo_transaccion dtt ON dtt.id_tipo_transaccion = ${TIPOS_TRANSACCION.SERVICIO}
                JOIN servicios_reservables_empresa sre ON sre.id_servicio_reservable_empresa = rsv.id_servicio_reservable_empresa
                LEFT JOIN billeteras b ON rsv.id_socio = b.id_socio
                LEFT JOIN billeteras_transacciones bt ON b.id_billetera = bt.id_billetera
                    AND bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.SERVICIO}
                    AND bt.id_pago_asociado = rsv.id_reservacion_servicio
                JOIN comercios cmr ON cmr.id_comercio = sre.id_comercio
                LEFT JOIN reservaciones_servicios_horas rsh ON rsh.id_reservacion_servicio = rsv.id_reservacion_servicio
                WHERE rsv.id_socio = ? 
                GROUP BY rsv.id_reservacion_servicio

                UNION ALL
                
                SELECT
                    ${TIPOS_TRANSACCION.RECARGA} AS id_tipo_transaccion,
                    br.estado AS estado_transaccion,
                    dtt.nombre_transaccion AS tipo_transaccion,
                    bt.monto AS total_transaccion,
                    bt.fecha_transaccion AS fecha_generacion,
                    bt.fecha_transaccion,
                    NULL AS descripcion_contenido,
                    NULL AS descripcion_cantidad,
                    bt.id_billetera_transaccion,
                    bt.id_pago_asociado
                FROM billeteras_recargas br
                JOIN data_tipo_transaccion dtt ON dtt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RECARGA}
                LEFT JOIN billeteras b ON br.id_billetera = b.id_billetera
                LEFT JOIN billeteras_transacciones bt ON b.id_billetera = bt.id_billetera
                    AND bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RECARGA}
                    AND bt.id_pago_asociado = br.id_billetera_recarga
                WHERE b.id_socio = ?

            ) t
            WHERE MONTH(t.fecha_generacion) = ? AND YEAR(t.fecha_generacion) = ?
            ORDER BY t.fecha_generacion DESC
        `, [id_socio, id_socio, id_socio, id_socio, id_socio, mes, anho]);
        return rows;
    } catch (error) {
        console.error('Error consultando transacciones completas por mes:', error);
        throw error;
    }
}

const getTransaccionPorIdDB = async (id_billetera_transaccion) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
            bt.id_billetera_transaccion,
            bt.id_billetera,
            bt.id_tipo_transaccion,
            dtt.nombre_transaccion as tipo_transaccion,
            bt.fecha_transaccion,
            bt.monto,
            bt.id_pago_asociado,
            CASE 
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD} THEN (SELECT ms.estado FROM mensualidades_socios ms WHERE ms.id_mensualidad_socio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RESERVACION} THEN (SELECT rs.estado FROM reservaciones rs WHERE rs.id_reservacion = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.COMPRA_COMERCIO} THEN (SELECT cc.estado FROM compras_comercio cc WHERE cc.id_compra_comercio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.SERVICIO} THEN (SELECT ps.estado FROM reservaciones_servicios ps WHERE ps.id_reservacion_servicio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RECARGA} THEN (SELECT br.estado FROM billeteras_recargas br WHERE br.id_billetera_recarga = bt.id_pago_asociado)
            END AS estado_transaccion,
            CASE 
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD} THEN (SELECT ms.fecha FROM mensualidades_socios ms WHERE ms.id_mensualidad_socio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RESERVACION} THEN (SELECT rs.fecha_creacion FROM reservaciones rs WHERE rs.id_reservacion = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.COMPRA_COMERCIO} THEN (SELECT cc.fecha_compra FROM compras_comercio cc WHERE cc.id_compra_comercio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.SERVICIO} THEN (SELECT ps.fecha_creacion FROM reservaciones_servicios ps WHERE ps.id_reservacion_servicio = bt.id_pago_asociado)
                WHEN bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RECARGA} THEN bt.fecha_transaccion
            END AS fecha_generacion
            FROM billeteras_transacciones bt
            JOIN data_tipo_transaccion dtt ON dtt.id_tipo_transaccion = bt.id_tipo_transaccion
            WHERE bt.id_billetera_transaccion = ?
        `, [id_billetera_transaccion]);
        return rows[0];
    } catch (error) {
        console.error('Error consultando transacción por ID:', error);
        throw error;
    }
}



const getDatosMensualidadDB = async (id_pago_asociado, connection) => {
    const executor = connection || pool;
    try {
        const [rows] = await executor.execute(`
            SELECT '1' as cantidad, 
            CONCAT(dtt.nombre_transaccion,' ',dts.nombre_tipo_socio) nombre_transaccion, 
            dts.tarifa as coste_total
            FROM mensualidades_socios AS mens
            JOIN socios AS s ON mens.id_socio = s.id_socio      
            JOIN data_tipo_socio AS dts ON s.id_tipo_socio = dts.id_tipo_socio
            JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = ${TIPOS_TRANSACCION.MENSUALIDAD}
            WHERE mens.id_mensualidad_socio = ?`, [id_pago_asociado]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los datos de la mensualidad:', error);
        throw error;
    }
}

const getDatosReservacionDB = async (id_pago_asociado, connection) => {
    const executor = connection || pool;
    try {
        const [rows] = await executor.execute(`
            SELECT COUNT(rh.id_reservacion_hora) as cantidad, 
            eru.nombre_unidad as nombre_transaccion, 
            res.costo_reserva as coste_total
            FROM reservaciones AS res
            JOIN espacios_reservables_unidad AS eru ON eru.id_espacio_reservable_unidad = res.id_espacio_reservable_unidad
            JOIN reservaciones_horas AS rh ON rh.id_reservacion = res.id_reservacion
            WHERE res.id_reservacion = ?
            GROUP BY res.id_reservacion`, [id_pago_asociado]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los datos de la reservación:', error);
        throw error;
    }
}

const getDatosCompraDB = async (id_pago_asociado, connection) => {
    const executor = connection || pool;
    try {
        const [rows] = await executor.execute(`
            SELECT ccp.cantidad as cantidad, 
            pr.nombre_producto as nombre_transaccion, 
            ccp.precio_producto as coste_total
            FROM compras_comercio AS comp
            JOIN compras_comercio_productos AS ccp ON ccp.id_compra_comercio = comp.id_compra_comercio
            JOIN productos AS pr ON pr.id_producto = ccp.id_producto
            WHERE comp.id_compra_comercio = ?`, [id_pago_asociado]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los datos de la compra:', error);
        throw error;
    }
}

const getDatosServicioDB = async (id_pago_asociado, connection) => {
    const executor = connection || pool;
    try{
        const [rows] = await executor.execute(`
            SELECT COUNT(rsh.id_reservacion_servicio_hora) as cantidad, 
            CONCAT(srs.nombre_servicio_reservable, ' ', cmr.nombre_comercio) as nombre_transaccion, 
            rvs.costo_reserva as coste_total
            FROM reservaciones_servicios AS rvs
            JOIN servicios_reservables srs 
                ON srs.id_servicio_reservable = rvs.id_servicio_reservable
            JOIN servicios_reservables_empresa sre 
                ON sre.id_servicio_reservable_empresa = rvs.id_servicio_reservable_empresa
            JOIN reservaciones_servicios_horas rsh
                ON rsh.id_reservacion_servicio = rvs.id_reservacion_servicio
            JOIN comercios AS cmr
                ON cmr.id_comercio = sre.id_comercio
            WHERE rvs.id_reservacion_servicio = ?
            GROUP BY rvs.id_reservacion_servicio`, [id_pago_asociado]);
        return rows;

    }catch(error){
        console.error('Error al obtener los datos del servicio:', error);
        throw error;
    }
}

const getDatosRecargaDB = async (id_pago_asociado, connection) => {
    const executor = connection || pool;

    try{
        const [rows] = await executor.execute(`
            
SELECT 1 as cantidad,
            'Recarga de Billetera' as nombre_transaccion,
            bt.monto as coste_total
            FROM billeteras_recargas br
            JOIN billeteras_transacciones bt ON br.id_billetera_recarga = bt.id_pago_asociado
            WHERE br.id_billetera_recarga = ?
            AND bt.id_tipo_transaccion = ${TIPOS_TRANSACCION.RECARGA}
            `,[id_pago_asociado])
            return rows;
    }catch(error){
        console.error('Error al obtener los datos de la recarga:', error);
        throw error;
    }
}

const createTransaccionDB = async (id_billetera, id_tipo_transaccion, id_pago_asociado, monto, connection) => {
    const executor = connection || pool;
    try {

        const [result] = await executor.execute(`
            INSERT INTO billeteras_transacciones (id_billetera, id_tipo_transaccion, id_pago_asociado, monto, fecha_transaccion) 
            VALUES (?, ?, ?, ?, ?)`, 
            [id_billetera, id_tipo_transaccion, id_pago_asociado, monto, new Date()]);

        return result.insertId; // Retorna el ID de la transacción creada

    }catch(error) {
        console.error('Error creando transacción:', error);
        throw error;
    }
}

const pagarMensualidadDB = async (id_pago_asociado, db_connection) => {
    const executor = db_connection || pool;
    try{
        const [rows] = await executor.execute(`
            UPDATE mensualidades_socios 
            SET estado = 1
            WHERE id_mensualidad_socio = ?`, [id_pago_asociado]);
        return rows.affectedRows > 0; // Retorna true si se actualizó al menos una fila
    }catch(error) {
        console.error('Error al pagar mensualidad:', error);
        throw error;
    }
}

const pagarReservacionDB = async (id_pago_asociado, db_connection) =>{
    const executor = db_connection || pool;
    try{
        const [rows] = await executor.execute(`
            UPDATE reservaciones
            SET estado = 1
            WHERE id_reservacion = ?`, [id_pago_asociado]);
        return rows.affectedRows > 0; // Retorna true si se actualizó al menos una fila

    }catch(error){
        console.error('Error al pagar reservación:', error);
        throw error;
    }
}


const pagarCompraDB = async (id_pago_asociado, db_connection) => {
    const executor = db_connection || pool;
    try{
        const [rows] = await executor.execute(`
            UPDATE compras_comercio
            SET estado = 1
            WHERE id_compra_comercio = ?`, [id_pago_asociado]);
        return rows.affectedRows > 0; // Retorna true si se actualizó al menos una fila
    }catch(error){
        console.error('Error al pagar compra:', error);
        throw error;
    }
}

const pagarServicioDB = async (id_pago_asociado, db_connection) =>{
    const executor = db_connection || pool;
    try{
        const [rows] = await executor.execute(`
            UPDATE reservaciones_servicios
            SET estado = 1
            WHERE id_reservacion_servicio = ?`, [id_pago_asociado]);
        return rows.affectedRows > 0; // Retorna true si se actualizó al menos una fila
    }catch(error){
        console.error('Error al pagar servicio:', error);
        throw error;
    }
}

export{
    getTransaccionesPendientesDB,
    getUltimasTransaccionesSocioDB,
    getTransaccionesSocioPorMesDB,
    getTransaccionesSocioCompletoPorMesDB,
    getTransaccionPorIdDB,
    createTransaccionDB,
    getDatosMensualidadDB,
    getDatosReservacionDB,
    getDatosCompraDB,
    getDatosServicioDB,
    getDatosRecargaDB,
    pagarMensualidadDB,
    pagarReservacionDB,
    pagarCompraDB,
    pagarServicioDB


}