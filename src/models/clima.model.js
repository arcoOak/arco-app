import {pool} from '../config/db.config.js';

// Obtiene el pronóstico del clima para los próximos 7 días, filtrado por el horario de apertura del club.
const getClimaSemanalDB = async (id_club, fecha) =>{

    try{
        const [rows] = await pool.execute(`
            SELECT date(clc.fecha) fecha, time(clc.fecha) hora, 
            clc.temperatura, clc.precipitacion_porcentaje
            FROM clubes_clima clc
            JOIN clubes clb ON clc.id_club = clb.id_club
            WHERE clc.id_club = ?
            AND TIME(clc.fecha) BETWEEN 
                TIME(clb.hora_apertura) AND TIME(clb.hora_cierre) 
			AND DATE(clc.fecha) BETWEEN 
                DATE(?) AND DATE_ADD(DATE(?), INTERVAL 7 DAY)
            ORDER BY clc.fecha ASC
        `, [id_club, fecha, fecha]);
        return rows;
    }catch(error){
        console.error('Error al obtener clima semanal:', error);
        throw error;
    }

}

// Obtiene todos los clubes con sus coordenadas para la actualización del clima.
const getAllClubesConCoordenadasDB = async () => {
    try {
        const [rows] = await pool.execute(
            `SELECT id_club, latitud, longitud FROM clubes WHERE latitud IS NOT NULL AND longitud IS NOT NULL`
        );
        return rows;
    } catch (error) {
        console.error('Error al obtener coordenadas de los clubes:', error);
        throw error;
    }
};

const cargarDatosClimaSemanalDB = async (id_club, datosSemanales)=>{

    try {

        const values = datosSemanales.map(data => [
            id_club,
            data.fecha,
            data.temperatura,
            data.precipitacion_porcentaje
        ]);

        const placeholders = values.map(() => '(?, ?, ?, ?)').join(', ');
        const flatValues = values.flat();
        
        const [result] = await pool.execute(
            `INSERT INTO clubes_clima (id_club, fecha, temperatura, precipitacion_porcentaje) 
            VALUES ${placeholders}`,
            flatValues
        );
        return result.affectedRows;


    } catch (error) {
        console.error('Error al cargar datos climáticos semanales:', error);
    }

}

// Limpia los datos de pronóstico existentes (de hoy en adelante) para un club.
const limpiarPronosticoClimaDB = async (id_club) => {
    try {
        const [result] = await pool.execute(
            `DELETE FROM clubes_clima WHERE id_club = ? AND fecha >= CURDATE()`,
            [id_club]
        );
        return result.affectedRows;
    } catch (error) {
        console.error(`Error al limpiar pronóstico del clima para el club ${id_club}:`, error);
        throw error;
    }
};

export {
    getClimaSemanalDB,
    cargarDatosClimaSemanalDB,
    getAllClubesConCoordenadasDB,
    limpiarPronosticoClimaDB
};