

import { Transaccion } from '../models/Transaccion.js';


import {pool} from '../config/db.config.js';

const getUltimasTransaccionesSocio = async (req, res) => {
    const { id_socio } = req.params;
    let connection
    try{
        connection = await pool.getConnection();
        const ultimasTransacciones = await Transaccion.getUltimasTransaccionesSocio(id_socio, connection);
        res.json(ultimasTransacciones);
    } catch (e){
        console.error('Error al obtener las últimas transacciones: ', e);
        res.status(500).json({ message: 'Error interno del servidor al obtener las últimas transacciones' });
    } finally {
        if (connection) await connection.release();
    }
}

const getTransaccionesPendientes = async (req, res) => {
    const { id_socio } = req.params;
    let connection;
    try {
        connection = await pool.getConnection();
        const transacciones = await Transaccion.getTransaccionesPendientes(id_socio, connection);
        res.json(transacciones);
    } catch (error) {
        console.error('Error al obtener transacciones pendientes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener transacciones pendientes' });
    }finally{
        if (connection) await connection.release();
    }
}

const getTransaccionesSocioPorMes = async (req, res) => {
    const { id_socio, mes } = req.params;
    let connection
    try {
        connection = await pool.getConnection();
        const transacciones = await Transaccion.getTransaccionesSocioPorMes(id_socio, mes, connection);
        res.json(transacciones);
    } catch (error) {
        console.error('Error al obtener transacciones por mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener transacciones por mes' });
    }finally{
        if (connection) await connection.release();
    }
}


const getTransaccionesSocioCompletoPorMes = async (req, res) => {
    const { id_socio, mes, anho } = req.params;
    let connection;
    try {
        connection = await pool.getConnection();
        const transacciones = await Transaccion.getTransaccionesSocioCompletoPorMes(id_socio, mes, anho, connection);
        res.json(transacciones);
    } catch (error) {
        console.error('Error al obtener transacciones completas por mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener transacciones completas por mes' });
    }finally{
        if (connection) await connection.release();
    }
}


const getTransaccionPorId = async (req, res) => {
    const { id_billetera_transaccion } = req.params;
    let connection;
    try {
        connection = await pool.getConnection();

        const transaccion = await Transaccion.getTransaccionPorId(id_billetera_transaccion, connection);
        if (!transaccion) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        res.json(transaccion);
    } catch (error) {
        console.error('Error al obtener la transacción por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la transacción por ID' });
    }finally{
        if (connection) await connection.release();
    }
}


const createTransaccion = async (req, res) => {
    const { id_billetera, id_tipo_transaccion, id_pago_asociado, monto } = req.body;
    
    try {
        const transaccion = await new Transaccion({
            id_usuario,
            id_billetera,
            monto,
            id_tipo_transaccion,
            id_pago_asociado,
        });
        await transaccion.save();
        res.status(201).json(transaccion);
    } catch (error) {
        console.error('Error al crear la transacción:', error);
        res.status(500).json({ message: 'Error interno del servidor al crear la transacción' });
    }finally{
        if (connection) await connection.release();
    }
}

const pagarTransaccion = async (req, res) =>{
    const { id_billetera, id_tipo_transaccion, id_pago_asociado, monto} = req.body;

    const connection = await pool.getConnection(); 
    try{
        await connection.beginTransaction();

        const response = Transaccion.pagarTransaccion(
            { id_billetera, id_tipo_transaccion, id_pago_asociado, monto },
            connection
        )
        if(!response){
            await connection.rollback();
            return res.status(404).json({ message: 'No se encontró el pago asociado o ya está pagado.' });
        }
        await connection.commit();

        res.status(200).json(response);
    }catch(error){
        console.error('Error al pagar la transacción:', error);
        res.status(500).json({ message: 'Error interno del servidor al pagar la transacción' });

        await connection.rollback();
    }
}

export default {
    getUltimasTransaccionesSocio,
    getTransaccionesPendientes,
    getTransaccionesSocioPorMes,
    getTransaccionesSocioCompletoPorMes,
    getTransaccionPorId,
    createTransaccion,
    pagarTransaccion
}