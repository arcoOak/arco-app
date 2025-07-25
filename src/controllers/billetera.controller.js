import {
    getBilleteraDB,
    getTransaccionesBilleteraPorMesDB,
    getTransaccionesBilleteraCompletaPorMesDB

} from '../models/billetera.model.js';

const getBilletera = async (req, res) => {
    const { id_socio } = req.params;
    try {
        const billetera = await getBilleteraDB(id_socio);
        res.json(billetera);
    } catch (error) {
        console.error('Error al obtener la billetera:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la billetera' });
    }
}

const getTransaccionesBilleteraPorMes = async (req, res) => {
    const { id_socio, mes } = req.params;
    try {
        const transacciones = await getTransaccionesBilleteraPorMesDB(id_socio, mes);
        res.json(transacciones);
    } catch (error) {
        console.error('Error al obtener transacciones por mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener transacciones por mes' });
    }
}

const getTransaccionesBilleteraCompletaPorMes = async (req, res) => {
    const { id_socio, mes } = req.params;
    try {
        const transacciones = await getTransaccionesBilleteraCompletaPorMesDB(id_socio, mes);
        res.json(transacciones);
    } catch (error) {
        console.error('Error al obtener transacciones completas por mes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener transacciones completas por mes' });
    }
}
export default {
    getBilletera,
    getTransaccionesBilleteraPorMes,
    getTransaccionesBilleteraCompletaPorMes
};