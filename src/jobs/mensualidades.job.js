import cron from 'node-cron';

import { getAllSociosDB } from '../models/socio.model.js';

import {TransaccionMensualidad} from '../models/Transaccion.js';

import {TIPOS_TRANSACCION} from '../constants/transaccion.constants.js'; 

// import { createTransaccion } from '../models/transaccion.model.js'; // Descomenta si es necesario

const generarMensualidades = async () => {
    try {
        const socios = await getAllSociosDB();
        for (const socio of socios) {
            try {
                // Cada transacción maneja su propia conexión y commit/rollback
                const transaccion = new TransaccionMensualidad({
                    id_usuario: socio.id_usuario, // Si tienes este dato
                    id_billetera: socio.id_billetera,
                    id_tipo_transaccion: TIPOS_TRANSACCION.MENSUALIDAD,
                    monto: null, // Se asigna en generate()
                    id_socio: socio.id_socio
                });

                await transaccion.save();

                console.log(`Mensualidad creada para socio ${socio.id_socio}`);
            } catch (error) {
                console.error(`Error procesando socio ${socio.id_socio}:`, error);
                // Continúa con el siguiente socio
            }
        }
    } catch (error) {
        console.error('Error general al crear mensualidades:', error);
    } 
};

const initScheduledJobs = () => {
    // Se ejecuta a las 02:00 AM del día 1 de cada mes.
    // Formato: (minuto hora día-del-mes mes día-de-la-semana)
    const scheduledJob = cron.schedule('0 2 1 * *', generarMensualidades, {
        scheduled: true,
        timezone: "America/Caracas"
    });

    console.log('Cron job de mensualidades agendado para ejecutarse el día 1 de cada mes a las 02:00 AM.');

    // Opcional: Ejecutar una vez al iniciar para pruebas
    generarMensualidades();

    return scheduledJob;
};

export default { initScheduledJobs };