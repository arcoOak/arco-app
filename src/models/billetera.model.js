import pool from '../config/db.config.js';

const getBilleteraDB = async (id_socio) => {
    try {
        const [rows] = await pool.query('SELECT * FROM billeteras WHERE id_socio = ?', [id_socio]);
        return rows[0]; // Assuming there's only one wallet per user
    } catch (error) {
        console.error('Error consultando billetera:', error);
        throw error;
    }
}

const getTransaccionesBilleteraPorMesDB = async (id_socio, mes) => {
    try {
        const [rows] = await pool.query(`
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

const getTransaccionesBilleteraCompletaPorMesDB = async (id_socio, mes) =>{
    try {
        const [rows] = await pool.query(`
            -- Parte 1: Mensualidades de Socios
            SELECT
                mens.estado AS estado_transaccion,
                CONCAT(dtt.nombre_transaccion, ' ', dts.nombre_tipo_socio) AS tipo_transaccion,
                dts.tarifa AS total_transaccion,
                bt.fecha_transaccion AS fecha_transaccion
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
                mens.id_socio = ? 
                AND mens.mes = ?

            UNION ALL

            -- Parte 2: Reservaciones
            SELECT
                res.estado AS estado_transaccion,
                dtt.nombre_transaccion AS tipo_transaccion,
                res.costo_reserva AS total_transaccion,
                bt.fecha_transaccion AS fecha_transaccion
            FROM
                reservaciones AS res
            JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 2 -- Tipo de transacción para reservaciones
            LEFT JOIN billeteras AS b ON res.id_socio = b.id_socio
            LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
                AND bt.id_tipo_transaccion = 2
                AND bt.id_pago_asociado = res.id_reservacion
            WHERE
                res.id_socio = ?
                AND MONTH(res.fecha_creacion) = ? 
                AND res.costo_reserva > 0

            UNION ALL

            -- Parte 3: Compras en Comercio
            SELECT
                comp.estado AS estado_transaccion,
                dtt.nombre_transaccion AS tipo_transaccion,
                comp.precio_total AS total_transaccion,
                bt.fecha_transaccion AS fecha_transaccion
            FROM
                compras_comercio AS comp
            JOIN data_tipo_transaccion AS dtt ON dtt.id_tipo_transaccion = 3 -- Tipo de transacción para compras
            LEFT JOIN billeteras AS b ON comp.id_socio = b.id_socio
            LEFT JOIN billeteras_transacciones AS bt ON b.id_billetera = bt.id_billetera
                AND bt.id_tipo_transaccion = 3
                AND bt.id_pago_asociado = comp.id_compra_comercio
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

export {
    getBilleteraDB,
    getTransaccionesBilleteraPorMesDB,
    getTransaccionesBilleteraCompletaPorMesDB
};