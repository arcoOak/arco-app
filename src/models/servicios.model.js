import pool from '../config/db.config.js';

const getTodosServiciosDB = async (id_club) =>{
    try{
        const [ rows] = await pool.execute(`
            SELECT * FROM servicios_reservables WHERE id_club = ?`, [id_club])
        return rows;
    } catch (error){
        throw error;
    }
}

const getHomeServiciosDB = async(id_club) => {
    try {
        const [ rows ] = await pool.execute(`
            SELECT srv.*, dcs.nombre_categoria_servicio FROM servicios_reservables srv 
			JOIN data_categoria_servicio dcs ON dcs.id_categoria_servicio = srv.id_categoria_servicio
            WHERE srv.id_club = ? AND disponible = 1 ORDER BY RAND() LIMIT 5`, [id_club])
        return rows;
    } catch (error){
        throw error;
    }
}

const getTodasOfertasServiciosComercioDB = async (id_club) =>{

    try{
        const [ rows ] = await pool.execute(`
            SELECT srv.*, sre.*,  cmr.*, dcs.nombre_categoria_servicio FROM servicios_reservables srv 
			JOIN servicios_reservables_empresa sre ON sre.id_servicio_reservable = srv.id_servicio_reservable
            JOIN comercios cmr ON sre.id_comercio = cmr.id_comercio 
			JOIN data_categoria_servicio dcs ON dcs.id_categoria_servicio = srv.id_categoria_servicio
            WHERE srv.id_club = ?`, [id_club]);
        return rows;
    }catch (error){
        throw error;
    }

}

const getCategoriasServiciosActivosDB = async (id_club) =>{
    try{
        const [rows] = await pool.execute(`
            SELECT dcs.* FROM servicios_reservables srv 
			JOIN servicios_reservables_empresa sre ON sre.id_servicio_reservable = srv.id_servicio_reservable
            JOIN comercios cmr ON sre.id_comercio = cmr.id_comercio 
			JOIN data_categoria_servicio dcs ON dcs.id_categoria_servicio = srv.id_categoria_servicio
            WHERE srv.id_club = ? GROUP BY srv.id_categoria_servicio`, [id_club])
        return rows;
    } catch (error) {
        throw error;
    }
}


const getServicioPorIdDB = async (id_servicio) => {
    
    try {

        const [ result] = await pool.execute(`
            SELECT srv.*, MIN(sre.hora_apertura_servicio) as hora_apertura_servicio, MAX(sre.hora_cierre_servicio) as hora_cierre_servicio, dcs.nombre_categoria_servicio FROM servicios_reservables srv 
			JOIN servicios_reservables_empresa sre ON sre.id_servicio_reservable = srv.id_servicio_reservable
            JOIN comercios cmr ON sre.id_comercio = cmr.id_comercio 
			JOIN data_categoria_servicio dcs ON dcs.id_categoria_servicio = srv.id_categoria_servicio
            WHERE srv.id_servicio_reservable = ? GROUP BY srv.id_servicio_reservable`, [id_servicio]);
        return result[0];

    }catch (error){
        throw error;
    }
}

const getEmpresasReservadorasPorServicioDB = async (id_servicio) => {
    try{
        const [ rows] = await pool.execute(`
            			
			SELECT srv.*, sre.*,  cmr.*, dcs.nombre_categoria_servicio FROM servicios_reservables srv 
			JOIN servicios_reservables_empresa sre ON sre.id_servicio_reservable = srv.id_servicio_reservable
            JOIN comercios cmr ON sre.id_comercio = cmr.id_comercio 
			JOIN data_categoria_servicio dcs ON dcs.id_categoria_servicio = srv.id_categoria_servicio
            WHERE srv.id_servicio_reservable = ? GROUP BY cmr.id_comercio 
            `,[id_servicio]);
        return rows;
    }catch (error){
        throw error;
    }
}

const getServiciosPorEmpresaReservadoraDB = async (id_empresa) => {
    try {
        const [rows] = await pool.execute(`
            SELECT srv.*, sre.*,  cmr.*, dcs.nombre_categoria_servicio FROM servicios_reservables srv 
			JOIN servicios_reservables_empresa sre ON sre.id_servicio_reservable = srv.id_servicio_reservable
            JOIN comercios cmr ON sre.id_comercio = cmr.id_comercio 
			JOIN data_categoria_servicio dcs ON dcs.id_categoria_servicio = srv.id_categoria_servicio
            WHERE cmr.id_comercio = ? GROUP BY srv.id_servicio_reservable
            `, [id_empresa]);
        return rows;
    } catch (error){
        throw error;
    }
}

export {
    getTodosServiciosDB,
    getHomeServiciosDB,
    getTodasOfertasServiciosComercioDB,
    getCategoriasServiciosActivosDB,
    getServicioPorIdDB,
    getEmpresasReservadorasPorServicioDB,
    getServiciosPorEmpresaReservadoraDB

}