import pool from '../config/db.config.js';

const getBilleteraDB = async (id_socio) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM billeteras WHERE id_socio = ?', [id_socio]);
        return rows[0]; // Assuming there's only one wallet per user
    } catch (error) {
        console.error('Error consultando billetera:', error);
        throw error;
    }
}

const getTransaccionesBilleteraPorMesDB = async (id_socio, mes) => {
    try {
        const [rows] = await pool.execute(`
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

const getUltimasTransaccioonesBilleteraDB = async (id_socio) => {
    try {
        const [rows] = await pool.execute(`
            	SELECT  bt.* , dtt.nombre_transaccion, 
                    CASE
                    WHEN bt.id_tipo_transaccion = 1 THEN ( CONCAT(dtt.nombre_transaccion, ' ', dts.nombre_tipo_socio)  )
                    WHEN bt.id_tipo_transaccion = 2 THEN ( SELECT eru.nombre_unidad FROM reservaciones res JOIN espacios_reservables_unidad as eru ON res.id_espacio_reservable_unidad = eru.id_espacio_reservable_unidad WHERE res.id_reservacion =  bt.id_pago_asociado  )
                        WHEN bt.id_tipo_transaccion = 3 THEN
                        ( SELECT com.nombre_comercio FROM compras_comercio coc JOIN comercios com ON coc.id_comercio = com.id_comercio WHERE coc.id_compra_comercio = bt.id_pago_asociado  )
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
        return rows
    } catch (e){
        console.error('Error consultando transacciones por mes:', e);
        throw e;
    }
}

const getTransaccionesBilleteraCompletaPorMesDB = async (id_socio, mes) =>{
    try {
        const [rows] = await pool.execute(`
            -- Parte 1: Mensualidades de Socios
                    SELECT
                dtt.id_tipo_transaccion,
            mens.estado AS estado_transaccion,
            dtt.nombre_transaccion AS tipo_transaccion,
            dts.tarifa AS total_transaccion,
                CAST(CONCAT(mens.anho, '-', mens.mes, '-', mens.dia) AS DATE) as fecha_generacion,
            bt.fecha_transaccion AS fecha_transaccion,
                CONCAT(dtt.nombre_transaccion, ' ', dts.nombre_tipo_socio) as descripcion_contenido,
                1 as descripcion_cantidad,
                bt.id_billetera_transaccion
        FROM
            mensualidades_socios AS mens
        JOIN socios AS s ON mens.id_socio = s.id_socio
        JOIN data_tipo_socio AS dts ON s.id_tipo_socio = dts.id_tipo_socio
        JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 1 -- Tipo de transacción para mensualidades
        LEFT JOIN billeteras AS b ON mens.id_socio = b.id_socio
        LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
            AND bt.id_tipo_transaccion = 1
            AND bt.id_pago_asociado = mens.id_mensualidad_socio
        WHERE
            mens.id_socio = ? AND mens.mes = ?

        UNION ALL

        -- Parte 2: Reservaciones
        SELECT
                dtt.id_tipo_transaccion,
            res.estado AS estado_transaccion,
            dtt.nombre_transaccion AS tipo_transaccion,
            res.costo_reserva AS total_transaccion,
                res.fecha_creacion AS fecha_generacion,
            bt.fecha_transaccion AS fecha_transaccion,
                CONCAT(eru.nombre_unidad) AS descripcion_contenido,
                (SELECT COUNT(rh.id_reservacion_hora ) FROM reservaciones_horas AS rh WHERE rh.id_reservacion = res.id_reservacion ) AS descripcion_cantidad,
                bt.id_billetera_transaccion
                FROM
            reservaciones AS res
        JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 2 -- Tipo de transacción para reservaciones
        LEFT JOIN billeteras AS b ON res.id_socio = b.id_socio
        LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
            AND bt.id_tipo_transaccion = 2
            AND bt.id_pago_asociado = res.id_reservacion
        JOIN espacios_reservables_unidad AS eru ON eru.id_espacio_reservable_unidad = res.id_espacio_reservable_unidad
        WHERE
            res.id_socio = ?
            AND MONTH(res.fecha_creacion) = ?
            AND res.costo_reserva > 0

        UNION ALL

        -- Parte 3: Compras en Comercio
        SELECT
                dtt.id_tipo_transaccion,
            comp.estado AS estado_transaccion,
            dtt.nombre_transaccion AS tipo_transaccion,
            comp.precio_total AS total_transaccion,
                comp.fecha_compra AS fecha_generacion,
            bt.fecha_transaccion AS fecha_transaccion,
                cmr.nombre_comercio AS descripcion_contenido,
            (SELECT SUM(ccp.cantidad) FROM compras_comercio_productos AS ccp WHERE ccp.id_compra_comercio = comp.id_compra_comercio )  AS descripcion_cantidad,
            bt.id_billetera_transaccion
        FROM
            compras_comercio AS comp
        JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 3 -- Tipo de transacción para compras
        LEFT JOIN billeteras AS b ON comp.id_socio = b.id_socio
        LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
            AND bt.id_tipo_transaccion = 3
            AND bt.id_pago_asociado = comp.id_compra_comercio
        JOIN comercios AS cmr ON cmr.id_comercio = comp.id_comercio 
        WHERE
            comp.id_socio = ?
            AND MONTH(comp.fecha_compra) = ?

            `, 
            [id_socio, mes, id_socio, mes, id_socio, mes]);
        return rows;
    } catch (error) {
        console.error('Error consultando transacciones completas por mes:', error);
        throw error;
    }
}

const getPagosPendientesDB = async (id_socio) => {

    try {
        const [rows] = await pool.execute(`
            SELECT mens.estado AS estado_transaccion,
                dts.tarifa AS total_transaccion,
                mens.mes as mes_generacion,
                CONCAT(dtt.nombre_transaccion, ' ',dts.nombre_tipo_socio) as descripcion_contenido,
                CAST(CONCAT(mens.anho, '-', mens.mes, '-', mens.dia) AS DATE) as fecha_generacion
                FROM
                    mensualidades_socios AS mens
                JOIN socios AS s ON mens.id_socio = s.id_socio
                JOIN data_tipo_socio AS dts ON s.id_tipo_socio = dts.id_tipo_socio
								JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 1
                WHERE
                    mens.estado = 0 AND
                    mens.id_socio = ? `,
            [id_socio]);
        return rows;
    } catch (error) {
        console.error('Error consultando pagos pendientes:', error);
        throw error;
    }
}

const getTransaccionPorIdDB = async (id_billetera_transaccion) => {
    try {
        const [rows] = await pool.execute(`SELECT * FROM(
                SELECT dtt.id_tipo_transaccion,
            mens.estado AS estado_transaccion,
            dtt.nombre_transaccion AS tipo_transaccion,
            dts.tarifa AS total_transaccion,
                CAST(CONCAT(mens.anho, '-', mens.mes, '-', mens.dia) AS DATE) as fecha_generacion,
            bt.fecha_transaccion AS fecha_transaccion,
                CONCAT(dtt.nombre_transaccion, ' ', dts.nombre_tipo_socio) as descripcion_contenido,
								bt.id_billetera_transaccion,
                                bt.id_pago_asociado
        FROM
            mensualidades_socios AS mens
        JOIN socios AS s ON mens.id_socio = s.id_socio
        JOIN data_tipo_socio AS dts ON s.id_tipo_socio = dts.id_tipo_socio
        JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 1 -- Tipo de transacción para mensualidades
        LEFT JOIN billeteras AS b ON mens.id_socio = b.id_socio
        LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
            AND bt.id_tipo_transaccion = 1
            AND bt.id_pago_asociado = mens.id_mensualidad_socio
        WHERE
             mens.estado = 1

        UNION ALL

        SELECT
                dtt.id_tipo_transaccion,
            res.estado AS estado_transaccion,
            dtt.nombre_transaccion AS tipo_transaccion,
            res.costo_reserva AS total_transaccion,
                res.fecha_creacion AS fecha_generacion,
            bt.fecha_transaccion AS fecha_transaccion,
                CONCAT(eru.nombre_unidad) AS descripcion_contenido,
								bt.id_billetera_transaccion,
                                bt.id_pago_asociado
        FROM
            reservaciones AS res
        JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 2 -- Tipo de transacción para reservaciones
        LEFT JOIN billeteras AS b ON res.id_socio = b.id_socio
        LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
            AND bt.id_tipo_transaccion = 2
            AND bt.id_pago_asociado = res.id_reservacion
        JOIN espacios_reservables_unidad AS eru ON eru.id_espacio_reservable_unidad = res.id_espacio_reservable_unidad
        WHERE
        res.costo_reserva > 0 and res.estado = 1

        UNION ALL


        SELECT
                dtt.id_tipo_transaccion,
            comp.estado AS estado_transaccion,
            dtt.nombre_transaccion AS tipo_transaccion,
            comp.precio_total AS total_transaccion,
                comp.fecha_compra AS fecha_generacion,
            bt.fecha_transaccion AS fecha_transaccion,
                cmr.nombre_comercio AS descripcion_contenido,
								bt.id_billetera_transaccion,
                                bt.id_pago_asociado
        FROM compras_comercio AS comp
        JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 3
        LEFT JOIN billeteras AS b ON comp.id_socio = b.id_socio
        LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
            AND bt.id_tipo_transaccion = 3
            AND bt.id_pago_asociado = comp.id_compra_comercio
        JOIN comercios AS cmr ON cmr.id_comercio = comp.id_comercio 
        
        ) tabla
				WHERE tabla.id_billetera_transaccion = ?
        `, [id_billetera_transaccion]);
        return rows[0];
    } catch (error) {
        console.error('Error consultando transacción por ID:', error);
        throw error;
    }
}

const getDatosMensualidadDB = async (id_pago_asociado) => {
    try {
        const [rows] = await pool.execute(`
            SELECT '1' as cantidad, 
            CONCAT(dtt.nombre_transaccion,' ',dts.nombre_tipo_socio) nombre_transaccion, 
            dts.tarifa as coste_total 
            FROM mensualidades_socios AS mens
            JOIN socios AS s ON mens.id_socio = s.id_socio      
            JOIN data_tipo_socio AS dts ON s.id_tipo_socio = dts.id_tipo_socio
            JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 1
            WHERE mens.id_mensualidad_socio = ?`, [id_pago_asociado]);
            return rows;
    } catch (error) {
        console.error('Error al obtener los datos de la mensualidad:', error);
        throw error;
    }
}

const getDatosReservacionDB = async (id_pago_asociado) => {
    try {
        const [rows] = await pool.execute(`
            SELECT COUNT(rh.id_reservacion_hora) as cantidad, 
            eru.nombre_unidad as nombre_transaccion, 
            res.costo_reserva as coste_total
            FROM reservaciones AS res
            JOIN espacios_reservables_unidad AS eru ON eru.id_espacio_reservable_unidad = res.id_espacio_reservable_unidad
            JOIN reservaciones_horas AS rh ON rh.id_reservacion = res.id_reservacion
            WHERE res.id_reservacion = ?`, [id_pago_asociado]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los datos de la reservación:', error);
        throw error;
    }
}

const getDatosCompraDB = async (id_pago_asociado) => {
    try {
        const [rows] = await pool.execute(`
            SELECT ccp.cantidad as cantidad, 
            pr.nombre_producto as nombre_transaccion, 
            ccp.precio_producto as coste_total
            FROM compras_comercio AS comp
            JOIN comercios AS cmr ON cmr.id_comercio = comp.id_comercio
            JOIN compras_comercio_productos AS ccp ON ccp.id_compra_comercio = comp.id_compra_comercio
            JOIN productos AS pr ON pr.id_producto = ccp.id_producto
            WHERE comp.id_compra_comercio = ?`, [id_pago_asociado]);
        return rows;
    } catch (error) {
        console.error('Error al obtener los datos de la compra:', error);
        throw error;
    }
}

/*

Crear getDatosReservacion
Crear getDatosCompra

Enlazar las vistas de estas listas en la vista individual de transacción

*/ 


export {
    getBilleteraDB,
    getUltimasTransaccioonesBilleteraDB,
    getTransaccionesBilleteraPorMesDB,
    getTransaccionesBilleteraCompletaPorMesDB,
    getPagosPendientesDB,
    getTransaccionPorIdDB,
    getDatosMensualidadDB,
    getDatosReservacionDB,
    getDatosCompraDB

};