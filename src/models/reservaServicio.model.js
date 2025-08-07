import pool from '../config/db.config.js';

const getReservaServicioByIdDB = async (id_reservacion_servicio) =>{

    try{

        const [row] = await pool.execute(`
            SELECT rss.*, srv.nombre_servicio_reservable, cmr.nombre_comercio, sre.costo_servicio, sre.capacidad
            FROM reservaciones_servicios rss
            JOIN servicios_reservables srv ON rss.id_servicio_reservable = srv.id_servicio_reservable 
			JOIN servicios_reservables_empresa sre ON rss.id_servicio_reservable_empresa = sre.id_servicio_reservable_empresa
			JOIN comercios cmr on sre.id_comercio = cmr.id_comercio
            WHERE rss.id_reservacion_servicio = ? 
            `, [id_reservacion_servicio]);
        return row[0];

    } catch(error){
        throw error;
    }

}

const getReservasServicioPorServicioDB = async (id_servicio, id_club) => {

    try{

        const [rows] = await pool.execute(`
            SELECT rss.* 
            FROM reservaciones_servicios rss
            JOIN servicios_reservables srv ON rss.id_servicio_reservable = srv.id_servicio_reservable 
            WHERE rss.id_servicio_reservable = ? AND srv.id_club = ?
            `, [id_servicio, id_club])
        
        return rows;

    } catch(error){
        throw error;
    }
}

const getReservasServicioPorServicioYMesDB = async (id_servicio, id_club, mes, anho) => {
    try{

        const [rows] = await pool.execute(`
            SELECT rss.* 
            FROM reservaciones_servicios rss
            JOIN servicios_reservables srv ON rss.id_servicio_reservable = srv.id_servicio_reservable 
            WHERE rss.id_servicio_reservable = ? AND srv.id_club = ? 
            AND MONTH(rss.fecha_reservacion) = ? AND YEAR(rss.fecha_reservacion) = ?
            `, [id_servicio, id_club, mes, anho])
        
        return rows;

    } catch(error){
        throw error;
    }
}


const getReservasServicioPorSocioDB = async (id_socio, id_club) => {
    try{

        const [rows] = await pool.execute(`
            SELECT rss.* 
            FROM reservaciones_servicios rss
            JOIN servicios_reservables srv ON rss.id_servicio_reservable = srv.id_servicio_reservable 
            WHERE rss.id_socio = ? AND srv.id_club = ?
            `, [id_socio, id_club]);
        return rows;

    } catch(error){
        throw error;
    }
}

const getReservasServicioPorSocioYMesDB = async (id_socio, id_club, mes, anho) => {
    try{

        const [rows] = await pool.execute(`
            SELECT rss.*, srv.nombre_servicio_reservable, cmr.nombre_comercio
            FROM reservaciones_servicios rss
            JOIN servicios_reservables srv ON rss.id_servicio_reservable = srv.id_servicio_reservable 
			JOIN servicios_reservables_empresa sre ON rss.id_servicio_reservable_empresa = sre.id_servicio_reservable_empresa
			JOIN comercios cmr on sre.id_comercio = cmr.id_comercio
            WHERE rss.id_socio = ? AND srv.id_club = ?
            AND MONTH(rss.fecha_reservacion) = ? AND YEAR(rss.fecha_reservacion) = ?
            `, [id_socio, id_club, mes, anho]);
            
        return rows;

    } catch(error){
        throw error;
    }
}


const getHorasReservadasPorServicioPorFechaDB = async (id_servicio, fecha, id_club) => {
    try{
        const [rows] = await pool.execute(`
            SELECT rsh.*, rss.*
            FROM reservaciones_servicios_horas rsh
            JOIN reservaciones_servicios rss ON rsh.id_reservacion_servicio = rss.id_reservacion_servicio
            JOIN servicios_reservables srv ON rss.id_servicio_reservable = srv.id_servicio_reservable
            WHERE rss.id_servicio_reservable = ? AND DATE(rss.fecha_reservacion) = ? AND srv.id_club = ?
            `, [id_servicio, fecha, id_club]);
        return rows;

    } catch(error){
        throw error;
    }
}

const getHorasReservadasPorReservaServiciosDB = async (id_reservacion_servicio) =>{
    try {
        const [rows] = await pool.execute(`
            SELECT rsh.*
            FROM reservaciones_servicios_horas rsh
            JOIN reservaciones_servicios rss ON rsh.id_reservacion_servicio = rss.id_reservacion_servicio
            WHERE rss.id_reservacion_servicio = ?
        `, [id_reservacion_servicio]);
        return rows;

    } catch(error){
        throw error;
    }
}

const createReservaServicioDB = async (reservaServicioData, db_connection) =>{

    const executor = db_connection || pool; // Usa la conexión proporcionada o el pool por defecto
    try{

        const {id_socio, id_servicio_reservable, id_servicio_reservable_empresa, coste_total, fecha_reservacion, nota} = reservaServicioData;

        const [result] = await executor.execute(`
            INSERT INTO reservaciones_servicios 
            (id_socio, id_servicio_reservable, id_servicio_reservable_empresa, costo_reserva, fecha_reservacion, nota, fecha_creacion, estado)
            VALUES (?, ?, ?, ?, ?, ?, NOW(), 1)
        `, [id_socio, id_servicio_reservable, id_servicio_reservable_empresa, coste_total, fecha_reservacion, nota]);

        return result.insertId;

    } catch(error){
        throw error;
    }
}

const createReservaServicioHorasDB = async (id_reservacion_servicio, horariosReservaServicio, db_connection) =>{
    const executor = db_connection || pool; // Usa la conexión proporcionada o el pool por defecto
    try {
        const values = horariosReservaServicio.map(hora => [id_reservacion_servicio, hora]);

        const placeholders = values.map(() => '(?, ?)').join(', ');
        const flatValues = values.flat();
        
        const [result] = await executor.execute(
            `INSERT INTO reservaciones_servicios_horas (id_reservacion_servicio, hora_reserva) VALUES ${placeholders}`,
            flatValues
        );
        return result.affectedRows; // Retorna el número de filas afectadas
    } catch (error) {
        console.error("Error al crear las horas de la reserva:", error);
        throw error; // Propaga el error para manejarlo en el lugar donde se llame a esta función
    }
}


export {
    
    getReservaServicioByIdDB,
    getReservasServicioPorServicioDB,
    getReservasServicioPorServicioYMesDB,
    getReservasServicioPorSocioDB,
    getReservasServicioPorSocioYMesDB,
    getHorasReservadasPorServicioPorFechaDB,
    getHorasReservadasPorReservaServiciosDB,
    createReservaServicioDB,
    createReservaServicioHorasDB

}