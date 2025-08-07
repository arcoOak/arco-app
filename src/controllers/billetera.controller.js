import {
    getBilleteraDB,
    getTransaccionesBilleteraPorMesDB,
    getTransaccionesBilleteraCompletaPorMesDB,
    getPagosPendientesDB,
    getUltimasTransaccioonesBilleteraDB,
    getTransaccionPorIdDB,
    getDatosMensualidadDB,
    getDatosReservacionDB,
    getDatosCompraDB
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

const getUltimasTransaccionesBilletera = async (req, res) => {
    const { id_socio } = req.params;
    try{
        const transacciones = await getUltimasTransaccioonesBilleteraDB(id_socio);
        res.json(transacciones);
    } catch (e){
        console.error('Error al obtener las últimas transacciones: ', e);
        res.status(500).json({ message: 'Error interno del servidor al obtener las últimas transacciones' });
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

const getPagosPendientes = async (req, res) => {
    const { id_socio } = req.params;
    try {
        const pagos = await getPagosPendientesDB(id_socio);
        res.json(pagos);
    } catch (error) {
        console.error('Error al obtener pagos pendientes:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener pagos pendientes' });
    }
}

const getTransaccionPorId = async (req, res) => {
    const { id_billetera_transaccion } = req.params;

    let listaElementosTransaccion = [];
    try {
        const transaccion = await getTransaccionPorIdDB(id_billetera_transaccion);
        if (!transaccion) {
            return res.status(404).json({ message: 'Transacción no encontrada' });
        }

        console.log('Transacción obtenida:', transaccion);

        if(transaccion.id_tipo_transaccion === 1){
            listaElementosTransaccion = await getDatosMensualidadDB(transaccion.id_pago_asociado);
        }else if(transaccion.id_tipo_transaccion === 2){
            listaElementosTransaccion = await getDatosReservacionDB(transaccion.id_pago_asociado);
        }else if(transaccion.id_tipo_transaccion === 3){
            listaElementosTransaccion = await getDatosCompraDB(transaccion.id_pago_asociado);
        }

        res.json({transaccion, listaElementosTransaccion});
    } catch (error) {
        console.error('Error al obtener la transacción por ID:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener la transacción por ID' });
    }
}

export default {
    getBilletera,
    getTransaccionesBilleteraPorMes,
    getTransaccionesBilleteraCompletaPorMes,
    getPagosPendientes,
    getUltimasTransaccionesBilletera,
    getTransaccionPorId
};