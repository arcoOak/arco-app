

import {TransaccionMensualidad} from '../models/Transaccion.js';

import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js'; 


const crearMensualidad = async (req, res) => {
    try {
        const { id_socio, transaccionData, id_usuario } = req.body;

        // Crea la instancia de la transacción de mensualidad
        const transaccion = new TransaccionMensualidad({
            id_usuario: id_usuario, // Si lo tienes, si no puedes omitirlo
            id_billetera: transaccionData.id_billetera,
            id_tipo_transaccion: transaccionData.id_tipo_transaccion,
            monto: transaccionData.monto, // Puede ser null, se asigna en generate()
            id_socio: id_socio, // Si lo tienes, si no puedes omitirlo
        });

        await transaccion.save();

        return res.status(200).json(true);
    } catch (e) {
        console.error('Error al crear la mensualidad:', e);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al crear la mensualidad' });
        }
    }
};


const pagarMensualidad = async (req, res) => {
    const { id_billetera, id_pago_asociado, monto } = req.body;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const response = await pagarTransaccion({ id_billetera, id_tipo_transaccion: TIPOS_TRANSACCION.MENSUALIDAD, id_pago_asociado, monto }, connection);

        await connection.commit();

        return res.status(200).json(response);
    } catch (error) {
        await connection.rollback();
        console.error('Error al pagar la mensualidad:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Error al pagar la mensualidad' });
        }
    } finally {
        if (connection) {
            connection.release();
        }
    }
}



export default {
    crearMensualidad,
    pagarMensualidad
};