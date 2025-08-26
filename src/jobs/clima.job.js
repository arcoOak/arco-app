import cron from 'node-cron';
import fetch from 'node-fetch';
import {
    getAllClubesConCoordenadasDB,
    limpiarPronosticoClimaDB,
    cargarDatosClimaSemanalDB
} from '../models/clima.model.js';

/**
 * Formatea la respuesta de la API de Open-Meteo a un formato que se puede insertar en la base de datos.
 * @param {object} datos - Los datos crudos de la API de Open-Meteo.
 * @returns {Array<object>} Un array de objetos de clima formateados.
 */
const formatearDatosClimaSemanal = (datos) => {
    const datosTime = datos.hourly.time;
    const datosTemp = datos.hourly.temperature_2m;
    const datosPrecipitacion = datos.hourly.precipitation_probability;

    return datosTime.map((time, index) => ({
        fecha: time,
        temperatura: datosTemp[index],
        precipitacion_porcentaje: datosPrecipitacion[index]
    }));
};

/**
 * Tarea que se ejecuta para obtener y almacenar el pronóstico del clima para todos los clubes.
 */
const actualizarClimaParaTodosLosClubes = async () => {
    console.log('Ejecutando cron job: Actualizando datos del clima...');
    try {
        const clubes = await getAllClubesConCoordenadasDB();
        if (!clubes || clubes.length === 0) {
            console.log('No hay clubes configurados con coordenadas para actualizar el clima.');
            return;
        }

        for (const club of clubes) {
            try {
                console.log(`Actualizando clima para el club: ${club.id_club}`);

                // 1. Obtener datos de Open-Meteo para los próximos 14 días para tener un buen margen.
                const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${club.latitud}&longitude=${club.longitud}&hourly=temperature_2m,precipitation_probability&forecast_days=14`;
        
                const meteoResponse = await fetch(openMeteoUrl);
                if (!meteoResponse.ok) {
                    throw new Error(`Error en API Open-Meteo para club ${club.id_club}: ${meteoResponse.statusText}`);
                }
                const datosSemanales = await meteoResponse.json();

                // 2. Formatear los datos
                const datosFormateados = formatearDatosClimaSemanal(datosSemanales);

                // 3. Limpiar datos de pronóstico antiguos e insertar los nuevos
                await limpiarPronosticoClimaDB(club.id_club);
                await cargarDatosClimaSemanalDB(club.id_club, datosFormateados);

                console.log(`Clima actualizado para el club: ${club.id_club}`);
            } catch (error) {
                console.error(`Error procesando clima para el club ${club.id_club}:`, error.message);
                // Continuar con el siguiente club
            }
        }
    } catch (error) {
        console.error('Error general en el cron job de clima:', error);
    }
    console.log('Cron job de clima finalizado.');
};

const initClimaJob = () => {
    // Se ejecuta todos los Lunes a las 03:00 AM.
    const scheduledJob = cron.schedule('0 3 * * 1', actualizarClimaParaTodosLosClubes, {
        scheduled: true,
        timezone: "America/Caracas"
    });

    console.log('Cron job de clima agendado para ejecutarse todos los lunes a las 03:00 AM.');

    // Ejecutar la tarea inmediatamente al iniciar el servidor
    actualizarClimaParaTodosLosClubes();

    return scheduledJob;
};

export default { initClimaJob };