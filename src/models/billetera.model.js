import {pool} from '../config/db.config.js';

import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js'; 

const getBilleteraSocioDB = async (id_socio, connection) => {
    const db_connection = connection || pool;
    try {
        const [rows] = await db_connection.execute('SELECT * FROM billeteras WHERE id_socio = ?', [id_socio]);
        return rows[0]; // Assuming there's only one wallet per user
    } catch (error) {
        console.error('Error consultando billetera:', error);
        throw error;
    }
}

const getBilleteraIdDB = async (id_billetera, connection) => {
    const db_connection = connection || pool;
    try {
        const [rows] = await db_connection.execute('SELECT * FROM billeteras WHERE id_billetera = ?', [id_billetera]);
        return rows[0]; // Assuming there's only one wallet per user
    } catch (error) {
        console.error('Error consultando billetera por ID:', error);
        throw error;
    }
}

const obtenerSaldoBilleteraDB = async(id_billetera, connection) => {
    const db_connection = connection || pool;
    try {
        const [rows] = await db_connection.execute('SELECT saldo_actual FROM billeteras WHERE id_billetera = ?', [id_billetera]);
        return rows[0]?.saldo_actual || 0;
    } catch (error) {
        console.error('Error consultando saldo de billetera:', error);
        throw error;
    }
}




const actualizarBilleteraDB = async (id_billetera, monto, db_connection) =>{
    const executor = db_connection || pool;
    console.log('Actualizando billetera:', {id_billetera, monto});
    try{

        const [rows] = await executor.execute(`
            UPDATE billeteras
            SET saldo_actual = saldo_actual + ?
            WHERE id_billetera = ?`, [monto, id_billetera]);
        return rows;
    }catch(error){
        console.error('Error al actualizar la billetera:', error);
        throw error;
    }

}

const crearRecargaDB = async (id_billetera, id_metodo_pago, connection) => {
    const executor = connection || pool;
    try {
        const [result] = await executor.execute(`
            INSERT INTO billeteras_recargas (id_billetera, id_metodo_pago, estado) 
            VALUES (?, ?, ?)`, [id_billetera, id_metodo_pago, 0]);
        return result.insertId; // Retorna el ID de la recarga creada
    } catch (error) {
        console.error('Error creando recarga:', error);
        throw error;
    }
}

const crearBilleteraDB = async (id_socio, id_usuario, db_connection) => {
    const executor = db_connection || pool;
    try {
        const [result] = await executor.execute(`
            INSERT INTO billeteras (id_billetera, id_socio, id_usuario) 
            VALUES (?, ?, ?)`, [id_billetera, id_socio, id_usuario]);
        return result.insertId; // Retorna el ID de la billetera creada
    } catch (error) {
        console.error('Error creando billetera:', error);
        throw error;
    }
}

const validarRecargaDB = async (id_recarga, connection) => {
    const db_connection = connection || pool;
    try {
        const [rows] = await db_connection.execute('UPDATE billeteras_recargas SET estado = 1 WHERE id_billetera_recarga = ?', [id_recarga]);
        return rows[0]; // Assuming there's only one wallet per user
    } catch (error) {
        console.error('Error consultando recarga:', error);
        throw error;
    }
}

export {
    getBilleteraSocioDB,
    getBilleteraIdDB,
    obtenerSaldoBilleteraDB,
    actualizarBilleteraDB,
    crearRecargaDB,
    crearBilleteraDB,
    validarRecargaDB
};