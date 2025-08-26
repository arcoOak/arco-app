import {
    getClimaSemanalDB,
} from '../models/clima.model.js';



const getClimaSemanal = async (req, res) => {
    const { id_club } = req.params; // Asegúrate de que el id_club se pase como query parameter
    const fecha = new Date(); // Puedes ajustar la fecha según sea necesario

    try {
        // La data es actualizada por un cron job. Este endpoint solo la consulta.
        const climaSemanal = await getClimaSemanalDB(id_club, fecha);
        if (climaSemanal.length === 0) {
            console.warn(`No se encontraron datos de clima para el club ${id_club}. El cron job podría no haberse ejecutado.`);
        }
        res.json(climaSemanal);
    } catch (error) {
        console.error('Error al obtener clima semanal:', error);
        res.status(500).json({ message: 'Error interno del servidor al obtener clima semanal' });
    }
}



export default {
    getClimaSemanal
};