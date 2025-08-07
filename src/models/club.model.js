import pool from '../config/db.config.js';

const getDatosClubDB = async (id_club) => {
    try {

        const [rows] = await pool.execute(
            `SELECT clb.*, ccf.* FROM clubes clb
            JOIN clubes_configuracion ccf ON clb.id_club = ccf.id_club
            WHERE clb.id_club = ?`, 
            [id_club]
        );

        if (rows.length === 0) {
            throw new Error('Club no encontrado');
        }

        return rows[0]; // Retorna el primer club encontrado

    } catch (error){
        console.error('Error al obtener datos del club:', error);
        throw new Error('Error al obtener datos del club');
    }
}

export {
    getDatosClubDB
}