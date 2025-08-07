import {
    getClimaSemanalDB,
    cargarDatosClimaSemanalDB
} from '../models/clima.model.js';

const getClimaSemanal = async (req, res) => {
    const { id_club } = req.params; // Asegúrate de que el id_club se pase como query parameter
    const fecha = new Date(); // Puedes ajustar la fecha según sea necesario

    try {
        const climaSemanal = await getClimaSemanalDB(id_club, fecha);
        res.json(climaSemanal);
    } catch (error) {
        console.error('Error al obtener clima semanal:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener clima semanal' });
    }
}

const cargarDatosClimaSemanal = async (req, res) => {
    const { id_club } = req.params; // Asegúrate de que el id_club se pase como query parameter
    const datosSemanales = req.body; // Los datos climáticos semanales deben enviarse en el cuerpo de la solicitud

    const datosFormateados = formatearDatosClimaSemanal(datosSemanales);


    try {
        const result = await cargarDatosClimaSemanalDB(id_club, datosFormateados);
        res.json({ message: `${result} registros insertados correctamente` });
    } catch (error) {
        console.error('Error al cargar datos climáticos semanales:', error);
        res.status(500).json({ message: 'Error interno del servidor al cargar datos climáticos semanales' });
    }
}

const formatearDatosClimaSemanal = (datos) =>{
    const datosTime = datos.hourly.time;
    const datosTemp = datos.hourly.temperature_2m;
    const datosPrecipitacion = datos.hourly.precipitation_probability;

    return datosTime.map((time, index) => ({
        fecha: time,
        temperatura: datosTemp[index],
        precipitacion_porcentaje: datosPrecipitacion[index]
    }));
}

export default {
    getClimaSemanal,
    cargarDatosClimaSemanal
};