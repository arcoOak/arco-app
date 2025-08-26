
import {pool} from '../config/db.config.js';

import {
    getCompraByIdDB,
    getComprasByUsuarioMesDB,
} from '../models/compra.model.js';

import {
    getProductosByCompraComercioDB
} from '../models/producto.model.js';

import { TransaccionCompra } from '../models/Transaccion.js';


const getCompraById = async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const compra = await getCompraByIdDB(id, connection);
        if (!compra) {
            await connection.rollback();
            return res.status(404).json({ message: 'Compra no encontrada' });
        }
        const productos = await getProductosByCompraComercioDB(id, connection);
        compra.productos = productos;
        await connection.commit();
        res.json(compra);
    } catch (error) {
        await connection.rollback();
        console.error('Error al obtener la compra por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    } finally {
        connection.release();
    }
};

const getComprasByUsuarioMes = async (req, res) => {
    const { id_socio, mes, anho } = req.params;
    try {
        const compras = await getComprasByUsuarioMesDB(id_socio, mes, anho);
        if (!compras || compras.length === 0) {
            return res.json({ message: 'No se encontraron compras para el usuario en el mes especificado' });
        }
        res.json(compras);
    } catch (error) {
        console.error('Error al obtener las compras del usuario por mes:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const crearCompra = async (req, res) => {
    const { id_usuario,
        id_billetera,
        monto,
        id_tipo_transaccion,
        compraData,
        listaItems
     } = req.body;
    try {
        const transaccion = new TransaccionCompra({
            id_usuario,
            id_billetera,
            monto,
            id_tipo_transaccion,
            compraData,
            listaItems
        });
        await transaccion.save();
        res.status(201).json(transaccion);
    } catch (error) {
        console.error('Error al crear la compra:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

export default {
    getCompraById,
    getComprasByUsuarioMes,
    crearCompra
}