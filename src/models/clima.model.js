import pool from '../config/db.config.js';

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

export {
    getClimaSemanalDB,
    cargarDatosClimaSemanalDB
};