
import {Billetera} from '../models/Billetera.js';


import {pool} from '../config/db.config.js';

const getBilleteraBySocio = async (req, res) => {
    const { id_socio } = req.params;
    try {
        const billetera = await Billetera.obtenerBilleteraSocio(id_socio);
        res.json(billetera);
    } catch (error) {
        console.error('Error al obtener la billetera:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la billetera' });
    }
}

const getBilleteraById = async (req, res) => {
    const {id_billetera} = req.params;
    try {
        const billetera = await Billetera.obtenerBilleteraId(id_billetera);
        res.json(billetera);
    } catch (error) {
        console.error('Error al obtener la billetera por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la billetera por ID' });
    }
}

const recargarSaldo = async (req, res) =>{
    const {id_billetera, monto, metodoSeleccionado} = req.body;
    const connection = await pool.getConnection();

    const montoNum = Number(monto);

    if( isNaN(montoNum) || montoNum <= 0 ){
        return res.status(400).json({ message: 'Monto inválido' });
    }


    try{
        await connection.beginTransaction();
        const billetera = await Billetera.obtenerBilleteraId(id_billetera, connection);
        await billetera.recargarSaldo(montoNum, metodoSeleccionado, connection);
        await connection.commit();

        return res.status(200).json({ message: 'Saldo recargado exitosamente' });

    }catch(error){
        await connection.rollback();
        console.error('Error al recargar saldo:', error);
        res.status(500).json({ message: 'Error interno del servidor al recargar saldo' });

    }finally{
        connection.release();
    }

}

const getSaldoBilletera = async (req, res) => {
    const { id_billetera } = req.params;
    try {
        const billetera = await Billetera.obtenerBilleteraId(id_billetera);
        const saldo = billetera.getSaldo();
        res.json(saldo);
    } catch (error) {
        console.error('Error al obtener el saldo de la billetera:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener el saldo de la billetera' });
    }
}

export default {
    getBilleteraBySocio,
    getBilleteraById,
    recargarSaldo,
    getSaldoBilletera
};