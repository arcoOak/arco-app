import pool from '../config/db.config.js';

const getAllNotificacionesDB = async (id_usuario) => {
    try {
        const [Notificaciones] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_notificacion, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM notificaciones ntc
            JOIN data_categoria_notificacion dcn ON dcn.id_categoria_notificacion = ntc.id_categoria_notificacion
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_usuario = ? ORDER BY ntc.fecha_notificacion DESC
        `, [id_usuario]);
        return Notificaciones;
    } catch (error) {
        console.error('Error al obtener todas las Notificaciones:', error);
        throw error;
    }
}

const getNotificacionPorIdDB = async (id_usuario, id_notificacion) => {
    try {
        const [Notificaciones] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_notificacion, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM notificaciones ntc
            JOIN data_categoria_notificacion dcn ON dcn.id_categoria_notificacion = ntc.id_categoria_notificacion
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_notificacion = ? AND ntc.id_usuario = ?`, [id_notificacion, id_usuario]
        );
        return Notificaciones;
    } catch (error) {
        console.error('Error al obtener Notificaciones por categoría:', error);
        throw error;
    }
}

const getUltimasNotificacionesDB = async (id_usuario) => {
    try {
        const [Notificaciones] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_notificacion, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM notificaciones ntc
            JOIN data_categoria_notificacion dcn ON dcn.id_categoria_notificacion = ntc.id_categoria_notificacion
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_usuario = ? ORDER BY ntc.fecha_notificacion DESC LIMIT 5
        `, [id_usuario]);
        return Notificaciones;
    } catch (error) {
        console.error('Error al obtener las últimas Notificaciones:', error);
        throw error;
    }
}

const getNotificacionesPorCategoriaDB = async (id_usuario, id_categoria) => {
    try {
        const [Notificaciones] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_notificacion, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM notificaciones ntc
            JOIN data_categoria_notificacion dcn ON dcn.id_categoria_notificacion = ntc.id_categoria_notificacion
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE ntc.id_categoria_notificacion = ? AND ntc.id_usuario = ? ORDER BY ntc.fecha_notificacion DESC
        `, [id_categoria, id_usuario]
        );
        return Notificaciones;
    } catch (error) {
        console.error('Error al obtener Notificaciones por categoría:', error);
        throw error;
    }
}

const getNotificacionesPorMesAnhoDB = async (mes, anho, id_usuario) => {
    try {
        const [Notificaciones] = await pool.execute(`
            SELECT ntc.*, dcn.nombre_categoria_notificacion, CONCAT(adm.nombre, ' ', adm.apellido) nombre_autor
            FROM notificaciones ntc
            JOIN data_categoria_notificacion dcn ON dcn.id_categoria_notificacion = ntc.id_categoria_notificacion
            JOIN administradores adm ON ntc.id_autor = adm.id_usuario
            WHERE MONTH(ntc.fecha_notificacion) = ? AND YEAR(ntc.fecha_notificacion) = ? AND ntc.id_usuario = ?
            ORDER BY ntc.fecha_notificacion DESC
            `,
            [mes, anho, id_usuario]
        );
        return Notificaciones;
    } catch (error) {
        console.error('Error al obtener Notificaciones por mes:', error);
        throw error;
    }
}

const getCategoriasNotificacionesDB = async(id_usuario)=>{
    try {
        const [categorias] = await pool.execute(`
            SELECT ntc.id_categoria, dcn.nombre_categoria_notificacion
            FROM notificaciones ntc 
            JOIN data_categoria_notificacion dcn ON dcn.id_categoria_notificacion = ntc.id_categoria_notificacion 
            WHERE id_usuario = ?
        `, [id_usuario]);
        return categorias;
        
    } catch (error) {
        console.error('Error al obtener categorías de Notificaciones:', error);
        throw error;
    }
}

export {
    getAllNotificacionesDB,
    getNotificacionPorIdDB,
    getUltimasNotificacionesDB,
    getNotificacionesPorCategoriaDB,
    getNotificacionesPorMesAnhoDB,
    getCategoriasNotificacionesDB
}