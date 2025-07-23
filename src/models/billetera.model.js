import pool from '../config/db.config.js';

export const getBilletera = async (id_socio) => {
    try {
        const [rows] = await pool.query('SELECT * FROM billeteras WHERE id_socio = ?', [id_socio]);
        return rows[0]; // Assuming there's only one wallet per user
    } catch (error) {
        console.error('Error consultando billetera:', error);
        throw error;
    }
}

export const getTransaccionesBilleteraPorMes = async (id_socio, mes) => {
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

export const getTransaccionesBilleteraCompletaPorMes = async (id_socio, mes) =>{
    try {
        const [rows] = await pool.query(`
            SELECT a.estado as estado_transaccion, 
            CONCAT('Mensualidad ',c.nombre_tipo_socio) as tipo_transaccion, 
            c.tarifa as total_transaccion,
            COALESCE((
                SELECT bt.fecha_transaccion 
                FROM billeteras_transacciones bt
                JOIN billeteras b ON bt.id_billetera = b.id_billetera 
                WHERE b.id_socio = a.id_socio AND MONTH(bt.fecha_transaccion) = a.mes
                LIMIT 1
            ), '') AS fecha_transaccion
            FROM mensualidades_socios a
            JOIN socios b ON a.id_socio = b.id_socio
            JOIN data_tipo_socio c ON b.id_tipo_socio = c.id_tipo_socio
            LEFT JOIN billeteras_transacciones d ON a.id_socio = d.id_socio
            JOIN data_tipo_transaccion e ON e.id_tipo_transaccion = d.id_tipo_transaccion
            WHERE a.id_socio = ?
            AND a.mes = ?
            
            UNION 

            SELECT a.estado as estado_transaccion,
            
            `, 
            [id_socio, mes, ]);
        return rows;
    } catch (error) {
        console.error('Error consultando transacciones completas por mes:', error);
        throw error;
    }
}